import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { IActivity } from '../Classes/IActivity';
import {
  IActivityDefinition,
  IActivitySteps,
} from '../Classes/IActivityDefinition';
import { IActivityUpdateData } from '../Classes/IActivitySerachData';
import { IDepartment } from '../Classes/Idepartment';
import { IOffice } from '../Classes/Ioffice';
import { IOfficeLevel } from '../Classes/IofficeLevel';
import { IProcess } from '../Classes/IProcess';
import { IResponsibility } from '../Classes/IResponsibility';
import { IRule } from '../Classes/IRule';
import {
  IStep,
  IWorkFlows,
  IWorkflowSearchData,
} from '../Classes/IworkflowTemplateSearch';
import { SelectItem } from '../Classes/SelectItem';
import { ActivityDefinitionService } from '../Services/activity-definition.service';
import { WorkflowManagementService } from '../Services/workflow-management.service';
import { ActDefUtilityDataService } from '../utilities/act-def-utility-data.service';

@Component({
  selector: 'app-add-activity-defination',
  templateUrl: './add-activity-defination.component.html',
  styleUrls: ['./add-activity-defination.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class AddActivityDefinationComponent implements OnInit {
  @ViewChild('rulesTableRef') rulesTableRef: Table | undefined;
  // collections
  departments: SelectItem[];
  officeLevels: SelectItem[];
  offices: SelectItem[];
  processes: SelectItem[];
  activities: SelectItem[];
  workflows: SelectItem[];
  responsibilities: SelectItem[];
  assignments: SelectItem[];

  //filter Collection
  filterDepartmentList: SelectItem[];
  filterOfficeLevelList: SelectItem[];
  filterOfficeList: SelectItem[];
  filterProcessList: SelectItem[];
  filterActivityList: SelectItem[];
  filterWorkflowList: SelectItem[];
  filterRuleList: SelectItem[];
  filterResponsibilityList: SelectItem[];

  //search params
  filterDepartment: SelectItem;
  filterOfficeLevel: SelectItem;
  filterOffice: SelectItem;
  filterProcess: SelectItem;
  filterActivity: SelectItem;
  filterWorkflow: SelectItem;
  filterRule: SelectItem[];

  //table Format
  actDefinitions: IActivityDefinition[];
  actDef: IActivityDefinition;
  loading: boolean = false;
  currentActivity: IActivityDefinition;
  rowsperPage: number;
  totalWorkFlowCount: number;
  active: boolean = true;
  numberOfDueDays: number;
  steps: IActivitySteps[];
  wrkSteps: IStep[];
  ruleList: IRule[];
  selectedRuleList: IRule[];
  submitSteps: IActivitySteps[];

  //flags
  isSelected: boolean = false;
  isDepSelect: boolean;
  isOfcLvlSelect: boolean;
  isOfcSelect: boolean;
  isProcSelect: boolean;
  isActSelect: boolean;
  isWrkTempSelect: boolean;
  isLoading: boolean;
  isSubmit: boolean;
  toolTipData: string;
  ruleDialog: boolean;

  constructor(
    private router: Router,
    private wms: WorkflowManagementService,
    private actUtility: ActDefUtilityDataService,
    private ads: ActivityDefinitionService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getDepartments();
    this.getProcesses();
    this.getResponsibilities();
    this.getAssignments();
    this.rowsperPage = 8;
    this.actDef = this.actUtility.getActDefSelectedRowData();
    if (this.actDef != null) {
      this.setCurrentActivityDefinition();
    }
  }

  setCurrentActivityDefinition() {
    try {
      this.filterDepartment = {
        label:
          this.actDef.depName != undefined && this.actDef.depName?.length > 25
            ? this.actDef.depName.slice(0, 25) + '...'
            : this.actDef.depName,
        value: this.actDef.depCode,
        title: this.actDef.depName,
      };
      this.filterOfficeLevel = {
        label:
          this.actDef.offLevName != undefined &&
          this.actDef.offLevName?.length > 25
            ? this.actDef.offLevName.slice(0, 25) + '...'
            : this.actDef.offLevName,
        value: this.actDef.offLevCode,
        title: this.actDef.offLevName,
      };
      this.filterOffice = {
        label:
          this.actDef.offName != undefined && this.actDef.offName?.length > 25
            ? this.actDef.offName.slice(0, 25) + '...'
            : this.actDef.offName,
        value: this.actDef.offCode,
        title: this.actDef.offName,
      };
      this.filterProcess = {
        label:
          this.actDef.procName != undefined && this.actDef.procName?.length > 25
            ? this.actDef.procName.slice(0, 25) + '...'
            : this.actDef.procName,
        value: this.actDef.procCode,
        title: this.actDef.procName,
      };
      this.filterActivity = {
        label:
          this.actDef.actName != undefined && this.actDef.actName?.length > 25
            ? this.actDef.actName.slice(0, 25) + '...'
            : this.actDef.actName,
        value: this.actDef.procCode,
        title: this.actDef.actName,
      };
      this.filterWorkflow = {
        label:
          this.actDef.wfTempName != undefined &&
          this.actDef.wfTempName?.length > 25
            ? this.actDef.wfTempName.slice(0, 25) + '...'
            : this.actDef.wfTempName,
        value: this.actDef.temId,
        title: this.actDef.wfTempName,
      };
      this.numberOfDueDays = this.actDef.slaDays;
      this.active = this.actDef.isActive;

      if (this.actDef.actDefId && this.actDef.actDefId > 0) {
        this.loading = true;
        this.isSelected =
          this.isDepSelect =
          this.isProcSelect =
          this.isActSelect =
          this.isWrkTempSelect =
            true;
        this.ads.getSelectedActivityDefinitionById(this.actDef.actDefId).then(
          (dt) => {
            if (
              dt == undefined &&
              dt.value == undefined &&
              dt.value.status >= 400
            ) {
              this.handleError('Server Error.');
            } else {
              this.steps = dt.value.steps;
              this.steps = this.steps.sort((a, b) =>
                a.stpNum > b.stpNum ? 1 : -1
              );
              this.selectedRuleList = dt.value.rules;
              if (
                this.selectedRuleList != undefined &&
                this.selectedRuleList.length > 0
              ) {
                this.selectedRuleList.forEach((x) => (x.logicalOp = 'Or'));
                this.selectedRuleList[0].logicalOp = '';
              }
            }
            this.loading = false;
          },
          (error) => {
            this.loading = false;
            this.handleError(error);
          }
        );
      }
    } catch (ex) {
      this.loading = false;
      this.handleError('Server Error.');
    }
  }

  getDepartments() {
    this.wms.getDepartmentList().then(
      (dpList: any) => {
        if (dpList.status != 200) {
          this.handleError('Server Error.');
        } else {
          this.populateDepartmentList(dpList.body.value);
        }
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  getProcesses() {
    this.ads.getProcessList().then(
      (prcList: any) => {
        console.log(prcList.value);
        this.populateProcessList(prcList.value);
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  getResponsibilities() {
    this.ads.getResponseList().then(
      (resList: any) => {
        this.populateResponseList(resList.value);
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  getAssignments() {
    this.populateAssignmentList();
  }

  getOfficeLevels() {
    if (this.filterDepartment && this.filterDepartment.value != '') {
      this.wms.getOfficeLevelList(this.filterDepartment.value).then(
        (oflList: any) => {
          this.populatOfficeLevelList(oflList.value);
        },
        (error) => {
          this.handleError(error);
        }
      );
    }
  }

  getActivities() {
    if (this.filterProcess && this.filterProcess.value != '') {
      this.ads.getActivityList(this.filterProcess.value).then(
        (actList: any) => {
          this.populatActivityList(actList.value);
        },
        (error) => {
          this.handleError(error);
        }
      );
    }
  }

  getOffices() {
    if (
      this.filterDepartment &&
      this.filterDepartment.value != '' &&
      this.filterOfficeLevel &&
      this.filterOfficeLevel.value != ''
    ) {
      this.wms
        .getOfficeList(
          this.filterDepartment.value,
          this.filterOfficeLevel.value
        )
        .then(
          (ofcList: any) => {
            this.populatOfficeList(ofcList.value);
          },
          (error) => {
            this.handleError(error);
          }
        );
    }
  }

  getRules() {
    if (this.filterActivity && this.filterActivity.value != '') {
      this.ads.getRuleList(this.filterActivity.value).then(
        (ruleList: any) => {
          if (
            ruleList === undefined ||
            ruleList.value === undefined ||
            ruleList.value.status >= 400
          ) {
            this.handleError('Server Error.');
          } else {
            this.ruleList = ruleList.value;
          }
        },
        (error) => {
          this.handleError(error);
        }
      );
    }
  }

  populateDepartmentList(dpList: IDepartment[]) {
    try {
      this.departments = [];
      this.departments.push({ value: null, label: 'Select Department' });
      for (let dp of dpList) {
        let dpt: SelectItem = {
          value: dp.departmentCode,
          label: dp.departmentName,
          title: dp.departmentName,
        };
        this.departments.push(dpt);
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  populatOfficeLevelList(ofcLevList: IOfficeLevel[]) {
    try {
      this.officeLevels = [];
      this.officeLevels.push({ value: null, label: 'Select OfficeLevel' });
      for (let ofl of ofcLevList) {
        let oflvl: SelectItem = {
          value: ofl.officeLevelCode,
          label: ofl.officeLevelName,
          title: ofl.officeLevelName,
        };
        this.officeLevels.push(oflvl);
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  populatOfficeList(ofcList: IOffice[]) {
    try {
      this.offices = [];
      this.offices.push({ value: null, label: 'Select Office' });
      for (let ofc of ofcList) {
        let ofcItem: SelectItem = {
          value: ofc.officeCode,
          label: ofc.officeName,
          title: ofc.officeName,
        };
        this.offices.push(ofcItem);
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  populateProcessList(prList: IProcess[]) {
    try {
      this.processes = [];
      this.processes.push({ value: null, label: 'Select Process' });
      for (let pr of prList) {
        let prc: SelectItem = {
          value: pr.processCode,
          label: pr.processName,
          title: pr.processName,
        };
        this.processes.push(prc);
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  populateResponseList(resList: IResponsibility[]) {
    try {
      this.responsibilities = [];
      for (let res of resList) {
        let resItem: SelectItem = {
          value: res.notifyTemplateName,
          label: res.notifyTemplateName,
          title: res.notifyTemplateType,
          lblValue: res.notifyTemplateId,
        };
        this.responsibilities.push(resItem);
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  populatActivityList(actList: IActivity[]) {
    try {
      this.activities = [];
      this.activities.push({ value: null, label: 'Select Activity' });
      for (let act of actList) {
        let actItem: SelectItem = {
          value: act.activityCode,
          label: act.activityName,
          title: act.activityName,
        };
        this.activities.push(actItem);
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  populateWorkflowList(workflows: IWorkFlows[]) {
    try {
      this.workflows = [];
      this.workflows.push({ value: null, label: 'Select Workflow Template' });
      for (let wrk of workflows) {
        let wrktemp: SelectItem = {
          value: wrk.templateId,
          label: wrk.shortName,
          title: wrk.shortName,
        };
        this.workflows.push(wrktemp);
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  populateAssignmentList() {
    this.assignments = [];
    this.assignments.push({ value: 'Broadcast', label: 'Broadcast' });
    this.assignments.push({ value: 'Roundrobin', label: 'Roundrobin' });
  }

  onDepartmentSelect() {
    if (
      this.filterDepartment !== undefined &&
      this.filterDepartment.label != undefined
    ) {
      this.filterDepartment = {
        value: this.filterDepartment.value,
        label:
          this.filterDepartment.label.length > 25
            ? this.filterDepartment.label.slice(0, 25) + '...'
            : this.filterDepartment.label,
        title: this.filterDepartment.title,
      };
    }
    this.isDepSelect = true;
    this.officeLevels = this.offices = this.workflows = this.wrkSteps = [];
    if (
      this.filterOfficeLevel != undefined ||
      this.filterOffice != undefined ||
      this.filterWorkflow != undefined
    ) {
      this.filterOfficeLevel = { value: null, label: '' };
      this.filterOffice = { value: null, label: '' };
      this.filterWorkflow = { value: null, label: '' };
    }
    this.getOfficeLevels();
    this.getWorkflowtemplateList();
  }
  onDepUnSelect() {
    this.officeLevels = this.offices = this.workflows = this.wrkSteps = [];
    if (
      this.filterOfficeLevel != undefined ||
      this.filterOffice != undefined ||
      this.filterWorkflow != undefined
    ) {
      this.filterOfficeLevel = { value: null, label: '' };
      this.filterOffice = { value: null, label: '' };
      this.filterWorkflow = { value: null, label: '' };
    }
    this.isDepSelect = false;
    this.isOfcLvlSelect = false;
    this.isLoading = false;
  }

  onOfficeLevelSelect() {
    if (
      this.filterOfficeLevel !== undefined &&
      this.filterOfficeLevel.label != undefined
    ) {
      this.filterOfficeLevel = {
        value: this.filterOfficeLevel.value,
        label:
          this.filterOfficeLevel.label.length > 25
            ? this.filterOfficeLevel.label.slice(0, 25) + '...'
            : this.filterOfficeLevel.label,
        title: this.filterOfficeLevel.title,
      };
    }
    this.isOfcLvlSelect = true;
    this.offices = this.workflows = this.wrkSteps = [];
    if (this.filterOffice != undefined || this.filterWorkflow != undefined) {
      this.filterOffice = { value: null, label: '' };
      this.filterWorkflow = { value: null, label: '' };
    }
    this.getOffices();
    this.getWorkflowtemplateList();
  }
  onOfcLvlUnSelect() {
    this.offices = this.workflows = this.wrkSteps = [];
    if (this.filterOffice != undefined || this.filterWorkflow != undefined) {
      this.filterOffice = { value: null, label: '' };
      this.filterWorkflow = { value: null, label: '' };
    }
    this.isOfcLvlSelect = false;
    this.getWorkflowtemplateList();
  }
  onOfficeSelect() {
    if (
      this.filterOffice !== undefined &&
      this.filterOffice.label != undefined
    ) {
      this.filterOffice = {
        value: this.filterOffice.value,
        label:
          this.filterOffice.label.length > 25
            ? this.filterOffice.label.slice(0, 25) + '...'
            : this.filterOffice.label,
        title: this.filterOffice.title,
      };
    }
    this.workflows = this.wrkSteps = [];
    if (this.filterWorkflow != undefined) {
      this.filterWorkflow = { value: null, label: '' };
    }
    this.getWorkflowtemplateList();
  }
  onOfcUnSelect() {
    this.workflows = this.wrkSteps = [];
    if (this.filterWorkflow != undefined) {
      this.filterWorkflow = { value: null, label: '' };
    }
    this.getWorkflowtemplateList();
  }
  onProcessSelect() {
    if (
      this.filterProcess !== undefined &&
      this.filterProcess.label != undefined
    ) {
      this.filterProcess = {
        value: this.filterProcess.value,
        label:
          this.filterProcess.label.length > 25
            ? this.filterProcess.label.slice(0, 25) + '...'
            : this.filterProcess.label,
        title: this.filterProcess.title,
      };
    }
    this.isProcSelect = true;
    this.activities = this.filterRule = [];
    if (this.filterActivity) {
      this.filterActivity = { value: null, label: '' };
    }
    this.isActSelect = false;
    this.getActivities();
  }
  onProcUnSelect() {
    this.activities = this.filterRule = [];
    if (this.filterActivity) {
      this.filterActivity = { value: null, label: '' };
    }
    this.isProcSelect = false;
    this.isActSelect = false;
  }
  onActivitySelect() {
    if (
      this.filterActivity !== undefined &&
      this.filterActivity.label != undefined
    ) {
      this.filterActivity = {
        value: this.filterActivity.value,
        label:
          this.filterActivity.label.length > 25
            ? this.filterActivity.label.slice(0, 25) + '...'
            : this.filterActivity.label,
        title: this.filterActivity.title,
      };
    }
    this.selectedRuleList = this.ruleList = [];
    this.isActSelect = true;
    this.getRules();
  }
  onActUnSelect() {
    this.selectedRuleList = this.ruleList = [];
    this.isActSelect = false;
  }
  getFilterDepartmentList(event: any) {
    if (this.departments && this.departments.length > 0) {
      let filtered: any[] = [];
      let query = event.query;
      for (let i = 0; i < this.departments.length; i++) {
        let department = this.departments[i];
        if (department.label?.toLowerCase().includes(query.trim().toLowerCase())) {
          filtered.push(department);
        }
      }
      this.filterDepartmentList = filtered;
    } else {
      this.filterDepartmentList = [];
    }
  }

  getFilterOfficeLevelList(event: any) {
    if (this.officeLevels && this.officeLevels.length > 0) {
      let filtered: any[] = [];
      let query = event.query;
      for (let i = 0; i < this.officeLevels.length; i++) {
        let office = this.officeLevels[i];
        if (office.label?.toLowerCase().includes(query.trim().toLowerCase())) {
          filtered.push(office);
        }
      }
      this.filterOfficeLevelList = filtered;
    } else {
      this.filterOfficeLevelList = [];
    }
  }

  getFilterOfficeList(event: any) {
    if (this.offices && this.offices.length > 0) {
      let filtered: any[] = [];
      let query = event.query;
      for (let i = 0; i < this.offices.length; i++) {
        let place = this.offices[i];
        if (place.label?.toLowerCase().includes(query.trim().toLowerCase())) {
          filtered.push(place);
        }
      }
      this.filterOfficeList = filtered;
    } else {
      this.filterOfficeList = [];
    }
  }

  getFilterProcessList(event: any) {
    if (this.processes && this.processes.length > 0) {
      let filtered: any[] = [];
      let query = event.query;
      for (let i = 0; i < this.processes.length; i++) {
        let process = this.processes[i];
        if (process.label?.toLowerCase().includes(query.trim().toLowerCase())) {
          filtered.push(process);
        }
      }
      this.filterProcessList = filtered;
    } else {
      this.filterProcessList = [];
    }
  }
  getFilterActivityList(event: any) {
    if (this.activities && this.activities.length > 0) {
      let filtered: any[] = [];
      let query = event.query;
      for (let i = 0; i < this.activities.length; i++) {
        let activity = this.activities[i];
        if (activity.label?.toLowerCase().includes(query.trim().toLowerCase())) {
          filtered.push(activity);
        }
      }
      this.filterActivityList = filtered;
    } else {
      this.filterActivityList = [];
    }
  }

  getFilterWorkflowList(event: any) {
    if (this.workflows && this.workflows.length > 0) {
      let filtered: any[] = [];
      let query = event.query;
      for (let i = 0; i < this.workflows.length; i++) {
        let wrkFlow = this.workflows[i];
        if (wrkFlow.label?.toLowerCase().includes(query.trim().toLowerCase())) {
          filtered.push(wrkFlow);
        }
      }
      this.filterWorkflowList = filtered;
    } else {
      this.filterWorkflowList = [];
    }
  }

  numberOfDaysChanged() {
    this.numberOfDueDays = 0;
    if (this.steps != null && this.steps.length > 0) {
      this.steps.forEach((element) => {
        this.numberOfDueDays += Number(element.stpSLADays);
      });
    } else if ((this.wrkSteps != null && this, this.wrkSteps.length > 0)) {
      this.wrkSteps.forEach((element) => {
        this.numberOfDueDays += Number(
          element.stpSLADays ? element.stpSLADays : 0
        );
      });
    }
  }

  getWorkflowtemplateList() {
    try {
      if (this.filterDepartment && this.filterDepartment.value != '') {
        this.isLoading = false;
        let param: IWorkflowSearchData = {
          departmentCode: this.filterDepartment
            ? this.filterDepartment.value
            : '',
          officeLevelCode: this.filterOfficeLevel
            ? this.filterOfficeLevel.value
            : '',
          officeCode: this.filterOffice ? this.filterOffice.value : '',
          status: true,
        };
        this.wms.getWorkflowTemplates(param).then(
          (dt) => {
            let workflows = dt.value;
            if (workflows != null) {
              this.isLoading = true;
              this.populateWorkflowList(workflows);
            }
          },
          (error) => {
            this.isLoading = true;
            console.log(error);
          }
        );
      }
    } catch (ex) {
      this.handleError('Server Error.');
    }
  }
  onWorkflowClear() {
    this.wrkSteps = [];
    this.isWrkTempSelect = false;
  }
  onWorkflowSelect() {
    try {
      if (this.filterWorkflow && this.filterWorkflow.value != null) {
        this.loading = true;
        this.isWrkTempSelect = true;
        this.wms.getCurrentTemplate(this.filterWorkflow.value).then(
          (res) => {
            if (res && res.value != null) {
              this.loading = false;
              this.wrkSteps = res.value.steps;
              this.wrkSteps = this.wrkSteps.sort((a, b) =>
                a.stepNumber > b.stepNumber ? 1 : -1
              );
            }
          },
          (error) => {
            this.loading = false;
            console.log(error);
          }
        );
      }
    } catch (ex) {
      this.loading = false;
      this.handleError('Server Error.');
    }
  }
  onSelectRuleClick() {
    this.ruleDialog = true;
  }
  onRuleSelect() {
    if (
      this.selectedRuleList != undefined &&
      this.selectedRuleList.length > 0
    ) {
      this.selectedRuleList.forEach((x) => {
        if (x.logicalOp == undefined || x.logicalOp == '') {
          x.logicalOp = 'Or';
        }
      });
      this.selectedRuleList[0].logicalOp = '';
    }
    this.rulesTableRef?.reset();
    this.ruleDialog = false;
  }
  onClickBack() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to go back ' + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.router.navigateByUrl('/activity');
      },
    });
  }

  onSubmitActivity() {
    try {
      if (this.isSelected) {
        this.updateAcitivityDefinition();
        return;
      }
      if (this.wrkSteps && this.wrkSteps.length > 0) {
        for (let wrk of this.wrkSteps) {
          if (wrk.stpSLADays != null && wrk.stpSLADays > 99) {
            let message = 'Due Days Value must be less than or equal to 99.';
            this.displayAlerts(message);
            return;
          }
          let res = this.responsibilities.find(
            (x) => x.label === wrk.noteTempName
          );
          wrk.noteTempId = res?.lblValue;
        }
        this.submitSteps = [];
        for (let wrkstp of this.wrkSteps) {
          let stp: IActivitySteps = {
            stpNum: wrkstp.stepNumber,
            depCode: wrkstp.departmentCode,
            offLevCode: wrkstp.officeLevelCode,
            rolCode: wrkstp.roleCode,
            cdrCode: wrkstp.cadreCode,
            pstCode: wrkstp.postCode,
            assignType:
              wrkstp.assignmentType &&
              wrkstp.assignmentType.toLowerCase().trim() === 'roundrobin'
                ? 'Roundrobin'
                : 'Broadcast',
            stpSLADays: wrkstp.stpSLADays,
            noteTempId: wrkstp.noteTempId,
          };
          this.submitSteps.push(stp);
        }
      }
      let activityDef: IActivityDefinition = {
        depCode: this.filterDepartment ? this.filterDepartment.value : null,
        offLevCode: this.filterOfficeLevel
          ? this.filterOfficeLevel.value
          : null,
        offCode: this.filterOffice ? this.filterOffice.value : null,
        actCode: this.filterActivity ? this.filterActivity.value : null,
        procCode: this.filterProcess ? this.filterProcess.value : null,
        temId: this.filterWorkflow ? this.filterWorkflow.value : null,
        slaDays: this.numberOfDueDays,
        effectiveDate: new Date(),
        endDate: new Date(),
        isActive: this.active,
        steps: this.submitSteps,
        rules: this.selectedRuleList,
      };
      this.loading = true;
      this.ads.createActivitydefinition(activityDef).subscribe(
        (dt) => {
          this.loading = false;
          let response = 'Activity Definition Added Successfully.';
          this.updateResponse(dt, response, true);
        },
        (error) => {
          this.loading = false;
          this.addMessages('error', error);
          this.loading = false;
        }
      );
    } catch (ex) {
      this.handleError('Server Error.');
    }
  }
  updateAcitivityDefinition() {
    try {
      if (this.steps && this.steps.length > 0) {
        for (let stp of this.steps) {
          if (stp.stpSLADays != null && stp.stpSLADays > 99) {
            let message = 'Due Days Value must be less than or equal to 99.';
            this.displayAlerts(message);
            return;
          }
          let res = this.responsibilities.find(
            (x) => x.label === stp.noteTempName
          );
          stp.noteTempId = res?.lblValue;
          stp.assignType =
            stp.assignType && stp.assignType.toLowerCase().trim() === 'roundrobin'
              ? 'Roundrobin'
              : stp.assignType;
        }
      }
      let updateActDef: IActivityUpdateData = {
        actDefId: this.actDef.actDefId,
        isActive: this.active,
        slaDays: this.numberOfDueDays,
        steps: this.steps,
      };
      this.ads.updateActivityDefinition(updateActDef).subscribe(
        (dt) => {
          this.loading = false;
          let response = 'Activity Definition Updated Successfully.';
          this.updateResponse(dt, response, false);
        },
        (error) => {
          this.loading = false;
          this.handleError('Update failed due to server error.');
        }
      );
    } catch (ex) {
      this.loading = false;
      this.handleError('Server Error.');
    }
  }
  updateResponse(result: any, status: string, submit: boolean) {
    try {
      if (
        result !== undefined &&
        result.value !== undefined &&
        result.value.status >= 400
      ) {
        this.handleError('Update failed due to server error.');
      } else {
        this.isSubmit = submit;
        this.addMessages('success', status);
      }
    } catch (ex) {
      this.handleError('Server Error.');
    }
  }

  onFocus(element?: SelectItem) {
    if (element != undefined) {
      this.toolTipData = element.title ? element.title : '';
    } else {
      this.toolTipData = '';
    }
  }
  disableNavigation(event: any) {
    if (
      event.key === 'ArrowDown' ||
      event.key === 'Down' ||
      event.key === 'ArrowUp' ||
      event.key === 'Up'
    ) {
      event.stopPropagation();
    }
  }
  addMessages(severity: string, message: string) {
    this.messageService.add({
      severity: severity,
      summary: severity,
      detail: message,
    });
  }
  handleError(error: any) {
    this.confirmationService.confirm({
      message: error + 'Please try again after sometime',
      header: 'Error',
      icon: 'pi pi-minus-circle',
      rejectVisible: false,
      acceptLabel: 'Ok',
      accept: () => {},
    });
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
  @HostListener("keydown", ["$event"])
    onKeyDown($event: any): any {
        if ($event.key === 'Tab' || $event.keyCode === 9) {
          console.log($event.target);
          console.log($event.key);
          console.log($event.keyCode); 
          console.log($event.currentTarget);   
          var targetClass = $event.target.classList as DOMTokenList;
          console.log(targetClass);
          console.log($event.currentTarget?.addEventListener.name);            
        }
    }
}
