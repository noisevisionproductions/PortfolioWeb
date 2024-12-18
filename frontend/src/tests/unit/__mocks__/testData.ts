import {Project, ProjectDTO, ProjectStatus, Contributor, ProjectImage} from '@/projects/types/project';

export const mockContributor: Contributor = {
    name: 'John Doe',
    role: 'Developer',
    profileUrl: 'https://example.com/profile'
};

export const mockProjectImage: ProjectImage = {
    id: 1,
    imageUrl: 'https://example.com/image.jpg',
    caption: 'Test Image'
};

export const emptyProject: Project = {
    name: '',
    description: '',
    slug: '',
    repositoryUrl: '',
    status: ProjectStatus.IN_PROGRESS,
    startDate: new Date(),
    features: [],
    technologies: [],
    contributors: [],
    projectImages: []
};

export const mockProject: Project = {
    id: 1,
    name: 'Test Project',
    description: 'Test Description',
    slug: 'test-project',
    repositoryUrl: 'https://github.com/test/project',
    status: ProjectStatus.IN_PROGRESS,
    startDate: new Date('2024-01-01'),
    features: ['Feature 1'],
    technologies: ['React'],
    contributors: [mockContributor],
    projectImages: [mockProjectImage],
    createdAt: new Date('2024-01-01'),
    lastModifiedAt: new Date('2024-01-01')
};

export const mockProjectDTO: ProjectDTO = {
    name: mockProject.name,
    description: mockProject.description,
    slug: mockProject.slug,
    repositoryUrl: mockProject.repositoryUrl,
    status: mockProject.status,
    startDate: mockProject.startDate,
    features: mockProject.features,
    technologies: mockProject.technologies,
    contributors: mockProject.contributors
};