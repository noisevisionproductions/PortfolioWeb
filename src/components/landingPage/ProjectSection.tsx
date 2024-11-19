import React from 'react';

interface ProjectSectionProps {
    projects: string,
    projectName: string,
    projectDescription: string,
}

export const ProjectSection: React.FC<ProjectSectionProps> = ({projects, projectName, projectDescription}) => {
    return (
        <section id="projects" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">{projects}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                    <div className="p-6 flex flex-col h-full">
                        <h3 className="text-xl font-semibold text-gray-900">{projectName}</h3>
                        <p className="text-gray-600 mt-4 mb-6 flex-grow">
                            {projectDescription}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-auto">
                            <span
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors">
                                React
                            </span>
                            <span
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors">
                                Spring Boot
                            </span>
                            <span
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors">
                                PostgreSQL
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}