import { SocketService } from './../../services/socket.service';
import { ApiService } from './../../services/api.service';
import { AuthService } from './../../services/auth.service';
import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { debounceTime } from "rxjs/operators";
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() user: any;
  @Input() chatOpening: any;
  @Input() chatPopup: any;
  @Input() isShowFunction: any;
  friendList: any = []

  searchList: Array<any> = [];
  inputValue?: string;

  isLogined: boolean = false;
  searchForm!: FormGroup;

  countNewMessage = 0
  countNewNoti=0

  constructor(private auth: AuthService, private fb: FormBuilder, private api: ApiService, private router: Router, private socket: SocketService) { }

  ngOnInit() {
    this.socket.subscribeData(this, `/message/notify/${this.auth.getUserId()}`)

    this.isLogined = this.auth.isLoggedIn();

    this.searchForm = this.fb.group({
      search: ['']
    })

    this.searchForm.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(data => {
        if (data.search) {
          this.api.searchFriend(data.search)
            .subscribe({
              next: (res) => {
                this.searchList = res;
              }
            })
        } else {
          this.searchList = []
        }
      })

    this.getListChatMessage()
  }

  getListChatMessage() {
    this.countNewMessage = 0
    this.api.getListChatMessage(Number(this.auth.getUserId()))
      .subscribe({
        next: (res: Array<any>) => {
          console.log(res);
          
          let tempArray = res.map(chat => {
            
            if (chat.unSeen) {
              this.countNewMessage += 1
            }
            if (chat.users.length === 1) {
              return {
                ...chat.users[0],
                chatId: chat.id,
                unSeen: chat.unSeen
              }
            } else {
              // Xử lý chat nhóm
              return {
                ...chat.users[0],
                firstName: "Chat group",
                chatId: chat.id,
                unSeen: chat.unSeen
              }
            }
          })

          this.friendList = tempArray;
        }
      })
  }

  changeData() {
    this.countNewMessage = 0
    this.api.getListChatMessage(Number(this.auth.getUserId()))
      .subscribe({
        next: (res: Array<any>) => {
          let audio = new Audio();
          audio.src = "../../../assets/audios/receive-message.mp3";
          audio.load();
          audio.play();

          let tempArray = res.map(chat => {
            if (chat.unSeen) {
              this.countNewMessage += 1
            }
            if (chat.users.length === 1) {
              return {
                ...chat.users[0],
                chatId: chat.id,
                unSeen: chat.unSeen
              }
            } else {
              // Xử lý chat nhóm
              return {
                ...chat.users[0],
                firstName: "Chat group",
                chatId: chat.id,
                unSeen: chat.unSeen
              }
            }
          })

          this.friendList = tempArray;
        }
      })
  }

  handleClickPersonel(id: number) {
    this.router.navigate([`personal/${id}`])
  }

  handleClickUser() {
    this.router.navigate([`personal/${this.auth.getUserId()}`])
  }

  formatFullName(firstName: string, lastName: string, limit: number) {
    let fullName = `${firstName} ${lastName}`

    let limitName = fullName.slice(0, limit)

    return `${limitName} ...`;
  }

  handleClickFriend(friend: any) {
    this.api.updateSeen({
      userId: Number(this.auth.getUserId()),
      chatId: friend.chatId,
      unSeen: 0
    })
      .subscribe({
        next: (res) => {
          if (res) {
            const index = this.friendList.findIndex((f: any) => f.chatId === friend.chatId)
            this.friendList[index].seen = true;
            this.countNewMessage -= 1
          }
        }
      })


    const index = this.chatOpening.findIndex((c: any) => c.id === friend.id)
    const index2 = this.chatPopup.findIndex((c: any) => c.id === friend.id)
    if (index === -1) {
      if (index2 === -1) {
        this.chatOpening.push(friend);
      } else {
        this.chatPopup.splice(index, 1);

        this.chatOpening.push(friend)
      }
    }
  }

  isSeen(seen: any): string {
    if (seen) {
      return "color: #007bff"
    } else {
      return ""
    }
  }

  logout() {
    this.auth.signOut()
  }
}
