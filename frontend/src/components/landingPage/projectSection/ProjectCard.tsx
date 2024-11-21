import React from 'react';
import {ChevronRight} from 'lucide-react';
import {Project} from '../../../types/project';
import {ProjectImage} from './ProjectImage';
import {TechnologyTags} from './TechnologyTags';

interface ProjectCardProps {
    project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({project}) => {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <ProjectImage images={project.projectImages} projectName={project.name}/>
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-center group mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                    <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"/>
                </div>
                <p className="text-gray-600 mb-6 line-clamp-3">
                    {project.description}
                </p>
                <TechnologyTags technologies={project.technologies}/>
            </div>
        </div>
    );
};