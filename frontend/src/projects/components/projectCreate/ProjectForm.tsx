import React from "react";
import {Project} from "../../types/project";
import {LanguageSelector} from "@/auth/components/register/ProgrammingLanguageSelector";
import {BasicInformation} from "./BasicInformation";
import {ProjectStatusSelector} from "./ProjectStatus";
import {ProjectDates} from "./ProjectDates";
import {FeaturesList} from "./FeaturesList";
import {ContributorsList} from "./ContributorsList";

interface ProjectFormProps {
    project: Project;
    onProjectChange: (project: Project) => void;
    availableTechnologies: string[];
    t: (key: string) => string;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
                                                            project,
                                                            onProjectChange,
                                                            availableTechnologies,
                                                            t
                                                        }) => {
    return (
        <div className="space-y-6">
            <BasicInformation
                project={project}
                onProjectChange={onProjectChange}
                t={t}
            />

            <ProjectStatusSelector
                project={project}
                onProjectChange={onProjectChange}
                t={t}
            />

            <ProjectDates
                project={project}
                onProjectChange={onProjectChange}
                t={t}
            />

            <LanguageSelector
                label={t('projectForm.technologies')}
                options={availableTechnologies}
                selected={project.technologies}
                onChange={(selected) => onProjectChange({...project, technologies: selected})}
            />

            <FeaturesList
                project={project}
                onProjectChange={onProjectChange}
                t={t}
            />

            <ContributorsList
                project={project}
                onProjectChange={onProjectChange}
                t={t}
            />
        </div>
    );
};