/* tslint:disable */

declare var Object: any;
export interface Eap_share_momentsInterface {
  "moment_id"?: number;
  "moment_lead_id"?: number;
  "moment_social_media_type"?: string;
  "moment_share_date"?: number;
  "moment_description"?: string;
  "moment_photos"?: string;
  "created_by"?: number;
  "created_date"?: number;
  "updated_by"?: number;
  "updated_date"?: number;
  "local_created_date"?: number;
  "local_updated_date"?: number;
  "status"?: number;
  "id"?: number;
}

export class Eap_share_moments implements Eap_share_momentsInterface {
  "moment_id": number;
  "moment_lead_id": number;
  "moment_social_media_type": string;
  "moment_share_date": number;
  "moment_description": string;
  "moment_photos": string;
  "created_by": number;
  "created_date": number;
  "updated_by": number;
  "updated_date": number;
  "local_created_date": number;
  "local_updated_date": number;
  "status": number;
  "id": number;
  constructor(data?: Eap_share_momentsInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Eap_share_moments`.
   */
  public static getModelName() {
    return "Eap_share_moments";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Eap_share_moments for dynamic purposes.
  **/
  public static factory(data: Eap_share_momentsInterface): Eap_share_moments{
    return new Eap_share_moments(data);
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
      name: 'Eap_share_moments',
      plural: 'Eap_share_moments',
      path: 'Eap_share_moments',
      idName: 'id',
      properties: {
        "moment_id": {
          name: 'moment_id',
          type: 'number'
        },
        "moment_lead_id": {
          name: 'moment_lead_id',
          type: 'number'
        },
        "moment_social_media_type": {
          name: 'moment_social_media_type',
          type: 'string'
        },
        "moment_share_date": {
          name: 'moment_share_date',
          type: 'number'
        },
        "moment_description": {
          name: 'moment_description',
          type: 'string'
        },
        "moment_photos": {
          name: 'moment_photos',
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
