import React from 'react';
import {ArrowLeft, Pencil, Trash2} from 'lucide-react';

interface ProjectHeaderProps {
    onBack: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    isAuthenticated: boolean;
    t: (key: string) => string;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
                                                                onBack,
                                                                onEdit,
                                                                onDelete,
                                                                isAuthenticated,
                                                                t
                                                            }) => {
    const renderManagementButtons = () => {
        if (!isAuthenticated) return null;

        return (
            <div className="flex gap-2">
                <button
                    onClick={onEdit}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    <Pencil className="h-4 w-4 mr-2"/>
                    {t('projectDetails.edit')}
                </button>
                <button
                    onClick={onDelete}
                    className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                    <Trash2 className="h-4 w-4 mr-2"/>
                    {t('projectDetails.delete')}
                </button>
            </div>
        );
    };

    return (
        <div className="mb-6 flex items-center justify-between bg-white rounded-lg p-4">
            <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-900"
            >
                <ArrowLeft className="h-5 w-5 mr-2"/>
                {t('projectDetails.back')}
            </button>
            {renderManagementButtons()}
        </div>
    );
};