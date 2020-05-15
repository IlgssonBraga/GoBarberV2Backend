import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

export default class ProviderAppointmentsController {
    async index(req: Request, res: Response): Promise<Response> {
        const { month, day, year } = req.body;
        const provider_id = req.user.id;

        const listProviderAppointmentsService = container.resolve(
            ListProviderAppointmentsService,
        );

        const appointments = await listProviderAppointmentsService.execute({
            day,
            month,
            year,
            provider_id,
        });

        return res.json(appointments);
    }
}
