import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect ,SubscribeMessage,MessageBody} from '@nestjs/websockets';
import { Server,Socket } from 'socket.io';
 
@WebSocketGateway(8080)
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
 
  handleConnection(client: Socket) {
    console.log("%c Line:10 🥒 client", "color:#ea7e5c", client);
    console.log('New client connected');
  }
 
  handleDisconnect(client: Socket) {
    console.log("%c Line:15 🍊 client", "color:#ea7e5c", client);
    console.log('Client disconnected');
  }
  @SubscribeMessage('message')
  async handleMessage(@MessageBody() data: number): Promise<number> {
    return data;
  }
}