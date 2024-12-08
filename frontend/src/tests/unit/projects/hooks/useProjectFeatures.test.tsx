import { vi, describe, test, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useProjectFeature} from "@/projects/hooks/useProjectFeatures";
import { ProjectFeatureContext } from '@/projects/context/ProjectFeatureContext';
import React from 'react';

type Props = {
    children: React.ReactNode;
};

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key
    })
}));

describe('useProjectFeature', () => {
    const mockUpdateFeatures = vi.fn();

    const MockProjectFeatureProvider = ({ children }: Props) => {
        const value = {
            loading: false,
            error: null,
            updateFeatures: mockUpdateFeatures
        };

        return (
            <ProjectFeatureContext.Provider value={value}>
                {children}
            </ProjectFeatureContext.Provider>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should return context values when used within provider', () => {
        const { result } = renderHook(() => useProjectFeature(), {
            wrapper: MockProjectFeatureProvider
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.updateFeatures).toBeDefined();
    });

    test('should throw error when used outside provider', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => {
            renderHook(() => useProjectFeature());
        }).toThrow('useProjectFeature must be used within a ProjectFeatureProvider');

        consoleErrorSpy.mockRestore();
    });

    test('should be able to call updateFeatures method', () => {
        const mockFeatures = ['Feature 1', 'Feature 2'];

        const { result } = renderHook(() => useProjectFeature(), {
            wrapper: MockProjectFeatureProvider
        });

        result.current.updateFeatures(1, mockFeatures);

        expect(mockUpdateFeatures).toHaveBeenCalledTimes(1);
        expect(mockUpdateFeatures).toHaveBeenCalledWith(1, mockFeatures);
    });
});