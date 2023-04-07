import { SocketService } from './../../services/socket.service';
import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private auth:AuthService) {}

  username:string|null='';
  user:any;
  
  chatOpening: Array<any> = []
  chatPopup: Array<any> = []

  messageNoti:number=0;

  ngOnInit() {
    this.username = this.auth.getUsername();

    this.auth.getUserDetail(this.username)
    .subscribe({
      next: (res) => {
        this.user=res;
      }
    })
  }

  changeData() {

  }
}
