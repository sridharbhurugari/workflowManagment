export interface IWorkflowSearchData{    
    departmentCode: string;
    officeLevelCode: string;
    officeCode: string;
    status: boolean;    
}
export interface IWorkflowParamData{ 
    departmentName?:string;
    officeLevelname?: string;
    officeName?:string;   
    departmentCode: string;
    officeLevelCode: string;
    officeCode: string;
    isActive: boolean;    
}
export interface IWorkFlows {
templateId?:number;
departmentCode: number;
departmentName?: string;
description: string;
isDefault:boolean;
isActive: boolean;
officeCode?: string;
officeLevelCode: string;
officeLevelName?: string;
officeName?: string;
shortName: string
deactiveReason?:string;
steps: IStep[];
}
export interface IStep {
templateStepId?: number;
templateId?: number;
stepNumber: number;
departmentCode: string;
departmentName?:string;
officeLevelCode: string;
officeLevelName?:string;
roleCode: string;
cadreCode: string;
postCode: string;
roleName?: string;
cadreName?:string;
postName?:string;
assignmentType: string;
noteTempName?:string;
noteTempId?:number;
stpSLADays?:number;
}
export interface IUpdateWorkflow{
    templateId?: number;
    isDefault:boolean;
    isActive: boolean;
    deactiveReason?:string;
}