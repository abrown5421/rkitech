import { BaseService } from '../base/base.service';
import { Elements } from './elements.model';
import { IElements } from './elements.types';

export class ElementsService extends BaseService<IElements> {
  constructor() {
    super(Elements);
  }
}
