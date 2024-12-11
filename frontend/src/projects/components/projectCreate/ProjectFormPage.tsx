import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import {Header} from '@/components/shared/Header';
import {ActionButton} from '@/components/shared/ActionButton';
import {Project, ProjectImage, ProjectStatus} from "@/projects/types/project";
import {ProjectForm} from './ProjectForm';
import {ImageUploader} from './ImageUploader';
import {ImageList} from './ImageList';
import programmingLanguages from '../../../assets/programmingLanguages.json';
import {LoadingSpinner} from "@/components/shared/LoadingSpinner";
import {useBaseProject, useProjectImage, useProjectContributor, useProjectFeature} from "../../context";
import {useLanguageSwitch} from "@/utils/translations/LanguageContext";
import {ErrorMessage} from "@/components/shared/ErrorMessage";
import {SuccessAlert} from "@/auth/components/SuccessAlert";

const ProjectFormPage = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {currentLanguage} = useLanguageSwitch();
    const {id: idParam} = useParams<{ id: string }>();
    const id = idParam ? parseInt(idParam, 10) : undefined;
    const isEditMode = Boolean(id);
    const {
        selectedProject,
        loading: baseLoading,
        error: baseError,
        getProject,
        createProject,
        updateProject
    } = useBaseProject();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {uploadProjectImage} = useProjectImage();
    const {addContributor} = useProjectContributor();
    const {updateFeatures} = useProjectFeature();

    const availableTechnologies = [
        ...programmingLanguages.languages,
        programmingLanguages.other[currentLanguage]
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
            getProject(id).catch(console.error);
        }
    }, [id, isEditMode, getProject]);

    useEffect(() => {
        if (selectedProject && isEditMode) {
            setProject(selectedProject);
        }
    }, [selectedProject, isEditMode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);

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
                savedProject = await updateProject(id, projectDTO);

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
                savedProject = await createProject(projectDTO);
            }

            const projectId = savedProject.id!

            await Promise.all([
                ...(newImages.length > 0
                    ? newImages.map(image => image.file && uploadProjectImage(projectId, image.file))
                    : []),
                ...(project.features.length > 0 ? [await updateFeatures(projectId, project.features)] : []),
                ...(project.contributors.length > 0 && !isEditMode
                    ? project.contributors.map(contributor => addContributor(projectId, contributor))
                    : [])
            ]);

            setShowSuccessMessage(true);
        } catch (error) {
            console.error(`Error ${isEditMode ? 'updating' : 'creating'} project:`, error);
            setSubmitError(error instanceof Error ? error.message : String(error));
        }
    };

    const handleAddImage = (image: ProjectImage & { file?: File }) => {
        setProject(prev => ({
            ...prev,
            projectImages: [...prev.projectImages, image]
        }));
    };

    const handleRemoveImage = (index: number) => {
        setProject(prev => ({
            ...prev,
            projectImages: prev.projectImages.filter((_, idx) => idx !== index)
        }));
    };

    if (baseLoading) {
        return <LoadingSpinner/>;
    }

    if (baseError || submitError) {
        return (
            <ErrorMessage
                error={submitError || baseError}
                onBack={() =>
                    navigate('/')} t={t}
            />
        );
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
                    <SuccessAlert
                        isOpen={showSuccessMessage}
                        onClose={() => {
                            setShowSuccessMessage(false);
                            navigate('/');
                        }}
                        title={t('projectForm.successTitle')}
                        description={t('projectForm.successDescription')}
                        buttonText={t('common.continue')}
                    />

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
                                t={t}
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