/* tslint:disable */

declare var Object: any;
export interface MunicipalityInterface {
  "id"?: number;
  "district_id"?: number;
  "name"?: string;
  "status"?: number;
  "municipality_code"?: string;
  "created_date"?: number;
  "created_by"?: number;
  "updated_date"?: number;
  "updated_by"?: number;
}

export class Municipality implements MunicipalityInterface {
  "id": number;
  "district_id": number;
  "name": string;
  "status": number;
  "municipality_code": string;
  "created_date": number;
  "created_by": number;
  "updated_date": number;
  "updated_by": number;
  constructor(data?: MunicipalityInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Municipality`.
   */
  public static getModelName() {
    return "Municipality";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Municipality for dynamic purposes.
  **/
  public static factory(data: MunicipalityInterface): Municipality{
    return new Municipality(data);
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
      name: 'Municipality',
      plural: 'Municipalities',
      path: 'Municipalities',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "district_id": {
          name: 'district_id',
          type: 'number'
        },
        "name": {
          name: 'name',
          type: 'string'
        },
        "status": {
          name: 'status',
          type: 'number'
        },
        "municipality_code": {
          name: 'municipality_code',
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
