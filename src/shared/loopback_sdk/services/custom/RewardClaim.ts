/* tslint:disable */
import { Injectable, Inject, Optional } from '@angular/core';
import { Http, Response } from '@angular/http';
import { SDKModels } from './SDKModels';
import { BaseLoopBackApi } from '../core/base.service';
import { LoopBackConfig } from '../../lb.config';
import { LoopBackAuth } from '../core/auth.service';
import { LoopBackFilter,  } from '../../models/BaseModels';
import { JSONSearchParams } from '../core/search.params';
import { ErrorHandler } from '../core/error.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { RewardClaim } from '../../models/RewardClaim';
import { SocketConnection } from '../../sockets/socket.connections';


/**
 * Api services for the `RewardClaim` model.
 */
@Injectable()
export class RewardClaimApi extends BaseLoopBackApi {

  constructor(
    @Inject(Http) protected http: Http,
    @Inject(SocketConnection) protected connection: SocketConnection,
    @Inject(SDKModels) protected models: SDKModels,
    @Inject(LoopBackAuth) protected auth: LoopBackAuth,
    @Inject(JSONSearchParams) protected searchParams: JSONSearchParams,
    @Optional() @Inject(ErrorHandler) protected errorHandler: ErrorHandler
  ) {
    super(http,  connection,  models, auth, searchParams, errorHandler);
  }

  /**
   * Patch an existing model instance or insert a new one into the data source.
   *
   * @param {object} data Request data.
   *
   *  - `data` – `{object}` - Model instance data
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `RewardClaim` object.)
   * </em>
   */
  public patchOrCreate(data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/rewardClaims";
    let _routeParams: any = {};
    let _postBody: any = {
      data: data
    };
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Patch attributes for a model instance and persist it into the data source.
   *
   * @param {any} id rewardClaim id
   *
   * @param {object} data Request data.
   *
   *  - `data` – `{object}` - An object of model property name/value pairs
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `RewardClaim` object.)
   * </em>
   */
  public patchAttributes(id: any, data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/rewardClaims/:id";
    let _routeParams: any = {
      id: id
    };
    let _postBody: any = {
      data: data
    };
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {number} id 
   *
   * @param {number} hpb_id 
   *
   * @param {number} promo_id 
   *
   * @param {string} status 
   *
   * @param {number} created_by 
   *
   * @param {number} created_date 
   *
   * @param {number} limit 
   *
   * @param {number} page 
   *
   * @param {number} user_id 
   *
   * @param {string} rolename 
   *
   * @param {string} rc_id 
   *
   * @param {string} hpb_name 
   *
   * @param {string} reward_name 
   *
   * @param {number} redeem_from 
   *
   * @param {number} redeem_to 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getRedeemHistory(id: any = {}, hpb_id: any = {}, promo_id: any = {}, status: any = {}, created_by: any = {}, created_date: any = {}, limit: any = {}, page: any = {}, user_id: any = {}, rolename: any = {}, rc_id: any = {}, hpb_name: any = {}, reward_name: any = {}, redeem_from: any = {}, redeem_to: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/rewardClaims/getRedeemHistory";
    let _routeParams: any = {
      id: id
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof hpb_id !== 'undefined' && hpb_id !== null) _urlParams.hpb_id = hpb_id;
    if (typeof promo_id !== 'undefined' && promo_id !== null) _urlParams.promo_id = promo_id;
    if (typeof status !== 'undefined' && status !== null) _urlParams.status = status;
    if (typeof created_by !== 'undefined' && created_by !== null) _urlParams.created_by = created_by;
    if (typeof created_date !== 'undefined' && created_date !== null) _urlParams.created_date = created_date;
    if (typeof limit !== 'undefined' && limit !== null) _urlParams.limit = limit;
    if (typeof page !== 'undefined' && page !== null) _urlParams.page = page;
    if (typeof user_id !== 'undefined' && user_id !== null) _urlParams.user_id = user_id;
    if (typeof rolename !== 'undefined' && rolename !== null) _urlParams.rolename = rolename;
    if (typeof rc_id !== 'undefined' && rc_id !== null) _urlParams.rc_id = rc_id;
    if (typeof hpb_name !== 'undefined' && hpb_name !== null) _urlParams.hpb_name = hpb_name;
    if (typeof reward_name !== 'undefined' && reward_name !== null) _urlParams.reward_name = reward_name;
    if (typeof redeem_from !== 'undefined' && redeem_from !== null) _urlParams.redeem_from = redeem_from;
    if (typeof redeem_to !== 'undefined' && redeem_to !== null) _urlParams.redeem_to = redeem_to;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {number} id 
   *
   * @param {number} hpb_id 
   *
   * @param {number} promo_id 
   *
   * @param {string} status 
   *
   * @param {number} created_by 
   *
   * @param {number} created_date 
   *
   * @param {number} limit 
   *
   * @param {number} page 
   *
   * @param {number} user_id 
   *
   * @param {string} rolename 
   *
   * @param {string} hpb_name 
   *
   * @param {string} reward_name 
   *
   * @param {number} redeem_from 
   *
   * @param {number} redeem_to 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getRedeemHistoryCount(id: any = {}, hpb_id: any = {}, promo_id: any = {}, status: any = {}, created_by: any = {}, created_date: any = {}, limit: any = {}, page: any = {}, user_id: any = {}, rolename: any = {}, hpb_name: any = {}, reward_name: any = {}, redeem_from: any = {}, redeem_to: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/rewardClaims/getRedeemHistoryCount";
    let _routeParams: any = {
      id: id
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof hpb_id !== 'undefined' && hpb_id !== null) _urlParams.hpb_id = hpb_id;
    if (typeof promo_id !== 'undefined' && promo_id !== null) _urlParams.promo_id = promo_id;
    if (typeof status !== 'undefined' && status !== null) _urlParams.status = status;
    if (typeof created_by !== 'undefined' && created_by !== null) _urlParams.created_by = created_by;
    if (typeof created_date !== 'undefined' && created_date !== null) _urlParams.created_date = created_date;
    if (typeof limit !== 'undefined' && limit !== null) _urlParams.limit = limit;
    if (typeof page !== 'undefined' && page !== null) _urlParams.page = page;
    if (typeof user_id !== 'undefined' && user_id !== null) _urlParams.user_id = user_id;
    if (typeof rolename !== 'undefined' && rolename !== null) _urlParams.rolename = rolename;
    if (typeof hpb_name !== 'undefined' && hpb_name !== null) _urlParams.hpb_name = hpb_name;
    if (typeof reward_name !== 'undefined' && reward_name !== null) _urlParams.reward_name = reward_name;
    if (typeof redeem_from !== 'undefined' && redeem_from !== null) _urlParams.redeem_from = redeem_from;
    if (typeof redeem_to !== 'undefined' && redeem_to !== null) _urlParams.redeem_to = redeem_to;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {object} data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public redeemPoints(dataArrObj: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/rewardClaims/redeemPoints";
    let _routeParams: any = {};
    let _postBody: any = {
      dataArrObj: dataArrObj
    };
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {number} redeem_id 
   *
   * @param {object} data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public addEditRedemption(dataArrObj: any = {}, redeem_id: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/rewardClaims/addEditRedemption";
    let _routeParams: any = {};
    let _postBody: any = {
      dataArrObj: dataArrObj
    };
    let _urlParams: any = {};
    if (typeof redeem_id !== 'undefined' && redeem_id !== null) _urlParams.redeem_id = redeem_id;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * The name of the model represented by this $resource,
   * i.e. `RewardClaim`.
   */
  public getModelName() {
    return "RewardClaim";
  }
}
