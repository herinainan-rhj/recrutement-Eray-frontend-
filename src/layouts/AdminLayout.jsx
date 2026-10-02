import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import Icon from "../components/Icon";
import Logo from "../components/Logo";
import "../styles/admin.css";

const LINKS = [
    { to: "/admin/dashboard", label: "Tableau de bord", icon: "dashboard" },
    { to: "/admin/jobs", label: "Offres d'emploi", icon: "briefcase" },
    { to: "/admin/candidates", label: "Candidats", icon: "users" },
    { to: "/admin/tests", label: "Tests QCM", icon: "clipboard" },
    { to: "/admin/emails", label: "Emails", icon: "mail" },
    { to: "/admin/settings", label: "Paramètres", icon: "settings" },
];

export default function AdminLayout() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { pathname } = useLocation();

    const current = LINKS.find((link) => pathname.startsWith(link.to));

    return (
        <div className="bo-layout">

            {/* SIDEBAR */}
            <aside className={`bo-sidebar ${menuOpen ? "open" : ""}`}>
                <div className="bo-sidebar-brand">
                    <Logo to="/admin/dashboard" light />
                    <span>Espace RH</span>
                </div>

                <nav className="bo-nav">
                    {LINKS.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={() => setMenuOpen(false)}
                        >
                            <Icon name={link.icon} />
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <Link to="/" className="bo-sidebar-site">
                    <Icon name="external" size={16} />
                    Voir le site public
                </Link>
            </aside>

            {menuOpen && (
                <div
                    className="bo-backdrop"
                    onClick={() => setMenuOpen(false)}
                ></div>
            )}

            {/* PARTIE DROITE */}
            <div className="bo-main">

                <header className="bo-topbar">
                    <button
                        type="button"
                        className="ui-icon-btn bo-menu-btn"
                        onClick={() => setMenuOpen(true)}
                        aria-label="Ouvrir le menu"
                    >
                        <Icon name="menu" />
                    </button>

                    <span className="bo-topbar-title">
                        {current?.label || "Administration"}
                    </span>

                    <div className="bo-user">
                        <span className="bo-avatar">RH</span>
                        <span>Admin RH</span>
                    </div>
                </header>

                <main className="bo-content">
                    <Outlet />
                </main>

            </div>
        </div>
    );
}
