import React from 'react';
import {ProjectImage as ProjectImageType} from '../../types/project';
import {getImageUrl} from "@/utils/imageUtils";
import {ImageViewer} from "@/components/shared/ImageViewer";

interface ProjectImageProps {
    images: ProjectImageType[];
    projectName: string;
}

export const ImageFromProject: React.FC<ProjectImageProps> = ({images, projectName}) => {
    if (!images || images.length === 0) return null;

    const mappedImages = images.map(image => ({
        url: image.imageUrl,
        caption: image.caption,
        alt: image.caption || projectName,
        id: image.id
    }));

    return (
        <ImageViewer
            images={mappedImages}
            getImageUrl={getImageUrl}
            aspectRatio="video"
            showImageCount={true}
            className="rounded-t-lg"
        />
    );
};
