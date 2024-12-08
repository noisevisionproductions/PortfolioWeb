import {vi} from "vitest";
import {imageService} from "@/projects/services";
import {ProjectImage} from "@/projects/types/project";
import {ProjectImageContext, ProjectImageProvider} from "@/projects/context/ProjectImageContext";
import React, {useContext} from "react";
import {act, render, screen, waitFor} from "@testing-library/react";
import {mockConsoleError, setupCommonMocks} from '@/tests/unit/__mocks__/commonMocks';
import {BaseProjectProvider} from "@/projects/context/BaseProjectContext";

setupCommonMocks();
mockConsoleError();

vi.mock('@/projects/services', () => ({
    imageService: {
        uploadProjectImage: vi.fn(),
        deleteProjectImage: vi.fn(),
    }
}));

const mockProjectImage: ProjectImage = {
    imageUrl: "",
    id: 1
};

const mockImageFile = new File(['test'], 'test.png', {type: 'image/png'});

const TestComponent = () => {
    const context = useContext(ProjectImageContext);
    if (!context) throw new Error('Context not provided');

    return (
        <div>
            <button
                onClick={() => context.uploadProjectImage(1, mockImageFile)}
                data-testid="upload-button"
            >
                Upload Image
            </button>
            <button
                onClick={() => context.deleteProjectImage(1, 1)}
                data-testid="delete-button"
            >
                Delete Image
            </button>
            {context.loading && <div data-testid="loading">Loading...</div>}
            {context.error && <div data-testid="error-message">{context.error}</div>}
        </div>
    );
};

const renderWithProviders = (component: React.ReactNode) => {
    return render(
        <BaseProjectProvider>
            <ProjectImageProvider>
                {component}
            </ProjectImageProvider>
        </BaseProjectProvider>
    );
};

describe('ProjectImageProvider', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should render provider without crashing', () => {
        renderWithProviders(<TestComponent/>);
        expect(screen.getByTestId('upload-button')).toBeInTheDocument();
        expect(screen.getByTestId('delete-button')).toBeInTheDocument();
    });

    describe('uploadProjectImage', () => {
        test('should show loading state when uploading image', async () => {
            vi.mocked(imageService.uploadProjectImage).mockImplementation(
                () => new Promise(resolve => setTimeout(resolve, 100))
            );

            renderWithProviders(<TestComponent/>);

            const button = screen.getByTestId('upload-button');
            await act(async () => {
                button.click();
            });

            expect(screen.getByTestId('loading')).toBeInTheDocument();
        });

        test('should successfully upload image', async () => {
            vi.mocked(imageService.uploadProjectImage).mockResolvedValue(mockProjectImage);

            renderWithProviders(<TestComponent/>);

            const button = screen.getByTestId('upload-button');
            await act(async () => {
                button.click();
            });

            await waitFor(() => {
                expect(imageService.uploadProjectImage).toHaveBeenCalledWith(1, mockImageFile);
                expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
                expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
            });
        });

        test('should handle error when uploading image fails', async () => {
            const error = new Error('Failed to upload image');
            vi.mocked(imageService.uploadProjectImage).mockRejectedValueOnce(error);

            renderWithProviders(<TestComponent/>);

            const button = screen.getByTestId('upload-button');
            await act(async () => {
                button.click();
            });

            await waitFor(() => {
                expect(screen.getByTestId('error-message'))
                    .toHaveTextContent('errors.image.add');
            });

            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
            expect(console.error).toHaveBeenCalledWith(error);
        });
    });

    describe('deleteProjectImage', () => {
        test('should show loading state when deleting image', async () => {
            vi.mocked(imageService.deleteProjectImage).mockImplementation(
                () => new Promise(resolve => setTimeout(resolve, 100))
            );

            renderWithProviders(<TestComponent/>);

            const button = screen.getByTestId('delete-button');
            await act(async () => {
                button.click();
            });

            expect(screen.getByTestId('loading')).toBeInTheDocument();
        });

        test('should successfully delete image', async () => {
            vi.mocked(imageService.deleteProjectImage).mockResolvedValue(undefined);

            renderWithProviders(<TestComponent/>);

            const button = screen.getByTestId('delete-button');
            await act(async () => {
                button.click();
            });

            await waitFor(() => {
                expect(imageService.deleteProjectImage).toHaveBeenCalledWith(1, 1);
                expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
                expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
            });
        });

        test('should handle error when deleting image fails', async () => {
            const error = new Error('Failed to delete image');
            vi.mocked(imageService.deleteProjectImage).mockRejectedValueOnce(error);

            renderWithProviders(<TestComponent/>);

            const button = screen.getByTestId('delete-button');
            await act(async () => {
                button.click();
            });

            await waitFor(() => {
                expect(screen.getByTestId('error-message'))
                    .toHaveTextContent('errors.image.delete');
            });

            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
            expect(console.error).toHaveBeenCalledWith(error);
        });
    });
});