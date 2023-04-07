import { TokenApiModel } from './../models/token-api.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = 'http://localhost:8080/api/'
  // private baseUrl: string = 'http://192.168.107.48:8080/api/'
  // private baseUrl: string = 'https://social-network-backend-c8ew.onrender.com/api/'

  constructor(private http: HttpClient, private router: Router) { }

  signUp(userObj: any) {
    return this.http.post<any>(`${this.baseUrl}user/save`, userObj);
  }

  login(loginObj: any) {
    return this.http.post<any>(`${this.baseUrl}login`, loginObj);
  }

  signOut() {
    localStorage.clear()
    this.router.navigate(['login'])
  }

  getUserDetailById(id:number) {
    return this.http.get<any>(`${this.baseUrl}user?id=${id}`);
  }

  getUserDetail(username:string) {
    return this.http.post<any>(`${this.baseUrl}user`, username);
  }

  storeUsername(username: string) {
    localStorage.setItem("username", username)
  }

  storeuserId(userId: string) {
    localStorage.setItem("userId", userId)
  }

  storeToken(tokenValue: string) {
    localStorage.setItem("access_token", tokenValue)
  }

  storeRefreshToken(tokenValue: string) {
    localStorage.setItem("refresh_token", tokenValue)
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  getUsername():string {
    return localStorage.getItem("username")!;
  }

  getUserId():string {
    return localStorage.getItem("userId")!;
  }

  getToken() {
    return localStorage.getItem("access_token")
  }

  getRefreshToken() {
    return localStorage.getItem("refresh_token")
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem("access_token")
  }

  // decodedToken() {
  //   const jwtHelper = new JwtHelperService()
  //   const token = this.getToken()!
  //   console.log("jwtHelper.decodeToken(token): ", jwtHelper.decodeToken(token));


  //   return jwtHelper.decodeToken(token)
  // }

  // getFullNameFromToken() {
  //   if (this.userPayload)
  //     return this.userPayload.name;
  // }

  // getRoleFromToken() {
  //   if (this.userPayload)
  //     return this.userPayload.role;
  // }

  renewToken(tokenApi: TokenApiModel) {
    return this.http.get<any>(`${this.baseUrl}token/refresh`, {
      headers: {
        "Authorization": `Bearer ${tokenApi}`
      }
    })
  }
}
