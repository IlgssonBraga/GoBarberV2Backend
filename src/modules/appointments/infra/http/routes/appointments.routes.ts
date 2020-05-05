import { Router } from 'express';
import { parseISO } from 'date-fns';
import AppointmentRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmetService';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const appointmentsRouter = Router();

const appointmentsRepository = new AppointmentRepository();

appointmentsRouter.use(ensureAuthenticated);

/* appointmentsRouter.get('/', async (req, res) => {
    const appointmentRepository = getCustomRepository(AppointmentRepository);
    const appointments = await appointmentRepository.find();
    return res.json(appointments);
}); */

appointmentsRouter.post('/', async (req, res) => {
    const { provider_id, date } = req.body;

    const parsedDate = parseISO(date);

    const createAppointment = new CreateAppointmentService(
        appointmentsRepository,
    );

    const appointment = await createAppointment.execute({
        date: parsedDate,
        provider_id,
    });

    return res.json(appointment);
});

export default appointmentsRouter;
