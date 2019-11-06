/* tslint:disable */

declare var Object: any;
export interface App_rds_visitInterface {
  "rds_visit_id"?: number;
  "rds_id"?: number;
  "visit_date"?: number;
  "additional_comments"?: string;
  "latitude"?: string;
  "longitude"?: string;
  "created_date"?: number;
  "created_by"?: number;
  "updated_date"?: number;
  "updated_by"?: number;
}

export class App_rds_visit implements App_rds_visitInterface {
  "rds_visit_id": number;
  "rds_id": number;
  "visit_date": number;
  "additional_comments": string;
  "latitude": string;
  "longitude": string;
  "created_date": number;
  "created_by": number;
  "updated_date": number;
  "updated_by": number;
  constructor(data?: App_rds_visitInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `App_rds_visit`.
   */
  public static getModelName() {
    return "App_rds_visit";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of App_rds_visit for dynamic purposes.
  **/
  public static factory(data: App_rds_visitInterface): App_rds_visit{
    return new App_rds_visit(data);
  }
  /**
  * @method getModelDefinition
  * @author Julien Ledun
  * @license MIT
  * This method returns an object that represents some of the model
  * definitions.
  **/
  public static getModelDefinition() {
    return {
      name: 'App_rds_visit',
      plural: 'app_rds_visit',
      path: 'app_rds_visit',
      idName: 'rds_visit_id',
      properties: {
        "rds_visit_id": {
          name: 'rds_visit_id',
          type: 'number'
        },
        "rds_id": {
          name: 'rds_id',
          type: 'number'
        },
        "visit_date": {
          name: 'visit_date',
          type: 'number'
        },
        "additional_comments": {
          name: 'additional_comments',
          type: 'string'
        },
        "latitude": {
          name: 'latitude',
          type: 'string'
        },
        "longitude": {
          name: 'longitude',
          type: 'string'
        },
        "created_date": {
          name: 'created_date',
          type: 'number'
        },
        "created_by": {
          name: 'created_by',
          type: 'number'
        },
        "updated_date": {
          name: 'updated_date',
          type: 'number'
        },
        "updated_by": {
          name: 'updated_by',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
