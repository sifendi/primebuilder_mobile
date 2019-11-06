/* tslint:disable */

declare var Object: any;
export interface RewardPointInterface {
  "uid": number;
  "id"?: number;
  "points": number;
  "type_id": number;
  "type": string;
  "approval_id": number;
  "created": number;
}

export class RewardPoint implements RewardPointInterface {
  "uid": number;
  "id": number;
  "points": number;
  "type_id": number;
  "type": string;
  "approval_id": number;
  "created": number;
  constructor(data?: RewardPointInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `RewardPoint`.
   */
  public static getModelName() {
    return "RewardPoint";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of RewardPoint for dynamic purposes.
  **/
  public static factory(data: RewardPointInterface): RewardPoint{
    return new RewardPoint(data);
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
      name: 'RewardPoint',
      plural: 'RewardPoints',
      path: 'RewardPoints',
      idName: 'id',
      properties: {
        "uid": {
          name: 'uid',
          type: 'number'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "points": {
          name: 'points',
          type: 'number'
        },
        "type_id": {
          name: 'type_id',
          type: 'number'
        },
        "type": {
          name: 'type',
          type: 'string'
        },
        "approval_id": {
          name: 'approval_id',
          type: 'number'
        },
        "created": {
          name: 'created',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
