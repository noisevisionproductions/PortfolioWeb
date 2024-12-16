import {useEffect, useState} from "react";
import {RegistrationEvent, RegistrationStats} from "@/kafka/types/registrationEvent";
import {registrationStatsService} from "@/kafka/services/registrationStatsService";

export const useRegistrationStats = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<RegistrationStats | null>(null);
    const [recentEvents, setRecentEvents] = useState<RegistrationEvent[]>([]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await registrationStatsService.getStats();
            setStats(data);
        } catch (err) {
            setError('kafka.errors.stats.statsFetchFailed');
            console.error('Error fetching stats:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecentEvents = async (limit: number = 10) => {
        try {
            setLoading(true);
            setError(null);
            const data = await registrationStatsService.getRecentRegistrations(limit);
            setRecentEvents(data);
        } catch (err) {
            setError('kafka.errors.stats.recentRegistrationsFetchFailed');
            console.error('Error fetching recent events:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRegistrationsForPeriod = async (stats: Date, end: Date) => {
        try {
            setLoading(true);
            setError(null);
            const data = await registrationStatsService.getRegistrationsForPeriod(stats, end);
            setRecentEvents(data);
        } catch (err) {
            setError('kafka.errors.stats.registrationsForPeriodFetchFailed');
            console.error('Error fetching period events:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                await Promise.all([
                    fetchStats(),
                    fetchRecentEvents()
                ]);
            } catch (error) {
                console.error('Error fetching initial data:', error);
            } finally {
                setLoading(false);
            }
        }

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