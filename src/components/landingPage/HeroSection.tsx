import React from 'react'
import GitHubIcon from "../icons/GitHubIcon";
import LinkedIn from "../icons/LinkedinIcon";
import {Mail} from 'lucide-react';

interface HeroSectionProps {
    title: string,
    description: string,
    githubUrl?: string,
    linkedInLink?: string,
    emailAddress?: string
}

export const HeroSection: React.FC<HeroSectionProps> = ({
                                                            title,
                                                            description,
                                                            githubUrl,
                                                            linkedInLink,
                                                            emailAddress
                                                        }) => {
    return (
        <section id="about" className=" pt-32 bg-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                    {title}
                </h1>
                <p className="mt-4 text-xl text-gray-600">
                    {description}
                </p>
                <div className="mt-6 flex justify-center space-x-6">
                    <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group">
                        <GitHubIcon
                            size={24}
                            className="text-gray-700 group-hover:text-gray-900 group-hover:opacity-80 transition-all duration-200"
                        />
                    </a>

                    <a
                        href={linkedInLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group">
                        <LinkedIn
                            size={24}
                            className="text-gray-700 group-hover:text-gray-900 group-hover:opacity-80 transition-all duration-200"
                        />
                    </a>

                    <a
                        href={`mailto:${emailAddress}`}
                        className="group">
                        <Mail
                            size={24}
                            className="text-gray-700 group-hover:text-gray-900 group-hover:opacity-70 transition-all duration-200"
                        />
                    </a>
                </div>
            </div>
        </section>
    )
}