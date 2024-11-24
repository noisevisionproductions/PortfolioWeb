import React from 'react';
import {Calendar} from "lucide-react";

interface ProjectDatesDisplayProps {
    startDate?: Date;
    endDate?: Date;
    t: (key: string) => string;
}

export const ProjectDatesDisplay: React.FC<ProjectDatesDisplayProps> = ({startDate, endDate, t}) => {
    const formatDate = (date?: Date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString();
    };

    return (
        <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2"/>
                <span>
                    {t('projectDetails.startDate')}: {formatDate(startDate)}
                </span>
            </div>
            {endDate && (
                <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2"/>
                    <span>
                        {t('projectDetails.endDate')}: {formatDate(endDate)}
                    </span>
                </div>
            )}
        </div>
    );
};