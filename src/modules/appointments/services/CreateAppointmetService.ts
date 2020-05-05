import { startOfHour } from 'date-fns';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
    provider_id: string;
    date: Date;
}

class CreateAppointmentService {
    constructor(private appointmentsRepository: IAppointmentsRepository) {}

    public async execute({
        provider_id,
        date,
    }: IRequest): Promise<Appointment> {
        const appointmentDate = startOfHour(date);

        const findAppointmentinSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate,
        );

        if (findAppointmentinSameDate) {
            throw new AppError('Date unavailable');
        }

        const appointment = await this.appointmentsRepository.create({
            provider_id,
            date: appointmentDate,
        });

        return appointment;
    }
}

export default CreateAppointmentService;
