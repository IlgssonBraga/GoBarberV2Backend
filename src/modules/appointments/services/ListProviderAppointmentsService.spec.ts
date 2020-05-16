import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointmentsService: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointmentsService', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeCacheProvider = new FakeCacheProvider();
        listProviderAppointmentsService = new ListProviderAppointmentsService(
            fakeAppointmentsRepository,
            fakeCacheProvider,
        );
    });
    it('should be able to list appointments on a specific day', async () => {
        const appointment1 = await fakeAppointmentsRepository.create({
            date: new Date(2020, 4, 20, 14),
            provider_id: 'provider',
            user_id: 'user',
        });

        const appointment2 = await fakeAppointmentsRepository.create({
            date: new Date(2020, 4, 20, 15),
            provider_id: 'provider',
            user_id: 'user',
        });

        const appointments = await listProviderAppointmentsService.execute({
            day: 20,
            month: 5,
            provider_id: 'provider',
            year: 2020,
        });

        expect(appointments).toEqual([appointment1, appointment2]);
    });
});
