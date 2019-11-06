/* tslint:disable */

declare var Object: any;
export interface Gps_loginInterface {
  "id"?: number;
  "user_id"?: number;
  "high_accuracy"?: string;
  "low_accuracy"?: string;
  "timestamp_before_position"?: string;
  "timestamp_after_position"?: string;
  "time_acquire_position"?: string;
  "network_type"?: string;
  "network_strength"?: string;
  "gps_accuracy"?: string;
  "mobile_os_version"?: string;
  "device_name"?: string;
  "device_hardware"?: string;
}

export class Gps_login implements Gps_loginInterface {
  "id": number;
  "user_id": number;
  "high_accuracy": string;
  "low_accuracy": string;
  "timestamp_before_position": string;
  "timestamp_after_position": string;
  "time_acquire_position": string;
  "network_type": string;
  "network_strength": string;
  "gps_accuracy": string;
  "mobile_os_version": string;
  "device_name": string;
  "device_hardware": string;
  constructor(data?: Gps_loginInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Gps_login`.
   */
  public static getModelName() {
    return "Gps_login";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Gps_login for dynamic purposes.
  **/
  public static factory(data: Gps_loginInterface): Gps_login{
    return new Gps_login(data);
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
      name: 'Gps_login',
      plural: 'Gps_logins',
      path: 'Gps_logins',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "user_id": {
          name: 'user_id',
          type: 'number'
        },
        "high_accuracy": {
          name: 'high_accuracy',
          type: 'string'
        },
        "low_accuracy": {
          name: 'low_accuracy',
          type: 'string'
        },
        "timestamp_before_position": {
          name: 'timestamp_before_position',
          type: 'string'
        },
        "timestamp_after_position": {
          name: 'timestamp_after_position',
          type: 'string'
        },
        "time_acquire_position": {
          name: 'time_acquire_position',
          type: 'string'
        },
        "network_type": {
          name: 'network_type',
          type: 'string'
        },
        "network_strength": {
          name: 'network_strength',
          type: 'string'
        },
        "gps_accuracy": {
          name: 'gps_accuracy',
          type: 'string'
        },
        "mobile_os_version": {
          name: 'mobile_os_version',
          type: 'string'
        },
        "device_name": {
          name: 'device_name',
          type: 'string'
        },
        "device_hardware": {
          name: 'device_hardware',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
