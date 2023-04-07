import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent {
  @Input() user:any;

  constructor(private router:Router, private auth:AuthService) {}

  handleClickUser() {
    this.router.navigate([`personal/${this.auth.getUserId()}`])
  }

  handleClickChatGpt() {
    this.router.navigate([`home/chatgpt`])
  }
}
