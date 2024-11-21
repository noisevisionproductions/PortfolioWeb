export interface ProjectImage {
    id: number;
    imageUrl: string;
    caption?: string;
}

export interface Project {
    id: number;
    name: string;
    description: string;
    technologies: string[];
    projectImages: ProjectImage[];
}