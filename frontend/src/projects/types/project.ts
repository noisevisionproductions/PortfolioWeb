export interface ProjectImage {
    id?: number;
    imageUrl: string;
    caption?: string;
    file?: File;
}

export interface Contributor {
    name: string;
    role: string;
    profileUrl: string;
}

export enum ProjectStatus {
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    ARCHIVED = 'ARCHIVED'
}

interface BaseProject {
    name: string;
    slug: string;
    description: string;
    repositoryUrl?: string;
    status: ProjectStatus;
    startDate?: Date;
    endDate?: Date;
    features: string[];
    technologies: string[];
    contributors: Contributor[];
}

export interface Project extends BaseProject {
    id?: number;
    createdAt?: Date;
    lastModifiedAt?: Date;
    projectImages: ProjectImage[];
}

export interface ProjectDTO extends BaseProject {

}