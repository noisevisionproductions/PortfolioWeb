import React from 'react';
import {ChevronRight} from 'lucide-react';
import {Project} from '../../../types/project';
import {ImageFromProject} from './ImageFromProject';
import {TechnologyTags} from './TechnologyTags';
import {useNavigate} from "react-router-dom";

interface ProjectCardProps {
    project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({project}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/project/${project.slug}`);
    };

    return (
        <div
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <ImageFromProject images={project.projectImages} projectName={project.name}/>
            <div className="p-6 flex flex-col flex-grow cursor-pointer"
                 onClick={handleClick}
            >
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