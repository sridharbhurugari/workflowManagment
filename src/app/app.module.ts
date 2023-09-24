import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { WorkflowManagementSystemComponent } from './workflow-management-system/workflow-management-system.component';
import { WokflowManagementTemplateComponent } from './wokflow-management-template/wokflow-management-template.component';
import { AddWorkflowTemplateComponent } from './add-workflow-template/add-workflow-template.component';
import { WorkFlowRuleSearchComponent } from './work-flow-rule-search/work-flow-rule-search.component';
import { WorkFlowRulesComponent } from './work-flow-rules/work-flow-rules.component';
import { ActivityDefinationComponent } from './activity-defination/activity-defination.component';
import { AddActivityDefinationComponent } from './add-activity-defination/add-activity-defination.component';
import { ProcessDefinitionComponent } from './process-definition/process-definition.component';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { CheckboxModule } from 'primeng/checkbox';
import { MenubarModule } from 'primeng/menubar';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { SidebarModule } from 'primeng/sidebar';
import { FieldsetModule } from 'primeng/fieldset';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { StatusTransperPipePipe } from './utilities/status-transper-pipe.pipe';
import { ListboxModule } from 'primeng/listbox';
import {InputSwitchModule} from 'primeng/inputswitch';
import {TreeTableModule} from 'primeng/treetable';
import { ProcessActivityDefinationComponent } from './process-activity-defination/process-activity-defination.component';
import { AttributeDefinitionComponent } from './attribute-definition/attribute-definition.component';


@NgModule({
  declarations: [
    AppComponent,
    WorkflowManagementSystemComponent,
    WokflowManagementTemplateComponent,
    AddWorkflowTemplateComponent,
    StatusTransperPipePipe,
    ActivityDefinationComponent,
    AddActivityDefinationComponent,
    WorkFlowRulesComponent,
    WorkFlowRuleSearchComponent,
    ProcessDefinitionComponent,
    ProcessActivityDefinationComponent,
    AttributeDefinitionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ButtonModule,
    PanelModule,
    BrowserAnimationsModule,
    MultiSelectModule,
    TableModule,
    CheckboxModule,
    MenubarModule,
    ToolbarModule,
    InputTextModule,
    AutoCompleteModule,
    SidebarModule,
    FieldsetModule,
    DialogModule,
    ProgressSpinnerModule,
    TooltipModule,
    MessagesModule,
    MessageModule,
    ConfirmDialogModule,
    DropdownModule,
    ListboxModule,
    ToastModule,
    TreeTableModule,    
    InputSwitchModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
