import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IRuleData, IRuleUpdateData } from '../Classes/IRuleData';

@Injectable({
  providedIn: 'root'
})
export class WorkFlowRuleService {
  baseUrl = environment.baseUrl;
  constructor(private _httpClient: HttpClient) { }
  getAttributeListByActivityId(activityCode: string) {
    var url = `${this.baseUrl}/domainreference/attributes/${activityCode}`;
    return this._httpClient.get<any>(url).toPromise();
  }
  getRulesByRuleId(ruleId: number) {
    var url = `${this.baseUrl}/rule/${ruleId}`;
    return this._httpClient.get<any>(url).toPromise();
  }
  getAttributeList() {
    var url = `${this.baseUrl}/domainreference/attributes`;
    return this._httpClient.get<any>(url).toPromise();
  }
  getValuesList(attributeCode: string) {
    var url = `${this.baseUrl}/domainreference/attributes/${attributeCode}/values`;
    console.log(url);
    return this._httpClient.get<any>(url).toPromise();
  }
  getValuesListByDepCode(attributeCode: string, depCode:string) {
    var url = `${this.baseUrl}/domainreference/attributes/${attributeCode}/values?filterCode=${depCode}`;
    console.log(url);
    return this._httpClient.get<any>(url).toPromise();
  }
  getWorkflowRules(request: any) {
    let body = JSON.stringify(request);
    let headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    var url = `${this.baseUrl}/rule/search`;
    return this._httpClient.post<any>(url, body, headers).toPromise();
  }
  createWorkflowRule(rule: IRuleData) {
    let body = JSON.stringify(rule);
    let headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    var url = `${this.baseUrl}/rule`;
    console.log(url);
    return this._httpClient.post<any>(url, body, headers)
      .pipe(catchError(err => this.handleError(err)));
  }
  updateWorkflowTemplate(rule: IRuleUpdateData) {
    let body = JSON.stringify(rule);
    let ruleId = rule.ruleId;
    let headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    var url = `${this.baseUrl}/rule/${ruleId}`;
    console.log(url);
    return this._httpClient.post<any>(url, body, headers)
      .pipe(catchError(err => this.handleError(err)));;
  }
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error) {
      errorMessage = error.status >= 400 ? "Rule is already exist." : error.statusText;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
