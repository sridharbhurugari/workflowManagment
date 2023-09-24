import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IActivity } from '../Classes/IActivity';
import { IProcess } from '../Classes/IProcessList';

@Injectable({
  providedIn: 'root'
})
export class ProcessDefinitionServiceService {
  baseUrl = environment.baseUrl; 
  constructor(
    private _httpClient: HttpClient) { 
      
    }
    createProcess(process: IProcess) {
      let body = JSON.stringify(process);
      let headers = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
      var url = `${this.baseUrl}/domainreference/process`;
      console.log(url);
      return this._httpClient.post<any>(url, body, headers)
        .pipe(catchError(err => this.handleError(err)));
    }
    createActivity(activity: IActivity) {
      let body = JSON.stringify(activity);
      let headers = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
      var url = `${this.baseUrl}/domainreference/Activity`;
      console.log(url);
      return this._httpClient.post<any>(url, body, headers)
        .pipe(catchError(err => this.handleError(err)));
    }
    updateProcess(process: any) {
      let body = JSON.stringify(process);
      let headers = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
      var url = `${this.baseUrl}/domainreference/process`;
      console.log(url);
      return this._httpClient.patch<any>(url, body, headers)
        .pipe(catchError(err => this.handleError(err)));
    }
    updateActivity(activity: any) {
      let body = JSON.stringify(activity);
      let headers = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
      var url = `${this.baseUrl}/domainreference/Activity`;
      console.log(url);
      return this._httpClient.patch<any>(url, body, headers)
        .pipe(catchError(err => this.handleError(err)));
    }
    updateAttribute(attribute: any) {
      let body = JSON.stringify(attribute);
      let headers = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
      var url = `${this.baseUrl}/domainreference/Attribute`;
      console.log(url);
      return this._httpClient.patch<any>(url, body, headers)
        .pipe(catchError(err => this.handleError(err)));
    }
    private handleError(error: HttpErrorResponse) {
      let errorMessage = '';
      if (error.error) {
        errorMessage = error.status >= 400 ? "Unable to save due to server issue" : error.statusText;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      return throwError(errorMessage);
    }
    
    createAttribute(attribute: any) {
      let body = JSON.stringify(attribute);
      let headers = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
      var url = `${this.baseUrl}/domainreference/Attribute`;
      console.log(url);
      return this._httpClient.post<any>(url, body, headers)
        .pipe(catchError(err => this.handleError(err)));
    }
}
