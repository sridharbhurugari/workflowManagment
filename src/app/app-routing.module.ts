import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityDefinationComponent } from './activity-defination/activity-defination.component';
import { AddActivityDefinationComponent } from './add-activity-defination/add-activity-defination.component';
import { AddWorkflowTemplateComponent } from './add-workflow-template/add-workflow-template.component';
import { AttributeDefinitionComponent } from './attribute-definition/attribute-definition.component';
import { ProcessActivityDefinationComponent } from './process-activity-defination/process-activity-defination.component';
import { ProcessDefinitionComponent } from './process-definition/process-definition.component';
import { WokflowManagementTemplateComponent } from './wokflow-management-template/wokflow-management-template.component';
import { WorkFlowRuleSearchComponent } from './work-flow-rule-search/work-flow-rule-search.component';
import { WorkFlowRulesComponent } from './work-flow-rules/work-flow-rules.component';

const routes: Routes = [
  { path: '', component: WokflowManagementTemplateComponent },
  { path: 'home', component: WokflowManagementTemplateComponent },
  { path: 'addWorkflow', component: AddWorkflowTemplateComponent },
  { path: 'rule', component: WorkFlowRulesComponent },
  { path: 'searchrule', component: WorkFlowRuleSearchComponent },
  { path: 'activity', component: ActivityDefinationComponent },
  { path: 'addActivity', component: AddActivityDefinationComponent },
  { path: 'process', component: ProcessDefinitionComponent },
  { path: 'process-activity', component: ProcessActivityDefinationComponent },
  { path: 'process-attribute', component: AttributeDefinitionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
