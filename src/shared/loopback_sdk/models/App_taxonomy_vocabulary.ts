/* tslint:disable */

declare var Object: any;
export interface App_taxonomy_vocabularyInterface {
  "vid"?: number;
  "name": string;
  "machine_name": string;
  "description"?: string;
  "weight"?: number;
  "status"?: number;
}

export class App_taxonomy_vocabulary implements App_taxonomy_vocabularyInterface {
  "vid": number;
  "name": string;
  "machine_name": string;
  "description": string;
  "weight": number;
  "status": number;
  constructor(data?: App_taxonomy_vocabularyInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `App_taxonomy_vocabulary`.
   */
  public static getModelName() {
    return "App_taxonomy_vocabulary";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of App_taxonomy_vocabulary for dynamic purposes.
  **/
  public static factory(data: App_taxonomy_vocabularyInterface): App_taxonomy_vocabulary{
    return new App_taxonomy_vocabulary(data);
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
      name: 'App_taxonomy_vocabulary',
      plural: 'app_taxonomy_vocabulary',
      path: 'app_taxonomy_vocabulary',
      idName: 'vid',
      properties: {
        "vid": {
          name: 'vid',
          type: 'number'
        },
        "name": {
          name: 'name',
          type: 'string'
        },
        "machine_name": {
          name: 'machine_name',
          type: 'string'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "weight": {
          name: 'weight',
          type: 'number',
          default: 1
        },
        "status": {
          name: 'status',
          type: 'number',
          default: 1
        },
      },
      relations: {
      }
    }
  }
}
