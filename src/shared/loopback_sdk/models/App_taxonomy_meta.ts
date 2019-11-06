/* tslint:disable */

declare var Object: any;
export interface App_taxonomy_metaInterface {
  "tid": number;
  "tm_key": string;
  "tm_value"?: string;
  "status"?: number;
  "id"?: number;
}

export class App_taxonomy_meta implements App_taxonomy_metaInterface {
  "tid": number;
  "tm_key": string;
  "tm_value": string;
  "status": number;
  "id": number;
  constructor(data?: App_taxonomy_metaInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `App_taxonomy_meta`.
   */
  public static getModelName() {
    return "App_taxonomy_meta";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of App_taxonomy_meta for dynamic purposes.
  **/
  public static factory(data: App_taxonomy_metaInterface): App_taxonomy_meta{
    return new App_taxonomy_meta(data);
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
      name: 'App_taxonomy_meta',
      plural: 'app_taxonomy_meta',
      path: 'app_taxonomy_meta',
      idName: 'id',
      properties: {
        "tid": {
          name: 'tid',
          type: 'number'
        },
        "tm_key": {
          name: 'tm_key',
          type: 'string'
        },
        "tm_value": {
          name: 'tm_value',
          type: 'string'
        },
        "status": {
          name: 'status',
          type: 'number',
          default: 1
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
