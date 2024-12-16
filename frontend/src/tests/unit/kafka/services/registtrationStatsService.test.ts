import {vi, expect, describe, beforeEach, test} from "vitest";
import api from "@/utils/axios";
import {EventStatus} from "@/kafka/types/registrationEvent";
import {registrationStatsService} from "@/kafka/services/registrationStatsService";

vi.mock('@/utils/axios', () => ({
    default: {
        get: vi.fn()
    }
}));

describe('registrationStatsService', () => {
    const mockStats = {
        totalRegistrations: 100,
        successfulRegistration: 90,
        failedRegistrations: 10,
        successRate: 0.9,
        recentEvents: []
    };

    const mockRegistrationEvent = {
        id: 1,
        userId: 'test-user',
        email: 'test@example.com',
        name: 'Test User',
        companyName: 'Test Company',
        timestamp: '2024-01-01T12:00:00Z',
        status: EventStatus.SUCCESS
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should fetch registration stats successfully', async () => {
        vi.mocked(api.get).mockResolvedValueOnce({data: mockStats});

        const result = await registrationStatsService.getStats();

        expect(api.get).toHaveBeenCalledWith('/api/kafka/stats/registrations');
        expect(result).toEqual(mockStats);
    });

    test('should handle error when fetching stats', async () => {
        const error = new Error('Failed to fetch stats');
        vi.mocked(api.get).mockRejectedValueOnce(error);

        await expect(registrationStatsService.getStats())
            .rejects
            .toThrow('Failed to fetch stats');
    });

    test('should fetch recent registrations with default limit', async () => {
        vi.mocked(api.get).mockResolvedValueOnce({data: [mockRegistrationEvent]});

        const result = await registrationStatsService.getRecentRegistrations();

        expect(api.get).toHaveBeenCalledWith(
            '/api/kafka/stats/registrations/recent',
            {params: {limit: 10}}
        );
        expect(result).toEqual([mockRegistrationEvent]);
    });

    test('should fetch recent registrations with custom limit', async () => {
        vi.mocked(api.get).mockResolvedValueOnce({data: [mockRegistrationEvent]});

        const result = await registrationStatsService.getRecentRegistrations(5);

        expect(api.get).toHaveBeenCalledWith(
            '/api/kafka/stats/registrations/recent',
            {params: {limit: 5}}
        );
        expect(result).toEqual([mockRegistrationEvent]);
    });

    test('should handle error when fetching recent registrations', async () => {
        const error = new Error('Failed to fetch recent registrations');
        vi.mocked(api.get).mockRejectedValueOnce(error);

        await expect(registrationStatsService.getRecentRegistrations())
            .rejects
            .toThrow('Failed to fetch recent registrations');
    });

    test('should fetch registrations for period', async () => {
        vi.mocked(api.get).mockResolvedValueOnce({data: [mockRegistrationEvent]});

        const startDate = new Date('2024-01-01');
        const endDate = new Date('2024-01-31');

        const result = await registrationStatsService.getRegistrationsForPeriod(
            startDate,
            endDate
        );

        expect(api.get).toHaveBeenCalledWith(
            '/api/kafka/stats/registrations/period',
            {
                params: {
                    start: startDate.toISOString(),
                    end: endDate.toISOString()
                }
            }
        );
        expect(result).toEqual([mockRegistrationEvent]);
    });

    test('should handle error when fetching registrations for period', async () => {
        const error = new Error('Failed to fetch period registrations');
        vi.mocked(api.get).mockRejectedValueOnce(error);

        const startDate = new Date('2024-01-01');
        const endDate = new Date('2024-01-31');

        await expect(
            registrationStatsService.getRegistrationsForPeriod(startDate, endDate)
        ).rejects.toThrow('Failed to fetch period registrations');
    });
});
