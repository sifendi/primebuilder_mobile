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
import { Reward } from '../../models/Reward';
import { SocketConnection } from '../../sockets/socket.connections';


/**
 * Api services for the `Reward` model.
 */
@Injectable()
export class RewardApi extends BaseLoopBackApi {

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
   * This usually means the response is a `Reward` object.)
   * </em>
   */
  public patchOrCreate(data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/rewards";
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
   * @param {any} id reward id
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
   * This usually means the response is a `Reward` object.)
   * </em>
   */
  public patchAttributes(id: any, data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/rewards/:id";
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
   * @param {string} name 
   *
   * @param {string} description 
   *
   * @param {string} image 
   *
   * @param {number} points 
   *
   * @param {number} status 
   *
   * @param {number} created_by 
   *
   * @param {number} created_date 
   *
   * @param {number} limit 
   *
   * @param {number} page 
   *
   * @param {number} rc_id 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getRewards(id: any = {}, name: any = {}, description: any = {}, image: any = {}, points: any = {}, status: any = {}, created_by: any = {}, created_date: any = {}, limit: any = {}, page: any = {}, rc_id: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/rewards/getRewards";
    let _routeParams: any = {
      id: id
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof name !== 'undefined' && name !== null) _urlParams.name = name;
    if (typeof description !== 'undefined' && description !== null) _urlParams.description = description;
    if (typeof image !== 'undefined' && image !== null) _urlParams.image = image;
    if (typeof points !== 'undefined' && points !== null) _urlParams.points = points;
    if (typeof status !== 'undefined' && status !== null) _urlParams.status = status;
    if (typeof created_by !== 'undefined' && created_by !== null) _urlParams.created_by = created_by;
    if (typeof created_date !== 'undefined' && created_date !== null) _urlParams.created_date = created_date;
    if (typeof limit !== 'undefined' && limit !== null) _urlParams.limit = limit;
    if (typeof page !== 'undefined' && page !== null) _urlParams.page = page;
    if (typeof rc_id !== 'undefined' && rc_id !== null) _urlParams.rc_id = rc_id;
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
   * @param {string} name 
   *
   * @param {string} description 
   *
   * @param {string} image 
   *
   * @param {number} points 
   *
   * @param {number} status 
   *
   * @param {number} created_by 
   *
   * @param {number} created_date 
   *
   * @param {number} limit 
   *
   * @param {number} page 
   *
   * @param {number} rc_id 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getRewardsDashboard(id: any = {}, name: any = {}, description: any = {}, image: any = {}, points: any = {}, status: any = {}, created_by: any = {}, created_date: any = {}, limit: any = {}, page: any = {}, rc_id: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/rewards/getRewardsDashboard";
    let _routeParams: any = {
      id: id
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof name !== 'undefined' && name !== null) _urlParams.name = name;
    if (typeof description !== 'undefined' && description !== null) _urlParams.description = description;
    if (typeof image !== 'undefined' && image !== null) _urlParams.image = image;
    if (typeof points !== 'undefined' && points !== null) _urlParams.points = points;
    if (typeof status !== 'undefined' && status !== null) _urlParams.status = status;
    if (typeof created_by !== 'undefined' && created_by !== null) _urlParams.created_by = created_by;
    if (typeof created_date !== 'undefined' && created_date !== null) _urlParams.created_date = created_date;
    if (typeof limit !== 'undefined' && limit !== null) _urlParams.limit = limit;
    if (typeof page !== 'undefined' && page !== null) _urlParams.page = page;
    if (typeof rc_id !== 'undefined' && rc_id !== null) _urlParams.rc_id = rc_id;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {any} reward_id 
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
  public addEditReward(dataArrObj: any = {}, reward_id: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/rewards/addEditReward";
    let _routeParams: any = {};
    let _postBody: any = {
      dataArrObj: dataArrObj
    };
    let _urlParams: any = {};
    if (typeof reward_id !== 'undefined' && reward_id !== null) _urlParams.reward_id = reward_id;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * The name of the model represented by this $resource,
   * i.e. `Reward`.
   */
  public getModelName() {
    return "Reward";
  }
}
