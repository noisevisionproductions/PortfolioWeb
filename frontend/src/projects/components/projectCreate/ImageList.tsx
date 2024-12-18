import React, {useState} from 'react';
import {X} from 'lucide-react';
import {ActionButton} from "@/components/shared/ActionButton";
import {ProjectImage} from "@/projects/types/project";

interface ImageListProps {
    images: (ProjectImage & { file?: File })[];
    onRemoveImage: (index: number) => void;
    t: (key: string) => string;
}

const encodeImageUrl = (url: string): string => {
    if (!url) return '';

    try {
        if (url.includes('/api/files/')) {
            const parts = url.split('/api/files/');
            if (parts.length !== 2) return url;

            const fileName = parts[1].split('/').map(part => encodeURIComponent(part)).join('/');
            return `${parts}/api/files/${fileName}`;
        }

        return encodeURI(url);
    } catch (error) {
        console.error('Error encoding image URL:', error);
        return url;
    }
};

export const ImageList: React.FC<ImageListProps> = ({images, onRemoveImage, t}) => {
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

    if (!images?.length) return null;

    const handleImageError = (imageUrl: string, index: number) => {
        console.error('Image loading error:', imageUrl);
        setImageErrors(prev => ({...prev, [index]: true}));
    };

    return (
        <div className="space-y-2 mt-4">
            {images.map((image, index) => {
                const encodeUrl = encodeImageUrl(image.imageUrl);
                const hasError = imageErrors[index];

                return (
                    <div
                        key={`image-${image.id || index}`}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded-md"
                    >
                        <div className="w-20 h-20 flex-shrink-0 relative">
                            {!hasError ? (
                                <img
                                    src={encodeUrl}
                                    alt={image.caption || t('projectForm.imageAlt')}
                                    className="w-full h-full object-cover rounded"
                                    onError={() => handleImageError(image.imageUrl, index)}
                                />
                            ) : (
                                <div
                                    className="w-full h-full  flex items-center justify-center bg-gray-200 rounded text-gray-500 text-xs text-center p-2">
                                    {t('projectForm.imageLoadError')}
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium">
                                {image.caption || t('projectForm.noCaption')}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                                {image.file ? t('projectForm.newImage') : t('projectForm.existingImage')}
                            </p>
                            {hasError && (
                                <p className="text-xs text-red-500">
                                    {t('projectForm.imageLoadErrorDetail')}
                                </p>
                            )}
                        </div>
                        <ActionButton
                            icon={<X className="h-5 w-5"/>}
                            onClick={() => onRemoveImage(index)}
                            variant="outline"
                            size="sm"
                            label=""
                            className="!p-1"
                            aria-label={t('projectForm.removeImage')}
                        />
                    </div>
                )
            })}
        </div>
    );
};