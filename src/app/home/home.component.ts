import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { from } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor( 
    private homeService: HomeService,
    private router: Router,
    private message: NzMessageService
    ) { }

  isCollapsed = false;

  logout() {
    // e.preventDefault();

    this.homeService.logout().subscribe(res => {
      // console.log("成功");
      // 2.客户端localStorage删除token
      localStorage.removeItem('login-token');

      // 3.跳转登录页
      this.router.navigate(['/login']);
    },err => {
      // console.log("失败");
      this.message.create('warning', `您退出失败了呢，请稍后再试一下`);
    })
  }
  

  ngOnInit() {
  }

}
