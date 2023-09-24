import { Injectable } from '@angular/core';
import { IWorkflowParamData, IWorkFlows } from '../Classes/IworkflowTemplateSearch';

@Injectable({
  providedIn: 'root'
})
export class WmsUtilityDataService {
  private wmsRowData:IWorkFlows;
  private wmsSearchData: IWorkflowParamData;
  constructor() { }

  getWmsSelectedRowData(){
    return this.wmsRowData;
  }
  setWmsSelectedRowData(data:IWorkFlows){   
    this.wmsRowData = data;
  }
  setWmsSearchData(data: IWorkflowParamData){
    this.wmsSearchData = data;
    console.log(this.wmsSearchData);
  }
  getwmsSearchData(){    
    return this.wmsSearchData;
  }
}

