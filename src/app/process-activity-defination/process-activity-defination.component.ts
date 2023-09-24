import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SelectableRow } from 'primeng/table';
import { IActivity } from '../Classes/IActivity';
import { ActivityDefinitionService } from '../Services/activity-definition.service';
import { ProcessDefinitionServiceService } from '../Services/process-definition-service.service';
import { ActDefUtilityDataService } from '../utilities/act-def-utility-data.service';

@Component({
  selector: 'app-process-activity-defination',
  templateUrl: './process-activity-defination.component.html',
  styleUrls: ['./process-activity-defination.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class ProcessActivityDefinationComponent implements OnInit {
  
  activityData:IActivity[];

  selectedProcess:any;
  addActivityDialog: boolean;
  activityCode: string;
  activityName: string;
  activityStatus:boolean;
  processState:String;
  processName:string;
  processCode:string;
  processStatus:boolean;
  selectActCode:string;
  selectActStatus:boolean;
  isToggleBlur:boolean;

  //table fileds
  loading:boolean;
  totalCount:number;
  rowsPerPage:number;
  currentPage:number
  alertMessage:string;
  constructor(private ads: ActivityDefinitionService,
    private act_def_ut:ActDefUtilityDataService,  
    private ps: ProcessDefinitionServiceService,  
    private router: Router, 
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {     
  }

  ngOnInit(): void {
    this.alertMessage = '';
    this.rowsPerPage = 10;
    this.totalCount = this.currentPage = 0;        
    this.selectedProcess = this.act_def_ut.getSelectedProcess();        
    if(this.selectedProcess != undefined && this.selectedProcess != ''){
      this.loading = true;      
      this.processStatus = this.selectedProcess.status;
      this.processName = this.selectedProcess.processName;
      this.processCode = this.selectedProcess.processCode;
      this.processState = !this.processStatus ? "Active Process": "Deactive Process"; 
      this.getActivities(this.selectedProcess.processCode);
    }    
  }
  getActivities(processCode: string) {
    this.ads.getActivityList(processCode).then(
      (actList: any) => {        
        if(actList.value === undefined || actList.value.length === 0){
          this.alertMessage = 'No Activity Found';
        }
        this.activityData = actList.value;          
        this.loading = false;                          
      },
      (error) => {
        this.loading = false;
        this.alertMessage = 'No Activity Found';
        console.log(error);
      }
    );
  }  
  onActivitySelect(event: SelectableRow){
    if(event != undefined && event.data != undefined && event.data.activityCode != undefined){   
      if(!this.isToggleBlur){   
      this.act_def_ut.setSelectedActivity(event.data);
      this.router.navigateByUrl('/process-attribute');      
      }
      else{
        this.selectActCode = event.data.activityCode;
        this.onUpdateActivity();
      }
    } 
  }
  onSubmitActivity(){
    if((this.activityCode === undefined || this.activityCode === '') || (this.activityName === '' || this.activityName === undefined)){
      this.displayAlerts("Please enter required fileds");
    }
    else{
      let newActivity:IActivity = {
        activityId : 0,
        processCode: this.processCode,
        activityCode: this.activityCode,
        activityName: this.activityName,
        status: this.activityStatus
      };      
      this.ps.createActivity(newActivity).subscribe(dt => {
        if(dt.statusCode >= 200 && dt.statusCode < 400){
          this.addMessages('success', 'Activity added successfully');
          this.addActivityDialog = false;      
          this.getActivities(this.processCode);    
        }
        else{
         let errorDetails =  (dt.value.detail !== undefined && dt.value.detail.includes('unique constraint')) ? "Activity with activity code is already exist.": 'Please contact administrative';     
          this.addMessages('error', 'Failed to add Activity.'+ errorDetails);
        }
      })      
    }    
  }
  onUpdateActivity(){
    if(this.selectActCode !== undefined){
      let param:any = {
        activityCode: this.selectActCode? this.selectActCode: null,
        status: this.selectActStatus
      }
      this.ps.updateActivity(param).subscribe(dt => {
        if(dt.statusCode >= 200 && dt.statusCode < 400){
          this.addMessages('success', 'Activity updated successfully');                         
        }
        else{
          let errorMessage = (dt.value !== undefined && dt.value.detail !== undefined)? dt.value.detail: 'Please contact administrative';
          this.addMessages('error', 'Failed to update Activity.'+ errorMessage);
        }
        this.getActivities(this.processCode);
      })      
    }
  }
  onToggleNotBlur(){    
    this.isToggleBlur = false;
  }
  onToggleBlur(){    
    this.isToggleBlur = true;
  }
  handleChange($event: any){   
    this.loading = true; 
   this.selectActStatus =$event.checked;
  } 
  addActivity(){
    this.activityCode = this.activityName = '';
    this.activityStatus = false;
    this.addActivityDialog = true;
  }
  displayAlerts(message: string) {
    this.confirmationService.confirm({
      message: message,
      header: 'Warning',
      icon: 'pi pi-exclamation-triangle',
      rejectVisible: false,
      acceptLabel: 'Ok',
      accept: () => {},
    });
  }
  addMessages(severity: string, message: string) {
    this.messageService.add({
      severity: severity,
      summary: severity,
      detail: message,
    });
  }

}
