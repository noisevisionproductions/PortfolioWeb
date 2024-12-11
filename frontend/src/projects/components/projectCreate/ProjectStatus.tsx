import React from 'react';
import {Project, ProjectStatus} from "@/projects/types/project";

interface ProjectStatusSelectorProps {
    project: Project;
    onProjectChange: (project: Project) => void;
    t: (key: string) => string;
}

export const ProjectStatusSelector: React.FC<ProjectStatusSelectorProps> = ({project, onProjectChange, t}) => {
    const statusOptions = [
        {value: ProjectStatus.IN_PROGRESS, label: t('projectForm.statuses.inProgress')},
        {value: ProjectStatus.COMPLETED, label: t('projectForm.statuses.completed')},
        {value: ProjectStatus.ARCHIVED, label: t('projectForm.statuses.archived')},
    ];

    const currentStatus = project.status || ProjectStatus.IN_PROGRESS;

    return (
        <div>
            <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="projectStatus"
            >
                {t('projectForm.status')}
            </label>
            <select
                id="projectStatus"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={currentStatus}
                onChange={(e) => onProjectChange({...project, status: e.target.value as ProjectStatus})}
            >
                {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};