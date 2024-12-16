import api from "@/utils/axios";
import {RegistrationEvent, RegistrationStats} from "@/kafka/types/registrationEvent";

export const registrationStatsService = {
    getStats: async (): Promise<RegistrationStats> => {
        const response = await api.get<RegistrationStats>('/api/kafka/stats/registrations');
        return response.data;
    },

    getRecentRegistrations: async (limit: number = 10): Promise<RegistrationEvent[]> => {
        const response = await api.get<RegistrationEvent[]>(
            '/api/kafka/stats/registrations/recent',
            {params: {limit}}
        );
        return response.data;
    },

    getRegistrationsForPeriod: async (
        start: Date,
        end: Date
    ): Promise<RegistrationEvent[]> => {
        const response = await api.get<RegistrationEvent[]>(
            '/api/kafka/stats/registrations/period',
            {
                params: {
                    start: start.toISOString(),
                    end: end.toISOString()
                }
            }
        );
        return response.data;
    }
};