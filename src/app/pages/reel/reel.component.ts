import { Component } from '@angular/core';
import axios from "axios";

@Component({
  selector: 'app-reel',
  templateUrl: './reel.component.html',
  styleUrls: ['./reel.component.css']
})
export class ReelComponent {

  reelList:Array<any>=[]

  ngOnInit() {
    const that = this;
    const options = {
      method: 'GET',
      url: 'https://tiktok-api6.p.rapidapi.com/user/videos',
      params: {username: 'mrbeast'},
      headers: {
        'X-RapidAPI-Key': '47c8ffb8e6msh0ef8580fb8a109dp1908a5jsnbda44fee2d51',
        'X-RapidAPI-Host': 'tiktok-api6.p.rapidapi.com'
      }
    };

    axios.request(options).then(function (response) {
      console.log(response.data);

      that.reelList = response.data.videos
    }).catch(function (error) {
      console.error(error);
    });
  }
}
