import {BaseStatsService} from "@/kafka/services/base/BaseStatsService";
import {RegistrationEvent, RegistrationStats} from "@/kafka/types/registrationEvent";
import api from "@/utils/axios";

class RegistrationStatsService extends BaseStatsService<RegistrationEvent> {
    constructor() {
        super('/api/kafka/stats/registrations');
    }

    async getStats(): Promise<RegistrationStats> {
        const response = await api.get<RegistrationStats>(this.basePath);
        return response.data;
    }

    async getRecentRegistrations(limit: number = 10): Promise<RegistrationEvent[]> {
        return this.getRecentEvents(limit);
    }

    async getRegistrationsForPeriod(start: Date, end: Date): Promise<RegistrationEvent[]> {
        return this.getEventsForPeriod(start, end);
    }
}

export const registrationStatsService = new RegistrationStatsService();