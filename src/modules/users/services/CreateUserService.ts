import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';

interface Request {
    name: string;
    email: string;
    password: string;
}

class CreateUserService {
    public async execute({ name, email, password }: Request): Promise<User> {
        const usersRepository = getRepository(User);
        const CheckUserExists = await usersRepository.findOne({
            where: { email },
        });

        if (CheckUserExists) {
            throw new AppError('E-mail already stored.');
        }

        const HashedPassword = await hash(password, 8);

        const user = usersRepository.create({
            name,
            email,
            password: HashedPassword,
        });

        await usersRepository.save(user);

        return user;
    }
}

export default CreateUserService;