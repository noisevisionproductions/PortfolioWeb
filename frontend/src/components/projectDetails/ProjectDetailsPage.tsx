import React from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {authService} from "../../services/authService";
import {useLanguage} from "../../utils/translations/LanguageContext";
import {getImageUrl} from "../../utils/imageUtils";
import {projectService} from "../../services/projectService";
import {ProjectHeader} from "./ProjectHeader";
import {ProjectImages} from './ProjectImages';
import {ProjectDetails} from './ProjectDetails';
import {useProject} from "../../hooks/useProject";
import {LoadingSpinner} from "../shared/LoadingSpinner";
import {ErrorMessage} from "../shared/ErrorMessage";

export const ProjectDetailsPage: React.FC = () => {
    const {t} = useLanguage();
    const isAuthenticated = authService.isAuthenticated();
    const {slug} = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const {project, loading, error, setProject, setError} = useProject(slug, t);

    const handleBackgroundClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            navigate('/');
        }
    };

    const handleProjectDelete = async () => {
        if (!project?.id || !window.confirm(t('projectDetails.confirmDelete'))) {
            return;
        }

        try {
            await projectService.deleteProject(project.id);
            navigate('/');
        } catch (err) {
            setError(t('projectDetails.deleteError'));
            console.error(err);
        }
    };

    const handleImageDelete = async (imageId: number) => {
        if (!project?.id || !window.confirm(t('projectDetails.confirmImageDelete'))) {
            return;
        }

        try {
            await projectService.deleteProjectImage(project.id, imageId);
            setProject(prev => prev ? {
                ...prev,
                projectImages: prev.projectImages.filter(img => img.id !== imageId)
            } : null);
        } catch (err) {
            setError(t('projectDetails.deleteImageError'));
            console.error(err);
        }
    };

    if (loading) return <LoadingSpinner/>;
    if (error || !project) return <ErrorMessage error={error} onBack={() => navigate('/')} t={t}/>;

    return (
        <div className="min-h-screen bg-gray-50 w-full" onClick={handleBackgroundClick}>
            <div className="max-w-4xl mx-auto px-4 py-8" onClick={e => e.stopPropagation()}>
                <ProjectHeader
                    onBack={() => navigate('/')}
                    onEdit={() => navigate(`/edit-project/${project?.id}`)}
                    onDelete={handleProjectDelete}
                    isAuthenticated={isAuthenticated}
                    t={t}
                />

                <div className="bg-white rounded-lg shadow-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                    <ProjectImages
                        images={project.projectImages}
                        projectName={project.name}
                        onImageDelete={handleImageDelete}
                        isAuthenticated={isAuthenticated}
                        getImageUrl={getImageUrl}
                    />
                    <ProjectDetails
                        project={project}
                        t={t}
                    />
                </div>
            </div>
        </div>
    );
};