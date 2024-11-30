import {describe, test, expect, beforeEach, afterEach, vi} from 'vitest';
import {getImageUrl} from "@/utils/imageUtils";

describe('getImageUrl', () => {
    const originalEnv = process.env;
    const mockBaseUrl = 'https://api.example.com';

    beforeEach(() => {
        process.env = {...originalEnv};
        process.env.REACT_APP_API_URL = mockBaseUrl;
        vi.spyOn(console, 'error').mockImplementation(() => {
        });
    });

    afterEach(() => {
        process.env = originalEnv;
        vi.restoreAllMocks();
    });

    test('should return empty string when imageUrl is undefined', () => {
        const result = getImageUrl(undefined);
        expect(result).toBe('');
    });

    test('should return original URL when it starts with http', () => {
        const imageUrl = 'https://example.com/image.jpg';
        const result = getImageUrl(imageUrl);
        expect(result).toBe(imageUrl);
    });

    test('should combine base URL with image path when filename has no underscore', () => {
        const imageUrl = '/images/simple-image.jpg';
        const result = getImageUrl(imageUrl);
        expect(result).toBe(`${mockBaseUrl}${imageUrl}`);
    });

    test('should handle filename with UUID and encode the rest of the filename', () => {
        const uuid = '123e4567-e89b-12d3-a456-426614174000';
        const originalFilename = 'my image with spaces.jpg';
        const imageUrl = `/images/${uuid}_${originalFilename}`;
        const expectedEncodedFilename = encodeURIComponent(originalFilename);

        const result = getImageUrl(imageUrl);

        expect(result).toBe(`${mockBaseUrl}/images/${uuid}_${expectedEncodedFilename}`);
    });

    test('should handle multiple underscores in filename', () => {
        const uuid = '123e4567-e89b-12d3-a456-426614174000';
        const originalFilename = 'my_image_with_underscores.jpg';
        const imageUrl = `/images/${uuid}_${originalFilename}`;
        const expectedEncodedFilename = encodeURIComponent(originalFilename);

        const result = getImageUrl(imageUrl);

        expect(result).toBe(`${mockBaseUrl}/images/${uuid}_${expectedEncodedFilename}`);
    });

    test('should handle special characters in filename', () => {
        const uuid = '123e4567-e89b-12d3-a456-426614174000';
        const originalFilename = 'image & special (chars).jpg';
        const imageUrl = `/images/${uuid}_${originalFilename}`;
        const expectedEncodedFilename = encodeURIComponent(originalFilename);

        const result = getImageUrl(imageUrl);

        expect(result).toBe(`${mockBaseUrl}/images/${uuid}_${expectedEncodedFilename}`);
    });

    test('should fallback to base URL concatenation when error occurs', () => {
        const malformedUrl = String('/images/123_test.jpg') as string;

        vi.spyOn(String.prototype, 'slice').mockImplementationOnce(() => {
            throw new Error('Simulated error');
        });

        const result = getImageUrl(malformedUrl);

        expect(console.error).toHaveBeenCalledWith('Error processing image URL:', expect.any(Error));
        expect(result).toBe(`${mockBaseUrl}${malformedUrl}`);

        vi.restoreAllMocks();
    });

    test('should handle missing REACT_APP_API_URL environment variable', () => {
        delete process.env.REACT_APP_API_URL;
        const imageUrl = '/images/image.jpg';
        const result = getImageUrl(imageUrl);

        expect(result).toBe(imageUrl);
    });
});