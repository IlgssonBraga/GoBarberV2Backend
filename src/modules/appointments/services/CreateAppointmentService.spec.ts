import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmetService';

describe('CreateAppointments', () => {
    it('should be able to create a new appointment', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const createAppointmentService = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );

        const appointment = await createAppointmentService.execute({
            date: new Date(),
            provider_id: '123',
        });

        expect(appointment).toHaveProperty('id');
    });

    /*
    it('should not be able to create two appointments on the same time', () => {
        expect(1 + 2).toBe(3);
    }); */
});
