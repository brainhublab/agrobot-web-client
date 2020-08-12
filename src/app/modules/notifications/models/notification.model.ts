import { IBaseModel } from '../../shared/base.model';

export interface INotification extends IBaseModel {
  title: string;
  description: string;
  type?: string;
  seen: boolean;
}
