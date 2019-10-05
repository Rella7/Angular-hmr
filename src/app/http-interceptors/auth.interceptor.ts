import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptors implements HttpInterceptor {
    constructor ( private router: Router ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // 有No-Auth标志的登录接口，则不添加拦截器请求头Authorization
        if (req.headers.get('No-Auth') === 'TRUE' ) {
            return next.handle(req);
        }
        
        // 使用HttpInterceptor拦截器统一添加Authorization请求头
        const token = localStorage.getItem('login-token');
        const authReq = req.clone({
            headers: req.headers.set('Authorization',`Bearer ${token}`)
        });
        return next.handle(authReq).pipe(
            tap(
                ok => {},
                error => {
                    // console.log('拦截器捕获到一个错误'+ error)
                    if ( error.status === 401 ) {
                        localStorage.removeItem('login-token');
                        this.router.navigate(['/login']);
                    }
                }
            )
        );
    }
}