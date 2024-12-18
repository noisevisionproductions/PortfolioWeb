import {BaseEvent} from "@/kafka/types/baseEvent";
import {useState} from "react";

export function useBaseStats<T extends BaseEvent>() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [events, setEvents] = useState<T[]>([]);

    const handleRequest = async <R>(
        request: () => Promise<R>,
        errorMessage: string
    ): Promise<R | null> => {
        try {
            setLoading(true);
            setError(null);
            return await request();
        } catch (err) {
            setError(errorMessage);
            console.error(`Error: ${errorMessage}`, err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        events,
        setEvents,
        handleRequest
    };
}