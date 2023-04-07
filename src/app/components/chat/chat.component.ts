import { SocketService } from './../../services/socket.service';
import { AuthService } from './../../services/auth.service';
import { ApiService } from './../../services/api.service';
import { Component, Input, Output, EventEmitter, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import * as SockJS from 'sockjs-client'
import * as Stomp from 'stompjs'
import Peer from 'peerjs'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent {
  @Input() friend: any;
  @Output() minimizeEvent = new EventEmitter<number>();
  @Output() closeEvent = new EventEmitter<number>();
  @ViewChild('remoteVideo') remoteVideo: ElementRef | undefined;
  @ViewChild('chatBody') chatBody: ElementRef;

  messages: Array<any> = []
  input: string = ''
  public stompClient: any;

  userId: number = Number(this.auth.getUserId())
  chatId: number = 0;

  showVideoCall: boolean = false;
  lazyStream: any;
  peer: Peer;
  peerId: any;
  peerIdShare: any;
  peerList: Array<any> = []
  currentPeer: any;

  scrollTop:number=400;

  constructor(private api: ApiService, private auth: AuthService, public socket: SocketService) {
    const serverUrl = 'http://localhost:8080/socket';
    // const serverUrl = 'http://192.168.107.48/socket';
    // const serverUrl = 'https://social-network-backend-c8ew.onrender.com/socket';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);

    this.peer = new Peer();
  }

  ngOnInit() {
    const that = this;

    this.stompClient.connect({}, function (frame: any) {
      that.stompClient.subscribe(`/message/receive/${that.friend.chatId}`, (message: any) => {
        if (message.body) {
          that.changeData(JSON.parse(message.body).body);
        }
      });
    }, function (message: any) {
      console.log(message);

    });

    if (this.friend) {
      this.getMessages()

      this.getPeerId()
    }
  }

  changeData(messages: any) {
    this.messages = messages
  }

  sendMessage() {
    if (this.input) {
      this.socket.sendMessage(`/app/send/message/${this.friend.chatId}`, {
        chatId: this.friend.chatId,
        senderId: this.userId,
        content: this.input,
        createdAt: Date.now(),
      })

      this.input = '';
    }
  }

  getMessages() {
    this.api.getMessages(Number(this.userId), this.friend.id)
      .subscribe({
        next: (res) => {
          this.messages = res;
        }
      })
  }

  formatFullName(firstName: string, lastName: string, limit: number) {
    let fullName = `${firstName} ${lastName}`

    let limitName = fullName.slice(0, limit)

    return `${limitName} ...`;
  }

  alignLeft(senderId: number) {
    if (senderId === this.userId) {
      return 'right'
    } else {
      return 'left'
    }
  }

  minimizeChat(value: any) {
    this.minimizeEvent.emit(value)
  }

  closeChat(value: any) {
    this.closeEvent.emit(value)
  }

  getPeerId = () => {
    this.peer.on('open', (id) => {
      console.log(id);

      this.peerId = id;
    });

    this.peer.on('call', (call) => {
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      }).then((stream) => {
        this.lazyStream = stream;

        call.answer(stream);
        call.on('stream', (remoteStream: any) => {
          if (!this.peerList.includes(call.peer)) {
            this.streamRemoteVideo(remoteStream);
            this.currentPeer = call.peerConnection;
            this.peerList.push(call.peer);
          }
        });

      }).catch(err => {
        console.log(err + 'Unable to get media');
      });
    });
  }

  streamRemoteVideo(stream: any) {
    const video = document.createElement('video');
    video.classList.add('video');
    video.style.width = "100%";
    video.srcObject = stream;
    video.play();

    this.remoteVideo?.nativeElement.append(video);
  }

  handleOpenVideoCall() {
    this.showVideoCall = true;
  }

  connectWithPeer() {
    // this.callPeer(this.friend.chatId);
    this.callPeer(this.peerIdShare);
  }

  handleCloseVideoCall() {
    this.showVideoCall = false
  }

  callPeer(id: string): void {
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then((stream) => {
      this.lazyStream = stream;

      stream.getVideoTracks().forEach((track) => {
        track.stop();
        track.enabled = false;
      });

      const call = this.peer.call(id, stream);

      call.on('stream', (remoteStream: any) => {
        if (!this.peerList.includes(call.peer)) {
          console.log("callPeer", remoteStream);
          this.streamRemoteVideo(remoteStream);
          this.currentPeer = call.peerConnection;
          this.peerList.push(call.peer);
        }
      });
    }).catch(err => {
      console.log(err + 'Unable to connect');
    });
  }

  shareScreen() {
    // @ts-ignore
    (<any>navigator.mediaDevices).getDisplayMedia({
      video: {
        cursor: 'always'
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true
      }
    }).then((stream: any) => {
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.onended = () => {
        this.stopScreenShare();
      };

      const sender = this.currentPeer.getSenders().find((s: any) => s.track.kind === videoTrack.kind);
      sender.replaceTrack(videoTrack);
    }).catch((err: any) => {
      console.log('Unable to get display media ' + err);
    });
  }

  stopScreenShare() {
    const videoTrack = this.lazyStream.getVideoTracks()[0];
    const sender = this.currentPeer.getSenders().find((s: any) => s.track.kind === videoTrack.kind);
    sender.replaceTrack(videoTrack);
  }
}
