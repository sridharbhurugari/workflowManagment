import { Injectable } from '@angular/core';
import { IActivityDefinition } from '../Classes/IActivityDefinition';
import { IActivitySearchData } from '../Classes/IActivitySerachData';

@Injectable({
  providedIn: 'root'
})
export class ActDefUtilityDataService {
  private wmsRowData:IActivityDefinition;
  private wmsSearchData: IActivitySearchData;
  private selectedProcess: any;
  private selectedActivity:any;
  constructor() { }
  getActDefSelectedRowData(){
    return this.wmsRowData;
  }
  setActDefSelectedRowData(data:IActivityDefinition){   
    this.wmsRowData = data;
  }
  setActDefSearchData(data: IActivitySearchData){
    this.wmsSearchData = data;
    console.log(this.wmsSearchData);
  }
  getActDefSearchData(){    
    return this.wmsSearchData;
  }
  setSelectedProcess(process:any){
    this.selectedProcess = process;
  }
  getSelectedProcess(){
    return this.selectedProcess;
  }
  setSelectedActivity(activity:any){
    this.selectedActivity = activity;
  }
  getSelectedActivity(){
    return this.selectedActivity;
  }
}
