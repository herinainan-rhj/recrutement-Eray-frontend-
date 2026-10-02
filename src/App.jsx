import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";

import Dashboard from "./pages/admin/Dashboard";
import JobsManagement from "./pages/admin/JobsManagement";
import QuestionnaireManagement from "./pages/admin/QuestionnaireManagement";
import TestPage from "./pages/public/TestPage";
import CandidatesManagement from "./pages/admin/CandidatesManagement";

import JobsPage from "./pages/public/JobsPage";

import "./styles/app.css";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =========================================
                   SITE PUBLIC
                ========================================= */}

                <Route
                    path="/"
                    element={<JobsPage />}
                />

                <Route
                    path="/test"
                    element={<TestPage />}
                />

                <Route
                    path="/jobs"
                    element={<JobsPage />}
                />

                <Route
                    path="/admin/candidates"
                    element={<CandidatesManagement />}
                />


                {/* =========================================
                   ADMIN — DASHBOARD
                ========================================= */}

                <Route
                    path="/admin/dashboard"
                    element={
                        <AdminLayout>
                            <Dashboard />
                        </AdminLayout>
                    }
                />


                {/* =========================================
                   ADMIN — OFFRES
                ========================================= */}

                <Route
                    path="/admin/jobs"
                    element={
                        <AdminLayout>
                            <JobsManagement />
                        </AdminLayout>
                    }
                />


                {/* =========================================
                   ADMIN — TESTS QCM
                ========================================= */}

                <Route
                    path="/admin/tests"
                    element={
                        <AdminLayout>
                            <QuestionnaireManagement />
                        </AdminLayout>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;