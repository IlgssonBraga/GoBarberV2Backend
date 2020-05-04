import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import Appointment from '../models/Appointment';
import AppointmentRepository from '../repositories/AppointmentRepository';
import AppError from '../errors/AppError';

interface Request {
    provider_id: string;
    date: Date;
}

class CreateAppointmentService {
    public async execute({ provider_id, date }: Request): Promise<Appointment> {
        const appointmentRepository = getCustomRepository(
            AppointmentRepository,
        );

        const appointmentDate = startOfHour(date);

        const findAppointmentinSameDate = await appointmentRepository.findByDate(
            appointmentDate,
        );

        if (findAppointmentinSameDate) {
            throw new AppError('Date unavailable');
        }

        const appointment = appointmentRepository.create({
            provider_id,
            date: appointmentDate,
        });

        await appointmentRepository.save(appointment);

        return appointment;
    }
}

export default CreateAppointmentService;
