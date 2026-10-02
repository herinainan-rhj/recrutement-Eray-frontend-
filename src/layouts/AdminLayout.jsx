import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AdminLayout({ children }) {
    return (
        <div className="admin-layout">

            {/* SIDEBAR */}
            <aside className="admin-sidebar">
                <Sidebar />
            </aside>

            {/* PARTIE DROITE */}
            <div className="admin-main">

                {/* NAVBAR */}
                <header className="admin-navbar">
                    <Navbar />
                </header>

                {/* CONTENU DE LA PAGE */}
                <main className="admin-page-content">
                    {children}
                </main>

            </div>

            <style>{`

                * {
                    box-sizing: border-box;
                }

                html,
                body,
                #root {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    min-height: 100%;
                }

                body {
                    overflow-x: hidden;
                }

                /* =========================================
                   STRUCTURE PRINCIPALE
                ========================================= */

                .admin-layout {
                    display: flex;
                    width: 100%;
                    min-height: 100vh;
                    background: #f5f7fb;
                }

                /* =========================================
                   SIDEBAR
                ========================================= */

                .admin-sidebar {
                    width: 250px;
                    min-width: 250px;
                    min-height: 100vh;
                    background: #ffffff;
                    border-right: 1px solid #e6e9ef;
                    position: sticky;
                    top: 0;
                    align-self: flex-start;
                    z-index: 100;
                }

                /* =========================================
                   PARTIE DROITE
                ========================================= */

                .admin-main {
                    flex: 1;
                    min-width: 0;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                }

                /* =========================================
                   NAVBAR
                ========================================= */

                .admin-navbar {
                    width: 100%;
                    height: 70px;
                    min-height: 70px;
                    background: #ffffff;
                    border-bottom: 1px solid #e6e9ef;
                    position: sticky;
                    top: 0;
                    z-index: 90;
                }

                /* =========================================
                   CONTENU
                ========================================= */

                .admin-page-content {
                    flex: 1;
                    width: 100%;
                    min-width: 0;
                    padding: 0;
                }

                /* =========================================
                   TABLETTE
                ========================================= */

                @media (max-width: 1000px) {

                    .admin-sidebar {
                        width: 220px;
                        min-width: 220px;
                    }

                }

                /* =========================================
                   MOBILE
                ========================================= */

                @media (max-width: 768px) {

                    .admin-layout {
                        display: block;
                        min-height: 100vh;
                    }

                    .admin-sidebar {
                        width: 100%;
                        min-width: 100%;
                        min-height: auto;
                        position: relative;
                        border-right: none;
                        border-bottom: 1px solid #e6e9ef;
                    }

                    .admin-main {
                        width: 100%;
                        min-height: auto;
                    }

                    .admin-navbar {
                        height: 60px;
                        min-height: 60px;
                        position: sticky;
                        top: 0;
                    }

                    .admin-page-content {
                        width: 100%;
                    }

                }

                /* =========================================
                   PETIT MOBILE
                ========================================= */

                @media (max-width: 480px) {

                    .admin-navbar {
                        height: 56px;
                        min-height: 56px;
                    }

                }

            `}</style>
        </div>
    );
}