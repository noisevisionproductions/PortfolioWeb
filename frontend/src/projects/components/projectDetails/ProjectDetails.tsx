import React from 'react';
import {ProjectStatusBadge} from "./ProjectStatusBadge";
import {ProjectDatesDisplay} from "./ProjectDates";
import {Link2, Users, Terminal, Code2, CircleDot} from "lucide-react";
import type {Project} from "@/projects/types/project";

interface ProjectDetailsProps {
    project: Project;
    t: (key: string) => string;
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({project, t}) => (
    <div className="p-6 space-y-6">

        {/* Header with status */}
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <Code2 className="h-7 w-7 mr-3 text-gray-700"/>
                <h1 className="text-2xl font-bold text-gray-900">
                    {project.name}
                </h1>
            </div>
            <ProjectStatusBadge
                status={project.status}
                t={t}
            />
        </div>

        {/* Dates */}
        <ProjectDatesDisplay
            startDate={project.startDate}
            endDate={project.endDate}
            t={t}
        />

        {/* Repository Link */}
        {project.repositoryUrl && (
            <div className="flex items-center text-blue-600 hover:text-blue-800">
                <Link2 className="h-4 w-4 mr-2"/>
                <a
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm"
                >
                    {t('projectDetails.viewRepository')}
                </a>
            </div>
        )}

        {/* Features */}
        {project.features.length > 0 && (
            <div>
                <h2 className="text-lg font-semibold mb-2 flex items-center">
                    <Terminal className="h-5 w-5 mr-2"/>
                    {t('projectDetails.features')}
                </h2>
                <ul className="list-none space-y-1 text-gray-600">
                    {project.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                            <CircleDot className="h-3 w-3 mr-2 text-blue-500"/>
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>
        )}

        {/* Technologies */}
        <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, index) => (
                <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                >
                    {tech}
                </span>
            ))}
        </div>

        {/* Contributors */}
        {project.contributors.length > 0 && (
            <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center">
                    <Users className="h-5 w-5 mr-2"/>
                    {t('projectDetails.contributors')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.contributors.map((contributor, index) => (
                        <div key={index} className="flex flex-col p-4 bg-gray-50 rounded-lg">
                            <span className="font-medium">
                                {contributor.name}
                            </span>
                            <span className="text-sm text-gray-600">
                                {contributor.role}
                            </span>
                            {contributor.profileUrl && (
                                <a
                                    href={contributor.profileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:text-blue-800 mt-1"
                                >
                                    {t('projectDetails.viewProfile')}
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
);