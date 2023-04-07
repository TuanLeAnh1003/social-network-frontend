import axios from 'axios';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { OpenaiService } from '../../services/openai.service';

@Component({
  selector: 'app-chatgpt',
  templateUrl: './chatgpt.component.html',
  styleUrls: ['./chatgpt.component.css']
})
export class ChatgptComponent {
  @ViewChild('chatBody') private chatBody: ElementRef;
  messageList:Array<any>=[]
  input:string=''

  constructor(private openaiService: OpenaiService) {}

  ngAfterViewChecked() {
    this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
  }

  generateText() {
    if (this.input !== '') {
      this.messageList.push({
        sender: 'me',
        message: this.input
      })
      
      this.input=''
  
      this.openaiService.generateText(this.input).then(text => {
        this.messageList.push({
          sender: 'gpt',
          message: text
        })

      });
    }
  }
}
