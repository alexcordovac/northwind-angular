import { Injectable } from '@angular/core';
import { Employee } from '../models/employee.model';
import { PageRequest } from '../models/page-request.model';
import { BaseCrudService } from './base-crud';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeesApi extends BaseCrudService<Employee> {
  protected override endpoint = environment.endpoints.employees;

  search(request: PageRequest) {
    return this.list(request);
  }
}
