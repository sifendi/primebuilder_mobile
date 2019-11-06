/* tslint:disable */

declare var Object: any;
export interface Eap_support_chatInterface {
  "chat_id"?: number;
  "chat_from_id"?: number;
  "chat_mesage"?: string;
  "chat_lead_id"?: number;
  "created_date"?: number;
  "status"?: number;
  "local_created_date"?: number;
  "local_updated_date"?: number;
  "id"?: number;
}

export class Eap_support_chat implements Eap_support_chatInterface {
  "chat_id": number;
  "chat_from_id": number;
  "chat_mesage": string;
  "chat_lead_id": number;
  "created_date": number;
  "status": number;
  "local_created_date": number;
  "local_updated_date": number;
  "id": number;
  constructor(data?: Eap_support_chatInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Eap_support_chat`.
   */
  public static getModelName() {
    return "Eap_support_chat";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Eap_support_chat for dynamic purposes.
  **/
  public static factory(data: Eap_support_chatInterface): Eap_support_chat{
    return new Eap_support_chat(data);
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
      name: 'Eap_support_chat',
      plural: 'Eap_support_chats',
      path: 'Eap_support_chats',
      idName: 'id',
      properties: {
        "chat_id": {
          name: 'chat_id',
          type: 'number'
        },
        "chat_from_id": {
          name: 'chat_from_id',
          type: 'number'
        },
        "chat_mesage": {
          name: 'chat_mesage',
          type: 'string'
        },
        "chat_lead_id": {
          name: 'chat_lead_id',
          type: 'number'
        },
        "created_date": {
          name: 'created_date',
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
