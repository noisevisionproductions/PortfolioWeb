import {useState, useEffect} from 'react';
import {Project} from '../types/project';
import {projectService} from '../services/projectService';

export const useProject = (slug: string | undefined, t: (key: string) => string) => {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchProject = async () => {
            if (!slug) return;

            try {
                setLoading(true);
                const data = await projectService.getProjectBySlug(slug);
                if (isMounted) {
                    setProject(data);
                }
            } catch (err) {
                if (isMounted) {
                    setError('Could not load the project');
                    console.error(err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchProject().catch((err) => {
            console.error('Error in fetchProject:', err);
            setError(t('projectDetails.error'));
            setLoading(false);
        });

        return () => {
            isMounted = false;
        };
    }, [slug, t]);

    return {project, loading, error, setProject, setError};
};