/* tslint:disable */

declare var Object: any;
export interface Cement_bag_removals_tblInterface {
  "id"?: number;
  "district_id"?: number;
  "from_date"?: number;
  "to_date"?: number;
  "quantity"?: number;
  "location_name"?: string;
  "address"?: string;
  "postal_code"?: string;
  "province"?: string;
  "city"?: string;
  "sub_district"?: string;
  "witness_name"?: string;
  "witness_designation"?: string;
  "additional_comments"?: string;
  "attach_picture"?: string;
  "digital_sign"?: string;
  "created_date"?: number;
  "updated_date"?: number;
  "created_by"?: number;
  "updated_by"?: number;
}

export class Cement_bag_removals_tbl implements Cement_bag_removals_tblInterface {
  "id": number;
  "district_id": number;
  "from_date": number;
  "to_date": number;
  "quantity": number;
  "location_name": string;
  "address": string;
  "postal_code": string;
  "province": string;
  "city": string;
  "sub_district": string;
  "witness_name": string;
  "witness_designation": string;
  "additional_comments": string;
  "attach_picture": string;
  "digital_sign": string;
  "created_date": number;
  "updated_date": number;
  "created_by": number;
  "updated_by": number;
  constructor(data?: Cement_bag_removals_tblInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Cement_bag_removals_tbl`.
   */
  public static getModelName() {
    return "Cement_bag_removals_tbl";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Cement_bag_removals_tbl for dynamic purposes.
  **/
  public static factory(data: Cement_bag_removals_tblInterface): Cement_bag_removals_tbl{
    return new Cement_bag_removals_tbl(data);
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
      name: 'Cement_bag_removals_tbl',
      plural: 'Cement_bag_removals_tbls',
      path: 'Cement_bag_removals_tbls',
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
        "from_date": {
          name: 'from_date',
          type: 'number'
        },
        "to_date": {
          name: 'to_date',
          type: 'number'
        },
        "quantity": {
          name: 'quantity',
          type: 'number'
        },
        "location_name": {
          name: 'location_name',
          type: 'string'
        },
        "address": {
          name: 'address',
          type: 'string'
        },
        "postal_code": {
          name: 'postal_code',
          type: 'string'
        },
        "province": {
          name: 'province',
          type: 'string'
        },
        "city": {
          name: 'city',
          type: 'string'
        },
        "sub_district": {
          name: 'sub_district',
          type: 'string'
        },
        "witness_name": {
          name: 'witness_name',
          type: 'string'
        },
        "witness_designation": {
          name: 'witness_designation',
          type: 'string'
        },
        "additional_comments": {
          name: 'additional_comments',
          type: 'string'
        },
        "attach_picture": {
          name: 'attach_picture',
          type: 'string'
        },
        "digital_sign": {
          name: 'digital_sign',
          type: 'string'
        },
        "created_date": {
          name: 'created_date',
          type: 'number'
        },
        "updated_date": {
          name: 'updated_date',
          type: 'number'
        },
        "created_by": {
          name: 'created_by',
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
