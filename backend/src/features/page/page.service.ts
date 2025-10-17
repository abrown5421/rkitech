import { Page } from './page.model';
import { BaseService } from '../base/base.service';
import { IPage } from './page.types';

export class PageService extends BaseService<IPage> {
    constructor() {
        super(Page)
    }
}