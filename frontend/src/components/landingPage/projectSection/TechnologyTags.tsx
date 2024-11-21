import React from 'react';

interface TechnologyTagsProps {
    technologies: string[];
}

export const TechnologyTags: React.FC<TechnologyTagsProps> = ({ technologies }) => {
    return (
        <div className="flex flex-wrap gap-2 mt-auto">
            {technologies.map((tech, index) => (
                <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
                >
                    {tech}
                </span>
            ))}
        </div>
    );
};
