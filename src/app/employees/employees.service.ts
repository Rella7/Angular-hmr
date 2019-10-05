import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL } from '../config';
import { EmployeesType } from './employees.type';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  constructor(private http: HttpClient) { }

  // 获取数据
  getData(curPage: number, pageSize: number) {
    const employeesUrl = `${URL}/employees?_page=${curPage}&_limit=${pageSize}`;

    return this.http.get<EmployeesType[]>(employeesUrl, {
      // 获取完整响应体的总条数
      observe: 'response'
    })
  }

  // 删除数据
  deleteEmployee(id: number) {
    return this.http.delete(`${URL}/employees/${id}`)
  }

  // 添加员工
  addEmployee(employee: EmployeesType) {
    return this.http.post(`${URL}/employees`, employee);
  }
  
  // 根据id查询员工信息
  getEmployeeById(id: number) {
    return this.http.get<EmployeesType>(`${URL}/employees/${id}`)
  }

  // 根据员工id更新员工
  updateEmployeeById(id: number, params: EmployeesType) {
    return this.http.patch<EmployeesType>(`${URL}/employees/${id}`, params)
  }
}