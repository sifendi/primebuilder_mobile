/* tslint:disable */

declare var Object: any;
export interface Project_stageInterface {
  "id"?: number;
  "project_stage"?: string;
  "status"?: number;
  "created_date"?: number;
  "created_by"?: number;
  "updated_date"?: number;
  "updated_by"?: number;
}

export class Project_stage implements Project_stageInterface {
  "id": number;
  "project_stage": string;
  "status": number;
  "created_date": number;
  "created_by": number;
  "updated_date": number;
  "updated_by": number;
  constructor(data?: Project_stageInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Project_stage`.
   */
  public static getModelName() {
    return "Project_stage";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Project_stage for dynamic purposes.
  **/
  public static factory(data: Project_stageInterface): Project_stage{
    return new Project_stage(data);
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
      name: 'Project_stage',
      plural: 'Project_stages',
      path: 'Project_stages',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "project_stage": {
          name: 'project_stage',
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
