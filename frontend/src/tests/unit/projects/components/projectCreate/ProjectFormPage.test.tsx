import {beforeEach, describe, expect} from "vitest";
import {
    BaseProjectContextType,
    ProjectContributorContextType,
    ProjectFeatureContextType,
    ProjectImageContextType
} from "@/projects/types/context";
import {
    emptyProject,
    mockContributor,
    mockProject,
    mockProjectDTO,
    mockProjectImage
} from "@/tests/unit/__mocks__/testData";
import {ProjectImage, ProjectStatus} from "@/projects/types/project";

describe('Project Contexts', () => {
    describe('BaseProjectContext', () => {
        let baseContext: BaseProjectContextType;

        beforeEach(() => {
            baseContext = {
                projects: [mockProject],
                selectedProject: null,
                loading: false,
                error: null,
                fetchProjects: vi.fn().mockResolvedValue(undefined),
                getProject: vi.fn().mockResolvedValue(mockProject),
                getProjectBySlug: vi.fn().mockResolvedValue(mockProject),
                createProject: vi.fn().mockResolvedValue(mockProject),
                updateProject: vi.fn().mockResolvedValue(mockProject),
                deleteProject: vi.fn().mockResolvedValue(undefined)
            };
        });

        test('should fetch projects successfully', async () => {
            await baseContext.fetchProjects();
            expect(baseContext.fetchProjects).toHaveBeenCalled();
        });

        test('should get project by id', async () => {
            const project = await baseContext.getProject(1);
            expect(baseContext.getProject).toHaveBeenCalledWith(1);
            expect(project).toEqual(mockProject);
        });

        test('should create project', async () => {
            const newProject = await baseContext.createProject(mockProjectDTO);
            expect(baseContext.createProject).toHaveBeenCalledWith(mockProjectDTO);
            expect(newProject).toEqual(mockProject);
        });

        test('should update project', async () => {
            const updatedProject = await baseContext.updateProject(1, mockProjectDTO);
            expect(baseContext.updateProject).toHaveBeenCalledWith(1, mockProjectDTO);
            expect(updatedProject).toEqual(mockProject);
        });

        test('should delete project', async () => {
            await baseContext.deleteProject(1);
            expect(baseContext.deleteProject).toHaveBeenCalledWith(1);
        });
    });

    describe('ProjectFeatureContext', () => {
        let featureContext: ProjectFeatureContextType;

        beforeEach(() => {
            featureContext = {
                loading: false,
                error: null,
                updateFeatures: vi.fn().mockResolvedValue(undefined)
            };
        });

        test('should update features', async () => {
            const features = mockProject.features;
            await featureContext.updateFeatures(1, features);
            expect(featureContext.updateFeatures).toHaveBeenCalledWith(1, features);
        });
    });

    describe('ProjectImageContext', async () => {
        let imageContext: ProjectImageContextType;
        const mockFile = new File([''], 'test.jps', {type: 'image/jpg'});

        beforeEach(() => {
            imageContext = {
                loading: false,
                error: null,
                uploadProjectImage: vi.fn().mockResolvedValue(undefined),
                deleteProjectImage: vi.fn().mockResolvedValue(undefined)
            };
        });

        test('should upload project image', async () => {
            await imageContext.uploadProjectImage(1, mockFile);
            expect(imageContext.uploadProjectImage).toHaveBeenCalledWith(1, mockFile);
        });

        test('should delete project image', async () => {
            await imageContext.deleteProjectImage(1, mockProjectImage.id!);
            expect(imageContext.deleteProjectImage).toHaveBeenCalledWith(1, mockProjectImage.id);
        });

        test('should handle image with file', async () => {
            const imageWithFile: ProjectImage & { file?: File } = {
                ...mockProjectImage,
                file: mockFile
            };

            await imageContext.uploadProjectImage(1, imageWithFile.file!);
            expect(imageContext.uploadProjectImage).toHaveBeenCalledWith(1, imageWithFile.file);
        });
    });

    describe('ProjectContributorContext', () => {
        let contributorContext: ProjectContributorContextType;

        beforeEach(() => {
            contributorContext = {
                loading: false,
                error: null,
                addContributor: vi.fn().mockResolvedValue(undefined)
            };
        });

        test('should add contributor', async () => {
            await contributorContext.addContributor(1, mockContributor);
            expect(contributorContext.addContributor).toHaveBeenCalledWith(1, mockContributor);
        });
    });

    describe('Project Interface', () => {
        test('should create a valid empty project', () => {
            expect(emptyProject).toMatchObject({
                name: '',
                description: '',
                slug: '',
                repositoryUrl: '',
                status: ProjectStatus.IN_PROGRESS,
                startDate: expect.any(Date),
                features: [],
                technologies: [],
                contributors: [],
                projectImages: []
            });
        });

        test('should create a valid full project', () => {
            expect(mockProject).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                description: expect.any(String),
                slug: expect.any(String),
                repositoryUrl: expect.any(String),
                status: expect.any(String),
                startDate: expect.any(Date),
                features: expect.any(Array),
                technologies: expect.any(Array),
                contributors: expect.any(Array),
                projectImages: expect.any(Array),
                createdAt: expect.any(Date),
                lastModifiedAt: expect.any(Date)
            });
        });

        test('should have valid project status', () => {
            expect(Object.values(ProjectStatus)).toContain(mockProject.status);
        });

        test('should handle optional fields correctly', () => {
            const projectWithOptionals = {
                ...mockProject,
                endDate: new Date(),
                repositoryUrl: undefined
            };
            expect(projectWithOptionals.endDate).toBeInstanceOf(Date);
            expect(projectWithOptionals.repositoryUrl).toBeUndefined();
        });
    });
});