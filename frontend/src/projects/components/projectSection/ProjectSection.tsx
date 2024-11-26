import React from 'react';
import {Project} from '../../types/project';
import {ProjectCard} from './ProjectCard';

interface ProjectSectionProps {
    projects: Project[];
}

export const ProjectSection: React.FC<ProjectSectionProps> = ({projects}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project}/>
            ))}
        </div>
    );
};