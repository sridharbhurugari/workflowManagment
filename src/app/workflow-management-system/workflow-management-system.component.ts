import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-workflow-management-system',
  templateUrl: './workflow-management-system.component.html',
  styleUrls: ['./workflow-management-system.component.css'],
})
export class WorkflowManagementSystemComponent implements OnInit {
  showSidebar: boolean = false;
  constructor() {}

  ngOnInit(): void {}

  openNav() {
    console.log('On open');
    this.showSidebar = true;
  }

  closeNav() {
    console.log('On close');
    this.showSidebar = false;
  }
}
