/* tslint:disable */

declare var Object: any;
export interface Eap_leadInterface {
  "lead_id"?: number;
  "lead_segment"?: number;
  "lead_status"?: string;
  "lead_refer_id"?: number;
  "lead_name"?: string;
  "lead_mobile"?: string;
  "lead_visit_date"?: number;
  "lead_photos"?: string;
  "lead_postal_code"?: string;
  "lead_province"?: string;
  "lead_city"?: string;
  "lead_sub_district"?: string;
  "lead_address"?: string;
  "lead_interview_result"?: string;
  "lead_support_ac"?: number;
  "lead_support_telesales"?: number;
  "latitude"?: string;
  "longitude"?: string;
  "created_date"?: number;
  "updated_date"?: number;
  "created_by"?: number;
  "updated_by"?: number;
  "local_created_date"?: number;
  "local_updated_date"?: number;
  "status"?: number;
}

export class Eap_lead implements Eap_leadInterface {
  "lead_id": number;
  "lead_segment": number;
  "lead_status": string;
  "lead_refer_id": number;
  "lead_name": string;
  "lead_mobile": string;
  "lead_visit_date": number;
  "lead_photos": string;
  "lead_postal_code": string;
  "lead_province": string;
  "lead_city": string;
  "lead_sub_district": string;
  "lead_address": string;
  "lead_interview_result": string;
  "lead_support_ac": number;
  "lead_support_telesales": number;
  "latitude": string;
  "longitude": string;
  "created_date": number;
  "updated_date": number;
  "created_by": number;
  "updated_by": number;
  "local_created_date": number;
  "local_updated_date": number;
  "status": number;
  constructor(data?: Eap_leadInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Eap_lead`.
   */
  public static getModelName() {
    return "Eap_lead";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Eap_lead for dynamic purposes.
  **/
  public static factory(data: Eap_leadInterface): Eap_lead{
    return new Eap_lead(data);
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
      name: 'Eap_lead',
      plural: 'eap_lead',
      path: 'eap_lead',
      idName: 'lead_id',
      properties: {
        "lead_id": {
          name: 'lead_id',
          type: 'number'
        },
        "lead_segment": {
          name: 'lead_segment',
          type: 'number'
        },
        "lead_status": {
          name: 'lead_status',
          type: 'string'
        },
        "lead_refer_id": {
          name: 'lead_refer_id',
          type: 'number'
        },
        "lead_name": {
          name: 'lead_name',
          type: 'string'
        },
        "lead_mobile": {
          name: 'lead_mobile',
          type: 'string'
        },
        "lead_visit_date": {
          name: 'lead_visit_date',
          type: 'number'
        },
        "lead_photos": {
          name: 'lead_photos',
          type: 'string'
        },
        "lead_postal_code": {
          name: 'lead_postal_code',
          type: 'string'
        },
        "lead_province": {
          name: 'lead_province',
          type: 'string'
        },
        "lead_city": {
          name: 'lead_city',
          type: 'string'
        },
        "lead_sub_district": {
          name: 'lead_sub_district',
          type: 'string'
        },
        "lead_address": {
          name: 'lead_address',
          type: 'string'
        },
        "lead_interview_result": {
          name: 'lead_interview_result',
          type: 'string'
        },
        "lead_support_ac": {
          name: 'lead_support_ac',
          type: 'number'
        },
        "lead_support_telesales": {
          name: 'lead_support_telesales',
          type: 'number'
        },
        "latitude": {
          name: 'latitude',
          type: 'string'
        },
        "longitude": {
          name: 'longitude',
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
