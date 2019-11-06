/* tslint:disable */

declare var Object: any;
export interface NotificationInterface {
  "alert"?: any;
  "badge"?: number;
  "category"?: string;
  "collapseKey"?: string;
  "contentAvailable"?: boolean;
  "created"?: Date;
  "delayWhileIdle"?: boolean;
  "deviceToken": string;
  "deviceType": string;
  "expirationInterval"?: number;
  "expirationTime"?: Date;
  "modified"?: Date;
  "scheduledTime"?: Date;
  "sound"?: string;
  "status"?: string;
  "urlArgs"?: Array<any>;
  "id"?: number;
}

export class Notification implements NotificationInterface {
  "alert": any;
  "badge": number;
  "category": string;
  "collapseKey": string;
  "contentAvailable": boolean;
  "created": Date;
  "delayWhileIdle": boolean;
  "deviceToken": string;
  "deviceType": string;
  "expirationInterval": number;
  "expirationTime": Date;
  "modified": Date;
  "scheduledTime": Date;
  "sound": string;
  "status": string;
  "urlArgs": Array<any>;
  "id": number;
  constructor(data?: NotificationInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Notification`.
   */
  public static getModelName() {
    return "Notification";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Notification for dynamic purposes.
  **/
  public static factory(data: NotificationInterface): Notification{
    return new Notification(data);
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
      name: 'Notification',
      plural: 'Notifications',
      path: 'Notifications',
      idName: 'id',
      properties: {
        "alert": {
          name: 'alert',
          type: 'any'
        },
        "badge": {
          name: 'badge',
          type: 'number'
        },
        "category": {
          name: 'category',
          type: 'string'
        },
        "collapseKey": {
          name: 'collapseKey',
          type: 'string'
        },
        "contentAvailable": {
          name: 'contentAvailable',
          type: 'boolean'
        },
        "created": {
          name: 'created',
          type: 'Date'
        },
        "delayWhileIdle": {
          name: 'delayWhileIdle',
          type: 'boolean'
        },
        "deviceToken": {
          name: 'deviceToken',
          type: 'string'
        },
        "deviceType": {
          name: 'deviceType',
          type: 'string'
        },
        "expirationInterval": {
          name: 'expirationInterval',
          type: 'number'
        },
        "expirationTime": {
          name: 'expirationTime',
          type: 'Date'
        },
        "modified": {
          name: 'modified',
          type: 'Date'
        },
        "scheduledTime": {
          name: 'scheduledTime',
          type: 'Date'
        },
        "sound": {
          name: 'sound',
          type: 'string'
        },
        "status": {
          name: 'status',
          type: 'string'
        },
        "urlArgs": {
          name: 'urlArgs',
          type: 'Array&lt;any&gt;'
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
