import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { SelectItem } from 'primeng/api/selectitem';
import { IAttribute } from '../Classes/IAttribute';
import { IAttributeValue } from '../Classes/IAttributeValu';
import { ICondition } from '../Classes/IConditions';
import { IDepartment } from '../Classes/Idepartment';
import { IRuleData, IRuleUpdateData } from '../Classes/IRuleData';
import { WorkFlowRuleService } from '../Services/work-flow-rule.service';
import { WorkflowManagementService } from '../Services/workflow-management.service';
import { RulesUtilityDataService } from '../utilities/rules-utility-data.service';

@Component({
  selector: 'app-work-flow-rules',
  templateUrl: './work-flow-rules.component.html',
  styleUrls: ['./work-flow-rules.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class WorkFlowRulesComponent implements OnInit {
  // collections
  departments: SelectItem[];
  attributes: SelectItem[];
  numOperators: SelectItem[];
  txtOperators: SelectItem[];
  lovOperators: SelectItem[];
  values: SelectItem[];
  conditions: ICondition[];

  //filter Collection
  filterDepartmentList: SelectItem[];
  filterAttributeList: SelectItem[];
  filterOperatorList: SelectItem[];
  filterValueList: SelectItem[];

  //search params
  filterAttribute: SelectItem;
  filterOperator: SelectItem;
  filterDepartment: SelectItem;
  filterValue: SelectItem[] = [];
  filterRuleName: string;
  ruleExpression: string;
  txtValue: any;
  isActive: boolean = true;

  //table Format
  condition: ICondition;
  loading: boolean = false;
  rowsperPage: number;
  totalWorkFlowCount: number;
  toolTipData: string;
  rules: any[];
  ruleData: IRuleData;

  //flags
  isLov: boolean;
  isAttrSelect: boolean;
  addRuleDialog: boolean;
  isSubmit: boolean;
  isSelected: boolean;
  isDepRequired: boolean;
  isValueEnable: boolean;
  isDepEnable:boolean;

  constructor(
    private router: Router,
    private wrs: WorkFlowRuleService,
    private confirmationService: ConfirmationService,
    private wms: WorkflowManagementService,
    private rud: RulesUtilityDataService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.ruleData = this.rud.getRuleSelectedRowData();
    if (this.ruleData != undefined && this.ruleData != null) {
      this.isSelected = true;
      this.setCurrentRule();
    }
    this.getNumericOperators();
    this.getTextOperators();
    this.getLovOperators();
    this.getDepartments();
  }
  setCurrentRule() {
    this.filterRuleName = this.ruleData.ruleName;
    this.ruleExpression = this.ruleData.ruleDesc;
    this.isActive = this.ruleData.isActive;
    this.wrs.getRulesByRuleId(this.ruleData.ruleId).then(
      (dt) => {
        if (dt === undefined || dt.value === undefined || dt.status >= 400) {
          this.handleError('Unable to load rules.');
        } else {
          this.conditions = dt.value.conditions;
          this.conditions[0].logicalOp = '';
        }
      },
      (error) => {
        this.handleError(error);
      }
    );
  }
  getNumericOperators() {
    this.populateNumericOprList();
  }

  getTextOperators() {
    this.populateTxtOprList();
  }
  getLovOperators() {
    this.populateLovOprList();
  }
  getDepartments() {
    this.wms.getDepartmentList().then(
      (dpList: any) => {
        if (dpList.status != 200) {
          this.handleError('Unable to load departments.');
        } else {
          this.populateDepartmentList(dpList.body.value);
        }
      },
      (error) => {
        this.handleError(error);
      }
    );
  }
  populateNumericOprList() {
    this.numOperators = [];
    this.numOperators.push({ value: 'Equal', label: 'Equal', title: '=' });
    this.numOperators.push({
      value: 'NotEqual',
      label: 'Not Equal',
      title: '!=',
    });
    this.numOperators.push({
      value: 'LessThan',
      label: 'Less Than',
      title: '<',
    });
    this.numOperators.push({
      value: 'LessThanOrEqual',
      label: 'Less Than or Equal',
      title: '<=',
    });
    this.numOperators.push({
      value: 'GreaterThan',
      label: 'Greater Than',
      title: '>',
    });
    this.numOperators.push({
      value: 'GreaterThanOrEqual',
      label: 'Greater Than or Equal',
      title: '>=',
    });
  }

  populateTxtOprList() {
    this.txtOperators = [];
    this.txtOperators.push({
      value: 'Contains',
      label: 'Contains',
      title: 'Contains',
    });
    this.txtOperators.push({
      value: 'StartsWith',
      label: 'Start With',
      title: 'Start With',
    });
  }
  populateLovOprList() {
    this.lovOperators = [];
    this.lovOperators.push({ value: 'Any', label: 'Any', title: 'Any' });
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
  onAddNewRule() {
    if (
      this.filterAttributeList === null ||
      this.filterAttributeList === undefined
    ) {
      this.getAttributes();
    }
    this.filterValueList = this.filterOperatorList = this.filterDepartmentList  = this.filterValue = [];
    this.filterAttribute = {
      label: '',
      value: null,
      title: '',
    };
    this.filterOperator = {
      label: '',
      value: null,
      title: '',
    };    
    this.filterDepartment = {
      label: '',
      value: null,
      title: '',
    };  
    this.txtValue = '';
    this.isLov = this.isDepRequired = false;
    this.addRuleDialog = true;
  }
  getAttributes() {
    this.wrs.getAttributeList().then(
      (atList: any) => {
        if (
          atList === undefined ||
          atList.value === undefined ||
          atList.value.status >= 400
        ) {
          this.handleError('Unable to load attributes.');
        } else {
          this.populateAttributeList(atList.value);
        }
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
          title: atr.attributeType,
        };
        this.attributes.push(atrItem);
      }
    } catch (ex) {
      console.log(ex);
    }
  }
  populateValuesList(atvList: IAttributeValue[]) {
    try {
      this.values = [];
      this.values.push({ value: null, label: 'Select Value' });
      for (let atr of atvList) {
        let atvItem: SelectItem = {
          value: atr.attributeValueCode,
          label: atr.attributeValueName,
          title: atr.attributeCode,
        };
        this.values.push(atvItem);
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

  getFilterDepartmentList(event: any) {
    if (this.departments != undefined && this.departments.length > 0) {
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

  onAttributeSelect() {
    try {
      this.isAttrSelect = true;
      this.isLov = this.isDepRequired = this.isValueEnable = this.isDepEnable = false;
      this.filterOperatorList = this.filterValueList = this.filterDepartmentList = this.filterValue = [];
      this.txtValue = null;
      if (this.filterOperator != undefined || this.filterValue != undefined || this.filterDepartment != undefined) {
        this.filterOperator = this.filterDepartment = { value: null, label: '' };
        this.filterValue = [];
      }
      if (this.filterAttribute && this.filterAttribute.title == '1') {
        this.filterOperatorList = this.txtOperators;
      }
      if (this.filterAttribute && this.filterAttribute.title == '2') {
        this.filterOperatorList = this.numOperators;
      }
      if (this.filterAttribute && this.filterAttribute.title == '3') {
        this.filterOperatorList = this.lovOperators;
        this.isLov = true;
      }
      if (
        this.filterAttribute != undefined &&
        this.filterAttribute.title === '4'
      ) {
        this.isDepRequired = this.isLov = true;
        this.filterOperatorList = this.lovOperators;
      }
    } catch (ex) {
      this.handleError(ex);
    }
  }
  getFilterValueList(event: any) {
    if (this.values && this.values.length > 0) {
      let filtered: any[] = [];
      let query = event.query;
      for (let i = 0; i < this.values.length; i++) {
        let atv = this.values[i];
        if (atv.label?.toLowerCase().includes(query.trim().toLowerCase())) {
          filtered.push(atv);
        }
      }
      this.filterValueList = filtered;
    } else {
      this.filterValueList = [];
    }
  }
  onUnSelectAttribute() {
    this.filterOperatorList = this.filterValueList = this.filterDepartmentList = this.filterValue = [];
    this.txtValue = null;
    if (this.filterOperator != undefined || this.filterValue != undefined || this.filterDepartment != undefined) {
      this.filterOperator = { value: null, label: '' };
      this.filterDepartment = { value: null, label: '' };
      this.filterValue = [];
    }
    this.isAttrSelect = this.isLov = this.isDepEnable = false;
  }
  onOptrSelect() {
    if (!this.isDepRequired) {
      this.wrs.getValuesList(this.filterAttribute.value).then(
        (atvList: any) => {
          if (
            atvList === undefined ||
            atvList.value === undefined ||
            atvList.value.status >= 400
          ) {
            this.handleError('Unable to load values.');
          } else {
            this.populateValuesList(atvList.value);
            this.isValueEnable = true;
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
    else{
      this.isDepEnable = true;
    }
  }
  onOptrUnSelect() {
    this.isValueEnable = false;
  }
  onDepartmentSelect() {
    this.isValueEnable = false;
    this.filterValueList = this.filterValue = [];
      this.txtValue = null;
    this.wrs
      .getValuesListByDepCode(
        this.filterAttribute.value,
        this.filterDepartment.value
      )
      .then(
        (atvList: any) => {
          if (
            atvList === undefined ||
            atvList.value === undefined ||
            atvList.value.status >= 400
          ) {
            this.handleError('Unable to load values.');
          } else {
            this.populateValuesList(atvList.value);
          }
        },
        (error) => {
          this.handleError(error);
        }
      );
    this.isLov = this.isValueEnable = true;
  }
  onDepartmentUnselect() {
    this.isValueEnable = false;
    this.filterValueList = this.filterValue = [];
      this.txtValue = null;
  }
  saveRule() {
    try {
      if (
        this.filterAttribute &&
        this.filterAttribute.value != null &&
        this.filterOperator &&
        this.filterOperator.value != null &&
        (this.txtValue != '' ||
          (this.filterValue && this.filterValue.length > 0))
      ) {
        if (
          this.conditions === undefined ||
          this.conditions === null ||
          this.conditions.length < 0
        ) {
          this.conditions = [];
        }
        let existingRecord = this.conditions.find(
          (dt) => dt.attributeCode === this.filterAttribute.value && dt.depCode === this.filterDepartment.value
        );
        if (existingRecord != undefined) {
          let message =
            'Attribute is already exist. Please select another attribute to add expression';
          this.displayAlerts(message);
          this.addRuleDialog = true;
        } else {
          this.getRuleExpression();
          this.addRuleDialog = false;
        }
      } else {
        let message =
          'Please select Attribute, Operator and value to save expression';
        this.displayAlerts(message);
        this.addRuleDialog = true;
      }
    } catch (ex) {
      this.handleError(ex);
    }
  }
  getRuleExpression() {
    let displayValue: string = '';
    let valuesList: string = '';
    if (this.filterValue != undefined && this.filterValue.length > 0) {
      let lastIndex = this.filterValue.length - 1;
      let index: number = 0;
      for (let vl of this.filterValue) {
        index++;
        let separator = index - 1 === lastIndex ? '' : ',';
        displayValue = displayValue.concat(vl.label + separator);
        valuesList = valuesList.concat(vl.value + separator);
      }
    }
    let cndtn: ICondition = {
      attributeName: this.filterAttribute ? this.filterAttribute.label : '',
      attributeCode: this.filterAttribute ? this.filterAttribute.value : '',
      relationOp: this.filterOperator ? this.filterOperator.value : '',
      oprator: this.filterOperator ? this.filterOperator.title : '',
      depCode: this.filterDepartment? this.filterDepartment.value:'',
      logicalOp: 'And',
      valueName:
        this.txtValue != null && this.txtValue != ''
          ? this.txtValue
          : this.filterValue != undefined
          ? displayValue
          : '',
      value:
        this.txtValue != null && this.txtValue != ''
          ? this.txtValue
          : this.filterValue != undefined
          ? valuesList
          : '',
    };
    this.conditions.push(cndtn);
    if (this.conditions !== null && this.conditions.length > 0) {
      this.ruleExpression = '';
      this.conditions[0].logicalOp = '';
      this.conditions.forEach((dt) => {
        this.ruleExpression +=
          dt.logicalOp +
          ' (' +
          dt.attributeName +
          ' ' +
          dt.oprator +
          ' ' +
          dt.value +
          ') ';
      });
      this.ruleExpression = this.ruleExpression.trim();
    }
  }
  updateRule() {
    try {
      let rule: IRuleUpdateData = {
        ruleId: this.ruleData.ruleId,
        ruleName: this.filterRuleName,
        ruleDesc: this.ruleExpression,
        isActive: this.isActive,
      };
      this.wrs.updateWorkflowTemplate(rule).subscribe(
        (res) => {
          if (res.statusCode >= 200 && res.statusCode < 400) {
            this.addMessages('success', 'Rule Updated successfully.');
          } else if (res.statusCode >= 400) {
            this.addMessages('error', 'Update Failed.');
          }
          this.loading = false;
        },
        (error: any) => {
          this.addMessages('error', error);
          this.loading = false;
        }
      );
    } catch (ex) {
      this.handleError(ex);
    }
  }
  onSubmit() {
    try {
      if (this.isSelected) {
        this.updateRule();
        return;
      }
      if (
        this.filterRuleName &&
        this.filterRuleName != '' &&
        this.ruleExpression != ''
      ) {
        let submit: IRuleData = {
          ruleId: 0,
          ruleName: this.filterRuleName,
          ruleDesc: this.ruleExpression,
          isActive: this.isActive,
          conditions: this.conditions,
        };
        this.wrs.createWorkflowRule(submit).subscribe(
          (res) => {
            if (res.statusCode >= 200 && res.statusCode < 400) {
              this.isSubmit = true;
              this.addMessages('success', 'Rule Created successfully');
            } else if (res.statusCode >= 400) {
              this.addMessages(
                'error',
                'Server Error. Please try again after sometime.'
              );
            }
            this.loading = false;
          },
          (error) => {
            this.addMessages('error', error);
          }
        );
      } else {
        let message = 'Please select Rule name and Expression to save rule';
        this.displayAlerts(message);
      }
    } catch (ex) {
      this.handleError(ex);
    }
  }
  deleteRule(condtion: ICondition) {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete ' + condtion.attributeName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.conditions = this.conditions.filter(
          (val) => val.attributeCode !== condtion.attributeCode
        );
        this.ruleExpression = '';
        if (this.conditions !== null && this.conditions.length > 0) {
          this.ruleExpression = '';
          this.conditions[0].logicalOp = '';
          this.conditions.forEach((dt) => {
            this.ruleExpression +=
              dt.logicalOp +
              ' (' +
              dt.attributeName +
              ' ' +
              dt.oprator +
              ' ' +
              dt.value +
              ') ';
          });
          this.ruleExpression = this.ruleExpression.trim();
        }
      },
    });
  }
  onClickBack() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to go back ' + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.router.navigateByUrl('/searchrule');
      },
    });
  }
  onFocusElement(element?: string) {
    if (element != undefined) {
      this.toolTipData = element ? element : '';
    } else {
      this.toolTipData = '';
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
}
