import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { URL } from '../config';

import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  // 退出
  logout() {
    // 1.向服务器发送请求，在服务器删除token
    return this.http.delete(`${URL}/tokens`)
    
  }
}
