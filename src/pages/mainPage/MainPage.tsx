import { useTranslation } from 'react-i18next';

import { Container } from '@/components/container/Container';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useYearsOfPraxis } from '@/hooks/useYearsOfPraxis';
import { AboutSection } from '@/pages/mainPage/AboutSection';
import { ContactSection } from '@/pages/mainPage/ContactSection';
import { ExperienceSection } from '@/pages/mainPage/ExperienceSection';
import { HeroSection } from '@/pages/mainPage/HeroSection';
import { ProjectsSection } from '@/pages/mainPage/ProjectsSection';

export function MainPage() {
    const { t } = useTranslation();
    const years = useYearsOfPraxis();
    useDocumentTitle(t('other.meta.title', years));

    return (
        <Container>
            <HeroSection />
            <ExperienceSection />
            <ProjectsSection />
            <AboutSection />
            <ContactSection />
        </Container>
    );
}
