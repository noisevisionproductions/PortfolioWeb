import React, {useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import {getImageUrl} from "@/utils/imageUtils";
import {ProjectHeader} from "./ProjectHeader";
import {ProjectImages} from './ProjectImages';
import {ProjectDetails} from './ProjectDetails';
import {LoadingSpinner} from "@/components/shared/LoadingSpinner";
import {ErrorMessage} from "@/components/shared/ErrorMessage";
import {useBaseProject, useProjectImage} from "@/projects/context";
import {ApiError} from "@/auth/types/errors";

export const ProjectDetailsPage: React.FC = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {slug} = useParams<{ slug: string }>();

    const {
        selectedProject: project,
        loading,
        error,
        getProjectBySlug,
        deleteProject
    } = useBaseProject();

    const {deleteProjectImage} = useProjectImage();

    useEffect(() => {
        let isActive = true;

        const fetchProject = async () => {
            if (!slug || !isActive) return;

            try {
                await getProjectBySlug(slug);
            } catch (error) {
                console.error('Error fetching project:', error);
            }
        };

        fetchProject().catch(console.error);

        return () => {
            isActive = false;
        };
    }, [getProjectBySlug, slug]);

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
            await deleteProject(project.id);
            navigate('/', {replace: true});
        } catch (error) {
            if (error instanceof ApiError) {
                if (error.status === 403) {
                    navigate('/unauthorized');
                } else {
                    console.error('API Error:', error.message);
                }
            } else {
                console.error('Unknown error:', error);
            }
        }
    };

    const handleImageDelete = async (imageId: number) => {
        if (!project?.id || !window.confirm(t('projectDetails.confirmImageDelete'))) {
            return;
        }

        try {
            await deleteProjectImage(project.id, imageId);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <LoadingSpinner/>;
    if (error || !project) return <ErrorMessage error={error} onBack={() => navigate('/')} t={t}/>;

    return (
        <div
            className="min-h-screen bg-gray-50 w-full"
            onClick={handleBackgroundClick}
            data-testid="project-background"
        >
            <div
                className="max-w-4xl mx-auto px-4 py-8"
                onClick={e => e.stopPropagation()}
                data-testid="project-content"
            >
                <ProjectHeader
                    onBack={() => navigate('/')}
                    onEdit={() => navigate(`/edit-project/${project?.id}`)}
                    onDelete={handleProjectDelete}
                    t={t}
                />

                <div className="bg-white rounded-lg shadow-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                    <ProjectImages
                        images={project.projectImages || []}
                        projectName={project.name}
                        onImageDelete={handleImageDelete}
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