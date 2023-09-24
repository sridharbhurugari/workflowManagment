import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message, ConfirmationService, MessageService } from 'primeng/api';
import { ICadre } from '../Classes/ICadre';
import { IDepartment } from '../Classes/Idepartment';
import { IOffice } from '../Classes/Ioffice';
import { IOfficeLevel } from '../Classes/IofficeLevel';
import { IPost } from '../Classes/IPost';
import { IRole } from '../Classes/IRole';
import {
  IStep,
  IUpdateWorkflow,
  IWorkflowParamData,
  IWorkFlows,
} from '../Classes/IworkflowTemplateSearch';
import { SelectItem } from '../Classes/SelectItem';
import { WorkflowManagementService } from '../Services/workflow-management.service';
import { WmsUtilityDataService } from '../utilities/wms-utility-data.service';

@Component({
  selector: 'app-add-workflow-template',
  templateUrl: './add-workflow-template.component.html',
  styleUrls: ['./add-workflow-template.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class AddWorkflowTemplateComponent implements OnInit {
  // collections
  departments: SelectItem[];
  officeLevels: SelectItem[];
  stepOfficeLevels: SelectItem[];
  offices: SelectItem[];
  roles: SelectItem[];
  cadres: SelectItem[];
  posts: SelectItem[];
  workflows: IWorkFlows[];
  workflow: IWorkFlows;
  wmsSearchData: IWorkflowParamData;
  steps: IStep[];

  //search params
  filterDepartmentList: SelectItem[];
  filterOfficeLevelList: SelectItem[];
  filterOfficeList: SelectItem[];
  filterDepartment: SelectItem;
  filterOfficeLevel: SelectItem;
  filterOffice: SelectItem;
  workflowTemplateName: string;
  workflowStepDescription: string;
  workflowId: string;

  //table Formar
  loading: boolean;
  active: boolean = true;
  departmentDefault: boolean;
  addStepDialog: boolean;
  pageNumber: number;
  rowperPage: number;
  totalWorkFlows: number;
  dueDays: number;

  // Step fields
  step: IStep;
  stepNo: number = 1;

  filterStepDepartment: SelectItem;
  filterStepDepartmentList: SelectItem[];

  filterStepOffice: SelectItem;
  filterStepOfficeList: SelectItem[];

  fileterStepRole: SelectItem;
  filterStepRoleList: SelectItem[];

  filterStepCadre: SelectItem;
  filterStepCadreList: SelectItem[];

  filterStepPost: SelectItem;
  filterStepPostList: SelectItem[];

  filterStepNotification: SelectItem;
  filterStepNotificationList: SelectItem[];

  //alerts
  toolTipData: string;

  // Validations
  isDepartmentSelect: boolean;
  isOffLvlSelect: boolean;
  isStepOfcLvlSelect: boolean;
  isBroadCast: boolean = true;
  isRoundRobin: boolean;
  isSelected: boolean = false;
  isRoleSelected: boolean = false;
  isCadreSelected: boolean = false;
  isCadreExist: boolean = false;
  isAddStep: boolean = true;
  isSubmit: boolean = true;
  isSaved: boolean = false;

  constructor(
    private router: Router,
    private wms: WorkflowManagementService,
    private wmsUtility: WmsUtilityDataService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getDepartments();
    this.workflow = this.wmsUtility.getWmsSelectedRowData();
    if (this.workflow != undefined && this.workflow != null) {
      this.isSelected = true;
      this.setCurrentWorkflow();
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

  setCurrentWorkflow() {
    this.filterDepartment = {
      label:
        this.workflow.departmentName != undefined &&
        this.workflow.departmentName?.length > 25
          ? this.workflow.departmentName.slice(0, 25) + '...'
          : this.workflow.departmentName,
      value: this.workflow.departmentCode,
      title: this.workflow.departmentName,
    };
    this.filterOfficeLevel = {
      label:
        this.workflow.officeLevelName != undefined &&
        this.workflow.officeLevelName?.length > 25
          ? this.workflow.officeLevelName.slice(0, 25) + '...'
          : this.workflow.officeLevelName,
      value: this.workflow.officeLevelCode,
      title: this.workflow.officeLevelName,
    };
    this.filterOffice = {
      label:
        this.workflow.officeName != undefined &&
        this.workflow.officeName?.length > 25
          ? this.workflow.officeName.slice(0, 25) + '...'
          : this.workflow.officeName,
      value: this.workflow.officeCode,
      title: this.workflow.officeName,
    };
    this.workflowTemplateName = this.workflow.shortName;
    this.workflowStepDescription = this.workflow.description;
    this.active = this.workflow.isActive;
    this.departmentDefault = this.workflow.isDefault;
    this.steps = this.workflow.steps;
    this.steps = this.steps.sort((a, b) =>
      a.stepNumber > b.stepNumber ? 1 : -1
    );
  }

  getOfficeLevels() {
    if (
      this.filterDepartment != undefined &&
      this.filterDepartment.value != ''
    ) {
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

  getOffices() {
    if (
      this.filterDepartment != undefined &&
      this.filterDepartment.value != '' &&
      this.filterOfficeLevel != undefined &&
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

  getStepOfficeLevels() {
    if (
      this.filterStepDepartment != undefined &&
      this.filterStepDepartment.value != ''
    ) {
      this.wms.getOfficeLevelList(this.filterStepDepartment.value).then(
        (oflList: any) => {
          this.populatStepOfficeLevelList(oflList.value);
        },
        (error) => {
          this.handleError(error);
        }
      );
    }
  }

  getRoles() {
    if (
      this.filterStepDepartment != undefined &&
      this.filterStepDepartment.value != '' &&
      this.filterStepOffice != undefined &&
      this.filterStepOffice.value != ''
    ) {
      this.wms
        .getRoleList(
          this.filterStepDepartment.value,
          this.filterStepOffice.value
        )
        .then(
          (roleList: any) => {
            console.log(roleList.value);
            this.populatRoleList(roleList.value);
          },
          (error) => {
            this.handleError(error);
          }
        );
    }
  }

  getCadres() {
    if (
      this.filterStepDepartment != undefined &&
      this.filterStepDepartment.value != '' &&
      this.filterStepOffice != undefined &&
      this.filterStepOffice.value != ''
    ) {
      this.wms
        .getCadreList(
          this.filterStepDepartment.value,
          this.filterStepOffice.value
        )
        .then(
          (cdrList: any) => {
            console.log(cdrList.value);
            this.populatCadreList(cdrList.value);
          },
          (error) => {
            this.handleError(error);
          }
        );
    }
  }

  getPosts() {
    if (
      this.filterStepDepartment != undefined &&
      this.filterStepDepartment.value != '' &&
      this.filterStepOffice != undefined &&
      this.filterStepOffice.value != '' &&
      this.filterStepCadre != undefined &&
      this.filterStepCadre.value != ''
    ) {
      this.wms
        .getPostList(
          this.filterStepDepartment.value,
          this.filterStepOffice.value,
          this.filterStepCadre.value
        )
        .then(
          (pstList: any) => {
            console.log(pstList.value);
            this.populatPostList(pstList.value);
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

  populatStepOfficeLevelList(ofcLevList: IOfficeLevel[]) {
    try {
      this.stepOfficeLevels = [];
      for (let ofl of ofcLevList) {
        let oflvl: SelectItem = {
          value: ofl.officeLevelCode,
          label: ofl.officeLevelName,
          title: ofl.officeLevelName,
        };
        this.stepOfficeLevels.push(oflvl);
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  populatRoleList(roleList: IRole[]) {
    try {
      this.roles = [];
      for (let role of roleList) {
        let roleItem: SelectItem = {
          value: role.roleCode,
          label: role.roleName,
          title: role.roleName,
        };
        this.roles.push(roleItem);
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  populatCadreList(cdrList: ICadre[]) {
    try {
      this.cadres = [];
      for (let cdr of cdrList) {
        let cadre: SelectItem = {
          value: cdr.cadreCode,
          label: cdr.cadreName,
          title: cdr.cadreName,
        };
        this.cadres.push(cadre);
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  populatPostList(pstList: IPost[]) {
    try {
      this.posts = [];
      for (let pst of pstList) {
        let pstItem: SelectItem = {
          value: pst.postCode,
          label: pst.postName,
          title: pst.postName,
        };
        this.posts.push(pstItem);
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  getFilterDepartmentList(event: any) {
    if (this.departments != undefined && this.departments.length > 0) {
      console.log(this.departments);
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
    if (this.officeLevels != undefined && this.officeLevels.length > 0) {
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
    if (this.offices != undefined && this.offices.length > 0) {
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
    this.isDepartmentSelect = true;
    this.officeLevels = this.offices = [];
    if (this.filterOfficeLevel != undefined && this.filterOffice != undefined) {
      this.filterOfficeLevel = { value: null, label: '' };
      this.filterOffice = { value: null, label: '' };
    }
    this.filterStepDepartment = {
      value: this.filterDepartment.value,
      label: this.filterDepartment.label,
      title: this.filterDepartment.title,
    };
    this.isAddStep = false;
    this.isSubmit = false;
    this.getOfficeLevels();
    this.getStepOfficeLevels();
  }

  onDepartmentUnselect() {
    if (this.steps != undefined && this.steps.length > 0) {
      this.confirmationService.confirm({
        message:
          'Are you sure you want to change department with out saving current template' +
          '?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.officeLevels = this.offices = this.steps = [];
          if (
            this.filterOfficeLevel != undefined ||
            this.filterOffice != undefined
          ) {
            this.filterOfficeLevel = { value: null, label: '' };
            this.filterOffice = { value: null, label: '' };
          }
          this.isDepartmentSelect = false;
          this.isOffLvlSelect = false;
          this.isAddStep = true;
        },
        reject: () => {
          if (
            this.filterStepDepartment != undefined &&
            this.filterStepDepartment.label != undefined
          ) {
            this.filterDepartment = {
              value: this.filterStepDepartment.value,
              label:
                this.filterStepDepartment.label.length > 25
                  ? this.filterStepDepartment.label?.slice(0, 25) + '...'
                  : this.filterDepartment.label,
              title: this.filterStepDepartment.title,
            };
          }
        },
      });
    } else {
      this.officeLevels = this.offices = [];
      if (
        this.filterOfficeLevel != undefined ||
        this.filterOffice != undefined
      ) {
        this.filterOfficeLevel = { value: null, label: '' };
        this.filterOffice = { value: null, label: '' };
      }
      this.isDepartmentSelect = false;
      this.isOffLvlSelect = false;
      this.isAddStep = true;
    }
  }
  onOfcLvlUnselect() {
    this.offices = [];
    if (this.filterOffice != undefined) {
      this.filterOffice = { value: null, label: '' };
    }
    this.isOffLvlSelect = false;
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
    this.isOffLvlSelect = true;
    this.offices = [];
    if (this.filterOffice != undefined) {
      this.filterOffice = { value: null, label: '' };
    }
    this.getOffices();
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
  }
  onStepOfficeLevelSelect() {
    this.isStepOfcLvlSelect = true;
    this.isRoleSelected = this.isCadreSelected = false;
    this.roles = this.cadres = this.posts = [];
    if (
      this.fileterStepRole != undefined ||
      this.filterStepCadre != undefined ||
      this.filterStepPost != undefined
    ) {
      this.fileterStepRole = { value: null, label: '' };
      this.filterStepCadre = { value: null, label: '' };
      this.filterStepPost = { value: null, label: '' };
    }
    this.getRoles();
    this.getCadres();
  }

  onStepRoleSelect() {
    if (this.filterStepCadre != undefined || this.filterStepPost != undefined) {
      this.filterStepPostList = [];
      this.filterStepCadre = { value: null, label: '' };
      this.filterStepPost = { value: null, label: '' };
    }
    this.isRoleSelected = true;
  }
  onStepOfcLvlUnSelect() {
    this.roles = this.cadres = this.posts = [];
    if (
      this.fileterStepRole != undefined ||
      this.filterStepCadre != undefined ||
      this.filterStepPost != undefined
    ) {
      this.fileterStepRole = { value: null, label: '' };
      this.filterStepCadre = { value: null, label: '' };
      this.filterStepPost = { value: null, label: '' };
    }
    this.isStepOfcLvlSelect = false;
  }
  onStepRoleUnselect() {
    this.isRoleSelected = false;
  }

  onStepCadreUnselect() {
    this.isCadreSelected = this.isCadreExist = false;
    this.filterStepPostList = [];
    if (this.filterStepPost != undefined) {
      this.filterStepPost = { value: null, label: '' };
    }
  }

  onStepCadreSelect() {
    if (this.fileterStepRole != undefined) {
      this.fileterStepRole = { value: null, label: '' };
    }
    this.filterStepPostList = [];
    if (this.filterStepPost != undefined) {
      this.filterStepPost = { value: null, label: '' };
    }
    this.isCadreSelected = this.isCadreExist = true;
    this.getPosts();
  }

  getFilterStepOfficeList(event: any) {
    if (
      this.stepOfficeLevels != undefined &&
      this.stepOfficeLevels.length > 0
    ) {
      let filtered: any[] = [];
      let query = event.query;
      for (let i = 0; i < this.stepOfficeLevels.length; i++) {
        let office = this.stepOfficeLevels[i];
        if (office.value?.toLowerCase().includes(query.trim().toLowerCase())) {
          filtered.push(office);
        }
      }

      this.filterStepOfficeList = filtered;
    } else {
      this.filterStepOfficeList = [];
    }
  }

  getFilterStepRoleList(event: any) {
    if (this.roles != undefined && this.roles.length > 0) {
      let filtered: any[] = [];
      let query = event.query;
      for (let i = 0; i < this.roles.length; i++) {
        let place = this.roles[i];
        if (place.value?.toLowerCase().includes(query.trim().toLowerCase())) {
          filtered.push(place);
        }
      }

      this.filterStepRoleList = filtered;
    } else {
      this.filterStepRoleList = [];
    }
  }

  getFilterStepCadreList(event: any) {
    if (this.cadres != undefined && this.cadres.length > 0) {
      let filtered: any[] = [];
      let query = event.query;
      for (let i = 0; i < this.cadres.length; i++) {
        let place = this.cadres[i];
        if (place.value?.toLowerCase().includes(query.trim().toLowerCase())) {
          filtered.push(place);
        }
      }

      this.filterStepCadreList = filtered;
    } else {
      this.filterStepCadreList = [];
    }
  }

  getFilterStepPostList(event: any) {
    if (this.posts != undefined && this.posts.length > 0) {
      let filtered: any[] = [];
      let query = event.query;
      for (let i = 0; i < this.posts.length; i++) {
        let pst = this.posts[i];
        if (pst.value?.toLowerCase().includes(query.trim().toLowerCase())) {
          filtered.push(pst);
        }
      }

      this.filterStepPostList = filtered;
    } else {
      this.filterStepPostList = [];
    }
  }

  addStep() {
    this.isRoleSelected = this.isCadreSelected = false;
    if (
      this.steps != undefined &&
      this.steps != null &&
      this.steps.length > 0
    ) {
      this.stepNo = this.steps.length + 1;
    }
    this.filterStepOffice = { label: '', value: null };
    this.filterStepCadre = { label: '', value: null };
    this.fileterStepRole = { label: '', value: null };
    this.filterStepPost = { label: '', value: null };
    this.isRoundRobin = false;
    this.isBroadCast = true;
    this.addStepDialog = true;
  }

  saveStep() {
    if (
      (this.filterStepOffice != undefined &&
        this.filterStepOffice.value != null &&
        this.fileterStepRole != undefined &&
        this.fileterStepRole.value != null) ||
      (this.filterStepOffice != undefined &&
        this.filterStepOffice.value != null &&
        this.filterStepCadre != undefined &&
        this.filterStepCadre.value != null)
    ) {
      if (this.steps == null || this.steps.length < 0) {
        this.steps = [];
      }
      let step: IStep = {
        stepNumber: this.stepNo ? this.stepNo : 0,
        departmentName: this.filterStepDepartment
          ? this.filterStepDepartment.label
          : '',
        departmentCode: this.filterStepDepartment
          ? this.filterStepDepartment.value
          : null,
        officeLevelName: this.filterStepOffice
          ? this.filterStepOffice.label
          : '',
        officeLevelCode: this.filterStepOffice
          ? this.filterStepOffice.value
          : null,
        roleName: this.fileterStepRole ? this.fileterStepRole.label : '',
        roleCode: this.fileterStepRole ? this.fileterStepRole.value : null,
        cadreName: this.filterStepCadre ? this.filterStepCadre.label : '',
        cadreCode: this.filterStepCadre ? this.filterStepCadre.value : null,
        postName: this.filterStepPost ? this.filterStepPost.label : '',
        postCode: this.filterStepPost ? this.filterStepPost.value : null,
        assignmentType: this.isBroadCast ? 'Broadcast' : 'Roundrobin',
      };
      this.steps = this.steps.filter(
        (val) => val.stepNumber !== step.stepNumber
      );
      if (this.steps != undefined && this.steps.length >= 1) {
        let lastStep = this.steps[this.steps.length - 1];
        if (
          (step.roleCode !== null &&
            step.officeLevelCode === lastStep.officeLevelCode &&
            step.roleCode === lastStep.roleCode) ||
          (step.cadreCode !== null &&
            step.officeLevelCode === lastStep.officeLevelCode &&
            step.cadreCode === lastStep.cadreCode &&
            step.postCode === lastStep.postCode)
        ) {
          let message =
            'Previous step having same designation.Please add different role or cadre';
          this.displayAlerts(message);
          this.addStepDialog = true;
        } else {
          this.steps.push(step);
          this.steps.sort((a, b) => (a.stepNumber < b.stepNumber ? -1 : 1));
          this.addStepDialog = false;
        }
      } else {
        this.steps.push(step);
        this.steps.sort((a, b) => (a.stepNumber < b.stepNumber ? -1 : 1));
        this.addStepDialog = false;
      }
    } else {
      let message = 'Please select office, Role or Cadre to save step';
      this.displayAlerts(message);
      this.addStepDialog = true;
    }
  }

  onBroadCastChange() {
    if (this.isBroadCast) {
      this.isRoundRobin = false;
    } else {
      this.isRoundRobin = true;
    }
  }

  onRoundRabinChange() {
    if (this.isRoundRobin) {
      this.isBroadCast = false;
    } else {
      this.isBroadCast = true;
    }
  }

  updateWorkflow() {
    let workflow: IUpdateWorkflow = {
      templateId: this.workflow.templateId,
      isActive: this.active,
      isDefault: this.departmentDefault,
      deactiveReason: this.active ? '' : 'required reason',
    };
    this.wms.updateWorkflowTemplate(workflow).subscribe(
      (res) => {
        if (res.statusCode == 204) {
          this.isSaved = true;
          this.addMessages('success', 'Template Updated successfully');
        }
      },
      (error: any) => {
        this.addMessages('error', error);
        this.loading = false;
      }
    );
  }

  onSubmitTemplate() {
    try {
      if (this.isSelected) {
        this.updateWorkflow();
        return;
      }
      let message = '';
      if (
        this.steps == null ||
        this.steps.length <= 0 ||
        this.workflowTemplateName == undefined ||
        this.workflowTemplateName == ''
      ) {
        message =
          'Required atleast two steps and worlflow templatename to save template ' +
          this.filterDepartment.label;
        this.displayAlerts(message);
      } else {
        if (this.steps && this.steps.length >= 2) {
          message =
            'You can not edit once template saved. Are you sure you want to save?';
          this.confirmationService.confirm({
            message: message,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.loading = true;
              let workflow: IWorkFlows = {
                departmentCode: this.filterDepartment
                  ? this.filterDepartment.value
                  : null,
                officeLevelCode: this.filterOfficeLevel
                  ? this.filterOfficeLevel.value
                  : null,
                officeCode: this.filterOffice ? this.filterOffice.value : null,
                shortName: this.workflowTemplateName
                  ? this.workflowTemplateName
                  : '',
                description: this.workflowStepDescription
                  ? this.workflowStepDescription
                  : '',
                isActive: this.active,
                isDefault: this.departmentDefault,
                deactiveReason: this.active ? '' : 'required reason',
                steps: this.steps,
              };
              this.wms.createWorkflowTemplate(workflow).subscribe(
                (result) => {
                  if (
                    result != undefined &&
                    result.routeValues != undefined &&
                    result.routeValues.id > 0
                  ) {
                    this.wms.getCurrentTemplate(result.routeValues.id).then(
                      (res) => {
                        if (
                          res == undefined ||
                          res.value == undefined ||
                          res.status >= 400
                        ) {
                          this.addMessages(
                            'error',
                            'Unable to create template.Please try again after sometime.'
                          );
                          this.loading = false;
                        } else {
                          this.workflow = res.value;
                          this.workflowStepDescription =
                            this.workflow.description;
                          this.loading = false;
                          this.isAddStep = true;
                          this.isSaved = true;
                          this.isSubmit = true;
                          this.isSelected = false;
                          this.addMessages(
                            'success',
                            'Template Added successfully'
                          );
                        }
                      },
                      (error) => {
                        this.loading = false;
                        this.addMessages('error', error.message);
                      }
                    );
                  } else {
                    this.loading = false;
                    this.handleError('Server Errror.');
                  }
                },
                (error: any) => {
                  this.loading = false;
                  this.addMessages('error', error);
                }
              );
            },
          });
        } else {
          this.loading = false;
          this.addMessages(
            'info',
            'Required atleast two steps to save template'
          );
        }
      }
    } catch (ex) {
      this.loading = false;
      this.addMessages(
        'error',
        'Server Exception.Please try again after sometime'
      );
    }
  }

  editProduct(product: IStep) {
    this.isRoleSelected = this.isCadreSelected = this.isCadreExist = false;
    this.isRoundRobin = this.isBroadCast = false;
    let step = { ...product };
    this.stepNo = step.stepNumber;
    this.filterStepOffice = {
      label: step.officeLevelName ? step.officeLevelName : '',
      value: step.officeLevelCode ?? step.officeLevelCode,
    };
    this.fileterStepRole = {
      label: step.roleName ? step.roleName : '',
      value: step.roleCode ?? step.roleCode,
    };
    this.filterStepCadre = {
      label: step.cadreName ? step.cadreName : '',
      value: step.cadreCode ?? step.cadreCode,
    };
    if (
      this.filterStepCadre.value != undefined ||
      this.filterStepCadre.value != null
    ) {
      this.isCadreExist = true;
    }
    this.filterStepPost = {
      label: step.postName ? step.postName : '',
      value: step.postCode ?? step.postCode,
    };
    step.assignmentType == 'Roundrobin'
      ? (this.isRoundRobin = true)
      : (this.isBroadCast = true);
    this.addStepDialog = true;
  }

  deleteProduct(product: IStep) {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete ' + product.departmentName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.steps = this.steps.filter(
          (val) => val.stepNumber !== product.stepNumber
        );
        this.steps.forEach(function (row, index) {
          row.stepNumber = index + 1;
        });
        this.steps.sort((a, b) => (a.stepNumber < b.stepNumber ? -1 : 1));
      },
    });
  }

  onClickBack() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to go back ' + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.router.navigateByUrl('/home');
      },
    });
  }
  onFocus(element?: SelectItem) {
    if (element != undefined) {
      this.toolTipData = element.title ? element.title : '';
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
