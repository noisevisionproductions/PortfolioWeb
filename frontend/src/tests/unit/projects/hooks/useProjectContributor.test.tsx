import {vi, describe, test, expect} from 'vitest';
import {renderHook} from '@testing-library/react';
import {useProjectContributor} from '@/projects/hooks/useProjectContributor';
import {ProjectContributorContext} from '@/projects/context/ProjectContributorContext';
import {Contributor} from '@/projects/types/project';
import React from 'react';

type Props = {
    children: React.ReactNode;
};

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key
    })
}));

describe('useProjectContributor', () => {
    const mockAddContributor = vi.fn();

    const MockProjectContributorProvider = ({children}: Props) => {
        const value = {
            loading: false,
            error: null,
            addContributor: mockAddContributor
        };

        return (
            <ProjectContributorContext.Provider value={value}>
                {children}
            </ProjectContributorContext.Provider>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should return context values when used within provider', () => {
        const {result} = renderHook(() => useProjectContributor(), {
            wrapper: MockProjectContributorProvider
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.addContributor).toBeDefined();
    });

    test('should throw error when used outside provider', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
        });

        expect(() => {
            renderHook(() => useProjectContributor());
        }).toThrow('useProjectContributor must be used within a ProjectContributorProvider');

        consoleErrorSpy.mockRestore();
    });

    test('should be able to call addContributor method', () => {
        const mockContributor: Contributor = {
            name: 'Test User',
            role: 'Developer',
            profileUrl: 'https://github.com/testuser'
        };

        const {result} = renderHook(() => useProjectContributor(), {
            wrapper: MockProjectContributorProvider
        });

        result.current.addContributor(1, mockContributor);

        expect(mockAddContributor).toHaveBeenCalledTimes(1);
        expect(mockAddContributor).toHaveBeenCalledWith(1, mockContributor);
    });
});