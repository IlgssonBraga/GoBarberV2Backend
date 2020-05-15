import { startOfHour, isBefore, getHours } from 'date-fns';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
    provider_id: string;
    user_id: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {
    constructor(
        @inject('AppointmentRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    public async execute({
        provider_id,
        date,
        user_id,
    }: IRequest): Promise<Appointment> {
        const appointmentDate = startOfHour(date);

        if (isBefore(appointmentDate, Date.now())) {
            throw new AppError("You can't create appointment on past date");
        }

        if (user_id === provider_id) {
            throw new AppError("You can't create appointment with yourself");
        }

        if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
            throw new AppError(
                "You can't create appointment before 8am and after 5pm",
            );
        }

        const findAppointmentinSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate,
        );

        if (findAppointmentinSameDate) {
            throw new AppError('Date unavailable');
        }

        const appointment = await this.appointmentsRepository.create({
            provider_id,
            date: appointmentDate,
            user_id,
        });

        return appointment;
    }
}

export default CreateAppointmentService;
