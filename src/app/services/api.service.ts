import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  constructor(private auth:AuthService, private http: HttpClient) { }

  baseUrl:string = this.auth.getBaseUrl();

  // USERS
  saveAvatar(data:any) {
    return this.http.post<any>(`${this.baseUrl}user/changeAvatar`, data);
  }

  saveCoverImage(data:any) {
    return this.http.post<any>(`${this.baseUrl}user/changeCoverImage`, data);
  }

  // POSTS
  getPosts() {
    return this.http.get<any>(`${this.baseUrl}posts`);
  }

  getPostsByOwnerId(userId:any) {
    return this.http.post<any>(`${this.baseUrl}post`, userId);
  }

  savePost (post:any) {
    return this.http.post<any>(`${this.baseUrl}post/save`, post);
  }

  deletePost (postId:any) {
    return this.http.post<any>(`${this.baseUrl}post/delete`, postId);
  }

  countTotalComment(postId:number) {
    return this.http.post<any>(`${this.baseUrl}comments/getTotalComment`, postId);
  }

  countShare(postId:number) {
    return this.http.post<any>(`${this.baseUrl}post/count-share`, postId);
  }

  // FRIENDS
  getFriends(userId:number) {
    return this.http.post<any>(`${this.baseUrl}friends`, userId);
  }

  searchFriend(search:string) {
    return this.http.post<any>(`${this.baseUrl}user/search`, {
      "search": `${search}`,
      "username": `${this.auth.getUsername()}`
    });
  }

  checkIsFriend(userId:number, friendId:number) {
    return this.http.post<any>(`${this.baseUrl}friend/checkIsFriend`, {
      userId,
      friendId
    });
  }

  saveFriend(userId:number, friendId:number) {
    return this.http.post<any>(`${this.baseUrl}friend/save`, {
      userId,
      friendId
    });
  }

  // MESSAGES
  getMessages(userId:number, friendId:number) {
    return this.http.post<any>(`${this.baseUrl}messages-by-user-ids`, {
      userId,
      friendId
    });
  }

  getChatId(userId:number, friendId:number) {
    return this.http.post<any>(`${this.baseUrl}message/getChatId`, {
      userId,
      friendId
    });
  }

  sendMessage(data:any) {
    return this.http.post<any>(`${this.baseUrl}message/save`, data);
  }

  // COMMENTS
  getCommentsByPostId(postId:number) {
    return this.http.post<any>(`${this.baseUrl}comments/findAllByPostId`, postId);
  }

  getCommentsByCommentId(commentId:number) {
    return this.http.post<any>(`${this.baseUrl}comments/findAllByCommentId`, commentId);
  }

  saveComment(comment:any) {
    return this.http.post<any>(`${this.baseUrl}comment/save`, comment);
  }

  // LIKES
  countTotalLikePost(postId:number) {
    return this.http.post<any>(`${this.baseUrl}like/count-like-post`, postId);
  }

  countTotalLikeComment(commentId:number) {
    return this.http.post<any>(`${this.baseUrl}like/count-like-comment`, commentId);
  }

  checkIsMyLikeComment(userId:number, commentId:number) {
    return this.http.post<any>(`${this.baseUrl}like/is-my-like-comment`, {
      userId: userId,
      commentId: commentId
    });
  }

  checkIsMyLikePost(userId:number, postId:number) {
    return this.http.post<any>(`${this.baseUrl}like/is-my-like-post`, {
      userId: userId,
      postId: postId
    });
  }

  likePostOrComment(data:any) {
    return this.http.post<any>(`${this.baseUrl}like/like-post-or-comment`, data);
  }

  dislikePost(data:any) {
    return this.http.post<any>(`${this.baseUrl}like/dislike-post`, data);
  }

  dislikeComment(data:any) {
    return this.http.post<any>(`${this.baseUrl}like/dislike-comment`, data);
  }

  // CHATS
  getListChatMessage(userId:any) {
    return this.http.post<any>(`${this.baseUrl}chat/getListChatMessage`, userId);
  }

  updateSeen(data:any) {
    return this.http.post<any>(`${this.baseUrl}chat/updateSeen`, data);
  }
}
