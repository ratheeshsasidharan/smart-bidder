import {ProjectCategory} from "./enumerations/project-category.model";
import {ProjectStatus} from "./enumerations/project-status.model";

export interface IProject {
  id?: number;
  category?: ProjectCategory | null;
  description?: string;
  country?: string;
  postcode?: number;
  expectedNoOfHours?: number | null;
  dueDateTime?: string;
  summary?: string;
  budget?: number | null;
  status?: ProjectStatus | null;
  assignedBidId?: number | null;
  createdBy?: string;
  createdByFullName?: string;
  createdDate?: string;
}

export interface ProjectsState {
  loading: boolean;
  errorMessage: string | null;
  entities: ReadonlyArray<IProject>;
  entity: IProject;
  links?: any;
  updating: boolean;
  totalItems?: number;
  updateSuccess: boolean;
  searchType?:string;
  selectedRowId:number;
}

export type IQueryParams = { query?: string; page?: number; size?: number; sort?: string;searchType?:string };

export const defaultValue: Readonly<IProject> = {};
