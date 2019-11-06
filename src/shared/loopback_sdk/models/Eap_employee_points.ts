/* tslint:disable */

declare var Object: any;
export interface Eap_employee_pointsInterface {
  "point_id"?: number;
  "lead_id"?: number;
  "activity_type_id"?: number;
  "activity_type"?: string;
  "points"?: number;
  "created_date"?: number;
  "created_by"?: number;
  "updated_date"?: number;
  "updated_by"?: number;
  "status"?: number;
}

export class Eap_employee_points implements Eap_employee_pointsInterface {
  "point_id": number;
  "lead_id": number;
  "activity_type_id": number;
  "activity_type": string;
  "points": number;
  "created_date": number;
  "created_by": number;
  "updated_date": number;
  "updated_by": number;
  "status": number;
  constructor(data?: Eap_employee_pointsInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Eap_employee_points`.
   */
  public static getModelName() {
    return "Eap_employee_points";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Eap_employee_points for dynamic purposes.
  **/
  public static factory(data: Eap_employee_pointsInterface): Eap_employee_points{
    return new Eap_employee_points(data);
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
      name: 'Eap_employee_points',
      plural: 'Eap_employee_points',
      path: 'Eap_employee_points',
      idName: 'point_id',
      properties: {
        "point_id": {
          name: 'point_id',
          type: 'number'
        },
        "lead_id": {
          name: 'lead_id',
          type: 'number'
        },
        "activity_type_id": {
          name: 'activity_type_id',
          type: 'number'
        },
        "activity_type": {
          name: 'activity_type',
          type: 'string'
        },
        "points": {
          name: 'points',
          type: 'number'
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
        "status": {
          name: 'status',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
