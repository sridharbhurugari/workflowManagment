export interface ICondition{
    attributeCode: string;
    attributeName?:string;    
    value: string;
    valueName?: string;
    relationOp: string;  
    oprator?:string;
    depCode?:string;
    logicalOp: string;
    }        