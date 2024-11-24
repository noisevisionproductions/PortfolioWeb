import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useLanguage} from '../../utils/translations/LanguageContext';
import {Header} from '../shared/Header';
import {ActionButton} from '../shared/ActionButton';
import {projectService} from '../../services/projectService';
import {Project, ProjectImage, ProjectStatus} from '../../types/project';
import {ProjectForm} from './ProjectForm';
import {ImageUploader} from './ImageUploader';
import {ImageList} from './ImageList';
import programmingLanguages from '../../assets/programmingLanguages.json';
import {LoadingSpinner} from "../shared/LoadingSpinner";

const ProjectFormPage = () => {
    const {t, currentLanguage} = useLanguage();
    const navigate = useNavigate();
    const {id: idParam} = useParams<{ id: string }>();
    const id = idParam ? parseInt(idParam, 10) : undefined;
    const isEditMode = Boolean(id);
    const [isLoading, setIsLoading] = useState(isEditMode);
    const [error, setError] = useState<string | null>(null);

    const availableTechnologies = [
        ...programmingLanguages.languages,
        programmingLanguages.other[currentLanguage as keyof typeof programmingLanguages.other]
    ];

    const [project, setProject] = useState<Project>({
        name: '',
        description: '',
        slug: '',
        repositoryUrl: '',
        status: ProjectStatus.IN_PROGRESS,
        startDate: new Date(),
        endDate: undefined,
        features: [],
        technologies: [],
        contributors: [],
        projectImages: []
    });

    useEffect(() => {
        if (isEditMode && id) {
            projectService.getProject(id)
                .then(fetchedProject => {
                    setProject(fetchedProject);
                })
                .catch(error => {
                    console.error('Error fetching project:', error);
                    setError(t('projectForm.fetchError'));
                })
                .finally(() => {
                    setIsLoading(false);
                })
        }
    }, [id, isEditMode, t]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            let savedProject: Project;

            const newImages = project.projectImages.filter(img => 'file' in img && img.file);

            if (isEditMode && id) {
                const {
                    projectImages,
                    id: projectId,
                    createdAt,
                    lastModifiedAt,
                    ...projectDTO
                } = project;
                savedProject = await projectService.updateProject(id, projectDTO);

                // Zachowaj referencję do istniejących obrazów
                savedProject = {
                    ...savedProject,
                    projectImages: project.projectImages.filter(img => !('file' in img))
                };
            } else {
                const {
                    projectImages,
                    id: projectId,
                    createdAt,
                    lastModifiedAt,
                    ...projectDTO
                } = project;
                savedProject = await projectService.createProject(projectDTO);
            }

            const projectId = savedProject.id!

            if (newImages.length > 0) {
                for (const image of newImages) {
                    if (image.file) {
                        await projectService.uploadProjectImage(projectId, image.file);
                    }
                }
            }

            if (project.features.length > 0) {
                await projectService.updateFeatures(projectId, project.features);
            }

            if (project.contributors.length > 0 && !isEditMode) {
                for (const contributor of project.contributors) {
                    await projectService.addContributor(projectId, contributor);
                }
            }

            navigate('/');
        } catch (error) {
            console.error(`Error ${isEditMode ? 'updating' : 'creating'} project:`, error);
            setError(t('projectForm.saveError'));
        }
    };

    const handleAddImage = (image: ProjectImage & { file?: File }) => {
        setProject(prev => ({
            ...prev,
            projectImages: [...prev.projectImages, image]
        }));
    };

    const handleRemoveImage = (imageId: number) => {
        setProject(prev => ({
            ...prev,
            projectImages: prev.projectImages?.filter(img => img.id !== imageId)
        }));
    };

    if (isLoading) {
        return <LoadingSpinner/>;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <p className="text-red-500 mb-4">
                        {error}
                    </p>
                    <ActionButton
                        label={t('common.backToHome')}
                        onClick={() => navigate('/')}
                        variant="secondary"
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header
                title={t('header.title')}
                navigation={{
                    login: t('header.navigation.login'),
                    logout: t('header.navigation.logout'),
                }}
            />
            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold mb-6">
                        {isEditMode ? t('projectForm.editTitle') : t('projectForm.createTitle')}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <ProjectForm
                            project={project}
                            onProjectChange={setProject}
                            availableTechnologies={availableTechnologies}
                            t={t}
                        />

                        <div>
                            <ImageUploader onImageAdd={handleAddImage} t={t}/>
                            <ImageList
                                images={project.projectImages}
                                onRemoveImage={handleRemoveImage}
                            />
                        </div>

                        <div className="flex justify-center mt-6">
                            <ActionButton
                                label={isEditMode ? t('projectForm.updateProject') : t('projectForm.saveProject')}
                                type="submit"
                                variant="primary"
                                size="lg"
                            />
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ProjectFormPage;