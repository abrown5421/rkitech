import { BaseService } from '../base/BaseService';
import { IUser } from './user.types';
import { User } from './user.model';

export class UserService extends BaseService<IUser> {
    constructor() {
        super(User)
    }
}