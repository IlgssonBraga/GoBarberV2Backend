import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmetService';

export default class AppointmentsController {
    async create(req: Request, res: Response): Promise<Response> {
        const { provider_id, date } = req.body;
        const user_id = req.user.id;

        const createAppointment = container.resolve(CreateAppointmentService);

        const appointment = await createAppointment.execute({
            user_id,
            date,
            provider_id,
        });

        return res.json(appointment);
    }
}
