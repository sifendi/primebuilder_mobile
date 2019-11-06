/* tslint:disable */

declare var Object: any;
export interface Monthly_statsInterface {
  "stat_id"?: number;
  "stat_date"?: string;
  "sph_id"?: number;
  "target_for"?: string;
  "monthly_target"?: number;
  "achieved_target"?: number;
  "remaining_target"?: number;
  "todays_target"?: number;
  "estimated_target"?: number;
  "created_date"?: number;
  "updated_date"?: number;
}

export class Monthly_stats implements Monthly_statsInterface {
  "stat_id": number;
  "stat_date": string;
  "sph_id": number;
  "target_for": string;
  "monthly_target": number;
  "achieved_target": number;
  "remaining_target": number;
  "todays_target": number;
  "estimated_target": number;
  "created_date": number;
  "updated_date": number;
  constructor(data?: Monthly_statsInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Monthly_stats`.
   */
  public static getModelName() {
    return "Monthly_stats";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Monthly_stats for dynamic purposes.
  **/
  public static factory(data: Monthly_statsInterface): Monthly_stats{
    return new Monthly_stats(data);
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
      name: 'Monthly_stats',
      plural: 'Monthly_stats',
      path: 'Monthly_stats',
      idName: 'stat_id',
      properties: {
        "stat_id": {
          name: 'stat_id',
          type: 'number'
        },
        "stat_date": {
          name: 'stat_date',
          type: 'string'
        },
        "sph_id": {
          name: 'sph_id',
          type: 'number'
        },
        "target_for": {
          name: 'target_for',
          type: 'string'
        },
        "monthly_target": {
          name: 'monthly_target',
          type: 'number'
        },
        "achieved_target": {
          name: 'achieved_target',
          type: 'number'
        },
        "remaining_target": {
          name: 'remaining_target',
          type: 'number'
        },
        "todays_target": {
          name: 'todays_target',
          type: 'number'
        },
        "estimated_target": {
          name: 'estimated_target',
          type: 'number'
        },
        "created_date": {
          name: 'created_date',
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
