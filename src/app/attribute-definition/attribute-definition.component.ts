import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { SelectableRow } from 'primeng/table';
import { IAttribute, IAttributeCode } from '../Classes/IAttribute';
import { ProcessDefinitionServiceService } from '../Services/process-definition-service.service';
import { WorkFlowRuleService } from '../Services/work-flow-rule.service';
import { ActDefUtilityDataService } from '../utilities/act-def-utility-data.service';

@Component({
  selector: 'app-attribute-definition',
  templateUrl: './attribute-definition.component.html',
  styleUrls: ['./attribute-definition.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class AttributeDefinitionComponent implements OnInit {

  // add dialog
  addAttributeDialog:boolean;
  attributeCode:string; 
  attributeType:string;
  active:boolean;
  processCode:string;
  activityCode:string;
  activityName:string;
  activityStatus:boolean;
  activityState:string;
  selectedActivity:any;
  selectProcess:any;
  attributeCodeList: IAttributeCode[];
  
   //table fileds
   attributes: SelectItem[];
   filterAttributeList: SelectItem[];
   attributeData:IAttribute[];
   filterAttribute:SelectItem;
   loading:boolean;
   totalCount:number;
   rowsPerPage:number;
   currentPage:number
   alertMessage:string;
   selectAtrCode:string;
   selectAtrStatus:boolean;
   isToggleBlur:boolean;   

  constructor(private wrs: WorkFlowRuleService,
    private act_def_ut:ActDefUtilityDataService,
    private ps: ProcessDefinitionServiceService,
    private messageService: MessageService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.alertMessage = '';
    this.rowsPerPage = 10;
    this.totalCount = this.currentPage = 0;
    this.selectedActivity = this.act_def_ut.getSelectedActivity();     
    this.selectProcess = this.act_def_ut.getSelectedProcess(); 
    if(this.selectProcess != undefined){
      this.processCode = this.selectProcess.processCode;
    }
    if(this.selectedActivity !== undefined){      
      this.loading = true;
      this.activityStatus = this.selectedActivity.status 
      this.activityName = this.selectedActivity.activityName;
      this.activityCode = this.selectedActivity.activityCode;
      this.activityState = !this.activityStatus? "Active Activity": "Deactive Activity"; 
      this.getAttributesByActivity(this.activityCode);
      this.getAttributes();
    }
    
    
  }
  getAttributesByActivity(actCode:string) {
    this.wrs.getAttributeListByActivityId(actCode).then(
      (atList: any) => {
        console.log(atList.value);
        if(atList === undefined || atList.value.length === 0){
          this.alertMessage = 'No Attribute Found';
        }
        this.attributeData = atList.value;  
        this.alertMessage = 'No Attribute Found';
        this.loading = false;     
      },
      (error) => {
        this.loading = false;
        console.log(error)
      }
    );            
  }
  getAttributes() {
    this.wrs.getAttributeList().then(
      (atList: any) => {
        this.populateAttributeList(atList.value);              
      },
      (error) => {
        console.log(error);
      }
    );
  }
  populateAttributeList(atList: IAttribute[]) {
    try {
      this.attributes = [];
      this.attributes.push({ value: null, label: 'Select Attribute' });
      for (let atr of atList) {
        let atrItem: SelectItem = {
          value: atr.attributeCode,
          label: atr.attributeName,
          title: atr.attributeTypeName,
        };
        this.attributes.push(atrItem);
      }
    } catch (ex) {
      console.log(ex);
    }
  }
  getFilterAttributeList(event: any) {
    if (this.attributes && this.attributes.length > 0) {
      let filtered: any[] = [];
      let query = event.query;
      for (let i = 0; i < this.attributes.length; i++) {
        let att = this.attributes[i];
        if (att.label?.toLowerCase().includes(query.trim().toLowerCase())) {
          filtered.push(att);
        }
      }
      this.filterAttributeList = filtered;
    } else {
      this.filterAttributeList = [];
    }
  }
  onAttributeSelect(){
    this.attributeCode = this.filterAttribute.value? this.filterAttribute.value: '';
    this.attributeType = this.filterAttribute.title ? this.filterAttribute.title:'';
  }
  onUnSelectAttribute(){
    this.filterAttribute = {label: '',  value:'', title:''};
    this.attributeCode = '';
    this.attributeType = '';
  }
 
  addAttribute(){
    this.filterAttribute = {label: '',  value:'', title:''};
    this.attributeCode = '';
    this.attributeType = '';
    this.addAttributeDialog = true;
  }
  onAttributeRowSelect(event: SelectableRow){
    this.selectAtrCode = event.data.attributeCode;    
        this.onUpdateAttribute();
  }
  onToggleNotBlur(){    
    this.isToggleBlur = false;
  }
  onToggleBlur(){    
    this.isToggleBlur = true;
  }
  handleChange($event: any){   
   this.loading = true;
   this.selectAtrStatus =$event.checked;
  } 
  onSubmitAttribute(){
    if(this.filterAttribute != undefined){
      this.attributeCodeList = [];
      let attCode: IAttributeCode = {
        attributeCode: this.filterAttribute ? this.filterAttribute.value:''
      }
      this.attributeCodeList.push(attCode);
      let param: any = {
        attributeId:0,
        activityCode: this.activityCode? this.activityCode:'',
        processCode: this.processCode? this.processCode:'',
        attributeDetail: this.attributeCodeList
      }
      this.ps.createAttribute(param).subscribe(dt => {
        if(dt.statusCode >= 200 && dt.statusCode < 400){
          this.loading = true;
          this.addMessages('success', 'Attribute added successfully');        
          this.addAttributeDialog = false;  
          this.getAttributesByActivity(this.activityCode);
          this.loading = false;
        }
        else{
          let errorDetails =  (dt.value.detail !== undefined && dt.value.detail.includes('Attributecode exists')) ? "Attribute is already exist.": 'Please select different attribute';     
          this.addMessages('error', 'Failed to add Attribute.'+ errorDetails);
        }
      })     
    }
  }
  onUpdateAttribute(){
    if(this.selectAtrCode !== undefined && this.activityCode != undefined){
      let param:any = {
        attributeCode: this.selectAtrCode? this.selectAtrCode: null,
        activityCode: this.activityCode? this.activityCode: null,
        status: this.selectAtrStatus
      }
      this.ps.updateAttribute(param).subscribe(dt => {
        if(dt.statusCode >= 200 && dt.statusCode < 400){
          this.addMessages('success', 'Attribute updated successfully');                         
        }
        else{
          let errorMessage = (dt.value !== undefined && dt.value.detail !== undefined)? dt.value.detail: 'Please contact administrative';
          this.addMessages('error', 'Failed to update Attribute.'+ errorMessage);
        }
        this.getAttributesByActivity(this.activityCode);
        this.loading = false;
      })      
    }
  }
  addMessages(severity: string, message: string) {
    this.messageService.add({
      severity: severity,
      summary: severity,
      detail: message,
    });
  }
}
