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
import { User_mapping } from '../../models/User_mapping';
import { SocketConnection } from '../../sockets/socket.connections';


/**
 * Api services for the `User_mapping` model.
 */
@Injectable()
export class User_mappingApi extends BaseLoopBackApi {

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
   * This usually means the response is a `User_mapping` object.)
   * </em>
   */
  public patchOrCreate(data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/user_mappings";
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
   * @param {any} id user_mapping id
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
   * This usually means the response is a `User_mapping` object.)
   * </em>
   */
  public patchAttributes(id: any, data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/user_mappings/:id";
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
   *  - `user_id` – `{number}` - 
   *
   *  - `rolename` – `{string}` - 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getUserMapped(user_id: any = {}, rolename: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/user_mappings/getUserMapped";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
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
   * @param {string} target_for 
   *
   * @param {string} rolename 
   *
   * @param {number} user_id 
   *
   * @param {number} region_id 
   *
   * @param {number} from_month 
   *
   * @param {number} to_month 
   *
   * @param {number} year 
   *
   * @param {object} data Request data.
   *
   *  - `res` – `{object}` - 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getScorecardAM(target_for: any = {}, res: any = {}, rolename: any = {}, user_id: any = {}, region_id: any = {}, from_month: any = {}, to_month: any = {}, year: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/user_mappings/getScorecardAM";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof target_for !== 'undefined' && target_for !== null) _urlParams.target_for = target_for;
    if (typeof rolename !== 'undefined' && rolename !== null) _urlParams.rolename = rolename;
    if (typeof user_id !== 'undefined' && user_id !== null) _urlParams.user_id = user_id;
    if (typeof region_id !== 'undefined' && region_id !== null) _urlParams.region_id = region_id;
    if (typeof from_month !== 'undefined' && from_month !== null) _urlParams.from_month = from_month;
    if (typeof to_month !== 'undefined' && to_month !== null) _urlParams.to_month = to_month;
    if (typeof year !== 'undefined' && year !== null) _urlParams.year = year;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {string} target_for 
   *
   * @param {string} rolename 
   *
   * @param {number} user_id 
   *
   * @param {number} region_id 
   *
   * @param {number} from_month 
   *
   * @param {number} to_month 
   *
   * @param {number} year 
   *
   * @param {object} data Request data.
   *
   * This method does not accept any data. Supply an empty object.
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getScorecardAMWebView(target_for: any = {}, rolename: any = {}, user_id: any = {}, region_id: any = {}, from_month: any = {}, to_month: any = {}, year: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/user_mappings/getScorecardAMWebView";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof target_for !== 'undefined' && target_for !== null) _urlParams.target_for = target_for;
    if (typeof rolename !== 'undefined' && rolename !== null) _urlParams.rolename = rolename;
    if (typeof user_id !== 'undefined' && user_id !== null) _urlParams.user_id = user_id;
    if (typeof region_id !== 'undefined' && region_id !== null) _urlParams.region_id = region_id;
    if (typeof from_month !== 'undefined' && from_month !== null) _urlParams.from_month = from_month;
    if (typeof to_month !== 'undefined' && to_month !== null) _urlParams.to_month = to_month;
    if (typeof year !== 'undefined' && year !== null) _urlParams.year = year;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {string} target_for 
   *
   * @param {string} rolename 
   *
   * @param {number} user_id 
   *
   * @param {number} ac_id 
   *
   * @param {number} district_id 
   *
   * @param {number} month 
   *
   * @param {number} year 
   *
   * @param {object} data Request data.
   *
   *  - `res` – `{object}` - 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getAMScorecardSummary(target_for: any = {}, res: any = {}, rolename: any = {}, user_id: any = {}, ac_id: any = {}, district_id: any = {}, month: any = {}, year: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/user_mappings/getAMScorecardSummary";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof target_for !== 'undefined' && target_for !== null) _urlParams.target_for = target_for;
    if (typeof rolename !== 'undefined' && rolename !== null) _urlParams.rolename = rolename;
    if (typeof user_id !== 'undefined' && user_id !== null) _urlParams.user_id = user_id;
    if (typeof ac_id !== 'undefined' && ac_id !== null) _urlParams.ac_id = ac_id;
    if (typeof district_id !== 'undefined' && district_id !== null) _urlParams.district_id = district_id;
    if (typeof month !== 'undefined' && month !== null) _urlParams.month = month;
    if (typeof year !== 'undefined' && year !== null) _urlParams.year = year;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {string} rolename 
   *
   * @param {number} user_id 
   *
   * @param {number} ac_id 
   *
   * @param {number} district_id 
   *
   * @param {number} month 
   *
   * @param {number} year 
   *
   * @param {object} data Request data.
   *
   * This method does not accept any data. Supply an empty object.
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getAMScorecardSummaryWebView(rolename: any = {}, user_id: any = {}, ac_id: any = {}, district_id: any = {}, month: any = {}, year: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/user_mappings/getAMScorecardSummaryWebView";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof rolename !== 'undefined' && rolename !== null) _urlParams.rolename = rolename;
    if (typeof user_id !== 'undefined' && user_id !== null) _urlParams.user_id = user_id;
    if (typeof ac_id !== 'undefined' && ac_id !== null) _urlParams.ac_id = ac_id;
    if (typeof district_id !== 'undefined' && district_id !== null) _urlParams.district_id = district_id;
    if (typeof month !== 'undefined' && month !== null) _urlParams.month = month;
    if (typeof year !== 'undefined' && year !== null) _urlParams.year = year;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {string} target_for 
   *
   * @param {string} rolename 
   *
   * @param {number} user_id 
   *
   * @param {number} ac_id 
   *
   * @param {number} district_id 
   *
   * @param {number} from_month 
   *
   * @param {number} to_month 
   *
   * @param {number} year 
   *
   * @param {object} data Request data.
   *
   *  - `res` – `{object}` - 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getScorecard(target_for: any = {}, res: any = {}, rolename: any = {}, user_id: any = {}, ac_id: any = {}, district_id: any = {}, from_month: any = {}, to_month: any = {}, year: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/user_mappings/getScorecard";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof target_for !== 'undefined' && target_for !== null) _urlParams.target_for = target_for;
    if (typeof rolename !== 'undefined' && rolename !== null) _urlParams.rolename = rolename;
    if (typeof user_id !== 'undefined' && user_id !== null) _urlParams.user_id = user_id;
    if (typeof ac_id !== 'undefined' && ac_id !== null) _urlParams.ac_id = ac_id;
    if (typeof district_id !== 'undefined' && district_id !== null) _urlParams.district_id = district_id;
    if (typeof from_month !== 'undefined' && from_month !== null) _urlParams.from_month = from_month;
    if (typeof to_month !== 'undefined' && to_month !== null) _urlParams.to_month = to_month;
    if (typeof year !== 'undefined' && year !== null) _urlParams.year = year;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {string} target_for 
   *
   * @param {string} rolename 
   *
   * @param {number} user_id 
   *
   * @param {number} ac_id 
   *
   * @param {number} district_id 
   *
   * @param {number} from_month 
   *
   * @param {number} to_month 
   *
   * @param {number} year 
   *
   * @param {object} data Request data.
   *
   * This method does not accept any data. Supply an empty object.
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getScorecardWebView(target_for: any = {}, rolename: any = {}, user_id: any = {}, ac_id: any = {}, district_id: any = {}, from_month: any = {}, to_month: any = {}, year: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/user_mappings/getScorecardWebView";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof target_for !== 'undefined' && target_for !== null) _urlParams.target_for = target_for;
    if (typeof rolename !== 'undefined' && rolename !== null) _urlParams.rolename = rolename;
    if (typeof user_id !== 'undefined' && user_id !== null) _urlParams.user_id = user_id;
    if (typeof ac_id !== 'undefined' && ac_id !== null) _urlParams.ac_id = ac_id;
    if (typeof district_id !== 'undefined' && district_id !== null) _urlParams.district_id = district_id;
    if (typeof from_month !== 'undefined' && from_month !== null) _urlParams.from_month = from_month;
    if (typeof to_month !== 'undefined' && to_month !== null) _urlParams.to_month = to_month;
    if (typeof year !== 'undefined' && year !== null) _urlParams.year = year;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {string} target_for 
   *
   * @param {string} rolename 
   *
   * @param {number} user_id 
   *
   * @param {number} ac_id 
   *
   * @param {number} district_id 
   *
   * @param {number} month 
   *
   * @param {number} year 
   *
   * @param {object} data Request data.
   *
   *  - `res` – `{object}` - 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getScorecardSummary(target_for: any = {}, res: any = {}, rolename: any = {}, user_id: any = {}, ac_id: any = {}, district_id: any = {}, month: any = {}, year: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/user_mappings/getScorecardSummary";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof target_for !== 'undefined' && target_for !== null) _urlParams.target_for = target_for;
    if (typeof rolename !== 'undefined' && rolename !== null) _urlParams.rolename = rolename;
    if (typeof user_id !== 'undefined' && user_id !== null) _urlParams.user_id = user_id;
    if (typeof ac_id !== 'undefined' && ac_id !== null) _urlParams.ac_id = ac_id;
    if (typeof district_id !== 'undefined' && district_id !== null) _urlParams.district_id = district_id;
    if (typeof month !== 'undefined' && month !== null) _urlParams.month = month;
    if (typeof year !== 'undefined' && year !== null) _urlParams.year = year;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {string} rolename 
   *
   * @param {number} user_id 
   *
   * @param {number} ac_id 
   *
   * @param {number} district_id 
   *
   * @param {number} month 
   *
   * @param {number} year 
   *
   * @param {object} data Request data.
   *
   * This method does not accept any data. Supply an empty object.
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getScorecardSummaryWebView(rolename: any = {}, user_id: any = {}, ac_id: any = {}, district_id: any = {}, month: any = {}, year: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/user_mappings/getScorecardSummaryWebView";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof rolename !== 'undefined' && rolename !== null) _urlParams.rolename = rolename;
    if (typeof user_id !== 'undefined' && user_id !== null) _urlParams.user_id = user_id;
    if (typeof ac_id !== 'undefined' && ac_id !== null) _urlParams.ac_id = ac_id;
    if (typeof district_id !== 'undefined' && district_id !== null) _urlParams.district_id = district_id;
    if (typeof month !== 'undefined' && month !== null) _urlParams.month = month;
    if (typeof year !== 'undefined' && year !== null) _urlParams.year = year;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * The name of the model represented by this $resource,
   * i.e. `User_mapping`.
   */
  public getModelName() {
    return "User_mapping";
  }
}
