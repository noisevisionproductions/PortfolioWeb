import React from 'react';
import { FormInput } from "@/components/shared/FormInput";
import { Project} from "@/projects/types/project";

interface ProjectDatesProps {
    project: Project;
    onProjectChange: (project: Project) => void;
    t: (key: string) => string;
}

export const ProjectDates: React.FC<ProjectDatesProps> = ({ project, onProjectChange, t }) => (
    <div className="grid grid-cols-2 gap-4">
        <FormInput
            id="startDate"
            type="date"
            label={t('projectForm.startDate')}
            value={project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : ''}
            onChange={(value) => onProjectChange({...project, startDate: value ? new Date(value) : undefined})}
        />
        <FormInput
            id="endDate"
            type="date"
            label={t('projectForm.endDate')}
            value={project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : ''}
            onChange={(value) => onProjectChange({...project, endDate: value ? new Date(value) : undefined})}
        />
    </div>
);
