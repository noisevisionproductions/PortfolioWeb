import React from 'react';
import { FormInput } from "../../../components/shared/FormInput";
import { Project } from "../../types/project";

interface FeaturesListProps {
    project: Project;
    onProjectChange: (project: Project) => void;
    t: (key: string) => string;
}

export const FeaturesList: React.FC<FeaturesListProps> = ({ project, onProjectChange, t }) => {
    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...project.features];
        newFeatures[index] = value;
        onProjectChange({...project, features: newFeatures});
    };

    const addFeature = () => {
        onProjectChange({
            ...project,
            features: [...project.features, '']
        });
    };

    const removeFeature = (index: number) => {
        const newFeatures = project.features.filter((_, i) => i !== index);
        onProjectChange({...project, features: newFeatures});
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('projectForm.features')}
            </label>
            <div className="space-y-2">
                {project.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                        <FormInput
                            id={`feature-${index}`}
                            label=""
                            value={feature}
                            onChange={(value) => handleFeatureChange(index, value)}
                        />
                        <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="px-2 py-1 text-sm text-red-600 hover:text-red-800"
                        >
                            {t('common.remove')}
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addFeature}
                    className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    {t('projectForm.addFeature')}
                </button>
            </div>
        </div>
    );
};