import { useEffect, useState } from "react";
import api from "../../services/api";
import "./JobsPage.css";
import ApplyForm from "./ApplyForm";

export default function JobsPage() {
    const [selectedJob, setSelectedJob] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Web Development");

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await api.get("/jobs");
            setJobs(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Filtrage des offres
    const filteredJobs = jobs.filter((job) => {
        const matchesTitle = job.titre
            ?.toLowerCase()
            .includes(searchTitle.toLowerCase());
        const matchesLocation = job.localisation
            ?.toLowerCase()
            .includes(searchLocation.toLowerCase());
        return matchesTitle && matchesLocation;
    });

    return (
        <div className="jobs-page-container">
            {/* BARRE DE NAVIGATION SUPÉRIEURE */}
            <header className="main-navbar">
                <div className="nav-logo">
                    <div className="logo-badge-circle">
                        <span>E</span>
                    </div>
                    <div className="logo-badge-text">RAY</div>
                </div>

                <nav className="nav-links">
                    <a href="#accueil" className="nav-item">Accueil</a>
                    <a href="#offres" className="nav-item active">Offres d'emploi</a>
                    <a href="#entreprise" className="nav-item">Entreprise</a>
                    <a href="#apropos" className="nav-item">À Propos</a>
                    <a href="#contact" className="nav-item">Contact Us</a>
                </nav>
            </header>

            {/* BANNIÈRE HERO / BARRE DE RECHERCHE */}
            <section className="search-hero-banner">
                <div className="search-box">
                    <div className="input-group">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Job Title, Keywords"
                            value={searchTitle}
                            onChange={(e) => setSearchTitle(e.target.value)}
                        />
                    </div>

                    <div className="input-divider"></div>

                    <div className="input-group">
                        <span className="location-icon">📍</span>
                        <input
                            type="text"
                            placeholder="Location"
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                        />
                    </div>

                    <button className="btn-search">Rechercher</button>
                </div>
            </section>

            {/* CONTENU PRINCIPAL (SIDEBAR + GRILLE) */}
            <main className="content-layout">
                {/* BARRE LATÉRALE - CATÉGORIES */}
                <aside className="sidebar-categories">
                    <h3>Catégories</h3>
                    <ul className="category-list">
                        {[
                            { name: "Web Development", icon: "</>" },
                            { name: "Mobile App Development", icon: "📱" },
                            { name: "UI/UX", icon: "🎨" },
                            { name: "Cloud", icon: "☁️️" }
                        ].map((cat) => (
                            <li
                                key={cat.name}
                                className={`category-item ${selectedCategory === cat.name ? "active" : ""}`}
                                onClick={() => setSelectedCategory(cat.name)}
                            >
                                <span className="cat-icon">{cat.icon}</span>
                                <span>{cat.name}</span>
                            </li>
                        ))}
                    </ul>
                    <button className="btn-filter">Filter</button>
                </aside>

                {/* CONTENEUR DES OFFRES */}
                <section className="jobs-display-area">
                    {/* OPTION DE TRI */}
                    <div className="sort-bar">
                        <label>Trier par</label>
                        <select defaultValue="recent">
                            <option value="recent">Plus récent</option>
                            <option value="popular">Plus populaire</option>
                        </select>
                    </div>

                    {/* GRILLE DES CARTE DE RECUTEMENT */}
                    <div className="jobs-cards-grid">
                        {filteredJobs.map((job) => (
                            <div key={job.id} className="job-card-item">
                                {/* LOGO CARTE */}
                                <div className="card-company-logo">
                                    <div className="mini-logo">E</div>
                                    <span className="company-tag">ERAY</span>
                                </div>

                                <h4 className="job-title">{job.titre}</h4>
                                <p className="job-company-name">
                                    {job.departement || "E RAY Solutions"}
                                </p>

                                <div className="job-location">
                                    📍 {job.localisation}
                                </div>

                                {/* TAGS DU CONTRAT */}
                                <div className="job-pills">
                                    {job.type_contrat && (
                                        <span className="pill">{job.type_contrat}</span>
                                    )}
                                    <span className="pill">Télétravail</span>
                                </div>

                                <button
                                    className="btn-apply-card"
                                    onClick={() => setSelectedJob(job)}
                                >
                                    Postuler
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* PIED DE PAGE */}
            <footer className="footer-section">
                <div className="footer-content">
                    <div className="footer-left">
                        <p>© 2026 E RAY, Inc. All rights reserved.</p>
                        <div className="social-links">
                            <a href="#fb" className="social-icon">f</a>
                            <a href="#tw" className="social-icon">t</a>
                            <a href="#ig" className="social-icon">i</a>
                            <a href="#in" className="social-icon">in</a>
                            <a href="#yt" className="social-icon">yt</a>
                        </div>
                    </div>

                    <div className="footer-right">
                        <div className="footer-col">
                            <h5>Accueil</h5>
                            <a href="#offres">Offres d'emploi</a>
                            <a href="#entreprise">Entreprise</a>
                            <a href="#apropos">À Propos</a>
                            <a href="#contact">Contact Us</a>
                        </div>
                        <div className="footer-col">
                            <h5>Site map</h5>
                            <a href="#status">Status</a>
                            <a href="#privacy">Confidentialité</a>
                            <a href="#rights">Droits réservés</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* MODALE DE CANDIDATURE */}
            {selectedJob && (
                <ApplyForm
                    jobId={selectedJob.id}
                    onClose={() => setSelectedJob(null)}
                />
            )}
        </div>
    );
}