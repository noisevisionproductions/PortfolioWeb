import React from 'react';
import {X} from 'lucide-react';
import {ActionButton} from "../shared/ActionButton";
import {ProjectImage} from "../../types/project";

interface ImageListProps {
    images: (ProjectImage & { file?: File })[];
    onRemoveImage: (id: number) => void;
}

export const ImageList: React.FC<ImageListProps> = ({images, onRemoveImage}) => {
    return (
        <div className="space-y-2">
            {images.map((image) => (
                <div key={image.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                    <div className="w-20 h-20 flex-shrink-0">
                        <img
                            src={image.imageUrl}
                            alt={image.caption}
                            className="w-full h-full object-cover rounded"
                        />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium">{image.caption}</p>
                        <p className="text-sm text-gray-500 truncate">
                            {image.file ? image.file.name : image.imageUrl}
                        </p>
                    </div>
                    <ActionButton
                        icon={<X className="h-5 w-5"/>}
                        onClick={() => onRemoveImage(image.id!)}
                        variant="outline"
                        size="sm"
                        label=""
                        className="!p-1"
                    />
                </div>
            ))}
        </div>
    );
};