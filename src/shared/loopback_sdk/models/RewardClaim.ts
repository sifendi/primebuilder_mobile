/* tslint:disable */

declare var Object: any;
export interface RewardClaimInterface {
  "id"?: number;
  "hpb_id": number;
  "reward_id": number;
  "promo_id"?: number;
  "points_redeemed": number;
  "status": string;
  "rejected_reason"?: string;
  "created_by": number;
  "created_date": number;
}

export class RewardClaim implements RewardClaimInterface {
  "id": number;
  "hpb_id": number;
  "reward_id": number;
  "promo_id": number;
  "points_redeemed": number;
  "status": string;
  "rejected_reason": string;
  "created_by": number;
  "created_date": number;
  constructor(data?: RewardClaimInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `RewardClaim`.
   */
  public static getModelName() {
    return "RewardClaim";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of RewardClaim for dynamic purposes.
  **/
  public static factory(data: RewardClaimInterface): RewardClaim{
    return new RewardClaim(data);
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
      name: 'RewardClaim',
      plural: 'RewardClaims',
      path: 'RewardClaims',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "hpb_id": {
          name: 'hpb_id',
          type: 'number'
        },
        "reward_id": {
          name: 'reward_id',
          type: 'number'
        },
        "promo_id": {
          name: 'promo_id',
          type: 'number'
        },
        "points_redeemed": {
          name: 'points_redeemed',
          type: 'number'
        },
        "status": {
          name: 'status',
          type: 'string'
        },
        "rejected_reason": {
          name: 'rejected_reason',
          type: 'string'
        },
        "created_by": {
          name: 'created_by',
          type: 'number'
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
