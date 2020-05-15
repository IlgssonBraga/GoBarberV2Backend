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
        const appointment = await createAppointmentService.execute({
            date: new Date(),
            provider_id: '123',
            user_id: '1234',
        });

        expect(appointment).toHaveProperty('id');
    });

    it('should not be able to create two appointments on the same time', async () => {
        const appointmentDate = new Date(2020, 4, 10, 11);

        await createAppointmentService.execute({
            date: appointmentDate,
            provider_id: '1234',
            user_id: '1234',
        });

        expect(
            createAppointmentService.execute({
                date: appointmentDate,
                provider_id: '1234',
                user_id: '1234',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
