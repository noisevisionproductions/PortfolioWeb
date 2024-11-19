import {Header} from "./components/landingPage/Header";
import {useLanguage} from "./utils/translations/LanguageContext";
import {HeroSection} from "./components/landingPage/HeroSection";
import {ProjectSection} from "./components/landingPage/ProjectSection";
import {ContactSection} from "./components/landingPage/ContactSection"

function App() {
    const {t} = useLanguage();

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
            <main className="pt=16">
                <HeroSection
                    title={t('heroSection.title')}
                    description={t('heroSection.description')}
                    githubUrl="https://github.com/noisevisionproductions/"
                    linkedInLink="https://www.linkedin.com/in/tomasz-jurczyk/"
                    emailAddress="tomasz.jurczyk95@gmail.com"
                />
                <ProjectSection projects={t('projectSection.projects')}
                                projectName={t('projectSection.projectName')}
                                projectDescription={t('projectSection.projectDescription')}
                />
                <ContactSection contact={t('contactSection.contact')}
                                message={t('contactSection.message')}
                                submit={t('contactSection.submit')}
                />
            </main>
        </div>
    );
}

export default App;


