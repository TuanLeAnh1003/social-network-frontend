import { ApiService } from './../../services/api.service';
import { AuthService } from './../../services/auth.service';
import { Component, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { base64ToFile } from 'ngx-image-cropper';

import { AngularFireStorage } from "@angular/fire/compat/storage";
import { map, finalize } from "rxjs/operators";

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent {
  id: number = 0; // id of personal page, NOT userId
  userId: number = Number(this.auth.getUserId());
  user: any;
  styleCoverImage: string = ''
  styleAvatar: string = ''
  isMyPersonal: boolean = true;
  isFriend: boolean = false;
  isShowFunction:boolean=false;

  chatOpening: Array<any> = []
  chatPopup: Array<any> = []

  isOpenModalChooseAvatar: boolean = false
  isOpenModalChooseCoverImage: boolean = false
  isConfirmSaveLoading: boolean = false

  imageChangedEvent: any = '';
  croppedImage: any = '';

  downloadURL: any;

  myPosts:Array<any>=[]
  isVisible: boolean = false;
  isConfirmLoading: boolean = false;
  createPostContent: string = ''

  imagesSelected: Array<string> = []
  imageFilesSelected: Array<any> = []

  selectedFile: any;

  constructor(private route: ActivatedRoute, private auth: AuthService, private api: ApiService, private noti: NzMessageService, private storage: AngularFireStorage) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = +params['id'];

      this.reloadPersonal()

      this.api.getPostsByOwnerId(this.id)
      .subscribe({
        next: (res) => {
          console.log(res);
          
          this.myPosts = res;
        }
      })
    });
  }

  checkIsFriend(userId: number, friendId: number) {
    this.api.checkIsFriend(userId, friendId)
      .subscribe({
        next: (res) => {
          this.isFriend = res;
        }
      })
  }

  reloadPersonal() {

    this.checkIsFriend(Number(this.auth.getUserId()), this.id);

    this.auth.getUserDetailById(this.id)
      .subscribe({
        next: (res) => {
          this.user = res;

          this.isMyPersonal = this.auth.getUsername() === this.user.username

          if (this.user.coverImage) {
            this.styleCoverImage = `url("${this.user.coverImage}")`
          } else {
            this.styleCoverImage = `url("http://via.placeholder.com/1180x300")`
          }

          if (this.user.avatar) {
            this.styleAvatar = `${this.user.avatar}`
          } else {
            this.styleAvatar = `http://via.placeholder.com/150x150`
          }
        }
      })
  }

  addFriend() {
    if (this.userId && this.id) {
      this.api.saveFriend(this.userId, this.id)
        .subscribe({
          next: (res) => {
            this.noti.create('success', `Add friend successfully!!!`);
          }
        })
    }
  }

  handleOpenModalChooseAvatar() {
    this.isOpenModalChooseAvatar = true
  }

  handleCloseModalChooseAvatar() {
    this.isOpenModalChooseAvatar = false
  }

  handleOpenModalChooseCoverImage() {
    this.isOpenModalChooseCoverImage = true
  }

  handleCloseModalChooseCoverImage() {
    this.isOpenModalChooseCoverImage = false
  }


  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    if (event.base64) {
      this.croppedImage = base64ToFile(event.base64);
    }
  }
  imageLoaded(image: LoadedImage) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  saveAvatar() {
    this.isConfirmSaveLoading = true;

    var n = Date.now();

    const file = this.croppedImage;
    const filePath = `AvatarImages/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`AvatarImages/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe((url: any) => {
            if (url) {
              this.api.saveAvatar({
                id: this.auth.getUserId(),
                avatar: url
              })
                .subscribe({
                  next: (res) => {
                    this.isConfirmSaveLoading = false;
                    this.isOpenModalChooseAvatar = false
                    this.reloadPersonal();
                  }
                })
            }
          });
        })
      )
      .subscribe(url => {
        if (url) {
        }
      });
  }

  saveCoverImage() {
    this.isConfirmSaveLoading = true;

    var n = Date.now();

    const file = this.croppedImage;
    const filePath = `CoverImages/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`CoverImages/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe((url: any) => {
            if (url) {
              this.api.saveCoverImage({
                id: this.auth.getUserId(),
                coverImage: url
              })
                .subscribe({
                  next: (res) => {
                    this.isConfirmSaveLoading = false;
                    this.isOpenModalChooseCoverImage = false
                    this.reloadPersonal();
                  }
                })
            }
          });
        })
      )
      .subscribe(url => {
        if (url) {
        }
      });
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isConfirmLoading = true;
    let temp = 0;
    const images: any = []

    for (let i = 0; i < this.imageFilesSelected.length; i++) {
      var n = Date.now();

      const file = this.imageFilesSelected[i];
      const filePath = `PostImages/${n}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(`PostImages/${n}`, file);
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL();
            this.downloadURL.subscribe((url: any) => {
              if (url) {
                temp += 1;

                images.push({
                  address: url,
                  createdAt: new Date
                })

                if (temp === this.imageFilesSelected.length) {
                  const post = {
                    ownerId: Number(this.auth.getUserId()),
                    content: this.createPostContent,
                    createdAt: new Date,
                    images: images
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

  readURL(input: any) {
    const that = this;

    this.imageFilesSelected.push(input.target.files[0]);
    if (input.target.files && input.target.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e: any) {
        that.imagesSelected.push(e.target.result);
      };

      reader.readAsDataURL(input.target.files[0]);
    }
  }
}
