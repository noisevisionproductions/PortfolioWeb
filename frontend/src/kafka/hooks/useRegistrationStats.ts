import {useEffect, useState} from "react";
import {RegistrationEvent, RegistrationStats} from "@/kafka/types/registrationEvent";
import {registrationStatsService} from "@/kafka/services/registrationStatsService";
import {useBaseStats} from "@/kafka/hooks/base/useBaseStats";

export const useRegistrationStats = () => {
    const {loading, error, events: recentEvents, setEvents, handleRequest} =
        useBaseStats<RegistrationEvent>();
    const [stats, setStats] = useState<RegistrationStats | null>(null);

    const fetchStats = async () => {
        const data = await handleRequest(
            () => registrationStatsService.getStats(),
            'kafka.errors.statsFetchFailed'
        );
        if (data) setStats(data);
    };

    const fetchRecentEvents = async (limit: number = 10) => {
        const data = await handleRequest(
            () => registrationStatsService.getRecentRegistrations(limit),
            'kafka.errors.recentEventsFetchFailed'
        );
        if (data) setEvents(data);
    };

    const fetchRegistrationsForPeriod = async (start: Date, end: Date) => {
        const data = await handleRequest(
            () => registrationStatsService.getRegistrationsForPeriod(start, end),
            'kafka.errors.registrationsForPeriodFetchFailed'
        );
        if (data) setEvents(data);
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            await Promise.all([
                fetchStats(),
                fetchRecentEvents()
            ]);
        };

        void fetchInitialData();
    }, []);

    return {
        loading,
        error,
        stats,
        recentEvents,
        fetchStats,
        fetchRecentEvents,
        fetchRegistrationsForPeriod
    };
};