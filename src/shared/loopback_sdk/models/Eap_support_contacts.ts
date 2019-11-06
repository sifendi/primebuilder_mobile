/* tslint:disable */

declare var Object: any;
export interface Eap_support_contactsInterface {
  "id"?: number;
  "title"?: string;
  "name"?: string;
  "city_id"?: number;
  "email"?: string;
  "mobile"?: string;
  "support_type"?: string;
  "status"?: number;
  "created_at"?: number;
  "created_by"?: any;
}

export class Eap_support_contacts implements Eap_support_contactsInterface {
  "id": number;
  "title": string;
  "name": string;
  "city_id": number;
  "email": string;
  "mobile": string;
  "support_type": string;
  "status": number;
  "created_at": number;
  "created_by": any;
  constructor(data?: Eap_support_contactsInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Eap_support_contacts`.
   */
  public static getModelName() {
    return "Eap_support_contacts";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Eap_support_contacts for dynamic purposes.
  **/
  public static factory(data: Eap_support_contactsInterface): Eap_support_contacts{
    return new Eap_support_contacts(data);
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
      name: 'Eap_support_contacts',
      plural: 'Eap_support_contacts',
      path: 'Eap_support_contacts',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "title": {
          name: 'title',
          type: 'string'
        },
        "name": {
          name: 'name',
          type: 'string'
        },
        "city_id": {
          name: 'city_id',
          type: 'number'
        },
        "email": {
          name: 'email',
          type: 'string'
        },
        "mobile": {
          name: 'mobile',
          type: 'string'
        },
        "support_type": {
          name: 'support_type',
          type: 'string'
        },
        "status": {
          name: 'status',
          type: 'number'
        },
        "created_at": {
          name: 'created_at',
          type: 'number'
        },
        "created_by": {
          name: 'created_by',
          type: 'any'
        },
      },
      relations: {
      }
    }
  }
}
