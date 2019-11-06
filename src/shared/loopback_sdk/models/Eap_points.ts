/* tslint:disable */

declare var Object: any;
export interface Eap_pointsInterface {
  "point_id"?: number;
  "user_id"?: number;
  "activity_type_id"?: number;
  "activity_type"?: string;
  "points"?: number;
  "created_date"?: number;
  "created_by"?: number;
  "updated_date"?: number;
  "updated_by"?: number;
  "status"?: number;
  "id"?: number;
}

export class Eap_points implements Eap_pointsInterface {
  "point_id": number;
  "user_id": number;
  "activity_type_id": number;
  "activity_type": string;
  "points": number;
  "created_date": number;
  "created_by": number;
  "updated_date": number;
  "updated_by": number;
  "status": number;
  "id": number;
  constructor(data?: Eap_pointsInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Eap_points`.
   */
  public static getModelName() {
    return "Eap_points";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Eap_points for dynamic purposes.
  **/
  public static factory(data: Eap_pointsInterface): Eap_points{
    return new Eap_points(data);
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
      name: 'Eap_points',
      plural: 'Eap_points',
      path: 'Eap_points',
      idName: 'id',
      properties: {
        "point_id": {
          name: 'point_id',
          type: 'number'
        },
        "user_id": {
          name: 'user_id',
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
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
