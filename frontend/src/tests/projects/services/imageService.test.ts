import {vi} from "vitest";
import {ProjectImage} from "@/projects/types/project";
import api from "@/utils/axios";
import {imageService} from "@/projects/services";

vi.mock('@/utils/axios');

describe('imageService', () => {
    const mockProjectId = 1;
    const mockImageId = 1;
    const mockFile = new File(['test'], 'test.jpg', {type: 'image/jpeg'});
    const mockProjectImage: ProjectImage = {
        id: mockImageId,
        imageUrl: 'https://example.com/test.jpg',
        caption: 'Test Image'
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('uploadProjectImage', () => {
        test('should upload image successfully', async () => {
            vi.mocked(api.post).mockResolvedValueOnce({data: mockProjectImage});

            const result = await imageService.uploadProjectImage(mockProjectId, mockFile);

            expect(api.post).toHaveBeenCalledTimes(1);
            expect(api.post).toHaveBeenCalledWith(
                `/api/projects/${mockProjectId}/images/upload`,
                expect.any(FormData),
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            expect(result).toEqual(mockProjectImage);
        });

        test('should handle upload error', async () => {
            const error = new Error('Upload failed');
            vi.mocked(api.post).mockRejectedValueOnce(error);

            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
            });

            await expect(imageService.uploadProjectImage(mockProjectId, mockFile))
                .rejects
                .toThrow('Upload failed');

            expect(consoleErrorSpy).toHaveBeenCalledWith('Error uploading image:', error);
            consoleErrorSpy.mockRestore();
        });
    });

    describe('addProjectImage', () => {
        const mockImageData: Omit<ProjectImage, 'id'> = {
            imageUrl: 'https://example.com/test.jpg',
            caption: 'Test Image'
        };

        test('should add project image successfully', async () => {
            vi.mocked(api.post).mockResolvedValueOnce({data: mockProjectImage});

            const result = await imageService.addProjectImage(mockProjectId, mockImageData);

            expect(api.post).toHaveBeenCalledWith(
                `/api/projects/${mockProjectId}/images`,
                mockImageData
            );
            expect(result).toEqual(mockProjectImage);
        });

        test('should handle add image error', async () => {
            const error = new Error('Add image failed');
            vi.mocked(api.post).mockRejectedValueOnce(error);

            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
            });

            await expect(imageService.addProjectImage(mockProjectId, mockImageData))
                .rejects
                .toThrow('Add image failed');

            expect(consoleErrorSpy).toHaveBeenCalledWith('Error adding project image:', error);
            consoleErrorSpy.mockRestore();
        });
    });

    describe('deleteProjectImage', () => {
        test('should delete project image successfully', async () => {
            vi.mocked(api.delete).mockResolvedValueOnce({});

            await imageService.deleteProjectImage(mockProjectId, mockImageId);

            expect(api.delete).toHaveBeenCalledWith(
                `/api/projects/${mockProjectId}/images/${mockImageId}`
            );
        });

        test('should handle delete error', async () => {
            const error = new Error('Delete failed');
            vi.mocked(api.delete).mockRejectedValueOnce(error);

            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
            });

            await expect(imageService.deleteProjectImage(mockProjectId, mockImageId))
                .rejects
                .toThrow('Delete failed');

            expect(consoleErrorSpy).toHaveBeenCalledWith('Error deleting project image:', error);
            consoleErrorSpy.mockRestore();
        });
    });
});