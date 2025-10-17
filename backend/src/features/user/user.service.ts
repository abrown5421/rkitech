import { BaseService } from '../base/base.service';
import { IUser } from './user.types';
import { User } from './user.model';

export class UserService extends BaseService<IUser> {
    constructor() {
        super(User)
    }
}