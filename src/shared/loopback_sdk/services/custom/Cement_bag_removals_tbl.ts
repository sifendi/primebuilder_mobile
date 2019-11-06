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
import { Cement_bag_removals_tbl } from '../../models/Cement_bag_removals_tbl';
import { SocketConnection } from '../../sockets/socket.connections';


/**
 * Api services for the `Cement_bag_removals_tbl` model.
 */
@Injectable()
export class Cement_bag_removals_tblApi extends BaseLoopBackApi {

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
   * This usually means the response is a `Cement_bag_removals_tbl` object.)
   * </em>
   */
  public patchOrCreate(data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/cement_bag_removals_tbls";
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
   * @param {any} id cement_bag_removals_tbl id
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
   * This usually means the response is a `Cement_bag_removals_tbl` object.)
   * </em>
   */
  public patchAttributes(id: any, data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/cement_bag_removals_tbls/:id";
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
   * @param {number} removal_id 
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
  public addEditCementBagRemoval(dataArrObj: any = {}, removal_id: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/cement_bag_removals_tbls/addEditCementBagRemoval";
    let _routeParams: any = {};
    let _postBody: any = {
      dataArrObj: dataArrObj
    };
    let _urlParams: any = {};
    if (typeof removal_id !== 'undefined' && removal_id !== null) _urlParams.removal_id = removal_id;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {number} removal_id 
   *
   * @param {number} district_id 
   *
   * @param {number} from_date 
   *
   * @param {number} to_date 
   *
   * @param {number} created_date 
   *
   * @param {number} created_by 
   *
   * @param {number} updated_date 
   *
   * @param {number} updated_by 
   *
   * @param {number} limit 
   *
   * @param {number} page 
   *
   * @param {string} rolename 
   *
   * @param {number} user_id 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getCementBagRemoval(removal_id: any = {}, district_id: any = {}, from_date: any = {}, to_date: any = {}, created_date: any = {}, created_by: any = {}, updated_date: any = {}, updated_by: any = {}, limit: any = {}, page: any = {}, rolename: any = {}, user_id: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/cement_bag_removals_tbls/getCementBagRemoval";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof removal_id !== 'undefined' && removal_id !== null) _urlParams.removal_id = removal_id;
    if (typeof district_id !== 'undefined' && district_id !== null) _urlParams.district_id = district_id;
    if (typeof from_date !== 'undefined' && from_date !== null) _urlParams.from_date = from_date;
    if (typeof to_date !== 'undefined' && to_date !== null) _urlParams.to_date = to_date;
    if (typeof created_date !== 'undefined' && created_date !== null) _urlParams.created_date = created_date;
    if (typeof created_by !== 'undefined' && created_by !== null) _urlParams.created_by = created_by;
    if (typeof updated_date !== 'undefined' && updated_date !== null) _urlParams.updated_date = updated_date;
    if (typeof updated_by !== 'undefined' && updated_by !== null) _urlParams.updated_by = updated_by;
    if (typeof limit !== 'undefined' && limit !== null) _urlParams.limit = limit;
    if (typeof page !== 'undefined' && page !== null) _urlParams.page = page;
    if (typeof rolename !== 'undefined' && rolename !== null) _urlParams.rolename = rolename;
    if (typeof user_id !== 'undefined' && user_id !== null) _urlParams.user_id = user_id;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {number} removal_id 
   *
   * @param {number} district_id 
   *
   * @param {number} from_date 
   *
   * @param {number} to_date 
   *
   * @param {number} created_date 
   *
   * @param {number} created_by 
   *
   * @param {number} updated_date 
   *
   * @param {number} updated_by 
   *
   * @param {number} limit 
   *
   * @param {number} page 
   *
   * @param {string} rolename 
   *
   * @param {number} user_id 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getCementBagRemovalCount(removal_id: any = {}, district_id: any = {}, from_date: any = {}, to_date: any = {}, created_date: any = {}, created_by: any = {}, updated_date: any = {}, updated_by: any = {}, limit: any = {}, page: any = {}, rolename: any = {}, user_id: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/cement_bag_removals_tbls/getCementBagRemovalCount";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof removal_id !== 'undefined' && removal_id !== null) _urlParams.removal_id = removal_id;
    if (typeof district_id !== 'undefined' && district_id !== null) _urlParams.district_id = district_id;
    if (typeof from_date !== 'undefined' && from_date !== null) _urlParams.from_date = from_date;
    if (typeof to_date !== 'undefined' && to_date !== null) _urlParams.to_date = to_date;
    if (typeof created_date !== 'undefined' && created_date !== null) _urlParams.created_date = created_date;
    if (typeof created_by !== 'undefined' && created_by !== null) _urlParams.created_by = created_by;
    if (typeof updated_date !== 'undefined' && updated_date !== null) _urlParams.updated_date = updated_date;
    if (typeof updated_by !== 'undefined' && updated_by !== null) _urlParams.updated_by = updated_by;
    if (typeof limit !== 'undefined' && limit !== null) _urlParams.limit = limit;
    if (typeof page !== 'undefined' && page !== null) _urlParams.page = page;
    if (typeof rolename !== 'undefined' && rolename !== null) _urlParams.rolename = rolename;
    if (typeof user_id !== 'undefined' && user_id !== null) _urlParams.user_id = user_id;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {number} from_date 
   *
   * @param {number} to_date 
   *
   * @param {number} district_id 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getReceiptQuantity(from_date: any = {}, to_date: any = {}, district_id: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/cement_bag_removals_tbls/getReceiptQuantity";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof from_date !== 'undefined' && from_date !== null) _urlParams.from_date = from_date;
    if (typeof to_date !== 'undefined' && to_date !== null) _urlParams.to_date = to_date;
    if (typeof district_id !== 'undefined' && district_id !== null) _urlParams.district_id = district_id;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * The name of the model represented by this $resource,
   * i.e. `Cement_bag_removals_tbl`.
   */
  public getModelName() {
    return "Cement_bag_removals_tbl";
  }
}
