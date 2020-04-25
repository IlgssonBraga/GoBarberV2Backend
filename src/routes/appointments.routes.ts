import { Router } from 'express';
import { startOfHour, parseISO } from 'date-fns';
import AppointmentRepository from '../repositories/AppointmentRepository';

const appointmentsRouter = Router();

const appointmentRepository = new AppointmentRepository();

appointmentsRouter.get('/', (req, res) => {
    const appointments = appointmentRepository.all();
    return res.json(appointments);
});

appointmentsRouter.post('/', (req, res) => {
    const { provider, date } = req.body;

    const parsedDate = startOfHour(parseISO(date));

    const findAppointmentinSameDate = appointmentRepository.findByDate(
        parsedDate,
    );

    if (findAppointmentinSameDate) {
        return res.status(400).json({ error: 'Date unavailable.' });
    }

    const appointment = appointmentRepository.create({
        provider,
        date: parsedDate,
    });

    return res.json(appointment);
});

export default appointmentsRouter;
