import React from 'react';
import {Trash2} from 'lucide-react';
import {ProjectImage} from "@/projects/types/project";
import {ImageViewerImage} from "@/projects/types/images";
import {ImageViewer} from "@/components/shared/ImageViewer";

interface ProjectImagesProps {
    images: ProjectImage[];
    projectName: string;
    onImageDelete: (imageId: number) => void;
    getImageUrl: (url: string) => string;
}

export const ProjectImages: React.FC<ProjectImagesProps> = ({
                                                                images,
                                                                projectName,
                                                                onImageDelete,
                                                                getImageUrl
                                                            }) => {
    if (!images || images.length === 0) {
        return null;
    }

    const mappedImages: ImageViewerImage[] = images.map(image => ({
        id: image.id,
        url: image.imageUrl || '',
        alt: image.caption || projectName,
        caption: image.caption
    }));

    const renderImageDeleteButton = (imageId: number) => {
        if (!imageId) return null;

        return (
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onImageDelete(imageId);
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                data-testid={`delete-image-${imageId}`}
            >
                <Trash2 className="h-4 w-4"/>
            </button>
        );
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {mappedImages.map((image, index) => (
                <div key={`image-${image.id || index}`} className="relative group">
                    <ImageViewer
                        images={mappedImages}
                        initialIndex={index}
                        getImageUrl={getImageUrl}
                        aspectRatio="square"
                        showImageCount={false}
                        className="!rounded-lg !aspect-[3/2]"
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-gray-200 rounded-lg pointer-events-none"/>
                    {image.id && renderImageDeleteButton(image.id)}
                </div>
            ))}
        </div>
    );
};