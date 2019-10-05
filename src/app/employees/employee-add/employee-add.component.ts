import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Observer, from } from 'rxjs';
import { EmployeesService } from '../employees.service';
import { NzMessageService } from 'ng-zorro-antd/message';

// 手机号码的正则
const PHONE_NUMBER_REGEXP = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.css']
})
export class EmployeeAddComponent implements OnInit {

  constructor(
    private fb: FormBuilder, 
    private employeeService: EmployeesService, 
    private message: NzMessageService,
    private router: Router
    ) { }

  employeeAddForm: FormGroup;

  // 日期的自定义校验
  joinDateValidate(control: FormControl) {
    const selectDate = +control.value;
    const curDate = +new Date();
    if (selectDate > curDate) {
      return { date: true };
    }
    return null;
  }

  submitForm = ($event: any, value: any) => {
    $event.preventDefault();
    for (const key in this.employeeAddForm.controls) {
      this.employeeAddForm.controls[key].markAsDirty();
      this.employeeAddForm.controls[key].updateValueAndValidity();
    }
    // 修改joinDate格式
    const joinDate = +this.employeeAddForm.value.joinDate;
    const params = { ...this.employeeAddForm.value, joinDate };
    // console.log(params);

    if (!this.employeeAddForm.valid) {
      return
    }
    this.employeeService.addEmployee(params).subscribe(res => {
      this.message.create('success', `添加员工成功`);
      this.resetEmployee();
      this.router.navigate(['/employee']);
    })

  };

  resetEmployee() {
    this.employeeAddForm.reset({ gender: '0' });
    for (const key in this.employeeAddForm.controls) {
      this.employeeAddForm.controls[key].markAsPristine();
      this.employeeAddForm.controls[key].updateValueAndValidity();
    }
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.resetEmployee();
  }

  ngOnInit() {
    this.employeeAddForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      gender: ['0', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      phoneNumber: ['', [Validators.pattern(PHONE_NUMBER_REGEXP)]],
      joinDate: ['', this.joinDateValidate]
    });
  }

}
