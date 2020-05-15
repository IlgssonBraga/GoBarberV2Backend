import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmetService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointments', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        createAppointmentService = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );
    });
    it('should be able to create a new appointment', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 9).getTime();
        });
        const appointment = await createAppointmentService.execute({
            date: new Date(2020, 4, 10, 11),
            provider_id: '123',
            user_id: '1234',
        });

        expect(appointment).toHaveProperty('id');
    });

    it('should not be able to create two appointments on the same time', async () => {
        /* jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        }); */

        const appointmentDate = new Date(2020, 4, 20, 12);

        await createAppointmentService.execute({
            date: appointmentDate,
            provider_id: '1234',
            user_id: '12345',
        });

        await expect(
            createAppointmentService.execute({
                date: appointmentDate,
                provider_id: '1234',
                user_id: '12345',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
    it('should not be able to create appointments on the past date', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12, 0, 0).getTime();
        });

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 10, 11, 0, 0),
                provider_id: '123',
                user_id: '1234',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
    it('should not be able to create appointment with same user as provider', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12, 0, 0).getTime();
        });

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 10, 13, 0, 0),
                provider_id: '123',
                user_id: '123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
    it('should not be able to create appointments before 8am and after 5pm', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12, 0, 0).getTime();
        });

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 11, 7),
                provider_id: '123',
                user_id: '1234',
            }),
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 11, 18),
                provider_id: '123',
                user_id: '1234',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
