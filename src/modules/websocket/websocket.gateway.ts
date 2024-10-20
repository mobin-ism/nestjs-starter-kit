import { Injectable, Logger } from '@nestjs/common'
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { WebsocketService } from './websocket.service'

@Injectable()
@WebSocketGateway(3001, {
    transports: ['websocket'],
    cors: {
        origin: '*', // Enable CORS for all origins
        methods: ['GET', 'POST'], // Allow specific methods
        allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
        credentials: true
    }
})
export class WebsocketGateway {
    @WebSocketServer()
    server: Server

    private logger: Logger = new Logger('SocketServerGateway')
    private clients: Map<string, Socket> = new Map() // CREATING A MAP TO STORE CLIENTS

    constructor(private readonly websocketService: WebsocketService) {}

    /**
     * This method is called when a client connects to the server.
     * @param client
     */
    handleConnection(client: Socket) {
        this.clients.set(client.id, client)
        const queryParams = client.handshake.query
        const authToken = queryParams['auth-token'] // Access other params like token if needed

        this.logger.log(`Client connected: ${client.id}`)
        this.logger.log(`Auth Token: ${authToken}`)
    }

    /**
     * This method is called when the server receives a message from a client.
     * @param data
     * @param client
     */
    @SubscribeMessage('activity')
    handleUserActivity(@MessageBody() data, @ConnectedSocket() client: Socket) {
        this.logger.log(`User query: ${data}`)
        this.logger.log(`Client ID: ${client.id}`)
        const targetClient = this.clients.get(client.id)
        if (targetClient) {
            if (data === '') {
                this.logger.log('No data received')
            }
        } else {
            client.emit('error', `Client with ID ${client.id} not found`)
        }
    }

    /**
     * This method is called when a client disconnects from the server.
     * @param client
     */
    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`)
        const deletableClient = this.clients.get(client.id)
        if (
            deletableClient &&
            deletableClient.handshake['query']['auth-token']
        ) {
            // DO ANY OPERATION BEFORE DELETING THE CLIENT
        }
        this.clients.delete(client.id)
    }
}
