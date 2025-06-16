import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  SocketMap = new Map();

  handleConnection(client: Socket, ...args: any[]) {
    // client.data = user;
  }
  handleDisconnect(client: any) {}
}
