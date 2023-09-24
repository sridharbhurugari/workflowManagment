import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WorkflowManagementService } from '../Services/workflow-management.service';
import {
  IStep,
  IWorkflowParamData,
  IWorkFlows,
  IWorkflowSearchData,
} from '../Classes/IworkflowTemplateSearch';
import { SelectItem } from '../Classes/SelectItem';
import { IDepartment } from '../Classes/Idepartment';
import { IOfficeLevel } from '../Classes/IofficeLevel';
import { IOffice } from '../Classes/Ioffice';
import { SelectableRow } from 'primeng/table';
import { WmsUtilityDataService } from '../utilities/wms-utility-data.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-wokflow-management-template',
  templateUrl: './wokflow-management-template.component.html',
  styleUrls: ['./wokflow-management-template.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class WokflowManagementTemplateComponent implements OnInit {
  // collections
  departments: SelectItem[];
  officeLevels: SelectItem[];
  offices: SelectItem[];

  //filter Collection
  filterDepartmentList: SelectItem[];
  filterOfficeLevelList: SelectItem[];
  filterOfficeList: SelectItem[];
  workflows: IWorkFlows[];
  steps: IStep[];

  //search params
  filterDepartment: SelectItem;
  filterOfficeLevel: SelectItem;
  filterOffice: SelectItem;
  isActive: boolean = true;
  isDepartmentSelect: boolean;
  isOffLvlSelect: boolean;

  //table Format
  loading: boolean = false;
  rowsperPage: number;
  currentPage: number;
  totalWorkFlowCount: number;
  toolTipData: string;
  alertMessage: string;

  constructor(
    private wms: WorkflowManagementService,
    private router: Router,
    private wmsUtility: WmsUtilityDataService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.rowsperPage = 10;
    this.totalWorkFlowCount = this.currentPage = 0;
    this.alertMessage = 'Select criteria and search templates';
    this.getDepartments();
    this.getWorkflowData();
  }
  ngOnDestroy() {
    let searchParam = this.setSearchData();
    this.wmsUtility.setWmsSearchData(searchParam);
  }
  getWorkflowData() {
    let searchParam = this.wmsUtility.getwmsSearchData();
    if (searchParam != undefined && searchParam != null) {
      this.filterDepartment = {
        label:
          searchParam.departmentName != undefined &&
          searchParam.departmentName?.length > 25
            ? searchParam.departmentName?.slice(0, 25) + '...'
            : searchParam.departmentName,
        value: searchParam.departmentCode,
        title: searchParam.departmentName,
      };
      this.filterOfficeLevel = {
        label:
          searchParam.officeLevelname != undefined &&
          searchParam.officeLevelname?.length > 25
            ? searchParam.officeLevelname?.slice(0, 25) + '...'
            : searchParam.officeLevelname,
        value: searchParam.officeLevelCode,
        title: searchParam.officeLevelname,
      };
      this.filterOffice = {
        label:
          searchParam.officeName != undefined &&
          searchParam.officeName?.length > 25
            ? searchParam.officeName?.slice(0, 25) + '...'
            : searchParam.officeName,
        value: searchParam.officeCode,
        title: searchParam.officeName,
      };
      this.isActive = searchParam.isActive;
      if (
        this.filterDepartment != undefined &&
        this.filterDepartment.value != ''
      ) {
        this.isDepartmentSelect = true;
        this.getOfficeLevels();
      }
      if (
        this.filterOfficeLevel != undefined &&
        this.filterOfficeLevel.value != ''
      ) {
        this.isOffLvlSelect = true;
        this.getOffices();
      }
      this.getWorkflowTemplate(false);
    }
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
        console.log(error);
      }
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
          console.log(error);
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

  onDepartmentSelect() {
    if (
      this.filterDepartment !== undefined &&
      this.filterDepartment.label != undefined
    ) {
      this.filterDepartment = {
        value: this.filterDepartment.value,
        label:
          this.filterDepartment.label.length > 25
            ? this.filterDepartment.label?.slice(0, 25) + '...'
            : this.filterDepartment.label,
        title: this.filterDepartment.title,
      };
    }
    this.isDepartmentSelect = true;
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
            ? this.filterOfficeLevel.label?.slice(0, 25) + '...'
            : this.filterOfficeLevel.label,
        title: this.filterOfficeLevel.title,
      };
    }
    this.isOffLvlSelect = true;
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
            ? this.filterOffice.label?.slice(0, 25) + '...'
            : this.filterOffice.label,
        title: this.filterOffice.title,
      };
    }
  }

  onDepartmentUnSelect() {
    this.officeLevels = this.offices = [];
    if (this.filterOfficeLevel != undefined || this.filterOffice != undefined) {
      this.filterOfficeLevel = { value: null, label: '', title: '' };
      this.filterOffice = { value: null, label: '', title: '' };
    }
    this.isDepartmentSelect = false;
    this.isOffLvlSelect = false;
  }

  onofcLvlUnSelect() {
    this.offices = [];
    if (this.filterOffice != undefined) {
      this.filterOffice = { value: null, label: '', title: '' };
    }
    this.isOffLvlSelect = false;
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

  onSearch() {
    this.getWorkflowTemplate(true);
  }

  getWorkflowTemplate(isSearchClick: boolean) {
    this.workflows = [];
    this.totalWorkFlowCount = this.currentPage = 0;
    if (
      this.filterDepartment != undefined &&
      this.filterDepartment.value != ''
    ) {
      this.loading = true;
      let param: IWorkflowSearchData = {
        departmentCode: this.filterDepartment
          ? this.filterDepartment.value
          : '',
        officeLevelCode: this.filterOfficeLevel
          ? this.filterOfficeLevel.value
          : '',
        officeCode: this.filterOffice ? this.filterOffice.value : '',
        status: this.isActive,
      };
      this.wms.getWorkflowTemplates(param).then(
        (dt) => {
          if (
            dt == undefined ||
            dt.value == undefined ||
            dt.value.status >= 400
          ) {
            this.alertMessage = 'No Templates Found';
          } else {
            this.workflows = dt.value;
            if (this.workflows != undefined && this.workflows.length > 0) {
              this.totalWorkFlowCount = this.workflows.length;
            } else {
              this.alertMessage = 'No Templates Found';
            }
          }
          this.loading = false;
        },
        (error) => {
          this.alertMessage = 'No Templates Found';
          this.loading = false;
          console.log(error);
        }
      );
    } else {
      if (isSearchClick) {
        this.confirmationService.confirm({
          message: 'Please Select Department for Template Data',
          header: 'Warning',
          icon: 'pi pi-exclamation-triangle',
          rejectVisible: false,
          acceptLabel: 'Ok',
          accept: () => {},
        });
      }
    }
  }

  onWorkflowSelect(event: SelectableRow) {
    this.wmsUtility.setWmsSelectedRowData(event.data);
    this.router.navigateByUrl('/addWorkflow');
  }

  addTemplate() {
    let selectedWorkflow: any = undefined;
    this.wmsUtility.setWmsSelectedRowData(selectedWorkflow);
    this.router.navigateByUrl('/addWorkflow');
  }

  setSearchData(): IWorkflowParamData {
    let param: IWorkflowParamData = {
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
      isActive: this.isActive,
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
