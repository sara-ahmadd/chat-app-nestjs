import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JWTFunctions } from 'src/common/services/jwt-service.service';
import { User } from 'src/modules/user/user.entity';
import { UserService } from 'src/modules/user/user.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly _JWTFunctions: JWTFunctions,
    private readonly _UserService: UserService,
  ) {}

  @WebSocketServer() server: Server;

  //map contains all currently connected users
  SocketMap = new Map();

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const { auth } = client.handshake.auth.authentication;
      const bearerTxt = auth?.split(' ')[0] == 'Bearer';
      if (!bearerTxt) {
        throw new BadRequestException('Token is invalid');
      }
      const token = auth?.split(' ')[1];
      const payload = this._JWTFunctions.decodeToken(token);

      if (!payload?._id) {
        client.emit('token_error', 'No token received!');
        return;
      }
      const user = await this._UserService.getUserById(payload._id);
      if (!user) {
        throw new NotFoundException('user is not found');
      }
      client.data.user = user;
      this.SocketMap.set(user?._id, client);
      // update online status of connected user
      user.isOnline = true;
      const updatedUser = await this._UserService.saveUser(user);
      client.emit('get_my_profile', { user: updatedUser });
      // on connection get users' friends
      client.emit('user_list', { users: user.friends });
    } catch (error) {
      throw new BadRequestException(error);
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
    { message, to }: { message: string; to: string },
  ) {
    const receiver = this.SocketMap.get(to);

    // emit receive msg event
    client
      .to(receiver?.id)
      .emit('receive_message', { message, from: client.data.user._id });
  }

  //update isTyping state of the user when he is typing the message.
  @SubscribeMessage('is_typing')
  async handleUpdateTypingState(
    client: Socket,
    { isTyping, to }: { isTyping: boolean; to: string },
  ) {
    console.log({ isTyping });

    const receiver = this.SocketMap.get(to);
    // client.to(receiver?.id).emit('is_typing', { isTyping });

    const userId = client.data.user._id;
    const user = await this._UserService.getUserById(userId);

    user.isTyping = isTyping;
    await this._UserService.saveUser(user);
    const receiverSocketId = receiver?._id;

    // إرسال قائمة الأصدقاء المحدثة (اختياري)
    const receiverUser = await this._UserService.getUserById(receiverSocketId);
    if (receiverUser) {
      client.to(receiverSocketId).emit('user_list', {
        users: receiverUser.friends,
      });
    }
  }

  async handleDisconnect(client: Socket) {
    const userData = client.data.user as User;
    const user = await this._UserService.getUserById(userData?._id);
    if (!user) {
      throw new NotFoundException('user is not found');
    }
    // update online status of connected user
    user.isOnline = false;
    user.lastSeenAt = new Date();
    await this._UserService.saveUser(user);
    this.SocketMap.delete(client.data.user._id);
  }
}
