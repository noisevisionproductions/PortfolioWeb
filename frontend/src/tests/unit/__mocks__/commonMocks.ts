import {vi} from 'vitest';

export const setupCommonMocks = () => {
    vi.mock('@/projects/hooks/useBaseProject', () => ({
        useBaseProject: () => ({
            fetchProjects: vi.fn(),
        })
    }));

    vi.mock('react-i18next', () => ({
        useTranslation: () => ({
            t: (key: string) => key
        })
    }));
};

export const mockConsoleError = () => {
    const originalConsoleError = console.error;

    beforeAll(() => {
        console.error = vi.fn();
    });

    afterAll(() => {
        console.error = originalConsoleError;
    });
};