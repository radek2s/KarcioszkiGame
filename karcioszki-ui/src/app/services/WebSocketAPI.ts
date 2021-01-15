import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';

export class WebSocket {

    private production: boolean = environment.production;
    private WS_END_POINT_PRODUCTION: string = window.location.href;
    private WS_END_POINT_DEVELOPMNET: string = 'http://localhost:8080/karcioszki-ws';
    private component: any;
    private destinationTopic: string;
    private stompClient: any;

    constructor(component: any, topic: string) {
        this.component = component;
        this.destinationTopic = topic;
        this._connect();
    }

    _disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        console.log('WS Disconnected');
    }

    /**
     * Send a message
     *
     * @param topic [string] Location where to send a data
     * @param payload [any] Data to be sent
     */
    sendMessage(topic, payload) {
        this.stompClient.send(topic, {}, JSON.stringify(payload));
    }

    private _connect(): void {
        let ws;
        if (this.production) {
            const address = this.WS_END_POINT_PRODUCTION.split('/');
            ws = new SockJS(`${address[0]}//${address[2]}/karcioszki-ws`);
        } else {
            ws = new SockJS(this.WS_END_POINT_DEVELOPMNET);
        }
        this.stompClient = Stomp.over(ws);
        const _this = this;
        _this.stompClient.connect({}, () => {
            _this.stompClient.subscribe(_this.destinationTopic, (sdkEvent) => {
                _this.onMessageReceived(sdkEvent);
            });
        }, this.errorCallback);
    }

    /**
     * Callback error function
     * If connection has been lost try to reconnect after 5 seconds
     * @param error - error message
     */
    private errorCallback(error) {
        console.log('Error with SockJS ->' + error);
        setTimeout(() => {
            this._connect();
        }, 5000);
    }

    /**
     * on Message Received
     * When WebSocket receive an message send this message body to component
     *
     * @param message Received WebSocket message
     */
    private onMessageReceived(message): void {
        this.component.handleWsMessage(message.body);
    }

}
