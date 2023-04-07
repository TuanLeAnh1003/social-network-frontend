import { TokenApiModel } from './../models/token-api.model';
import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError, switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

	constructor(private auth: AuthService, private router: Router) { }

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> | any {
		const myToken = this.auth.getToken();

		if (myToken) {
			request = request.clone({
				setHeaders: {
					Authorization: `Bearer ${myToken}`
				},
			});
		}

		return next.handle(request).pipe(
			catchError((err: any) => {
				if (err instanceof HttpErrorResponse) {
					if (err.status === 401) {
						return this.handleUnAuthorizedError(request, next)
					}
				}
				return throwError(() => new Error("Some other error occured"))
			})
		);
	}

	handleUnAuthorizedError(req: HttpRequest<any>, next: HttpHandler) {
		let tokenApiModel = new TokenApiModel();
		tokenApiModel.access_token = this.auth.getToken()!;
		tokenApiModel.refresh_token = this.auth.getRefreshToken()!;
		return this.auth.renewToken(tokenApiModel)
			.pipe(
				switchMap((data: TokenApiModel) => {
					this.auth.storeRefreshToken(data.refresh_token)
					this.auth.storeToken(data.access_token)
					req = req.clone({
						setHeaders: {
							Authorization: `Bearer ${data.access_token}`
						},
						withCredentials: false
					});
					return next.handle(req)
				}),
				catchError((err) => {
					return throwError(() => {
						alert("Token is expired, login again")
						this.router.navigate(["login"])
					})
				})
			)
	}
}
