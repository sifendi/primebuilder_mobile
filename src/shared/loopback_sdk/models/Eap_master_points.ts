/* tslint:disable */

declare var Object: any;
export interface Eap_master_pointsInterface {
  "point_id": number;
  "point_type"?: string;
  "points"?: number;
  "status"?: number;
  "created_by"?: number;
  "created_date"?: number;
  "updated_by"?: number;
  "updated_date"?: number;
  "id"?: number;
}

export class Eap_master_points implements Eap_master_pointsInterface {
  "point_id": number;
  "point_type": string;
  "points": number;
  "status": number;
  "created_by": number;
  "created_date": number;
  "updated_by": number;
  "updated_date": number;
  "id": number;
  constructor(data?: Eap_master_pointsInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Eap_master_points`.
   */
  public static getModelName() {
    return "Eap_master_points";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Eap_master_points for dynamic purposes.
  **/
  public static factory(data: Eap_master_pointsInterface): Eap_master_points{
    return new Eap_master_points(data);
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
      name: 'Eap_master_points',
      plural: 'Eap_master_points',
      path: 'Eap_master_points',
      idName: 'id',
      properties: {
        "point_id": {
          name: 'point_id',
          type: 'number'
        },
        "point_type": {
          name: 'point_type',
          type: 'string'
        },
        "points": {
          name: 'points',
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
