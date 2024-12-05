export const getImageUrl = (imageUrl: string | undefined): string => {
    if (!imageUrl || imageUrl.startsWith('http')) {
        return imageUrl || '';
    }

    const baseUrl = (import.meta.env.VITE_API_URL as string);

    try {
        const lastPartIndex = imageUrl.lastIndexOf('/');
        const filename = imageUrl.slice(lastPartIndex + 1);

        if (!filename.includes('_')) {
            return `${baseUrl}${imageUrl}`;
        }

        const [uuid, ...filenameParts] = filename.split('_');
        const encodedFilename = encodeURIComponent(filenameParts.join('_'));

        return `${baseUrl}${imageUrl.slice(0, lastPartIndex + 1)}${uuid}_${encodedFilename}`;
    } catch (error) {
        console.error('Error processing image URL:', error);
        return `${baseUrl}${imageUrl}`;
    }
};