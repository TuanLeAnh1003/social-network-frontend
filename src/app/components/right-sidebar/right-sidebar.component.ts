import { AuthService } from './../../services/auth.service';
import { ApiService } from './../../services/api.service';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.css']
})
export class RightSidebarComponent {
  @Input() user: any;
  @Input() chatOpening: any;
  @Input() chatPopup: any;
  friendList: any = []

  constructor(private api: ApiService, private auth: AuthService) { }

  ngOnInit() {
    this.auth.getUserDetail(this.auth.getUsername())
      .subscribe({
        next: (res) => {
          this.auth.storeuserId(res.id)
          this.api.getFriends(res.id)
            .subscribe({
              next: (resu) => {
                this.friendList = resu.friends;

                // for (let i=0; i< resu.friends.length; i++) {
                //   
                // }
              }
            })
        }
      })
  }

  handleClickFriend(friend: any) {
    const index = this.chatOpening.findIndex((c: any) => c.id === friend.id)
    const index2 = this.chatPopup.findIndex((c: any) => c.id === friend.id)
    if (index === -1) {
      if (index2 === -1) {
        this.chatOpening.push(friend);
      }
    }

    this.api.getChatId(Number(this.auth.getUserId()), friend.id)
      .subscribe({
        next: (res) => {
          const index = this.friendList.map((f:any) => f.id).indexOf(friend.id);
          
          this.friendList[index].chatId = res;
        }
      })
  }

  minimizeChat(friend: any) {
    const index = this.chatOpening.findIndex((c: any) => c.id === friend.id)
    this.chatPopup.push(friend)

    this.chatOpening.splice(index, 1);
  }

  closeChat(friend: any) {
    const index = this.chatOpening.findIndex((c: any) => c.id === friend.id)
    this.chatOpening.splice(index, 1);
  }

  handleClickPopup(friend: any) {
    const index = this.chatPopup.findIndex((c: any) => c.id === friend.id)
    this.chatPopup.splice(index, 1);

    this.chatOpening.push(friend)
  }
}
