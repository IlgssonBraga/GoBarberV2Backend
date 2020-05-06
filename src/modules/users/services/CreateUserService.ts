import { hash } from 'bcryptjs';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
    name: string;
    email: string;
    password: string;
}

class CreateUserService {
    constructor(private usersRepository: IUsersRepository) {}

    public async execute({ name, email, password }: IRequest): Promise<User> {
        const CheckUserExists = await this.usersRepository.findByEmail(email);

        if (CheckUserExists) {
            throw new AppError('E-mail already stored.');
        }

        const HashedPassword = await hash(password, 8);

        const user = await this.usersRepository.create({
            name,
            email,
            password: HashedPassword,
        });

        return user;
    }
}

export default CreateUserService;
