/* tslint:disable */

declare var Object: any;
export interface Eap_refer_customerInterface {
  "refer_id"?: number;
  "refer_via"?: number;
  "refer_name"?: string;
  "refer_address"?: string;
  "refer_mobile"?: string;
  "refer_photos"?: string;
  "created_by"?: number;
  "created_date"?: number;
  "updated_by"?: number;
  "updated_date"?: number;
  "local_created_date"?: number;
  "local_updated_date"?: number;
  "status"?: number;
}

export class Eap_refer_customer implements Eap_refer_customerInterface {
  "refer_id": number;
  "refer_via": number;
  "refer_name": string;
  "refer_address": string;
  "refer_mobile": string;
  "refer_photos": string;
  "created_by": number;
  "created_date": number;
  "updated_by": number;
  "updated_date": number;
  "local_created_date": number;
  "local_updated_date": number;
  "status": number;
  constructor(data?: Eap_refer_customerInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Eap_refer_customer`.
   */
  public static getModelName() {
    return "Eap_refer_customer";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Eap_refer_customer for dynamic purposes.
  **/
  public static factory(data: Eap_refer_customerInterface): Eap_refer_customer{
    return new Eap_refer_customer(data);
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
      name: 'Eap_refer_customer',
      plural: 'Eap_refer_customers',
      path: 'Eap_refer_customers',
      idName: 'refer_id',
      properties: {
        "refer_id": {
          name: 'refer_id',
          type: 'number'
        },
        "refer_via": {
          name: 'refer_via',
          type: 'number'
        },
        "refer_name": {
          name: 'refer_name',
          type: 'string'
        },
        "refer_address": {
          name: 'refer_address',
          type: 'string'
        },
        "refer_mobile": {
          name: 'refer_mobile',
          type: 'string'
        },
        "refer_photos": {
          name: 'refer_photos',
          type: 'string'
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
        "local_created_date": {
          name: 'local_created_date',
          type: 'number'
        },
        "local_updated_date": {
          name: 'local_updated_date',
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
