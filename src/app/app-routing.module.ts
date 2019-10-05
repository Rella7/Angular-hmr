import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

// 导入守卫服务
import { AuthGuard } from "./auth.guard";
import { from } from 'rxjs';

const routes: Routes = [
  
  { 
    path: '', 
    component: HomeComponent,
    // 路由守卫
    canActivate: [AuthGuard],
    // 子路由异步加载
    children: [
      {
        path: 'employee',
        loadChildren: './employees/employees.module#EmployeesModule'
      }
    ]
  },
  { 
    path: 'login', 
    component: LoginComponent 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
