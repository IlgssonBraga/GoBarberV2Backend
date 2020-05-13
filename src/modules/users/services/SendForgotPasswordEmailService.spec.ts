import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUsersTokenRepository from '../repositories/fakes/FakeUsersTokenRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUsersTokenRepository: FakeUsersTokenRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUsersTokenRepository = new FakeUsersTokenRepository();

        sendForgotPasswordEmail = new SendForgotPasswordEmailService(
            fakeUsersRepository,
            fakeMailProvider,
            fakeUsersTokenRepository,
        );
    });
    it('should be able to recover the password using email', async () => {
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        await fakeUsersRepository.create({
            name: 'Ilgsson Braga',
            email: 'ilgsson@gmail.com',
            password: '123456',
        });

        await sendForgotPasswordEmail.execute({
            email: 'ilgsson@gmail.com',
        });

        expect(sendMail).toHaveBeenCalled();
    });

    it('should not be able to recover a non-existing user password', async () => {
        await expect(
            sendForgotPasswordEmail.execute({
                email: 'ilgsson@gmail.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should generate a forgot password token', async () => {
        const generate = jest.spyOn(fakeUsersTokenRepository, 'generate');

        const user = await fakeUsersRepository.create({
            name: 'Ilgsson Braga',
            email: 'ilgsson@gmail.com',
            password: '123456',
        });

        await sendForgotPasswordEmail.execute({
            email: 'ilgsson@gmail.com',
        });

        expect(generate).toHaveBeenCalledWith(user.id);
    });
});
