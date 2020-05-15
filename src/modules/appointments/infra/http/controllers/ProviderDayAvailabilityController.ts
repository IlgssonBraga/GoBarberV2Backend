import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailabilityController {
    async index(req: Request, res: Response): Promise<Response> {
        const { month, day, year } = req.body;
        const { id } = req.params;

        const listProviderDayAvailability = container.resolve(
            ListProviderDayAvailabilityService,
        );

        const availability = await listProviderDayAvailability.execute({
            day,
            month,
            year,
            provider_id: id,
        });

        return res.json(availability);
    }
}
