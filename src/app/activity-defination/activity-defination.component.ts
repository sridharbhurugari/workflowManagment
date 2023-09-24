import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SelectableRow } from 'primeng/table';
import { IActivity } from '../Classes/IActivity';
import { IActivityDefinition } from '../Classes/IActivityDefinition';
import { IActivitySearchData } from '../Classes/IActivitySerachData';
import { IDepartment } from '../Classes/Idepartment';
import { IOffice } from '../Classes/Ioffice';
import { IOfficeLevel } from '../Classes/IofficeLevel';
import { IProcess } from '../Classes/IProcess';
import { SelectItem } from '../Classes/SelectItem';
import { ActivityDefinitionService } from '../Services/activity-definition.service';
import { WorkflowManagementService } from '../Services/workflow-management.service';
import { ActDefUtilityDataService } from '../utilities/act-def-utility-data.service';

@Component({
  selector: 'app-activity-defination',
  templateUrl: './activity-defination.component.html',
  styleUrls: ['./activity-defination.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class ActivityDefinationComponent implements OnInit {
  // collections
  departments: SelectItem[];
  officeLevels: SelectItem[];
  offices: SelectItem[];
  processes: SelectItem[];
  activities: SelectItem[];

  //filter Collection
  filterDepartmentList: SelectItem[];
  filterOfficeLevelList: SelectItem[];
  filterOfficeList: SelectItem[];
  filterProcessList: SelectItem[];
  filterActivityList: SelectItem[];

  //search params
  filterDepartment: SelectItem;
  filterOfficeLevel: SelectItem;
  filterOffice: SelectItem;
  filterProcess: SelectItem;
  filterActivity: SelectItem;
  isActive: boolean = true;

  //table Format
  activieDefinitions: IActivityDefinition[];
  loading: boolean = false;
  rowsperPage: number;
  currentPage: number;
  totalacdCount: number;

  //flags
  isDepSelect: boolean;
  isOfcLvlSelect: boolean;
  isProcessSelect: boolean;
  toolTipData: string;
  alertMessage: string;

  constructor(
    private wms: WorkflowManagementService,
    private router: Router,
    private ads: ActivityDefinitionService,
    private confirmationService: ConfirmationService,
    private actutility: ActDefUtilityDataService
  ) {}

  ngOnInit(): void {
    this.rowsperPage = 10;
    this.totalacdCount = this.currentPage = 0;
    this.alertMessage = 'Select criteria and search Activity Definition';
    this.getActivityDefinationData();
    this.getDepartments();
    this.getProcesses();
  }
  ngOnDestroy() {
    let searchParam = this.setSearchData();
    this.actutility.setActDefSearchData(searchParam);
  }
  getActivityDefinationData() {
    let searchParam = this.actutility.getActDefSearchData();
    if (searchParam != null) {
      this.filterDepartment = {
        label:
          searchParam.departmentName != undefined &&
          searchParam.departmentName?.length > 25
            ? searchParam.departmentName.slice(0, 25) + '...'
            : searchParam.departmentName,
        value: searchParam.departmentCode,
        title: searchParam.departmentName,
      };
      this.filterOfficeLevel = {
        label:
          searchParam.officeLevelname != undefined &&
          searchParam.officeLevelname?.length > 25
            ? searchParam.officeLevelname.slice(0, 25) + '...'
            : searchParam.officeLevelname,
        value: searchParam.officeLevelCode,
        title: searchParam.officeLevelname,
      };
      this.filterOffice = {
        label:
          searchParam.officeName != undefined &&
          searchParam.officeName?.length > 25
            ? searchParam.officeName.slice(0, 25) + '...'
            : searchParam.officeName,
        value: searchParam.officeCode,
        title: searchParam.officeName,
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
      if (
        this.filterDepartment != undefined &&
        this.filterDepartment.value != ''
      ) {
        this.isDepSelect = true;
        this.getOfficeLevels();
      }
      if (
        this.filterOfficeLevel != undefined &&
        this.filterOfficeLevel.value != ''
      ) {
        this.isOfcLvlSelect = true;
        this.getOffices();
      }
      if (this.filterProcess != undefined && this.filterProcess.value != '') {
        this.isProcessSelect = true;
        this.getActivities();
      }
      this.getActivityDefinition(false);
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
        console.log(error);
      }
    );
  }
  getProcesses() {
    this.ads.getProcessList().then(
      (prcList: any) => {
        this.populateProcessList(prcList.value);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getOfficeLevels() {
    if (this.filterDepartment && this.filterDepartment.value != '') {
      this.wms.getOfficeLevelList(this.filterDepartment.value).then(
        (oflList: any) => {
          this.populatOfficeLevelList(oflList.value);
        },
        (error) => {
          console.log(error);
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
          console.log(error);
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
            console.log(error);
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
    this.officeLevels = this.offices = [];
    if (this.filterOfficeLevel && this.filterOffice) {
      this.filterOfficeLevel = { value: null, label: '' };
      this.filterOffice = { value: null, label: '' };
    }
    this.getOfficeLevels();
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
    this.offices = [];
    if (this.filterOffice) {
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
    this.activities = [];
    if (this.filterActivityList) {
      this.filterActivity = { value: null, label: '' };
    }
    this.getActivities();
  }
  onActivityListSelect() {
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
  }
  onDepUnSelect() {
    this.officeLevels = this.offices = [];
    if (this.filterOfficeLevel != undefined || this.filterOffice != undefined) {
      this.filterOfficeLevel = { value: null, label: '' };
      this.filterOffice = { value: null, label: '' };
    }
    this.isDepSelect = false;
    this.isOfcLvlSelect = false;
  }
  onOfcLvlUnSelect() {
    this.offices = [];
    if (this.filterOffice != undefined) {
      this.filterOffice = { value: null, label: '' };
    }
    this.isOfcLvlSelect = false;
  }
  onProcUnSelect() {
    this.activities = [];
    if (this.filterActivityList) {
      this.filterActivity = { value: null, label: '' };
    }
    this.isProcessSelect = false;
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

  onSearch() {
    this.getActivityDefinition(true);
  }

  getActivityDefinition(isSelected: boolean) {
    this.activieDefinitions = [];
    this.totalacdCount = this.currentPage = 0;
    if (
      this.filterDepartment != undefined &&
      this.filterDepartment.value != ''
    ) {
      this.loading = true;
      let param: IActivitySearchData = {
        departmentCode: this.filterDepartment
          ? this.filterDepartment.value
          : '',
        officeLevelCode: this.filterOfficeLevel
          ? this.filterOfficeLevel.value
          : '',
        officeCode: this.filterOffice ? this.filterOffice.value : '',
        processCode: this.filterProcess ? this.filterProcess.value : '',
        activityCode: this.filterActivity ? this.filterActivity.value : '',
        status: this.isActive,
      };
      this.ads.getActivityDefinitions(param).then(
        (dt) => {
          if (
            dt == undefined ||
            dt.value == undefined ||
            dt.value.status >= 400
          ) {
            this.alertMessage = 'No Activity Definition Found';
          } else {
            this.activieDefinitions = dt.value;
            if (
              this.activieDefinitions != undefined &&
              this.activieDefinitions.length > 0
            ) {
              this.totalacdCount = this.activieDefinitions.length;
            } else {
              this.alertMessage = 'No Activity Definition Found';
            }
          }
          this.loading = false;
        },
        (error) => {
          this.alertMessage = 'No Activity Definition Found';
          this.loading = false;
          console.log(error);
        }
      );
    } else {
      if (isSelected) {
        this.confirmationService.confirm({
          message: 'Please Select Department for Activity Definition Data',
          header: 'Warning',
          icon: 'pi pi-exclamation-triangle',
          rejectVisible: false,
          acceptLabel: 'Ok',
          accept: () => {},
        });
      }
    }
  }

  addActivity() {
    let selectedWorkflow: any = undefined;
    this.actutility.setActDefSelectedRowData(selectedWorkflow);
    this.router.navigateByUrl('/addActivity');
  }

  onActivitySelect(event: SelectableRow) {
    this.actutility.setActDefSelectedRowData(event.data);
    this.router.navigateByUrl('/addActivity');
  }
  setSearchData(): IActivitySearchData {
    let param: IActivitySearchData = {
      departmentName: this.filterDepartment
        ? this.filterDepartment.title
        : undefined,
      departmentCode: this.filterDepartment ? this.filterDepartment.value : '',
      officeLevelname: this.filterOfficeLevel
        ? this.filterOfficeLevel.title
        : undefined,
      officeLevelCode: this.filterOfficeLevel
        ? this.filterOfficeLevel.value
        : '',
      officeName: this.filterOffice ? this.filterOffice.title : undefined,
      officeCode: this.filterOffice ? this.filterOffice.value : '',
      processName: this.filterProcess ? this.filterProcess.title : undefined,
      processCode: this.filterProcess ? this.filterProcess.value : '',
      activityName: this.filterActivity ? this.filterActivity.title : undefined,
      activityCode: this.filterActivity ? this.filterActivity.value : '',
      status: this.isActive,
    };
    return param;
  }
  onFocus(element?: SelectItem) {
    if (element != undefined) {
      this.toolTipData = element.title ? element.title : '';
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
