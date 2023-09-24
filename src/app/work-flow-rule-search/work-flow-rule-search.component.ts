import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SelectableRow } from 'primeng/table';
import { IActivity } from '../Classes/IActivity';
import { IAttribute } from '../Classes/IAttribute';
import { IProcess } from '../Classes/IProcess';
import { IRuleData } from '../Classes/IRuleData';
import { IRuleSearchData } from '../Classes/IRuleSearchData';
import { IStep, IWorkFlows } from '../Classes/IworkflowTemplateSearch';
import { SelectItem } from '../Classes/SelectItem';
import { ActivityDefinitionService } from '../Services/activity-definition.service';
import { WorkFlowRuleService } from '../Services/work-flow-rule.service';
import { RulesUtilityDataService } from '../utilities/rules-utility-data.service';

@Component({
  selector: 'app-work-flow-rule-search',
  templateUrl: './work-flow-rule-search.component.html',
  styleUrls: ['./work-flow-rule-search.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class WorkFlowRuleSearchComponent implements OnInit {
  // collections
  rules: IRuleData[];
  ruleList: SelectItem[];
  attributes: SelectItem[];
  processes: SelectItem[];
  activities: SelectItem[];

  //filter Collection
  filterRuleNameList: SelectItem[];
  filterAttributeList: SelectItem[];
  filterProcessList: SelectItem[];
  filterActivityList: SelectItem[];
  workflows: IWorkFlows[];
  steps: IStep[];

  //search params
  filterAttribute: SelectItem;
  filterProcess: SelectItem;
  filterActivity: SelectItem;
  filterRuleName: SelectItem;
  isActive: boolean = true;

  //table Format
  loading: boolean = false;
  rowsperPage: number;
  currentPage: number;
  totalRulesCount: number;
  toolTipData: string;
  alertMessage: string;

  //flags
  isProcessSelect: boolean;
  isActivitySelect: boolean;
  isRuleNameSelect: boolean;
  isAttSelected: boolean;

  constructor(
    private confirmationService: ConfirmationService,
    private router: Router,
    private wrs: WorkFlowRuleService,
    private ads: ActivityDefinitionService,
    private rud: RulesUtilityDataService
  ) {}

  ngOnInit(): void {
    this.rowsperPage = 10;
    this.totalRulesCount = this.currentPage = 0;
    this.alertMessage = 'Select criteria and search Rules';
    this.getRuleData();
    this.getRules();
    this.getProcesses();
  }
  ngOnDestroy() {
    let searchParam = this.setSearchData();
    this.rud.setRuleSearchData(searchParam);
  }
  getRules() {
    let serach: IRuleSearchData = {
      ruleName: '',
      attributeCode: '',
      status: false,
    };
    this.wrs.getWorkflowRules(serach).then(
      (dt) => {
        if (
          dt == undefined ||
          dt.value == undefined ||
          dt.value.status >= 400
        ) {
          this.handleError('Unable to load rules.');
        } else {
          this.populateRuleList(dt.value);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getRuleData() {
    let searchParam = this.rud.getRuleSearchData();
    if (searchParam != null) {
      this.filterRuleName = {
        label:
          searchParam.ruleName != undefined && searchParam.ruleName?.length > 25
            ? searchParam.ruleName.slice(0, 25) + '...'
            : searchParam.ruleName,
        value: searchParam.ruleId,
        title: searchParam.ruleName,
      };
      this.filterAttribute = {
        label:
          searchParam.attributeName != undefined &&
          searchParam.attributeName?.length > 25
            ? searchParam.attributeName.slice(0, 25) + '...'
            : searchParam.attributeName,
        value: searchParam.attributeCode,
        title: searchParam.attributeName,
      };
      this.filterProcess = {
        label:
          searchParam.processName != undefined &&
          searchParam.processName?.length > 25
            ? searchParam.processName.slice(0, 25) + '...'
            : searchParam.processName,
        value: searchParam.processCode,
        title: searchParam.processName,
      };
      this.filterActivity = {
        label:
          searchParam.activityName != undefined &&
          searchParam.activityName?.length > 25
            ? searchParam.activityName.slice(0, 25) + '...'
            : searchParam.activityName,
        value: searchParam.activityCode,
        title: searchParam.activityName,
      };
      this.isActive = searchParam.status;
      if(this.filterRuleName != undefined && this.filterRuleName.value != ''){
        this.isRuleNameSelect = true;
      }
      if (this.filterProcess != undefined && this.filterProcess.value != '') {
        this.getActivities();
        this.isProcessSelect = true;
      }
      if (this.filterActivity != undefined && this.filterActivity.value != '') {
        this.getAttributes();
        this.isActivitySelect = true;
      }
      this.getRulesData(false);
    }
  }
  getProcesses() {
    this.ads.getProcessList().then(
      (prcList: any) => {
        console.log(prcList.value);
        console.log(prcList);
        this.populateProcessList(prcList.value);
      },
      (error) => {
        this.handleError('Unable to load processes.');
      }
    );
  }

  getAttributes() {
    if (this.filterActivity && this.filterActivity.value != '') {
      this.wrs.getAttributeListByActivityId(this.filterActivity.value).then(
        (atList: any) => {
          console.log(atList);
          this.populateAttributeList(atList.value);
        },
        (error) => {
          this.handleError('Unable to load Attributes.');
        }
      );
    }
  }

  getActivities() {
    if (this.filterProcess && this.filterProcess.value != '') {
      this.ads.getActivityList(this.filterProcess.value).then(
        (actList: any) => {
          console.log(actList);
          this.populatActivityList(actList.value);
        },
        (error) => {
          this.handleError('Unable to load activities.');
        }
      );
    }
  }
  populateRuleList(rlList: IRuleData[]) {
    try {
      this.ruleList = [];
      this.ruleList.push({ value: null, label: 'Select Rule Name' });
      for (let rul of rlList) {
        let ruleItem: SelectItem = {
          value: rul.ruleId,
          label: rul.ruleName,
          title: rul.ruleName,
        };
        this.ruleList.push(ruleItem);
      }
    } catch (ex) {
      console.log(ex);
    }
  }
  populateAttributeList(atList: IAttribute[]) {
    try {
      this.attributes = [];
      this.attributes.push({ value: null, label: 'Select Attribute' });
      for (let atr of atList) {
        let atrItem: SelectItem = {
          value: atr.attributeCode,
          label: atr.attributeName,
          title: atr.attributeName,
        };
        this.attributes.push(atrItem);
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
  getFilterRuleList(event: any) {
    if (this.ruleList && this.ruleList.length > 0) {
      let filtered: any[] = [];
      let query = event.query;
      for (let i = 0; i < this.ruleList.length; i++) {
        let rl = this.ruleList[i];
        if (rl.label?.toLowerCase().includes(query.trim().toLowerCase())) {
          filtered.push(rl);
        }
      }
      this.filterRuleNameList = filtered;
    } else {
      this.filterRuleNameList = [];
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
    this.isProcessSelect = true;
    this.filterActivityList = this.filterAttributeList  = [];
    this.isActivitySelect = this.isAttSelected = false;
    if (this.filterActivity || this.filterAttribute) {
      this.filterActivity = { value: null, label: '' };
      this.filterAttribute = { value: null, label: '' };
    }
    this.getActivities();
  }

  onProcUnSelect() {
    this.activities = this.attributes = [];
    if (this.filterActivity != undefined || this.filterAttribute != undefined) {
      this.filterActivity = { value: '', label: '' };
      this.filterAttribute = { value: '', label: '' };
    }
    this.isProcessSelect = this.isActivitySelect = this.isAttSelected = false;     
  }
  onActSelect() {
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
    this.isActivitySelect = true;
    this.attributes = [];
    if (this.filterAttribute) {
      this.filterAttribute = { value: null, label: '' };
    }
    this.isAttSelected = false;
    this.getAttributes();
  }
  onActUnSelect() {
    this.attributes = [];
    if (this.filterAttribute) {
      this.filterAttribute = { value: null, label: '' };
    }
    this.isActivitySelect = this.isAttSelected = false;
  }
  onAttSelect() {
    if (
      this.filterAttribute !== undefined &&
      this.filterAttribute.label != undefined
    ) {
      this.filterAttribute = {
        value: this.filterAttribute.value,
        label:
          this.filterAttribute.label.length > 25
            ? this.filterAttribute.label.slice(0, 25) + '...'
            : this.filterAttribute.label,
        title: this.filterAttribute.title,
      };
    }
    this.isAttSelected = true;
  }
  onAttUnSelect() {
    this.isAttSelected = false;
  }
  onRuleNameSelect() {
    if (
      this.filterRuleName !== undefined &&
      this.filterRuleName.label != undefined
    ) {
      this.filterRuleName = {
        value: this.filterRuleName.value,
        label:
          this.filterRuleName.label.length > 25
            ? this.filterRuleName.label.slice(0, 25) + '...'
            : this.filterRuleName.label,
        title: this.filterRuleName.title,
      };
    }
    this.isRuleNameSelect = true;
  }
  onRuleNameUnSelect() {
    if (this.filterRuleName != undefined) {
      this.filterRuleName = { value: '', label: '', title: '' };
    }
    this.isRuleNameSelect = false;
  }
  OnSearch() {
    this.getRulesData(true);
  }
  getRulesData(isSearchSelect: boolean) {
    try {
      this.rules = [];
      this.totalRulesCount = this.currentPage = 0;
      if (
        (this.filterRuleName != undefined &&
          this.filterRuleName.value != '' &&
          this.filterRuleName.value != undefined) ||
        (this.filterAttribute != undefined &&
          this.filterAttribute.value != '' &&
          this.filterAttribute.value != undefined)
      ) {
        this.loading = true;
        let serach: IRuleSearchData = {
          ruleName: this.filterRuleName ? this.filterRuleName.title : '',
          attributeCode: this.filterAttribute ? this.filterAttribute.value : '',
          status: this.isActive,
        };
        this.wrs.getWorkflowRules(serach).then(
          (dt) => {
            if (
              dt == undefined ||
              dt.value == undefined ||
              dt.value.status >= 400
            ) {
              this.alertMessage = 'No Rules Found';
            } else {
              this.rules = dt.value;
              if (this.rules != undefined && this.rules.length > 0) {
                this.totalRulesCount = this.rules.length;
              } else {
                this.alertMessage = 'No Rules Found';
              }
            }
            this.loading = false;
          },
          (error) => {
            this.loading = false;
            this.alertMessage = 'No Rules Found';            
          }
        );
      } else {
        if (isSearchSelect) {
          this.confirmationService.confirm({
            message: 'Please select Rule name or Attribute for Rules',
            header: 'Warning',
            icon: 'pi  pi-exclamation-triangle',
            rejectVisible: false,
            acceptLabel: 'Ok',
            accept: () => {
              this.loading = false;
            },
          });
        }
      }
    } catch (ex) {
      this.handleError(ex);
      this.alertMessage = 'No Rules Found';
      this.loading = false;
    }
  }
  onRuleSelect(event: SelectableRow) {
    let searchParam = this.setSearchData();
    this.rud.setRuleSelectedRowData(event.data);
    this.rud.setRuleSearchData(searchParam);
    this.router.navigateByUrl('/rule');
  }
  OnNewRule() {
    let searchParam = this.setSearchData();
    let selectedRule: any = undefined;
    this.rud.setRuleSelectedRowData(selectedRule);
    this.rud.setRuleSearchData(searchParam);
    this.router.navigateByUrl('/rule');
  }
  setSearchData(): IRuleSearchData {
    let param: IRuleSearchData = {
      ruleId: this.filterRuleName ? this.filterRuleName.value : '',
      ruleName: this.filterRuleName ? this.filterRuleName.title : '',
      attributeName: this.filterAttribute ? this.filterAttribute.title : '',
      attributeCode: this.filterAttribute ? this.filterAttribute.value : '',
      processName: this.filterProcess ? this.filterProcess.title : '',
      processCode: this.filterProcess ? this.filterProcess.value : '',
      activityName: this.filterActivity ? this.filterActivity.title : '',
      activityCode: this.filterActivity ? this.filterActivity.value : '',
      status: this.isActive,
    };
    return param;
  }
  onFocus(element?: SelectItem) {
    if (element != undefined) {
      this.toolTipData = element.label ? element.label : '';
    } else {
      this.toolTipData = '';
    }
  }
  onFocusElement(element?: string) {
    if (element != undefined) {
      this.toolTipData = element ? element : '';
    } else {
      this.toolTipData = '';
    }
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
}
