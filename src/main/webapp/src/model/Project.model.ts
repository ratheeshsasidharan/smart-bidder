import {ProjectCategory} from "./enumerations/project-category.model";

export interface IProject {
  id?: number;
  category?: ProjectCategory | null;
  description?: string;
  country?: string;
  postcode?: number;
  expectedNoOfHours?: number | null;
  dueDateTime?: string;
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
}

export type IQueryParams = { query?: string; page?: number; size?: number; sort?: string };

export const defaultValue: Readonly<IProject> = {};