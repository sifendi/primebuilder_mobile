/* tslint:disable */

declare var Object: any;
export interface Eap_master_social_mediaInterface {
  "social_id"?: number;
  "social_name"?: string;
  "created_date"?: number;
  "updated_date"?: number;
  "created_by"?: number;
  "updated_by"?: number;
  "status"?: number;
  "id"?: number;
}

export class Eap_master_social_media implements Eap_master_social_mediaInterface {
  "social_id": number;
  "social_name": string;
  "created_date": number;
  "updated_date": number;
  "created_by": number;
  "updated_by": number;
  "status": number;
  "id": number;
  constructor(data?: Eap_master_social_mediaInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Eap_master_social_media`.
   */
  public static getModelName() {
    return "Eap_master_social_media";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Eap_master_social_media for dynamic purposes.
  **/
  public static factory(data: Eap_master_social_mediaInterface): Eap_master_social_media{
    return new Eap_master_social_media(data);
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
      name: 'Eap_master_social_media',
      plural: 'Eap_master_social_media',
      path: 'Eap_master_social_media',
      idName: 'id',
      properties: {
        "social_id": {
          name: 'social_id',
          type: 'number'
        },
        "social_name": {
          name: 'social_name',
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
