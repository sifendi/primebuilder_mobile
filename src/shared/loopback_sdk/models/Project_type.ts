/* tslint:disable */

declare var Object: any;
export interface Project_typeInterface {
  "id"?: number;
  "project_type"?: string;
  "status"?: number;
  "created_date"?: number;
  "created_by"?: number;
  "updated_date"?: number;
  "updated_by"?: number;
}

export class Project_type implements Project_typeInterface {
  "id": number;
  "project_type": string;
  "status": number;
  "created_date": number;
  "created_by": number;
  "updated_date": number;
  "updated_by": number;
  constructor(data?: Project_typeInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Project_type`.
   */
  public static getModelName() {
    return "Project_type";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Project_type for dynamic purposes.
  **/
  public static factory(data: Project_typeInterface): Project_type{
    return new Project_type(data);
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
      name: 'Project_type',
      plural: 'Project_types',
      path: 'Project_types',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "project_type": {
          name: 'project_type',
          type: 'string'
        },
        "status": {
          name: 'status',
          type: 'number'
        },
        "created_date": {
          name: 'created_date',
          type: 'number'
        },
        "created_by": {
          name: 'created_by',
          type: 'number'
        },
        "updated_date": {
          name: 'updated_date',
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
