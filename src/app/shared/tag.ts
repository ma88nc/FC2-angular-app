export class Tag 
{
    TagId : number;
    TagDescription : string;
    Count : number;
}

export class TreeNode
{
    constructor(public text: string, public value: string, public children: any[]) {}
 /*    text: string;
    value: string;
    children: any[]; */
}