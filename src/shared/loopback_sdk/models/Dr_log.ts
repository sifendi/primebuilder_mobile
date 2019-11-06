/* tslint:disable */

declare var Object: any;
export interface Dr_logInterface {
  "dr_id"?: number;
  "userid"?: string;
  "password"?: string;
  "sender"?: string;
  "messageId"?: number;
  "delivery_status"?: number;
  "date_hit"?: string;
  "date_received"?: string;
  "created_date"?: number;
}

export class Dr_log implements Dr_logInterface {
  "dr_id": number;
  "userid": string;
  "password": string;
  "sender": string;
  "messageId": number;
  "delivery_status": number;
  "date_hit": string;
  "date_received": string;
  "created_date": number;
  constructor(data?: Dr_logInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Dr_log`.
   */
  public static getModelName() {
    return "Dr_log";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Dr_log for dynamic purposes.
  **/
  public static factory(data: Dr_logInterface): Dr_log{
    return new Dr_log(data);
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
      name: 'Dr_log',
      plural: 'Dr_logs',
      path: 'Dr_logs',
      idName: 'dr_id',
      properties: {
        "dr_id": {
          name: 'dr_id',
          type: 'number'
        },
        "userid": {
          name: 'userid',
          type: 'string'
        },
        "password": {
          name: 'password',
          type: 'string'
        },
        "sender": {
          name: 'sender',
          type: 'string'
        },
        "messageId": {
          name: 'messageId',
          type: 'number'
        },
        "delivery_status": {
          name: 'delivery_status',
          type: 'number'
        },
        "date_hit": {
          name: 'date_hit',
          type: 'string'
        },
        "date_received": {
          name: 'date_received',
          type: 'string'
        },
        "created_date": {
          name: 'created_date',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
