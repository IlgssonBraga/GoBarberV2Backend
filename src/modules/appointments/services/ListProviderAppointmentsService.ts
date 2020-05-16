import { injectable, inject } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

@injectable()
class ListProviderAppointmentsService {
    constructor(
        @inject('AppointmentRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute({
        provider_id,
        month,
        day,
        year,
    }: IRequest): Promise<Appointment[]> {
        const cacheData = await this.cacheProvider.recover('aa');

        console.log(cacheData);

        const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
            {
                day,
                month,
                year,
                provider_id,
            },
        );

        // await this.cacheProvider.save('aa', 'sf');

        return appointments;
    }
}

export default ListProviderAppointmentsService;
