import { BaseResourceModel } from "../../../shared/models/base-resource.model";

export class Category extends BaseResourceModel{

    constructor(
        public id?:number,
        public nome?: string,
        public description?: string
    ){
        super();
    }

}