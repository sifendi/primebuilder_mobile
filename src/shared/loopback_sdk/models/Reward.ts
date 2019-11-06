/* tslint:disable */

declare var Object: any;
export interface RewardInterface {
  "id"?: number;
  "name": string;
  "description"?: string;
  "image"?: string;
  "points": number;
  "status": number;
  "created_by": number;
  "created_date": number;
  "reward_code"?: string;
  "reward_item"?: string;
  "reward_cat_id"?: number;
}

export class Reward implements RewardInterface {
  "id": number;
  "name": string;
  "description": string;
  "image": string;
  "points": number;
  "status": number;
  "created_by": number;
  "created_date": number;
  "reward_code": string;
  "reward_item": string;
  "reward_cat_id": number;
  constructor(data?: RewardInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Reward`.
   */
  public static getModelName() {
    return "Reward";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Reward for dynamic purposes.
  **/
  public static factory(data: RewardInterface): Reward{
    return new Reward(data);
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
      name: 'Reward',
      plural: 'Rewards',
      path: 'Rewards',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "name": {
          name: 'name',
          type: 'string'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "image": {
          name: 'image',
          type: 'string'
        },
        "points": {
          name: 'points',
          type: 'number'
        },
        "status": {
          name: 'status',
          type: 'number'
        },
        "created_by": {
          name: 'created_by',
          type: 'number'
        },
        "created_date": {
          name: 'created_date',
          type: 'number'
        },
        "reward_code": {
          name: 'reward_code',
          type: 'string'
        },
        "reward_item": {
          name: 'reward_item',
          type: 'string'
        },
        "reward_cat_id": {
          name: 'reward_cat_id',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
