import React from 'react';
import { FormInput } from "../../../components/shared/FormInput";
import { Project, Contributor } from "../../types/project";

interface ContributorsListProps {
    project: Project;
    onProjectChange: (project: Project) => void;
    t: (key: string) => string;
}

export const ContributorsList: React.FC<ContributorsListProps> = ({ project, onProjectChange, t }) => {
    const handleContributorChange = (index: number, field: keyof Contributor, value: string) => {
        const newContributors = [...project.contributors];
        newContributors[index] = {
            ...newContributors[index],
            [field]: value
        };
        onProjectChange({...project, contributors: newContributors});
    };

    const addContributor = () => {
        onProjectChange({
            ...project,
            contributors: [...project.contributors, { name: '', role: '', profileUrl: '' }]
        });
    };

    const removeContributor = (index: number) => {
        const newContributors = project.contributors.filter((_, i) => i !== index);
        onProjectChange({...project, contributors: newContributors});
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('projectForm.contributors')}
            </label>
            <div className="space-y-4">
                {project.contributors.map((contributor, index) => (
                    <div key={index} className="p-4 border rounded-md space-y-2">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-lg font-medium">
                                {t('projectForm.contributor')} #{index + 1}
                            </h4>
                            <button
                                type="button"
                                onClick={() => removeContributor(index)}
                                className="text-red-600 hover:text-red-800"
                            >
                                {t('common.remove')}
                            </button>
                        </div>
                        <FormInput
                            id={`contributor-${index}-name`}
                            label={t('projectForm.contributorName')}
                            value={contributor.name}
                            onChange={(value) => handleContributorChange(index, 'name', value)}
                        />
                        <FormInput
                            id={`contributor-${index}-role`}
                            label={t('projectForm.contributorRole')}
                            value={contributor.role}
                            onChange={(value) => handleContributorChange(index, 'role', value)}
                        />
                        <FormInput
                            id={`contributor-${index}-profileUrl`}
                            label={t('projectForm.contributorProfileUrl')}
                            value={contributor.profileUrl}
                            onChange={(value) => handleContributorChange(index, 'profileUrl', value)}
                            type="url"
                        />
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addContributor}
                    className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    {t('projectForm.addContributor')}
                </button>
            </div>
        </div>
    );
};