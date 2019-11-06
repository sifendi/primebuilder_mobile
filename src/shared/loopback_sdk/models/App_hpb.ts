/* tslint:disable */

declare var Object: any;
export interface App_hpbInterface {
  "hpb_id"?: number;
  "uid"?: number;
  "hpb_name": string;
  "hpb_type": string;
  "hpb_profile_pic": string;
  "primary_mobile_no": string;
  "secondary_mobile_no"?: string;
  "hpb_email"?: string;
  "place_of_birth"?: string;
  "date_of_birth"?: number;
  "id_photo"?: string;
  "id_card_number"?: string;
  "id_card_address"?: string;
  "id_card_province"?: string;
  "id_card_city"?: string;
  "id_card_sub_district"?: string;
  "id_card_pincode": number;
  "domicile_same_as_id_card": number;
  "domicile_address"?: string;
  "domicile_province"?: string;
  "domicile_city"?: string;
  "domicile_sub_district"?: string;
  "domicile_pincode"?: number;
  "company_name"?: string;
  "company_representative_name"?: string;
  "company_designation"?: string;
  "hpb_status"?: string;
  "hpb_digital_sign"?: string;
  "additional_comments"?: string;
  "latitude"?: string;
  "longitude"?: string;
  "created_date"?: number;
  "created_by"?: number;
  "updated_date"?: number;
  "updated_by"?: number;
  "assigned_to"?: number;
  "generated_by"?: number;
  "status"?: number;
  "local_created_date"?: number;
  "local_updated_date"?: number;
}

export class App_hpb implements App_hpbInterface {
  "hpb_id": number;
  "uid": number;
  "hpb_name": string;
  "hpb_type": string;
  "hpb_profile_pic": string;
  "primary_mobile_no": string;
  "secondary_mobile_no": string;
  "hpb_email": string;
  "place_of_birth": string;
  "date_of_birth": number;
  "id_photo": string;
  "id_card_number": string;
  "id_card_address": string;
  "id_card_province": string;
  "id_card_city": string;
  "id_card_sub_district": string;
  "id_card_pincode": number;
  "domicile_same_as_id_card": number;
  "domicile_address": string;
  "domicile_province": string;
  "domicile_city": string;
  "domicile_sub_district": string;
  "domicile_pincode": number;
  "company_name": string;
  "company_representative_name": string;
  "company_designation": string;
  "hpb_status": string;
  "hpb_digital_sign": string;
  "additional_comments": string;
  "latitude": string;
  "longitude": string;
  "created_date": number;
  "created_by": number;
  "updated_date": number;
  "updated_by": number;
  "assigned_to": number;
  "generated_by": number;
  "status": number;
  "local_created_date": number;
  "local_updated_date": number;
  constructor(data?: App_hpbInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `App_hpb`.
   */
  public static getModelName() {
    return "App_hpb";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of App_hpb for dynamic purposes.
  **/
  public static factory(data: App_hpbInterface): App_hpb{
    return new App_hpb(data);
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
      name: 'App_hpb',
      plural: 'app_hpb',
      path: 'app_hpb',
      idName: 'hpb_id',
      properties: {
        "hpb_id": {
          name: 'hpb_id',
          type: 'number'
        },
        "uid": {
          name: 'uid',
          type: 'number'
        },
        "hpb_name": {
          name: 'hpb_name',
          type: 'string'
        },
        "hpb_type": {
          name: 'hpb_type',
          type: 'string'
        },
        "hpb_profile_pic": {
          name: 'hpb_profile_pic',
          type: 'string'
        },
        "primary_mobile_no": {
          name: 'primary_mobile_no',
          type: 'string'
        },
        "secondary_mobile_no": {
          name: 'secondary_mobile_no',
          type: 'string'
        },
        "hpb_email": {
          name: 'hpb_email',
          type: 'string'
        },
        "place_of_birth": {
          name: 'place_of_birth',
          type: 'string'
        },
        "date_of_birth": {
          name: 'date_of_birth',
          type: 'number'
        },
        "id_photo": {
          name: 'id_photo',
          type: 'string'
        },
        "id_card_number": {
          name: 'id_card_number',
          type: 'string'
        },
        "id_card_address": {
          name: 'id_card_address',
          type: 'string'
        },
        "id_card_province": {
          name: 'id_card_province',
          type: 'string'
        },
        "id_card_city": {
          name: 'id_card_city',
          type: 'string'
        },
        "id_card_sub_district": {
          name: 'id_card_sub_district',
          type: 'string'
        },
        "id_card_pincode": {
          name: 'id_card_pincode',
          type: 'number'
        },
        "domicile_same_as_id_card": {
          name: 'domicile_same_as_id_card',
          type: 'number'
        },
        "domicile_address": {
          name: 'domicile_address',
          type: 'string'
        },
        "domicile_province": {
          name: 'domicile_province',
          type: 'string'
        },
        "domicile_city": {
          name: 'domicile_city',
          type: 'string'
        },
        "domicile_sub_district": {
          name: 'domicile_sub_district',
          type: 'string'
        },
        "domicile_pincode": {
          name: 'domicile_pincode',
          type: 'number'
        },
        "company_name": {
          name: 'company_name',
          type: 'string'
        },
        "company_representative_name": {
          name: 'company_representative_name',
          type: 'string'
        },
        "company_designation": {
          name: 'company_designation',
          type: 'string'
        },
        "hpb_status": {
          name: 'hpb_status',
          type: 'string'
        },
        "hpb_digital_sign": {
          name: 'hpb_digital_sign',
          type: 'string'
        },
        "additional_comments": {
          name: 'additional_comments',
          type: 'string'
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
        "assigned_to": {
          name: 'assigned_to',
          type: 'number'
        },
        "generated_by": {
          name: 'generated_by',
          type: 'number'
        },
        "status": {
          name: 'status',
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
      },
      relations: {
      }
    }
  }
}
