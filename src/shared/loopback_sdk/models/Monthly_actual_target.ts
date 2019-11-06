/* tslint:disable */

declare var Object: any;
export interface Monthly_actual_targetInterface {
  "sph_id"?: number;
  "postal_code"?: number;
  "target_month"?: number;
  "target_year"?: number;
  "target_label"?: string;
  "target_value"?: string;
  "status"?: number;
  "created_by"?: number;
  "created_date"?: number;
  "updated_by"?: number;
  "updated_date"?: number;
  "target_id"?: number;
}

export class Monthly_actual_target implements Monthly_actual_targetInterface {
  "sph_id": number;
  "postal_code": number;
  "target_month": number;
  "target_year": number;
  "target_label": string;
  "target_value": string;
  "status": number;
  "created_by": number;
  "created_date": number;
  "updated_by": number;
  "updated_date": number;
  "target_id": number;
  constructor(data?: Monthly_actual_targetInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Monthly_actual_target`.
   */
  public static getModelName() {
    return "Monthly_actual_target";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Monthly_actual_target for dynamic purposes.
  **/
  public static factory(data: Monthly_actual_targetInterface): Monthly_actual_target{
    return new Monthly_actual_target(data);
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
      name: 'Monthly_actual_target',
      plural: 'Monthly_actual_targets',
      path: 'Monthly_actual_targets',
      idName: 'target_id',
      properties: {
        "sph_id": {
          name: 'sph_id',
          type: 'number'
        },
        "postal_code": {
          name: 'postal_code',
          type: 'number'
        },
        "target_month": {
          name: 'target_month',
          type: 'number'
        },
        "target_year": {
          name: 'target_year',
          type: 'number'
        },
        "target_label": {
          name: 'target_label',
          type: 'string'
        },
        "target_value": {
          name: 'target_value',
          type: 'string'
        },
        "status": {
          name: 'status',
          type: 'number'
        },
        "created_by": {
          name: 'created_by',
          type: 'number'
        },
        "created_date": {
          name: 'created_date',
          type: 'number'
        },
        "updated_by": {
          name: 'updated_by',
          type: 'number'
        },
        "updated_date": {
          name: 'updated_date',
          type: 'number'
        },
        "target_id": {
          name: 'target_id',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
