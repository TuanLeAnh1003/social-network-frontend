import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client'
import * as Stomp from 'stompjs'

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public stompClient: any;
  public msg: Array<any> = [];

  constructor() {
    // const serverUrl = 'http://localhost:8080/socket';
    // const serverUrl = 'http://192.168.107.48:8080/socket';
    const serverUrl = 'https://social-network-be.onrender.com/socket';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
  }

  subscribeData(_this:any, url:string) {
    const that = this;
    
    this.stompClient.connect({}, function (frame: any) {
      that.stompClient.subscribe(url, (message: any) => {
        if (message.body) {
          _this.changeData();
        }
      });
    });
  }

  sendMessage(url:string, message: any) {
    return this.stompClient.send(url, {}, JSON.stringify(message));
  }

}
