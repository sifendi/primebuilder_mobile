/* tslint:disable */

declare var Object: any;
export interface RegionInterface {
  "id"?: number;
  "name"?: string;
  "region_code"?: string;
  "status"?: number;
  "created_date"?: number;
  "created_by"?: number;
  "updated_date"?: number;
  "updated_by"?: number;
}

export class Region implements RegionInterface {
  "id": number;
  "name": string;
  "region_code": string;
  "status": number;
  "created_date": number;
  "created_by": number;
  "updated_date": number;
  "updated_by": number;
  constructor(data?: RegionInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Region`.
   */
  public static getModelName() {
    return "Region";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Region for dynamic purposes.
  **/
  public static factory(data: RegionInterface): Region{
    return new Region(data);
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
      name: 'Region',
      plural: 'Regions',
      path: 'Regions',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "name": {
          name: 'name',
          type: 'string'
        },
        "region_code": {
          name: 'region_code',
          type: 'string'
        },
        "status": {
          name: 'status',
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
      },
      relations: {
      }
    }
  }
}
