import {BidType} from "./enumerations/bid-type.model";
import {BidStatus} from "./enumerations/bid-status.model";
import {IProject} from "./Project.model";

export interface IProjectBid {
  id?: number;
  bidType?: BidType;
  bidAmount?: number;
  comments?: string | null;
    bidStatus?: BidStatus | null;
  projectId?: number | null;
  createdBy?: string | null;
  createdByFullName?: string | null;
}

export interface ProjectBidState {
  loading: boolean;
  errorMessage: string | null;
  entities: ReadonlyArray<IProjectBid>;
  entity: IProjectBid;
  links?: any;
  updating: boolean;
  totalItems?: number;
  updateSuccess: boolean;
  projectId?:number | null;
}

export type IQueryParamsBid = { query?: string; page?: number; size?: number; sort?: string,projectId?:number };

export const defaultValue: Readonly<IProjectBid> = {};
