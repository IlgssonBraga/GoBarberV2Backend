import { inject, injectable } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IhashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
    user_id: string;
    name: string;
    email: string;
    old_password?: string;
    password?: string;
}

@injectable()
class UpdateProfileService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IhashProvider,
    ) {}

    public async execute({
        user_id,
        name,
        email,
        password,
        old_password,
    }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError('User not found');
        }

        const checkEmail = await this.usersRepository.findByEmail(email);

        if (checkEmail && checkEmail.id !== user_id) {
            throw new AppError('E-mail already exists');
        }

        user.name = name;
        user.email = email;

        if (password && !old_password) {
            throw new AppError('Missing old password');
        }

        if (password && old_password) {
            const checkOldPassword = await this.hashProvider.compareHash(
                old_password,
                user.password,
            );

            if (!checkOldPassword) {
                throw new AppError('Wrong old password');
            }
            user.password = await this.hashProvider.generateHash(password);
        }

        return this.usersRepository.save(user);
    }
}

export default UpdateProfileService;
