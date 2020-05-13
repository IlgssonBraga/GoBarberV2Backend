// import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUsersTokenRepository from '../repositories/fakes/FakeUsersTokenRepository';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUsersTokenRepository: FakeUsersTokenRepository;
let resetPasswordService: ResetPasswordService;

describe('ResetPassword', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUsersTokenRepository = new FakeUsersTokenRepository();

        resetPasswordService = new ResetPasswordService(
            fakeUsersRepository,
            fakeUsersTokenRepository,
        );
    });

    it('should be able to reset the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Ilgsson Braga',
            email: 'ilgsson@gmail.com',
            password: '123456',
        });

        const { token } = await fakeUsersTokenRepository.generate(user.id);

        await resetPasswordService.execute({
            password: '123457',
            token,
        });

        const updatedUser = await fakeUsersRepository.findById(user.id);

        expect(updatedUser?.password).toBe('123457');
    });
});
