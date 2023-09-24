import { ICondition } from "./IConditions";

export interface IRuleData {
    ruleId:number;
    ruleName:string;
    ruleDesc:string;
    creator?:string;
    createdTimeStamp?:Date;
    isActive:boolean;
    conditions:ICondition[];
}

export interface IRuleUpdateData {
    ruleId:number;
    ruleName:string;
    ruleDesc:string;    
    isActive:boolean;   
}