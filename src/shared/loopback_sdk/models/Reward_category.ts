/* tslint:disable */

declare var Object: any;
export interface Reward_categoryInterface {
  "rew_category_id"?: number;
  "rew_category_name"?: string;
  "created_date"?: number;
  "updated_date"?: number;
  "created_by"?: number;
  "updated_by"?: number;
}

export class Reward_category implements Reward_categoryInterface {
  "rew_category_id": number;
  "rew_category_name": string;
  "created_date": number;
  "updated_date": number;
  "created_by": number;
  "updated_by": number;
  constructor(data?: Reward_categoryInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Reward_category`.
   */
  public static getModelName() {
    return "Reward_category";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Reward_category for dynamic purposes.
  **/
  public static factory(data: Reward_categoryInterface): Reward_category{
    return new Reward_category(data);
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
      name: 'Reward_category',
      plural: 'Reward_categories',
      path: 'Reward_categories',
      idName: 'rew_category_id',
      properties: {
        "rew_category_id": {
          name: 'rew_category_id',
          type: 'number'
        },
        "rew_category_name": {
          name: 'rew_category_name',
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
      },
      relations: {
      }
    }
  }
}
