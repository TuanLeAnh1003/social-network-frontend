import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private auth: AuthService, private router: Router) {

  }

  canActivate():boolean {
    if (this.auth.isLoggedIn()){
      return true;
    } else {
      this.router.navigate(['login'])
      return false;
    }
  }
  
}
