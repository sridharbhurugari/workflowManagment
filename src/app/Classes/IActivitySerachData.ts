import { IActivitySteps } from "./IActivityDefinition";
import { IRule } from "./IRule";
import { IStep } from "./IworkflowTemplateSearch";

export interface IActivitySearchData{    
    departmentCode: string;
    officeLevelCode: string;
    officeCode: string;
    processCode:string;
    activityCode: string;
    departmentName?:string;
    officeLevelname?: string;
    officeName?:string;   
    processName?:string;
    activityName?:string;
    status: boolean;    
}
export interface IActivityUpdateData{
    actDefId?:number;
    isActive:boolean;
    slaDays:number;
    steps: IActivitySteps[];
}

