import { BaseService } from '../base/base.service';
import { IUser } from './user.types';
import { User } from './user.model';
import { verifyPassword } from '../../utils/password';
import jwt from 'jsonwebtoken';

export class UserService extends BaseService<IUser> {
    constructor() {
        super(User)
    }
    async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
        const user = await User.findOne({ userEmail: email }).select('+userPassword');
        if (!user) throw new Error('Invalid credentials');

        const passwordValid = await verifyPassword(user.userPassword, password);
        if (!passwordValid) throw new Error('Invalid credentials');
        user.userPassword = undefined as any;

        const token = jwt.sign(
            { id: user._id, email: user.userEmail, type: user.userType },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        return { user, token };
    }

}