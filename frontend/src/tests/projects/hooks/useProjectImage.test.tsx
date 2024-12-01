import { vi, describe, test, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useProjectImage } from '@/projects/hooks/useProjectImage';
import { ProjectImageContext } from '@/projects/context/ProjectImageContext';
import React from 'react';

type Props = {
    children: React.ReactNode;
};

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key
    })
}));

describe('useProjectImage', () => {
    const mockUploadProjectImage = vi.fn();
    const mockDeleteProjectImage = vi.fn();

    const MockProjectImageProvider = ({ children }: Props) => {
        const value = {
            loading: false,
            error: null,
            uploadProjectImage: mockUploadProjectImage,
            deleteProjectImage: mockDeleteProjectImage
        };

        return (
            <ProjectImageContext.Provider value={value}>
                {children}
            </ProjectImageContext.Provider>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should return context values when used within provider', () => {
        const { result } = renderHook(() => useProjectImage(), {
            wrapper: MockProjectImageProvider
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.uploadProjectImage).toBeDefined();
        expect(result.current.deleteProjectImage).toBeDefined();
    });

    test('should throw error when used outside provider', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => {
            renderHook(() => useProjectImage());
        }).toThrow('useProjectImage must be used within a ProjectImageProvider');

        consoleErrorSpy.mockRestore();
    });

    test('should be able to call uploadProjectImage method', async () => {
        const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
        const mockProjectId = 1;

        const { result } = renderHook(() => useProjectImage(), {
            wrapper: MockProjectImageProvider
        });

        await result.current.uploadProjectImage(mockProjectId, mockFile);

        expect(mockUploadProjectImage).toHaveBeenCalledTimes(1);
        expect(mockUploadProjectImage).toHaveBeenCalledWith(mockProjectId, mockFile);
    });

    test('should be able to call deleteProjectImage method', async () => {
        const mockProjectId = 1;
        const mockImageId = 2;

        const { result } = renderHook(() => useProjectImage(), {
            wrapper: MockProjectImageProvider
        });

        await result.current.deleteProjectImage(mockProjectId, mockImageId);

        expect(mockDeleteProjectImage).toHaveBeenCalledTimes(1);
        expect(mockDeleteProjectImage).toHaveBeenCalledWith(mockProjectId, mockImageId);
    });
});