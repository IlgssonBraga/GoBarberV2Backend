import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from './AuthenticateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUserService: AuthenticateUserService;

describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        authenticateUserService = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it('should be able to authenticate', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Ilgsson',
            email: 'ilgsson@gmail.com',
            password: '123456',
        });

        const response = await authenticateUserService.execute({
            email: 'ilgsson@gmail.com',
            password: '123456',
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toBe(user);
    });

    it('should not be able to authenticate with non existing user', async () => {
        await expect(
            authenticateUserService.execute({
                email: 'ilgsson@gmail.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate with wrong password', async () => {
        await fakeUsersRepository.create({
            name: 'Ilgsson',
            email: 'ilgsson@gmail.com',
            password: '123456',
        });

        await expect(
            authenticateUserService.execute({
                email: 'ilgsson@gmail.com',
                password: 'wrong-password',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
