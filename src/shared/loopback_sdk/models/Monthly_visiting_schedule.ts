/* tslint:disable */

declare var Object: any;
export interface Monthly_visiting_scheduleInterface {
  "dv_id"?: number;
  "sph_id"?: number;
  "visitor_id"?: number;
  "visit_date"?: string;
  "visitor_type"?: string;
  "status"?: number;
  "created_by"?: number;
  "created_date"?: number;
  "updated_by"?: number;
  "updated_date"?: number;
}

export class Monthly_visiting_schedule implements Monthly_visiting_scheduleInterface {
  "dv_id": number;
  "sph_id": number;
  "visitor_id": number;
  "visit_date": string;
  "visitor_type": string;
  "status": number;
  "created_by": number;
  "created_date": number;
  "updated_by": number;
  "updated_date": number;
  constructor(data?: Monthly_visiting_scheduleInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Monthly_visiting_schedule`.
   */
  public static getModelName() {
    return "Monthly_visiting_schedule";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Monthly_visiting_schedule for dynamic purposes.
  **/
  public static factory(data: Monthly_visiting_scheduleInterface): Monthly_visiting_schedule{
    return new Monthly_visiting_schedule(data);
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
      name: 'Monthly_visiting_schedule',
      plural: 'Monthly_visiting_schedules',
      path: 'Monthly_visiting_schedules',
      idName: 'dv_id',
      properties: {
        "dv_id": {
          name: 'dv_id',
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
        "visit_date": {
          name: 'visit_date',
          type: 'string'
        },
        "visitor_type": {
          name: 'visitor_type',
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
      },
      relations: {
      }
    }
  }
}
