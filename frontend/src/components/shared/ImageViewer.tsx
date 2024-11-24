import React, {useState} from "react";
import {Image as ImageIcon, ChevronLeft, ChevronRight, X} from "lucide-react";
import {ImageViewerImage} from "../../types/images";
import {useLanguage} from "../../utils/translations/LanguageContext";

interface ImageViewerProps {
    images: ImageViewerImage[];
    initialIndex?: number;
    getImageUrl?: (url: string) => string;
    className?: string;
    aspectRatio?: 'video' | 'square' | 'auto';
    showImageCount?: boolean;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
                                                            images,
                                                            initialIndex = 0,
                                                            getImageUrl = (url) => url,
                                                            className = '',
                                                            aspectRatio = 'video',
                                                            showImageCount = true,
                                                        }) => {
    const {t} = useLanguage();
    const [imageError, setImageError] = useState<boolean>(false);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(initialIndex);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    if (!Array.isArray(images) || images.length === 0) {
        return null;
    }

    const displayImage = images[initialIndex];
    const currentImage = images[currentImageIndex];

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        console.error('Error loading image:', displayImage.url);
        setImageError(true);
        e.currentTarget.classList.add('image-error');
    };

    const openModal = () => {
        setCurrentImageIndex(initialIndex);
        setIsModalOpen(true);
    }

    const closeModal = () => setIsModalOpen(false);

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const getAspectRatioClass = () => {
        switch (aspectRatio) {
            case 'video':
                return 'aspect-video';
            case 'square':
                return 'aspect-square';
            default:
                return '';
        }
    };

    return (
        <>
            <div
                className={`relative ${getAspectRatioClass()} w-full overflow-hidden rounded-lg bg-gray-100 cursor-zoom-in ${className}`}
                onClick={openModal}
            >
                {!imageError ? (
                    <img
                        src={getImageUrl(displayImage.url)}
                        alt={displayImage.alt}
                        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                        onError={handleImageError}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-gray-500 flex flex-col items-center gap-2">
                            <ImageIcon size={24}/>
                            <span>
                            {t('common.errorWhileLoading')}
                        </span>
                        </div>
                    </div>
                )}

                {showImageCount && images.length > 1 && !imageError && (
                    <div
                        className="absolute bottom-2 right-2 bg-black/50 rounded-full px-2 py-1 text-white text-sm flex items-center gap-1">
                        <ImageIcon size={14}/>
                        <span>
                        {currentImageIndex + 1}/{images.length}
                    </span>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
                    onClick={closeModal}
                >
                    <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
                    >
                        <X size={24}/>
                    </button>

                    <div className="relative w-full max-w-7xl mx-4 cursor-zoom-out">
                        <img
                            src={getImageUrl(currentImage.url)}
                            alt={currentImage.alt}
                            className="w-full h-auto max-h-[90vh] object-contain"
                        />

                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full"
                                >
                                    <ChevronLeft size={24}/>
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full"
                                >
                                    <ChevronRight size={24}/>
                                </button>
                            </>
                        )}

                        {currentImage.caption && (
                            <div
                                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg">
                                {currentImage.caption}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};