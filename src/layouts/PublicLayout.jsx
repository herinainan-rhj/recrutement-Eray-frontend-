import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import Icon from "../components/Icon";
import Logo from "../components/Logo";
import site from "../config/site";
import "../styles/public.css";

const LINKS = [
    { to: "/", label: "Accueil", end: true },
    { to: "/jobs", label: "Offres d'emploi" },
    { to: "/entreprise", label: "Entreprise" },
    { to: "/a-propos", label: "À propos" },
    { to: "/contact", label: "Contact" },
];

export default function PublicLayout() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="site">

            {/* BARRE DE NAVIGATION */}
            <header className="site-header">
                <div className="site-container site-header-inner">
                    <Logo />

                    <button
                        type="button"
                        className="ui-icon-btn site-menu-btn"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Menu"
                        aria-expanded={menuOpen}
                    >
                        <Icon name={menuOpen ? "x" : "menu"} />
                    </button>

                    <nav className={`site-nav ${menuOpen ? "open" : ""}`}>
                        {LINKS.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                className="site-nav-link"
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </header>

            <main className="site-main">
                <Outlet />
            </main>

            {/* PIED DE PAGE */}
            <footer className="site-footer">
                <div className="site-container site-footer-inner">
                    <div className="site-footer-brand">
                        <Logo light />

                        <p>
                            Rejoignez nos équipes : consultez nos offres,
                            postulez en ligne et suivez un processus de
                            recrutement simple et transparent.
                        </p>
                    </div>

                    <div className="site-footer-col">
                        <h5>Navigation</h5>

                        {LINKS.map((link) => (
                            <Link key={link.to} to={link.to}>
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="site-footer-col">
                        <h5>Contact</h5>

                        {site.adresse && <span>{site.adresse}</span>}

                        {site.email && (
                            <a href={`mailto:${site.email}`}>{site.email}</a>
                        )}

                        {site.telephone && (
                            <a href={`tel:${site.telephone}`}>{site.telephone}</a>
                        )}

                        <Link to="/contact">Nous écrire</Link>
                    </div>
                </div>

                <div className="site-container site-footer-bottom">
                    <span>
                        © {new Date().getFullYear()} {site.nom}. Tous droits réservés.
                    </span>

                    <Link to="/admin">Espace RH</Link>
                </div>
            </footer>
        </div>
    );
}
