import { IBaseModel } from '../../core/models/base.model';

export interface INotification extends IBaseModel {
  title: string;
  description: string;
  type?: string;
  seen: boolean;
}
