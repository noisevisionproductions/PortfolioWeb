import React from 'react';
import {Image as ImageIcon} from 'lucide-react';
import {ProjectImage as ProjectImageType} from '../../../types/project';

interface ProjectImageProps {
    images: ProjectImageType[];
    projectName: string;
}

export const ProjectImage: React.FC<ProjectImageProps> = ({images, projectName}) => {
    if (images.length === 0) return null;

    return (
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
            <img
                src={images[0].imageUrl}
                alt={images[0].caption || projectName}
                className="object-cover w-full h-full"
            />
            {images.length > 1 && (
                <div
                    className="absolute bottom-2 right-2 bg-black/50 rounded-full px-2 py-1 text-white text-sm flex items-center gap-1">
                    <ImageIcon size={14}/>
                    <span>{images.length}</span>
                </div>
            )}
        </div>
    );
};