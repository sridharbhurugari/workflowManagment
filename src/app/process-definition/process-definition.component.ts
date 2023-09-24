import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { LEADING_TRIVIA_CHARS } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RowToggler, SelectableRow } from 'primeng/table';
import { IProcess} from '../Classes/IProcessList';
import { ActivityDefinitionService } from '../Services/activity-definition.service';
import { ProcessDefinitionServiceService } from '../Services/process-definition-service.service';
import { WorkFlowRuleService } from '../Services/work-flow-rule.service';
import { ActDefUtilityDataService } from '../utilities/act-def-utility-data.service';

@Component({
  selector: 'app-process-definition',
  templateUrl: './process-definition.component.html',
  styleUrls: ['./process-definition.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class ProcessDefinitionComponent implements OnInit {
     
  //add Process dialog
  processState:String;
  processCode: string;
  processName: string;    
  selectedProcessCode:string;
  selectedProcessStatus:boolean;
  processStatus:boolean;  
  addProcessDialog: boolean;
        
  //process table properties
  procData: IProcess[];
  loading:boolean;
  rowperPageForProcess:number;
  totalProcessCount:number;
  alertMessage:string;
  currentPageProcess: number;
  isToggleBlur:boolean;
    
  constructor(
    private ps: ProcessDefinitionServiceService,    
    private ads: ActivityDefinitionService,
    private confirmationService: ConfirmationService,
    private act_def_ut:ActDefUtilityDataService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.alertMessage = '';
    this.rowperPageForProcess = 10;
    this.totalProcessCount = this.currentPageProcess = 0;
    this.loading = true;
    this.getProcesses();    
  }

  getProcesses() {  
    this.ads.getProcessList().then(
      (prcList: any) => {        
        if(prcList.value === undefined || prcList.value.length === 0){
          this.alertMessage = 'No Process Found';
        }
        this.procData = prcList.value;        
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.alertMessage = 'No Process Found';
        console.log(error);
      }
    );
  }
  
  addProcess() {
    this.processCode = this.processName = '';
    this.processStatus = false;
    this.addProcessDialog = true;
  }
  onProcessSelect(event:any){    
    if(event != undefined && event.data != undefined && event.data.processCode != undefined ){
      if(!this.isToggleBlur){
      this.act_def_ut.setSelectedProcess(event.data);
      this.router.navigateByUrl('/process-activity');
      }
      else{
        this.selectedProcessCode = event.data.processCode;       
        this.onUpdateProcess();
      }
    }    
  }  
  onSubmitProcess() {
    if((this.processCode === undefined || this.processCode === '') || (this.processName === '' || this.processName === undefined)){
      this.displayAlerts("Please enter required fileds");
    }
    else{
      let newProcess:IProcess = {
        processId : 0,
        processCode: this.processCode,
        processName: this.processName,
        status: this.processStatus
      };      
      this.ps.createProcess(newProcess).subscribe(dt => {
        if(dt.statusCode >= 200 && dt.statusCode < 400){
          this.addMessages('success', 'Process added successfully');
          this.addProcessDialog = false;
          this.getProcesses();
        }
        else{
          let errorDetails =  (dt.value.detail !== undefined && dt.value.detail.includes('unique constraint')) ? "Process with process code is already exist.": 'Please contact administrative';     
          this.addMessages('error', 'Failed to add Process.'+ errorDetails);
        }
      })      
    }    
  }
  onUpdateProcess(){
    if(this.selectedProcessCode !== undefined){
      let param:any = {
        processCode: this.selectedProcessCode? this.selectedProcessCode: null,
        status: this.selectedProcessStatus
      }
      this.ps.updateProcess(param).subscribe(dt => {            
        if(dt.statusCode >= 200 && dt.statusCode < 400){
          this.addMessages('success', 'Process updated successfully');                    
        }
        else{
          let errorMessage = (dt.value !== undefined && dt.value.detail !== undefined)? dt.value.detail: 'Please contact administrative';
          this.addMessages('error', 'Failed to update process.'+ errorMessage);
        }        
        this.getProcesses();
        this.loading = false;
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
   this.selectedProcessStatus =$event.checked;
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
