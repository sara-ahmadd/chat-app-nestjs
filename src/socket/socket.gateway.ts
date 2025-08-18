import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FilesService } from 'src/common/services/files.service';
import { JWTFunctions } from 'src/common/services/jwt-service.service';
import { ConversationService } from 'src/modules/conversation/conversation.service';
import { Message } from 'src/modules/message/message.entity';
import { MessageService } from 'src/modules/message/message.service';
import { User } from 'src/modules/user/user.entity';
import { UserService } from 'src/modules/user/user.service';
import { base64ToMulterFile } from 'src/utils/helpers/base64ToFile';
import { encryptEmojieText } from 'src/utils/helpers/encryptEmojiesText';

@WebSocketGateway({ cors: { origin: '*' } })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly _JWTFunctions: JWTFunctions,
    private readonly _UserService: UserService,
    private readonly _ConversationService: ConversationService,
    private readonly _MessageService: MessageService,
    private readonly filesService: FilesService,
    private readonly _ConfigService: ConfigService,
  ) {}

  @WebSocketServer() server: Server;

  //map contains all currently connected users
  SocketMap = new Map();

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const { auth } = client.handshake.auth.authentication;
      // console.log({ auth });
      const bearerTxt = auth?.split(' ')[0] == 'Bearer';
      if (!bearerTxt) {
        throw new BadRequestException('Token is invalid');
      }
      const token = auth?.split(' ')[1];

      //verify token before moving further
      await this._JWTFunctions.verifyToken(token);
      const payload = this._JWTFunctions.decodeToken(token);
      // console.log({ payload });
      if (!payload?._id) {
        client.emit('token_error', 'No token received!');
        return;
      }
      const user = await this._UserService.getUserById(payload._id);
      // console.log({ client: user.email });
      if (!user) {
        throw new NotFoundException('user is not found');
      }
      client.data.user = user;
      this.SocketMap.set(user?._id, client);
      // update online status of connected user
      user.isOnline = true;
      const updatedUser = await this._UserService.saveUser(user);
      client.emit('get_my_profile', { user: updatedUser });
      const conversations = await this.getMyGroups(user);

      client.emit('get_my_groups', { conversations });
      // on connection get users' friends
      client.emit('user_list', { users: user.friends });
      // on connection update users' friends
      client
        .to([...user.friends.map((item) => item._id)])
        .emit('user_activity_status', { user: updatedUser });
    } catch (error) {
      console.log({ error });
      client.emit('token_error', 'No token received!');
    }
  }

  @SubscribeMessage('add_friend')
  async handleAddFriend(client: Socket, message: any) {
    const currentUserId = client.data.user._id;
    const friend = await this._UserService.getUserById(message.friendId);

    const currentUser = await this._UserService.getUserById(currentUserId);
    if (!friend || !currentUser) {
      client.emit('token_error', 'friend is not found');
      return;
    }
    friend.friends.push(currentUser);
    await this._UserService.saveUser(friend);
    currentUser.friends.push(friend);
    await this._UserService.saveUser(currentUser);
  }

  // listen to send message event
  @SubscribeMessage('send_message')
  async handleReceiveMsg(
    client: Socket,
    { message, to, image }: { message: string; to: string; image?: string },
  ) {
    const receiver = this.SocketMap.get(to);
    const receiverUser = await this._UserService.getUserById(receiver?._id);

    // emit receive msg event
    client
      .to(receiver?.id)
      .emit('receive_message', { message, from: client.data.user._id, image });
    // console.log({ sender: client.data.user, receiverUser, message, image });
    await this.saveMessageToDB(
      client.data.user,
      [client.data.user, receiverUser] as User[],
      message,
      image,
    );
  }
  // listen to send message event
  @SubscribeMessage('send_group_message')
  async handleSendingMsgToGroup(
    client: Socket,
    {
      group,
      message,
      image,
    }: { message: string; group: string; image?: string },
  ) {
    const groupConv =
      await this._ConversationService.getConversationById(group);
    // emit receive msg event
    client
      .to(groupConv.participants.map((user) => user._id))
      .emit('receive_message', { message, from: client.data.user._id, image });
    await this.saveMessageToDB(
      client.data.user,
      groupConv.participants,
      message,
      image,
    );
  }

  //update isTyping state of the user when he is typing the message.
  @SubscribeMessage('is_typing')
  async handleUpdateTypingState(
    client: Socket,
    { isTyping, to }: { isTyping: boolean; to: string },
  ) {
    // console.log({ isTyping });

    const receiver = this.SocketMap.get(to);

    const userId = client.data.user._id;
    const user = await this._UserService.getUserById(userId);

    user.isTyping = isTyping;
    await this._UserService.saveUser(user);
    client
      .to(receiver?.id)
      .emit('listen_typing', { isTyping, sender: client.data.user });
  }

  // listen to event that fetches the whole chat between 2 participants
  @SubscribeMessage('get_chat')
  async getPrivateChat(client: Socket, { receiverId }: { receiverId: string }) {
    console.log({ sender: client.data.user._id, receiverId });
    const sender = client.data.user;
    const receiver = await this._UserService.getUserById(receiverId);
    const chat = await this._ConversationService.getWholeChat(sender, receiver);
    console.log({ chat });
    client.emit('whole_chat', { chat });
  }
  @SubscribeMessage('get_group_chat')
  async getGroupChat(client: Socket, { groupId }: { groupId: string }) {
    console.log({ groupId });

    const chat = await this._ConversationService.getGroupChat(groupId);
    console.log({ chat });
    client.emit('whole_group_chat', { chat });
  }

  async handleDisconnect(client: Socket) {
    // console.log('Disconnected client has no user data', client.data.user.email);

    const userData = client.data.user as User;
    const user = await this._UserService.getUserById(userData?._id);
    if (!user) {
      throw new NotFoundException('user is not found');
    }
    // update online status of connected user
    user.isOnline = false;
    user.lastSeenAt = new Date();
    const updateUser = await this._UserService.saveUser(user);
    // on connection get users' friends
    client
      .to([...user.friends.map((item) => item._id)])
      .emit('user_activity_status', { user: { ...user, isOnline: false } });
    this.SocketMap.delete(client.data.user._id);
  }

  async saveMessageToDB(
    sender: User,
    users: User[],
    message: string,
    image?: string,
  ) {
    // console.log({ sender: users[0].id, receiver: users[1].id });
    //find conversation by
    const conversation =
      await this._ConversationService.getConversationByParticipants(users);
    // console.log({ groupChat: conversation });
    let newImg: { secure_url: string; public_id: string } | undefined =
      undefined;
    if (image) {
      const { secure_url, public_id } = await this.filesService.uploadFile(
        base64ToMulterFile(image, 'img'),
        {
          folder: `${this._ConfigService.get('CLOUD_APP_FOLDER')}/messagesImages/}`,
        },
      );
      newImg = { secure_url, public_id };
    }
    let newMessage: Message;
    //if found add the new message to the found conversation
    if (conversation) {
      //create new message in DB add to it the text then if there is an image
      newMessage = await this._MessageService.createNewMessage({
        sentBy: sender,
        contentText: message,
        contentImgUrl: image ? newImg?.secure_url : undefined,
        conversation,
      });

      return;
    } else {
      //if not found create one
      const newConversation =
        await this._ConversationService.createNewConversation({
          participants: users,
        });

      newMessage = await this._MessageService.createNewMessage({
        sentBy: sender,
        contentText: message,
        contentImgUrl: image ? newImg?.secure_url : undefined,
        conversation: newConversation,
      });
    }
  }

  async getChat(sender: User, receiver: User) {
    return this._ConversationService.getWholeChat(sender, receiver);
  }

  // get all groups in which current user is participated
  async getMyGroups(user: User) {
    return this._ConversationService.getConversationsOfAParticipant(user);
  }
}
