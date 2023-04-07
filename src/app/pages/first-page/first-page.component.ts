import { AuthService } from './../../services/auth.service';
import { ApiService } from './../../services/api.service';
import { Component, Input } from '@angular/core';
import { Observable } from "rxjs";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { map, finalize } from "rxjs/operators";
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-first-page',
  templateUrl: './first-page.component.html',
  styleUrls: ['./first-page.component.css']
})
export class FirstPageComponent {
  postList: any = []
  user: any;
  isVisible: boolean = false;
  isConfirmLoading: boolean = false;
  createPostContent: string = ''

  imagesSelected: Array<any> = []
  imageFilesSelected: Array<any> = []

  selectedFile: any;
  downloadURL: any;

  panels = [
    {
      active: false,
      name: 'Add images',
      // childPanel: [
      //   {
      //     active: false,
      //     name: 'This is panel header 1-1'
      //   }
      // ]
    },
    {
      active: false,
      name: 'Add videos'
    }
  ];

  constructor(private api: ApiService, private auth: AuthService, private noti: NzMessageService, private storage: AngularFireStorage) {
    this.auth.getUserDetail(this.auth.getUsername())
      .subscribe({
        next: (res) => {
          this.user = res;
        }
      })
  }

  ngOnInit() {
    this.api.getPosts()
      .subscribe({
        next: (res) => {
          this.postList = res;
        }
      })
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isConfirmLoading = true;
    let temp = 0;
    const images: any = []
    const videos: any = []

    for (let i = 0; i < this.imageFilesSelected.length; i++) {
      var n = Date.now();

      const path = this.imageFilesSelected[i].type === 'image' ? 'PostImages' : 'PostVideos';

      const file = this.imageFilesSelected[i].file;
      const filePath = `${path}/${n}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(`${path}/${n}`, file);
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL();
            this.downloadURL.subscribe((url: any) => {
              if (url) {
                temp += 1;

                if (this.imageFilesSelected[i].type === 'image') {
                  images.push({
                    address: url,
                    createdAt: new Date
                  })
                } else {
                  videos.push({
                    address: url,
                    createdAt: new Date
                  })
                }

                if (temp === this.imageFilesSelected.length) {
                  const post = {
                    ownerId: Number(this.auth.getUserId()),
                    content: this.createPostContent,
                    createdAt: new Date,
                    images: images,
                    videos: videos,
                  }

                  this.api.savePost(post)
                    .subscribe({
                      next: (res) => {
                        this.isConfirmLoading = false;
                        this.isVisible = false;
                        this.noti.create('success', `Create post successfully!!!`);
                      }
                    })
                }
              }
            });
          })
        )
        .subscribe(url => {
          if (url) {
          }
        });
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  readURL(event: any) {
    let imageObj = event.currentTarget.files[0];
    let {
      name,
      size,
      type
    } = imageObj;

    size = size / 1000000
    if (size > 20) {
      alert("please upload file less than 20 MB");
      return;
    }

    type = type.split("/")[0];
    if (type != "image") {
      alert("please upload image only");
      return;
    }

    const that = this;

    this.imageFilesSelected.push({
      file: event.target.files[0],
      type: 'image'
    });
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e: any) {
        that.imagesSelected.push({
          file: e.target.result,
          type: 'image'
        });
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  readVideo(event: any) {
    let videoObj = event.currentTarget.files[0];
    let {
      name,
      size,
      type
    } = videoObj;

    size = size / 1000000
    if (size > 20) {
      alert("please upload file less than 20 MB");
      return;
    }

    type = type.split("/")[0];
    if (type != "video") {
      alert("please upload video only");
      return;
    }

    const that = this;

    this.imageFilesSelected.push({
      file: event.target.files[0],
      type: 'video'
    });
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e: any) {
        that.imagesSelected.push({
          file: e.target.result,
          type: 'video'
        });
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }
}
