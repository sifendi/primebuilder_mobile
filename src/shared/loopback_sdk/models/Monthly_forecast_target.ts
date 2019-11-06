/* tslint:disable */

declare var Object: any;
export interface Monthly_forecast_targetInterface {
  "dt_id"?: number;
  "sph_id"?: number;
  "visitor_id"?: number;
  "visitor_type"?: string;
  "target_date"?: number;
  "target_label"?: string;
  "target_value"?: number;
  "status"?: number;
  "created_by"?: number;
  "created_date"?: number;
  "updated_by"?: number;
  "updated_date"?: number;
}

export class Monthly_forecast_target implements Monthly_forecast_targetInterface {
  "dt_id": number;
  "sph_id": number;
  "visitor_id": number;
  "visitor_type": string;
  "target_date": number;
  "target_label": string;
  "target_value": number;
  "status": number;
  "created_by": number;
  "created_date": number;
  "updated_by": number;
  "updated_date": number;
  constructor(data?: Monthly_forecast_targetInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Monthly_forecast_target`.
   */
  public static getModelName() {
    return "Monthly_forecast_target";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Monthly_forecast_target for dynamic purposes.
  **/
  public static factory(data: Monthly_forecast_targetInterface): Monthly_forecast_target{
    return new Monthly_forecast_target(data);
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
      name: 'Monthly_forecast_target',
      plural: 'Monthly_forecast_targets',
      path: 'Monthly_forecast_targets',
      idName: 'dt_id',
      properties: {
        "dt_id": {
          name: 'dt_id',
          type: 'number'
        },
        "sph_id": {
          name: 'sph_id',
          type: 'number'
        },
        "visitor_id": {
          name: 'visitor_id',
          type: 'number'
        },
        "visitor_type": {
          name: 'visitor_type',
          type: 'string'
        },
        "target_date": {
          name: 'target_date',
          type: 'number'
        },
        "target_label": {
          name: 'target_label',
          type: 'string'
        },
        "target_value": {
          name: 'target_value',
          type: 'number'
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
      },
      relations: {
      }
    }
  }
}
