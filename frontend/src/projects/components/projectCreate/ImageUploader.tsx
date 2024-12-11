import React, {useRef, useState} from "react";
import {Upload} from "lucide-react";
import {ActionButton} from "@/components/shared/ActionButton";
import {FormInput} from "@/components/shared/FormInput";
import {ProjectImage} from "@/projects/types/project";

interface ImageUploaderProps {
    onImageAdd: (image: Omit<ProjectImage, 'id'> & { file?: File }) => void;
    t: (key: string) => string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({onImageAdd, t}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isAddingCaption, setIsAddingCaption] = useState(false);
    const [newImage, setNewImage] = useState<Partial<ProjectImage> & { file?: File }>({
        imageUrl: '',
        caption: ''
    });

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setNewImage({
                imageUrl: imageUrl,
                file: file,
                caption: ''
            });
            setIsAddingCaption(true);
        }
    };

    const handleAddImageWithCaption = () => {
        if (newImage.imageUrl) {
            onImageAdd({
                imageUrl: newImage.imageUrl,
                caption: newImage.caption || '',
                file: newImage.file
            } as ProjectImage & { file: File });
        }

        resetForm();
    };

    const resetForm = () => {
        setNewImage({imageUrl: '', caption: ''});
        setIsAddingCaption(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div>
            <div className="flex justify-center mb-4">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    aria-label={t('projectForm.uploadImage')}
                    onChange={handleFileUpload}
                    data-testid="file-input"
                />
                <ActionButton
                    label={t('projectForm.addImage')}
                    icon={<Upload className="h-5 w-5"/>}
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                />
            </div>

            {isAddingCaption && (
                <div className="mb-4 p-4 border rounded-md bg-gray-50">
                    <div className="mb-2">
                        <img
                            src={newImage.imageUrl}
                            alt="Preview"
                            className="max-h-40 mx-auto rounded"
                        />
                    </div>
                    <FormInput
                        id="newImageCaption"
                        label={t('projectForm.caption')}
                        value={newImage.caption || ''}
                        onChange={(value) => setNewImage(prev => ({...prev, caption: value}))}
                        placeholder={t('projectForm.createCaption')}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                        <ActionButton
                            label={t('common.cancel')}
                            variant="outline"
                            onClick={resetForm}
                        />
                        <ActionButton
                            label={t('projectForm.saveImage')}
                            variant="primary"
                            onClick={handleAddImageWithCaption}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
