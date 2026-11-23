import { BrowserRouter, Route, Routes } from 'react-router';

import { SiteLayout } from '@/components/siteLayout/SiteLayout';
import { ContrastReportPage } from '@/pages/contrastReportPage/ContrastReportPage';
import { MainPage } from '@/pages/mainPage/MainPage';
import { NotFoundPage } from '@/pages/notFoundPage/NotFoundPage';
import { PrivacyByDesignPage } from '@/pages/privacyByDesignPage/PrivacyByDesignPage';
import { ProjectPage } from '@/pages/projectPage/ProjectPage';

export function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<SiteLayout />}>
                    <Route index element={<MainPage />} />
                    <Route path="projects/:slug" element={<ProjectPage />} />
                    <Route path="accessibility" element={<ContrastReportPage />} />
                    <Route path="privacy-by-design" element={<PrivacyByDesignPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
