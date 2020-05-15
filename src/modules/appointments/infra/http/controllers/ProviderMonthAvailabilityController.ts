import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class ProviderMonthAvailabilityController {
    async index(req: Request, res: Response): Promise<Response> {
        const { month, year } = req.body;
        const { id } = req.params;

        const listProviderMonthAvailability = container.resolve(
            ListProviderMonthAvailabilityService,
        );

        const availability = await listProviderMonthAvailability.execute({
            month,
            provider_id: id,
            year,
        });

        return res.json(availability);
    }
}
