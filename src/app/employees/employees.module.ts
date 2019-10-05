import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeAddComponent } from './employee-add/employee-add.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { from } from 'rxjs';


@NgModule({
  declarations: [EmployeeListComponent, EmployeeAddComponent],
  imports: [
    CommonModule,
    EmployeesRoutingModule,
    NgZorroAntdModule,
    ReactiveFormsModule
  ]
})
export class EmployeesModule { }
