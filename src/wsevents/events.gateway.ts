import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { EMPTY, Observable } from 'rxjs';
import { ChildProcess,exec } from 'child_process';

@WebSocketGateway()
export class EventsGateway {
    @WebSocketServer() server;

    @SubscribeMessage('drawPoint')
    onEvent(client, data): Observable<WsResponse<number>> {
        if (data) {
            console.log(data.color);
        }

        //获取 namespace为'/' 下的所有sockets
        let sockets = this.server.of('/').sockets;

        //遍历所有的socket，如果不是自己，并且都是在同一个roomId(channel)，就发送消息给其他的socket
        for (let sId in sockets) {
            if (!client.handshake.roomId) {
                //过滤掉没有roomId的client
                continue;
            }

            if (
                sockets[sId].id !== client.id &&
                sockets[sId].handshake.roomId === client.handshake.roomId
            ) {
                sockets[sId].emit('drawPointReceive', data);
            }
        }

        //client.emit('events', 'hahahha');
        //const event = 'events';
        //const response = [1, 2, 3];

        return EMPTY;
    }

    @SubscribeMessage('join')
    onJoin(client, data): Observable<WsResponse<number>> {
        console.log(`join: ${data}`);
        //设置房间号，channel
        client.handshake.roomId = data;

        //获取 namespace为'/' 下的所有sockets
        let sockets = this.server.of('/').sockets;

        console.log('sockets:' + Object.keys(sockets));

        return EMPTY;
    }

    @SubscribeMessage('startRecord')
    onStartRecord(client, data): Observable<WsResponse<number>> {


        return EMPTY;
    }

}
