import {vi, describe, test, expect, beforeEach} from 'vitest';
import {render, screen, act, waitFor} from '@testing-library/react';
import {BaseProjectProvider, BaseProjectContext} from "@/projects/context/BaseProjectContext";
import {baseProjectService} from '@/projects/services';
import {Project, ProjectDTO, ProjectStatus} from '@/projects/types/project';
import {ApiError} from '@/auth/types/errors';
import {useContext} from 'react';

const originalError = console.error

vi.mock('@/projects/services', () => ({
    baseProjectService: {
        getAllProjects: vi.fn(),
        getProject: vi.fn(),
        getProjectBySlug: vi.fn(),
        createProject: vi.fn(),
        updateProject: vi.fn(),
        deleteProject: vi.fn(),
    }
}));

const mockProject: Project = {
    id: 1,
    name: 'Test Project',
    slug: 'test-project',
    description: 'Test Description',
    status: ProjectStatus.IN_PROGRESS,
    technologies: ['React', 'TypeScript'],
    features: ['Feature 1'],
    contributors: [],
    projectImages: [],
};

const mockProjectDTO: ProjectDTO = {
    name: 'Test Project',
    slug: 'test-project',
    description: 'Test Description',
    status: ProjectStatus.IN_PROGRESS,
    technologies: ['React', 'TypeScript'],
    features: ['Feature 1'],
    contributors: [],
};

const TestComponent = () => {
    const context = useContext(BaseProjectContext);
    if (!context) throw new Error('Context not provided');
    return (
        <div>
            <button onClick={async () => {
                try {
                    await context.fetchProjects();
                } catch (e) {
                }
            }}>Fetch Projects
            </button>
            <button onClick={async () => {
                try {
                    await context.getProject(1);
                } catch (e) {
                }
            }}>Get Project
            </button>
            <button onClick={async () => {
                try {
                    await context.createProject(mockProjectDTO);
                } catch (e) {
                }
            }}>Create Project
            </button>
            {context.loading && <div data-testid="loading">Loading...</div>}
            {context.error && <div data-testid="error-message">Error: {context.error}</div>}
        </div>
    );
};

const TestSlugComponent = () => {
    const context = useContext(BaseProjectContext);
    if (!context) throw new Error('Context not provided');
    return (
        <div>
            <button onClick={async () => {
                try {
                    await context.getProjectBySlug('test-project');
                } catch (e) {
                }
            }}>Get Project By Slug
            </button>
            {context.loading && <div data-testid="loading">Loading...</div>}
            {context.error && <div data-testid="error-message">Error: {context.error}</div>}
        </div>
    );
};

