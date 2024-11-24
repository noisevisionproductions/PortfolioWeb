import React from 'react';
import {ProjectStatus} from '../../types/project';

interface ProjectStatusBadgeProps {
    status: ProjectStatus;
    t: (key: string) => string;
}

export const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({status, t}) => {
    const getStatusColor = () => {
        switch (status) {
            case ProjectStatus.IN_PROGRESS:
                return 'bg-yellow-100 text-yellow-800';
            case ProjectStatus.COMPLETED:
                return 'bg-green-100 text-green-800';
            case ProjectStatus.ARCHIVED:
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800'
        }
    };

    const getTranslationKey = () => {
        switch (status) {
            case ProjectStatus.IN_PROGRESS:
                return 'inProgress';
            case ProjectStatus.COMPLETED:
                return 'completed';
            case ProjectStatus.ARCHIVED:
                return 'archived';
            default:
                return 'unknown';
        }
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
            {t(`projectForm.statuses.${getTranslationKey()}`)}
        </span>
    );
};