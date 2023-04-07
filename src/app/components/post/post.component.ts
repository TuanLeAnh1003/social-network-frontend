import { AuthService } from './../../services/auth.service';
import { ApiService } from './../../services/api.service';
import { Component, Input } from '@angular/core';
import { ReactEnum } from 'src/app/enum/ReactEnum';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {
  @Input() post: any;
  @Input() user: any;
  @Input() isSharedPost: boolean = false;
  commentList: any = []
  isComment: boolean = false;
  commentInput: string = ''

  totalReact = 0;
  totalComment = 0;
  totalShare = 0;
  isMyLikePost: string = ""

  deletedPostId: any
  isOpenDeleteModal: boolean = false
  isConfirmDeleteLoading: boolean = false

  reactType = ReactEnum;

  isOpenShareModal: boolean = false
  sharePostId: number
  shareContent: String = ''
  isConfirmShareLoading: boolean = false

  listImagesAndVideos: Array<any> = []

  constructor(private api: ApiService, private auth: AuthService, private noti: NzMessageService) {

  }

  ngOnInit() {
    this.api.getCommentsByPostId(this.post.id)
      .subscribe({
        next: (res) => {
          this.commentList = res;
        }
      })
    this.countTotalLikePost()
    this.countTotalComment()
    this.countShare()
    if (this.user && this.post) {
      this.checkIsMyLikePost();
    }

    const images = this.post.images.map((image: any) => (
      {
        ...image,
        type: 'image'
      }
    ))

    const videos = this.post.videos.map((video: any) => (
      {
        ...video,
        type: 'video'
      }
    ))

    this.listImagesAndVideos = images.concat(videos).sort((a: any, b: any) => a.createdAt - b.createdAt);

  }

  checkIsMyLikePost() {
    this.api.checkIsMyLikePost(this.user.id, this.post.id)
      .subscribe({
        next: (res) => {
          if (res) {
            switch (res.type) {
              case 'HEART':
                this.isMyLikePost = 'HEART'
                break;
              case 'HAHA':
                this.isMyLikePost = 'HAHA'
                break;
              case 'LIKE':
                this.isMyLikePost = 'LIKE'
                break;
              case 'WOW':
                this.isMyLikePost = 'WOW'
                break;
              case 'SAD':
                this.isMyLikePost = 'SAD'
                break;
              case 'ANGRY':
                this.isMyLikePost = 'ANGRY'
                break;
              default:
                break;
            }
          } else {
            this.isMyLikePost = ''
          }
        },
        error(err) {
          console.log(err);

        },
      })
  }

  countTotalLikePost() {
    this.api.countTotalLikePost(this.post.id)
      .subscribe({
        next: (res) => {
          this.totalReact = res;
        }
      })
  }

  countTotalComment() {
    this.api.countTotalComment(this.post.id)
      .subscribe({
        next: (res) => {
          this.totalComment = res;
        }
      })
  }

  countShare() {
    this.api.countShare(this.post.id)
      .subscribe({
        next: (res) => {
          this.totalShare = res;
        }
      })
  }

  setClassName(index: number, length: number) {
    if (length > 4) {
      if (index > 3) {
        return `fp__post-image-5-4`
      } else {
        return `fp__post-image-5-${index}`
      }
    } else {
      return `fp__post-image-${length}`
    }
  }

  handleClickComment() {
    this.isComment = !this.isComment;
  }

  handleSubmitComment() {
    if (this.commentInput !== '') {
      const comment = {
        postId: this.post.id,
        userId: this.user.id,
        content: this.commentInput,
        createdAt: new Date()
      }

      this.api.saveComment(comment)
        .subscribe({
          next: (res) => {
            this.commentInput = ''
          }
        })
    }
  }

  like(data: any) {
    if (this.isMyLikePost !== '') {
      // dislike
      this.api.dislikePost({
        userId: this.user.id,
        postId: this.post.id,
      })
        .subscribe({
          next: (res) => {
            if (res) {
              this.isMyLikePost = res
              this.countTotalLikePost()
              this.checkIsMyLikePost();
            }
          }
        })
    } else {
      // like
      this.api.likePostOrComment({
        userId: this.user.id,
        postId: this.post.id,
        type: ReactEnum[data]
      })
        .subscribe({
          next: (res) => {
            this.isMyLikePost = res
            this.countTotalLikePost()
            this.checkIsMyLikePost();
          }
        })
    }
  }

  changeLike(data: any) {
    this.api.likePostOrComment({
      userId: this.user.id,
      postId: this.post.id,
      type: ReactEnum[data]
    })
      .subscribe({
        next: (res) => {
          this.isMyLikePost = res
          this.countTotalLikePost()
          this.checkIsMyLikePost();
        }
      })
  }

  handleConfirmDelete(post: any) {
    console.log(post);

    this.deletedPostId = post.id;

    this.isOpenDeleteModal = true
  }

  closeDeleteModal() {
    this.isOpenDeleteModal = false
  }

  deletePost() {
    this.isConfirmDeleteLoading = true

    this.api.deletePost(this.deletedPostId)
      .subscribe({
        next: (res) => {
          if (res) {
            this.isConfirmDeleteLoading = false
            this.isOpenDeleteModal = false
          }
        }
      })
  }

  checkIsMyPost(userId: any, postId: any) {
    if (postId === userId) return true
    else return false;
  }

  isShared() {
    if (this.post.sharePost !== null) {
      return true
    } else {
      return false
    }
  }

  convertStringToBoolean(value: string) {
    if (value === 'true')
      return true
    else return false
  }

  openShareModal(id: number) {
    this.isOpenShareModal = true
    this.sharePostId = id
  }

  closeShareModal() {
    this.isOpenShareModal = false
  }

  handleSharePost() {
    this.isConfirmShareLoading = true;

    const post = {
      ownerId: Number(this.auth.getUserId()),
      content: this.shareContent,
      createdAt: new Date,
      sharePostId: this.sharePostId
    }

    this.api.savePost(post)
      .subscribe({
        next: (res) => {
          this.isConfirmShareLoading = false;
          this.isOpenShareModal = false;
          this.noti.create('success', `Share post successfully!!!`);
        }
      })
  }
}
