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
import { Monthly_actual_target } from '../../models/Monthly_actual_target';
import { SocketConnection } from '../../sockets/socket.connections';


/**
 * Api services for the `Monthly_actual_target` model.
 */
@Injectable()
export class Monthly_actual_targetApi extends BaseLoopBackApi {

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
   * This usually means the response is a `Monthly_actual_target` object.)
   * </em>
   */
  public patchOrCreate(data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/monthly_actual_targets";
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
   * @param {any} id monthly_actual_target id
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
   * This usually means the response is a `Monthly_actual_target` object.)
   * </em>
   */
  public patchAttributes(id: any, data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/monthly_actual_targets/:id";
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
   * @param {object} data Request data.
   *
   *  - `jsonData` – `{any}` - 
   *
   *  - `month` – `{number}` - 
   *
   *  - `year` – `{number}` - 
   *
   *  - `rows` – `{number}` - 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public insertMonthlyTarget(jsonData: any = {}, month: any = {}, year: any = {}, rows: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/monthly_actual_targets/insertMonthlyTarget";
    let _routeParams: any = {};
    let _postBody: any = {
      jsonData: jsonData
    };
    let _urlParams: any = {};
    if (typeof month !== 'undefined' && month !== null) _urlParams.month = month;
    if (typeof year !== 'undefined' && year !== null) _urlParams.year = year;
    if (typeof rows !== 'undefined' && rows !== null) _urlParams.rows = rows;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {number} sph_id 
   *
   * @param {number} month 
   *
   * @param {number} year 
   *
   * @param {string} status 
   *
   * @param {string} sph_mobile 
   *
   * @param {number} user_id 
   *
   * @param {string} rolename 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getMonthlyTarget(sph_id: any = {}, month: any = {}, year: any = {}, status: any = {}, sph_mobile: any = {}, user_id: any = {}, rolename: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/monthly_actual_targets/getMonthlyTarget";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof sph_id !== 'undefined' && sph_id !== null) _urlParams.sph_id = sph_id;
    if (typeof month !== 'undefined' && month !== null) _urlParams.month = month;
    if (typeof year !== 'undefined' && year !== null) _urlParams.year = year;
    if (typeof status !== 'undefined' && status !== null) _urlParams.status = status;
    if (typeof sph_mobile !== 'undefined' && sph_mobile !== null) _urlParams.sph_mobile = sph_mobile;
    if (typeof user_id !== 'undefined' && user_id !== null) _urlParams.user_id = user_id;
    if (typeof rolename !== 'undefined' && rolename !== null) _urlParams.rolename = rolename;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getMonthlyTargetHeaders(customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/monthly_actual_targets/getMonthlyTargetHeaders";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * The name of the model represented by this $resource,
   * i.e. `Monthly_actual_target`.
   */
  public getModelName() {
    return "Monthly_actual_target";
  }
}
