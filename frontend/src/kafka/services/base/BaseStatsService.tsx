import {BaseEvent} from "@/kafka/types/baseEvent";
import api from "@/utils/axios";

export abstract class BaseStatsService<T extends BaseEvent> {
    protected constructor(protected readonly basePath: string) {
    }

    protected async getRecentEvents(limit: number = 10): Promise<T[]> {
        const response = await api.get<T[]>(
            `${this.basePath}/recent`,
            {params: {limit}}
        );
        return response.data;
    }

    protected async getEventsForPeriod(start: Date, end: Date): Promise<T[]> {
        const response = await api.get<T[]>(
            `${this.basePath}/period`,
            {
                params: {
                    start: start.toISOString(),
                    end: end.toISOString()
                }
            }
        );
        return response.data;
    }
}