import React from 'react';
import {ChevronRight, Image as ImageIcon} from 'lucide-react';

interface ProjectImage {
    id: number;
    imageUrl: string;
    caption?: string;
}

interface Project {
    id: number;
    name: string;
    description: string;
    technologies: string[];
    projectImages: ProjectImage[];
}

interface ProjectSectionProps {
    title: string;
    projects: Project[];
}

export const ProjectSection: React.FC<ProjectSectionProps> = ({title, projects}) => {
    return (
        <section id="projects" className="w-full py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <h2 className="text-3xl font-bold mb-8">{title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
                        >
                            {project.projectImages.length > 0 && (
                                <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                                    <img
                                        src={project.projectImages[0].imageUrl}
                                        alt={project.projectImages[0].caption || project.name}
                                        className="object-cover w-full h-full"
                                    />
                                    {project.projectImages.length > 1 && (
                                        <div
                                            className="absolute bottom-2 right-2 bg-black/50 rounded-full px-2 py-1 text-white text-sm flex items-center gap-1">
                                            <ImageIcon size={14}/>
                                            <span>{project.projectImages.length}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex justify-between items-center group mb-4">
                                    <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                                    <ChevronRight
                                        className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"/>
                                </div>
                                <p className="text-gray-600 mb-6 line-clamp-3">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {project.technologies && project.technologies.map((tech, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