describe('BaseProjectProvider', () => {
    beforeAll(() => {
        console.error = (...args: any[]) => {
            const errorMessage = args[0]?.toString() || '';
            if (errorMessage.includes('Failed to fetch') ||
                errorMessage.includes('Failed to get project') ||
                errorMessage.includes('Failed to create') ||
                args[0] instanceof ApiError) {
                return;
            }
            originalError(...args);
        };
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterAll(() => {
        console.error = originalError;
    });

    test('should fetch projects successfully', async () => {
        vi.mocked(baseProjectService.getAllProjects).mockResolvedValueOnce([mockProject]);

        render(
            <BaseProjectProvider>
                <TestComponent/>
            </BaseProjectProvider>
        );

        const button = screen.getByText('Fetch Projects');
        await act(async () => {
            button.click();
        });

        await waitFor(() => {
            expect(baseProjectService.getAllProjects).toHaveBeenCalledTimes(1);
        });

        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    });

    test('should handle fetch projects error', async () => {
        const error = new ApiError(500, 'Failed to fetch projects', 'FETCH_ERROR');
        vi.mocked(baseProjectService.getAllProjects).mockRejectedValueOnce(error);

        render(
            <BaseProjectProvider>
                <TestComponent/>
            </BaseProjectProvider>
        );

        const button = screen.getByText('Fetch Projects');
        await act(async () => {
            button.click();
        });

        await waitFor(() => {
            const errorMessage = screen.getByText('Error: Błąd podczas pobierania projektów');
            expect(errorMessage).toBeInTheDocument();
        });
    });

    test('should get single project successfully', async () => {
        vi.mocked(baseProjectService.getProject).mockResolvedValueOnce(mockProject);

        render(
            <BaseProjectProvider>
                <TestComponent/>
            </BaseProjectProvider>
        );

        const button = screen.getByText('Get Project');
        await act(async () => {
            button.click();
        });

        await waitFor(() => {
            expect(baseProjectService.getProject).toHaveBeenCalledWith(1);
        });
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    test('should handle get project error', async () => {
        const error = new ApiError(500, 'Failed to get project', 'GET_ERROR');
        vi.mocked(baseProjectService.getProject).mockRejectedValueOnce(error);

        render(
            <BaseProjectProvider>
                <TestComponent/>
            </BaseProjectProvider>
        );

        const button = screen.getByText('Get Project');
        await act(async () => {
            button.click();
        });

        await waitFor(() => {
            const errorMessage = screen.getByTestId('error-message');
            expect(errorMessage).toHaveTextContent('Error: Błąd podczas pobierania projektu');
        });
    });

    test('should get project by slug successfully', async () => {
        vi.mocked(baseProjectService.getProjectBySlug).mockResolvedValueOnce(mockProject);

        render(
            <BaseProjectProvider>
                <TestSlugComponent/>
            </BaseProjectProvider>
        );

        const button = screen.getByText('Get Project By Slug');
        await act(async () => {
            button.click();
        });

        await waitFor(() => {
            expect(baseProjectService.getProjectBySlug).toHaveBeenCalledWith('test-project');
        });
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    });

    test('should handle get project by slug error', async () => {
        const error = new ApiError(500, 'Failed to get project by slug', 'GET_ERROR');
        vi.mocked(baseProjectService.getProjectBySlug).mockRejectedValueOnce(error);

        render(
            <BaseProjectProvider>
                <TestSlugComponent/>
            </BaseProjectProvider>
        );

        const button = screen.getByText('Get Project By Slug');
        await act(async () => {
            button.click();
        });

        await waitFor(() => {
            const errorMessage = screen.getByTestId('error-message');
            expect(errorMessage).toHaveTextContent('Error: Błąd podczas pobierania projektu');
        });
    });

    test('should create project successfully', async () => {
        vi.mocked(baseProjectService.createProject).mockResolvedValueOnce(mockProject);

        render(
            <BaseProjectProvider>
                <TestComponent/>
            </BaseProjectProvider>
        );

        const button = screen.getByText('Create Project');
        await act(async () => {
            button.click();
        });

        await waitFor(() => {
            expect(baseProjectService.createProject).toHaveBeenCalledWith(mockProjectDTO);
        });
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    test('should handle create project error', async () => {
        const error = new Error('Failed to create');
        vi.mocked(baseProjectService.createProject).mockRejectedValueOnce(error);

        render(
            <BaseProjectProvider>
                <TestComponent/>
            </BaseProjectProvider>
        );

        const button = screen.getByText('Create Project');
        await act(async () => {
            button.click();
        });

        await waitFor(() => {
            const errorMessage = screen.getByText('Error: Błąd podczas tworzenia projektu');
            expect(errorMessage).toBeInTheDocument();
        });
    });

    test('should update project successfully', async () => {
        const updatedProject = {...mockProject, name: 'Updated Project'};
        vi.mocked(baseProjectService.updateProject).mockResolvedValueOnce(updatedProject);

        const TestUpdateComponent = () => {
            const context = useContext(BaseProjectContext);
            if (!context) throw new Error('Context not provided');
            return (
                <div>
                    <button onClick={() => context.updateProject(1, mockProjectDTO)}>
                        Update Project
                    </button>
                    {context.error && <div data-testid="error-message">{context.error}</div>}
                </div>
            );
        };

        render(
            <BaseProjectProvider>
                <TestUpdateComponent/>
            </BaseProjectProvider>
        );

        const button = screen.getByText('Update Project');
        await act(async () => {
            button.click();
        });

        await waitFor(() => {
            expect(baseProjectService.updateProject).toHaveBeenCalledWith(1, mockProjectDTO);
        });
    });

    test('should delete project successfully', async () => {
        vi.mocked(baseProjectService.deleteProject).mockResolvedValueOnce();

        const TestDeleteComponent = () => {
            const context = useContext(BaseProjectContext);
            if (!context) throw new Error('Context not provided');
            return (
                <div>
                    <button onClick={() => context.deleteProject(1)}>Delete Project</button>
                    {context.error && <div data-testid="error-message">{context.error}</div>}
                </div>
            );
        };

        render(
            <BaseProjectProvider>
                <TestDeleteComponent/>
            </BaseProjectProvider>
        );

        const button = screen.getByText('Delete Project');
        await act(async () => {
            button.click();
        });

        await waitFor(() => {
            expect(baseProjectService.deleteProject).toHaveBeenCalledWith(1);
        });
    });

    test('should handle delete project error with ApiError', async () => {
        const apiError = new ApiError(404, 'Project not found', 'NOT_FOUND');
        vi.mocked(baseProjectService.deleteProject).mockRejectedValueOnce(apiError);

        const TestDeleteComponent = () => {
            const context = useContext(BaseProjectContext);
            if (!context) throw new Error('Context not provided');
            return (
                <div>
                    <button onClick={() => context.deleteProject(1)}>Delete Project</button>
                    {context.error && <div data-testid="error-message">Error: {context.error}</div>}
                </div>
            );
        };

        render(
            <BaseProjectProvider>
                <TestDeleteComponent/>
            </BaseProjectProvider>
        );

        const button = screen.getByText('Delete Project');
        await act(async () => {
            button.click();
        });

        await waitFor(() => {
            const errorMessage = screen.getByText('Error: Project not found');
            expect(errorMessage).toBeInTheDocument();
        });
    });
});