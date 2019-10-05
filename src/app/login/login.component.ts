import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms"
import { from } from 'rxjs';
// 导入类型
import { LoginFormType } from './login.type';
// 导入登录服务
import { LoginService } from './login.service';
// 导入路由服务
import { Router } from '@angular/router';

// token 接口
interface Token {
  token: string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
    ) { }

  LoginForm: FormGroup;

  submitForm(): void {
    for (const i in this.LoginForm.controls) {
      this.LoginForm.controls[i].markAsDirty();
      this.LoginForm.controls[i].updateValueAndValidity();
    }

    // 判断验证是否成功
    if(!this.LoginForm.valid) {
      console.log('验证失败')
      return
    }
    const { userName, password } = this.LoginForm.value;
    const loginParams: LoginFormType = {
      username: userName,
      password
    };
    this.loginService.login(loginParams).subscribe((res: Token) => {
      // console.log('登录成功', res)
      // 存储token
      localStorage.setItem('login-token', res.token);
      this.router.navigate(['/']);
    });
  }

  ngOnInit(): void {
    this.LoginForm = this.fb.group({
      userName: ['zqran', [Validators.required,Validators.maxLength(6), Validators.minLength(3)]],
      password: ['123456', [Validators.required,Validators.pattern(/^[a-zA-Z0-9]{6,16}$/)]]
    });
  }

}
