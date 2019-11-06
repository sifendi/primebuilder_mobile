/* tslint:disable */

declare var Object: any;
export interface DistrictInterface {
  "id"?: number;
  "province_id"?: number;
  "name"?: string;
  "status"?: number;
  "district_code"?: string;
  "created_date"?: number;
  "created_by"?: number;
  "updated_date"?: number;
  "updated_by"?: number;
}

export class District implements DistrictInterface {
  "id": number;
  "province_id": number;
  "name": string;
  "status": number;
  "district_code": string;
  "created_date": number;
  "created_by": number;
  "updated_date": number;
  "updated_by": number;
  constructor(data?: DistrictInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `District`.
   */
  public static getModelName() {
    return "District";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of District for dynamic purposes.
  **/
  public static factory(data: DistrictInterface): District{
    return new District(data);
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
      name: 'District',
      plural: 'Districts',
      path: 'Districts',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "province_id": {
          name: 'province_id',
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
        "district_code": {
          name: 'district_code',
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
