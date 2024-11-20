import {Header} from "./components/landingPage/Header";
import {useLanguage} from "./utils/translations/LanguageContext";
import {HeroSection} from "./components/landingPage/HeroSection";
import {ProjectSection} from "./components/landingPage/ProjectSection";
import {ContactSection} from "./components/landingPage/ContactSection"
import {useEffect, useState} from "react";
import {projectService} from "./services/projectService";

interface ApiError {
    message: string;
}

interface Project {
    id: number;
    name: string;
    description: string;
    technologies: string[];
    projectImages: {
        id: number;
        imageUrl: string;
        caption?: string;
    }[];
}

function App() {
    const {t} = useLanguage();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setIsLoading(true);
                const response = await projectService.getAllProjects();
                console.log('Fetched projects:', response); // do debugowania
                if (Array.isArray(response) && response.length > 0) {
                    setProjects(response);
                } else {
                    console.error('Unexpected response format:', response);
                    setProjects([]);
                }
            } catch (err) {
                const error = err as Error | ApiError;
                setError(error.message || 'An unknown error occurred');
                console.error('Failed to fetch projects:', error)
            } finally {
                setIsLoading(false)
            }
        };

        void fetchProjects()
    }, []);

    const handleLogin = () => {

    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header
                title={t('header.title')}
                navigation={{
                    about: t('header.navigation.about'),
                    projects: t('header.navigation.projects'),
                    contact: t('header.navigation.contact'),
                    login: t('header.navigation.login')
                }}
                onLoginClick={handleLogin}
            />
            <main className="pt-16">
                <HeroSection
                    title={t('heroSection.title')}
                    description={t('heroSection.description')}
                    githubUrl="https://github.com/noisevisionproductions/"
                    linkedInLink="https://www.linkedin.com/in/tomasz-jurczyk/"
                    emailAddress="tomasz.jurczyk95@gmail.com"
                />
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"/>
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-red-600">
                        {t('projectSection.errorLoading')}
                    </div>
                ) : (
                    <ProjectSection
                        title={t('projectSection.title')}
                        projects={projects}
                    />
                )}
                <ContactSection contact={t('contactSection.contact')}
                                message={t('contactSection.message')}
                                submit={t('contactSection.submit')}
                />
            </main>
        </div>
    );
}

export default App;


