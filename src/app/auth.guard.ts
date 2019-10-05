import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
// 导入路由服务
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor ( private router: Router ){};
  canActivate(): boolean {
    const token = localStorage.getItem("login-token")
    if(!!token) {
      return true;
    } else {
      // 找不到token，跳转到登录页
      this.router.navigate(["/login"]);
      return false;
    }
    
  }
  
}
