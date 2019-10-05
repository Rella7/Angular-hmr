import { Component, OnInit } from '@angular/core';
import { EmployeesService } from '../employees.service';
import { EmployeesType } from '../employees.type';
import { HttpResponse } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { from } from 'rxjs';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'

// 手机号码的正则
const PHONE_NUMBER_REGEXP = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  constructor(
    private employeesService: EmployeesService, 
    private message: NzMessageService,
    private fb: FormBuilder
    ) { }

  listOfData: EmployeesType[] = [];
  curPage = 1;
  pageSize = 5;
  totalCount: number;
  isLoading = false;
  // 控制编辑员工对话框
  isShowEmployeeModal = false
  employeeEditForm: FormGroup
  editEmployeeId: number

  // 列表追踪
  trackByEmpId(index: number, employee: EmployeesType) {
    return employee.id;
  }

  
  // 日期的自定义校验规则
  joinDateValidate(control: FormControl) {
    const selectDate = +control.value
    // console.log(selectDate)
    const curDate = +new Date()

    if (selectDate > curDate) {
      return { date: true }
    }

    return null
  }

  // 获取数据
  getData() {
    this.isLoading = true;
    this.employeesService
      .getData(this.curPage, this.pageSize)
      .subscribe((res: HttpResponse<EmployeesType[]>) => {
        this.totalCount = + res.headers.get('X-Total-Count');
        this.listOfData = res.body;
        this.isLoading = false;
      });
  }

  // 确认删除
  handleDelete(id: number) {
    this.employeesService.deleteEmployee(id).subscribe(res => {
      this.message.info('删除成功');
      this.getData();
    })
  }
  // 取消删除
  handleCancel() {
    this.message.info('取消删除');
  }

  // 弹出修改员工对话框
  showEditEmployeeModal(id: number) {
    this.isShowEmployeeModal = true
    this.editEmployeeId = id

    // 根据id获取员工信息
    this.employeesService
      .getEmployeeById(id)
      .subscribe((employee: EmployeesType) => {
        // console.log(employee)

        // 将获取到的员工数据展示在表单中
        const { joinDate } = employee
        this.employeeEditForm.patchValue({
          ...employee,
          joinDate: +new Date(joinDate)
        })
      })
  }

  // 取消编辑
  handleEditEmployeeCancel() {
    // console.log('取消编辑')
    this.isShowEmployeeModal = false

    this.resetEmployee()
  }

  // 确认修改
  editEmployee() {
    // console.log('确认修改')
    const employeeEditForm = this.employeeEditForm
    const { controls } = employeeEditForm

    Object.keys(controls).forEach(key => {
      controls[key].markAsDirty()
      controls[key].updateValueAndValidity()
    })

    // console.log(employeeEditForm.valid)
    if (!employeeEditForm.valid) {
      return
    }

    let { joinDate } = employeeEditForm.value
    if (!joinDate) {
      // 初始化默认日期
      joinDate = +new Date()
    }
    const params = { ...employeeEditForm.value, joinDate: joinDate - 0 }

    this.employeesService
      .updateEmployeeById(this.editEmployeeId, params)
      .subscribe((res: EmployeesType) => {
        // console.log('编辑成功：', res)
        this.isShowEmployeeModal = false
        const index = this.listOfData.findIndex(
          employee => employee.id === res.id
        )
        this.listOfData[index] = res

        this.resetEmployee()
      })
  }

  resetEmployee() {
    const employeeEditForm = this.employeeEditForm
    const { controls } = employeeEditForm

    this.employeeEditForm.reset()
    Object.keys(controls).forEach(key => {
      controls[key].markAsPristine()
      controls[key].updateValueAndValidity()
    })
  }

  ngOnInit() {
    this.getData();
    this.employeeEditForm = this.fb.group({
      // 注意：如果有两个及其以上的验证规则，需要使用 [] 来包裹
      name: ['', [Validators.required, Validators.minLength(2)]],
      gender: ['0', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.pattern(PHONE_NUMBER_REGEXP)],
      joinDate: ['', this.joinDateValidate]
    })
  }

}
