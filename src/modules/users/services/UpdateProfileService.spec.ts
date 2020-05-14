import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        updateProfile = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });
    it('should be able update the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Ilgsson',
            email: 'ilgsson@gmail.com',
            password: '123456',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'Ilgsson Braga',
            email: 'ilgsson2@gmail.com',
        });

        expect(updatedUser.name).toBe('Ilgsson Braga');
        expect(updatedUser.email).toBe('ilgsson2@gmail.com');
    });

    it('should not be able to change e-mail if alread exists.', async () => {
        await fakeUsersRepository.create({
            name: 'Ilgsson',
            email: 'ilgsson@gmail.com',
            password: '123456',
        });

        const userTest = await fakeUsersRepository.create({
            name: 'Ilgner',
            email: 'ilg@gmail.com',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                user_id: userTest.id,
                name: 'IlgnerBraga',
                email: 'ilgsson@gmail.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Ilgsson',
            email: 'ilgsson@gmail.com',
            password: '123456',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'Ilgsson Braga',
            email: 'ilgsson2@gmail.com',
            old_password: '123456',
            password: '123123',
        });

        expect(updatedUser.name).toBe('Ilgsson Braga');
        expect(updatedUser.email).toBe('ilgsson2@gmail.com');
        expect(updatedUser.password).toBe('123123');
    });

    it('should be able to update the password only with old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Ilgsson',
            email: 'ilgsson@gmail.com',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'Ilgsson Braga',
                email: 'ilgsson2@gmail.com',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
    it('should not be able to update the password with wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Ilgsson',
            email: 'ilgsson@gmail.com',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'Ilgsson Braga',
                email: 'ilgsson2@gmail.com',
                old_password: 'wrong-old-password',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
