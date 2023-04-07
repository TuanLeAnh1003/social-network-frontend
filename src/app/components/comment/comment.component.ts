import { ReactEnum } from './../../enum/ReactEnum';
import { ApiService } from './../../services/api.service';
import { Component, Input } from '@angular/core';
import { formatDistance } from 'date-fns';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {
  @Input() comment: any;
  @Input() user: any;

  subCommentList: Array<any> = []
  isReply: boolean = false;
  replyInput: string = ''
  totalLike: number = 0

  likes = 0;
  isMyLike: string = '';

  reactType = ReactEnum;

  constructor(private api: ApiService) {

  }

  ngOnInit() {
    this.api.getCommentsByCommentId(this.comment.id)
      .subscribe({
        next: (res) => {
          this.subCommentList = res;
        }
      })
    this.countTotalLikeComment();
    this.checkIsMyLikeComment();
  }

  checkIsMyLikeComment() {
    this.api.checkIsMyLikeComment(this.user.id, this.comment.id)
      .subscribe({
        next: (res) => {
          if (res) {
            switch (res.type) {
              case 'HEART':
                this.isMyLike = 'HEART'
                break;
              case 'HAHA':
                this.isMyLike = 'HAHA'
                break;
              case 'LIKE':
                this.isMyLike = 'LIKE'
                break;
              case 'WOW':
                this.isMyLike = 'WOW'
                break;
              case 'SAD':
                this.isMyLike = 'SAD'
                break;
              case 'ANGRY':
                this.isMyLike = 'ANGRY'
                break;
              default:
                break;
            }
          } else {
            this.isMyLike = ''
          };
        }

      })
  }

  countTotalLikeComment() {
    this.api.countTotalLikeComment(this.comment.id)
      .subscribe({
        next: (res) => {
          this.likes = res;
        }
      })
  }

  like(data: any): void {
    if (this.isMyLike !== '') {
      // dislike
      this.api.dislikeComment({
        userId: this.user.id,
        commentId: this.comment.id,
      })
        .subscribe({
          next: (res) => {
            if (res) {
              this.isMyLike = res
              this.countTotalLikeComment()
              this.checkIsMyLikeComment();
            }
          }
        })
    } else {
      // like
      this.api.likePostOrComment({
        userId: this.user.id,
        commentId: this.comment.id,
        type: ReactEnum[data]
      })
        .subscribe({
          next: (res) => {
            this.isMyLike = res
            this.countTotalLikeComment()
            this.checkIsMyLikeComment();
          }
        })
    }
  }

  formatFullName(firstName: string, lastName: string, limit: number) {
    let fullName = `${firstName} ${lastName}`

    let limitName = fullName.slice(0, limit)

    return `${limitName} ...`;
  }

  formatDate(date: string) {
    return `${formatDistance(new Date(date), new Date())}`
  }

  handleClickReply() {
    this.isReply = !this.isReply;
  }

  handleSubmitReply() {
    if (this.replyInput !== '') {
      const comment = {
        commentId: this.comment.id,
        userId: this.user.id,
        content: this.replyInput,
        createdAt: new Date()
      }

      this.api.saveComment(comment)
        .subscribe({
          next: (res) => {
            this.replyInput = ''
          }
        })
    }
  }

  changeLike(data: any) {
    this.api.likePostOrComment({
      userId: this.user.id,
      commentId: this.comment.id,
      type: ReactEnum[data]
    })
      .subscribe({
        next: (res) => {
          this.isMyLike = res
          this.countTotalLikeComment()
          this.checkIsMyLikeComment();
        }
      })
  }
}
