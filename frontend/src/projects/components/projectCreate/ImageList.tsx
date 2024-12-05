import React from 'react';
import {X} from 'lucide-react';
import {ActionButton} from "@/components/shared/ActionButton";
import {ProjectImage} from "@/projects/types/project";

interface ImageListProps {
    images: (ProjectImage & { file?: File })[];
    onRemoveImage: (index: number) => void;
    t: (key: string) => string;
}

export const ImageList: React.FC<ImageListProps> = ({images, onRemoveImage, t}) => {
    if (!images?.length) return null;

    return (
        <div className="space-y-2 mt-4">
            {images.map((image, index) => (
                <div
                    key={`image-${image.id || index}`}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded-md"
                >
                    <div className="w-20 h-20 flex-shrink-0">
                        <img
                            src={image.imageUrl}
                            alt={image.caption || t('projectForm.imageAlt')}
                            className="w-full h-full object-cover rounded"
                        />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium">
                            {image.caption || t('projectForm.noCaption')}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                            {image.file ? t('projectForm.newImage') : t('projectForm.existingImage')}
                        </p>
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
            ))}
        </div>
    );
};