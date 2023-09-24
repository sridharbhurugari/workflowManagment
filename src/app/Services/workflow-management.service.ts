import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { IUpdateWorkflow, IWorkFlows, IWorkflowSearchData } from '../Classes/IworkflowTemplateSearch';
import { environment } from 'src/environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WorkflowManagementService {
  baseUrl = environment.baseUrl;
  constructor(private _httpClient: HttpClient) { }

  getDepartmentList() {
    var url = `${this.baseUrl}/domainreference/department`;
    return this._httpClient.get<any>(url,{observe: 'response'}).toPromise();
  }

  getOfficeLevelList(departmentCode: string) {
    var url = `${this.baseUrl}/domainreference/officelevel/${departmentCode}`;
    return this._httpClient.get<any>(url).toPromise();
  }
  getOfficeList(departmentCode: string, officeLevelCod: string) {
    var url = `${this.baseUrl}/domainreference/office/${departmentCode}/${officeLevelCod}`
    console.log(url);
    return this._httpClient.get<any>(url).toPromise();
  }
  getRoleList(departmentCode: string, officeLevelCod: string) {
    var url = `${this.baseUrl}/domainreference/role/${departmentCode}/${officeLevelCod}`
    console.log(url);
    return this._httpClient.get<any>(url).toPromise();
  }
  getCadreList(departmentCode: string, officeLevelCod: string) {
    var url = `${this.baseUrl}/domainreference/cadre/${departmentCode}/${officeLevelCod}`
    console.log(url);
    return this._httpClient.get<any>(url).toPromise();
  }
  getPostList(departmentCode: string, officeLevelCod: string, cadreCode: string) {
    var url = `${this.baseUrl}/domainreference/post/${departmentCode}/${officeLevelCod}/${cadreCode}`
    console.log(url);
    return this._httpClient.get<any>(url).toPromise();
  }
  getWorkflowTemplates(request: IWorkflowSearchData) {
    let body = JSON.stringify(request);
    let headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    var url = `${this.baseUrl}/template/search`;
    return this._httpClient.post<any>(url, body, headers).toPromise();
  }

  createWorkflowTemplate(workfLow: IWorkFlows) {
    let body = JSON.stringify(workfLow);
    let headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    var url = `${this.baseUrl}/template`;
    console.log(url);
    return this._httpClient.post<any>(url, body, headers)
      .pipe(catchError(err => this.handleError(err)));
  }

  updateWorkflowTemplate(wrkflow: IUpdateWorkflow) {
    let body = JSON.stringify(wrkflow);
    let headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    var url = `${this.baseUrl}/template`;
    console.log(url);
    return this._httpClient.patch<any>(url, body, headers)
      .pipe(catchError(err => this.handleError(err)));;
  }
  getCurrentTemplate(templateId: number) {
    var url = `${this.baseUrl}/template/${templateId}`;
    return this._httpClient.get<any>(url).toPromise();
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error) {
      errorMessage = error.status === 400 ? "Default template already exists for the selected Department One default template is allowed for a Department." : error.statusText;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}

