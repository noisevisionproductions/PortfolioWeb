export interface ProjectImage {
    id: number;
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

// Pełny interfejs projektu z wszystkimi polami
export interface Project extends BaseProject {
    id?: number;
    createdAt?: Date;
    lastModifiedAt?: Date;
    projectImages: ProjectImage[];
}

// DTO używane do tworzenia/aktualizacji projektu (bez pól generowanych przez backend)
export interface ProjectDTO extends BaseProject {

}