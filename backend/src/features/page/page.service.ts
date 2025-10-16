import { Page } from './page.model';
import { BaseService } from '../base/BaseService';
import { IPage } from './page.types';

export class PageService extends BaseService<IPage> {
    constructor() {
        super(Page)
    }
}