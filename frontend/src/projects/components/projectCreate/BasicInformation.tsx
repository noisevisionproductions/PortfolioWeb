import React from 'react';
import {FormInput} from "@/components/shared/FormInput";
import {Project} from "@/projects/types/project";

interface BasicInformationProps {
    project: Project;
    onProjectChange: (project: Project) => void;
    t: (key: string) => string;
}

export const BasicInformation: React.FC<BasicInformationProps> = ({project, onProjectChange, t}) => (
    <div className="space-y-4">
        <FormInput
            id="name"
            label={t('projectForm.projectName')}
            value={project.name || ''}
            onChange={(value) => onProjectChange({...project, name: value})}
            required
        />

        <div>
            <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
            >
                {t('projectForm.description')}
            </label>
            <textarea
                id="description"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                rows={4}
                value={project.description || ''}
                onChange={(e) => onProjectChange({...project, description: e.target.value})}
                required
            />
        </div>

        <FormInput
            id="repositoryUrl"
            label={t('projectForm.repositoryUrl')}
            value={project.repositoryUrl || ''}
            onChange={(value) => onProjectChange({...project, repositoryUrl: value})}
            type="url"
        />
    </div>
);