import { IRule } from "./IRule";

export interface IActivityDefinition {
    temId?:number;
    actDefId?:number;
    slaDays:number;
    depCode: number;
    depName?: string;       
    offCode?: string;
    offName?: string;
    offLevCode: string;
    offLevName?: string;
    procCode:string;
    procName?:string;
    actCode:string;
    actName?:string;
    wfTempName?: string
    isActive:boolean;
    createdDate?:Date;
    createdBy?:string;
    deactiveReason?:string; 
    effectiveDate?:Date;
    endDate?:Date;
    steps?:IActivitySteps[];
    rules?:IRule[];    
    }
export interface IActivitySteps {
    actDefStpId?:number;
    actDefId?:string;
    stpNum:number;
    stpSLADays?:number;
    noteTempId?:number;
    depCode:string;
    depName?:string;
    offLevCode:string;
    offLevName?:string;
    rolCode:string;
    rolName?:string;
    cdrCode:string;
    cdrName?:string;
    pstCode:string;
    pstName?:string;
    noteTempName?:string;
    assignType:string;                                
}