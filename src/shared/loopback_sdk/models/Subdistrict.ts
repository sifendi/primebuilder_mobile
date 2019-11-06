/* tslint:disable */

declare var Object: any;
export interface SubdistrictInterface {
  "id"?: number;
  "municipality_id"?: number;
  "name"?: string;
  "status"?: number;
  "subdistrict_code"?: string;
  "created_date"?: number;
  "created_by"?: number;
  "updated_date"?: number;
  "updated_by"?: number;
}

export class Subdistrict implements SubdistrictInterface {
  "id": number;
  "municipality_id": number;
  "name": string;
  "status": number;
  "subdistrict_code": string;
  "created_date": number;
  "created_by": number;
  "updated_date": number;
  "updated_by": number;
  constructor(data?: SubdistrictInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Subdistrict`.
   */
  public static getModelName() {
    return "Subdistrict";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Subdistrict for dynamic purposes.
  **/
  public static factory(data: SubdistrictInterface): Subdistrict{
    return new Subdistrict(data);
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
      name: 'Subdistrict',
      plural: 'Subdistricts',
      path: 'Subdistricts',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "municipality_id": {
          name: 'municipality_id',
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
        "subdistrict_code": {
          name: 'subdistrict_code',
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
