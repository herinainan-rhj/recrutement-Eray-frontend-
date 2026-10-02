import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";
import PublicLayout from "./layouts/PublicLayout";

import HomePage from "./pages/public/HomePage";
import JobsPage from "./pages/public/JobsPage";
import JobDetailPage from "./pages/public/JobDetailPage";
import CompanyPage from "./pages/public/CompanyPage";
import AboutPage from "./pages/public/AboutPage";
import ContactPage from "./pages/public/ContactPage";
import NotFoundPage from "./pages/public/NotFoundPage";
import TestPage from "./pages/public/TestPage";

import Dashboard from "./pages/admin/Dashboard";
import JobsManagement from "./pages/admin/JobsManagement";
import CandidatesManagement from "./pages/admin/CandidatesManagement";
import QuestionnaireManagement from "./pages/admin/QuestionnaireManagement";
import EmailsPage from "./pages/admin/EmailsPage";
import SettingsPage from "./pages/admin/SettingsPage";


function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =========================================
                   SITE PUBLIC
                ========================================= */}

                <Route element={<PublicLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/jobs" element={<JobsPage />} />
                    <Route path="/jobs/:id" element={<JobDetailPage />} />
                    <Route path="/entreprise" element={<CompanyPage />} />
                    <Route path="/a-propos" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>

                {/* TEST DE RECRUTEMENT (sans navigation, pour rester concentré) */}
                <Route path="/test" element={<TestPage />} />


                {/* =========================================
                   BACKOFFICE
                ========================================= */}

                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="jobs" element={<JobsManagement />} />
                    <Route path="candidates" element={<CandidatesManagement />} />
                    <Route path="tests" element={<QuestionnaireManagement />} />
                    <Route path="emails" element={<EmailsPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;
