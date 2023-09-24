import { Injectable } from '@angular/core';
import { IRuleData } from '../Classes/IRuleData';
import { IRuleSearchData } from '../Classes/IRuleSearchData';

@Injectable({
  providedIn: 'root'
})
export class RulesUtilityDataService {
  private ruleRowData:IRuleData;
  private ruleSearchData: IRuleSearchData;
  constructor( ) { }
  setRuleSearchData(data: IRuleSearchData){
    this.ruleSearchData = data;
    console.log(this.ruleSearchData);
  }
  setRuleSelectedRowData(data:IRuleData){   
    this.ruleRowData = data;
  }
  getRuleSelectedRowData(){
    return this.ruleRowData;
  }
  getRuleSearchData(){    
    return this.ruleSearchData;
  }
}
