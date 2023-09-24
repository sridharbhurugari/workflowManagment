import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IActivitySearchData, IActivityUpdateData } from '../Classes/IActivitySerachData';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { IActivityDefinition } from '../Classes/IActivityDefinition';

@Injectable({
  providedIn: 'root'
})
export class ActivityDefinitionService {
  baseUrl = environment.baseUrl;
  constructor(private _httpClient: HttpClient) { }

  getProcessList() {
    var url = `${this.baseUrl}/domainreference/process`;
    console.log(url);
    return this._httpClient.get<any>(url).toPromise();
  }

  getResponseList() {
    var url = `${this.baseUrl}/activitydefinition/notification`;
    console.log(url);
    return this._httpClient.get<any>(url).toPromise();
  }

  getActivityList(processCode: string) {
    var url = `${this.baseUrl}/domainreference/activity/${processCode}`;
    return this._httpClient.get<any>(url).toPromise();
  }

  getRuleList(activityCode: string) {
    var url = `${this.baseUrl}/activitydefinition/rules/${activityCode}`;
    return this._httpClient.get<any>(url).toPromise();
  }

  getActivityDefinitions(request: IActivitySearchData) {
    let body = JSON.stringify(request);
    let headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    var url = `${this.baseUrl}/activitydefinition/search`;
    return this._httpClient.post<any>(url, body, headers).toPromise();
  }

  getSelectedActivityDefinitionById(actDefCode: number) {
    var url = `${this.baseUrl}/activitydefinition/${actDefCode}`;
    return this._httpClient.get<any>(url).toPromise();
  }

  createActivitydefinition(actDef: IActivityDefinition) {
    let body = JSON.stringify(actDef);
    console.log(body);
    let headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    var url = `${this.baseUrl}/activitydefinition`;
    console.log(url);
    return this._httpClient.post<any>(url, body, headers)
      .pipe(catchError(err => this.handleError(err)));
  }
  
  updateActivityDefinition(actDef: IActivityUpdateData) {
    let body = JSON.stringify(actDef);
    console.log(body);
    let headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    var url = `${this.baseUrl}/activitydefinition`;
    console.log(url);
    return this._httpClient.patch<any>(url, body, headers)
      .pipe(catchError(err => this.handleError(err)));;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';       
     if(error.status >= 400 ){
      errorMessage = "Activity Definition alredy exist for the selected Department,OfficeLevel,Office,Activity and Rules";         
     }    
      else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
