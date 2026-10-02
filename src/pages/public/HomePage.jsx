import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../../components/Icon";
import JobCard from "../../components/JobCard";
import useApi from "../../hooks/useApi";
import { fetchJobs } from "../../services/api";
import ApplyForm from "./ApplyForm";

const STEPS = [
    {
        icon: "search",
        title: "Choisissez une offre",
        text: "Parcourez nos postes ouverts et trouvez celui qui correspond à votre profil.",
    },
    {
        icon: "file",
        title: "Envoyez votre CV",
        text: "Votre CV est analysé automatiquement et comparé aux critères du poste.",
    },
    {
        icon: "clipboard",
        title: "Passez le test",
        text: "Si votre profil correspond, vous accédez directement à un test de compétences en ligne.",
    },
    {
        icon: "users",
        title: "Rencontrez l'équipe",
        text: "Les candidats retenus sont invités à un entretien avec nos recruteurs.",
    },
];

const VALUES = [
    {
        icon: "check",
        title: "Un processus transparent",
        text: "Vous connaissez immédiatement le résultat de l'analyse de votre CV et de votre test.",
    },
    {
        icon: "clock",
        title: "Une réponse rapide",
        text: "La candidature et l'évaluation se font en ligne, sans attente ni déplacement.",
    },
    {
        icon: "briefcase",
        title: "Des postes variés",
        text: "Développement, design, cloud : nos offres couvrent plusieurs métiers et niveaux d'expérience.",
    },
];

export default function HomePage() {
    const { data: jobs, loading } = useApi(fetchJobs);
    const [selectedJob, setSelectedJob] = useState(null);

    const latestJobs = [...jobs]
        .sort((a, b) => (b.id || 0) - (a.id || 0))
        .slice(0, 3);

    return (
        <>
            {/* HERO */}
            <section className="hero">
                <div className="site-container hero-inner">
                    <div className="hero-text">
                        <span className="hero-eyebrow">Nous recrutons</span>

                        <h1>
                            Construisez la suite de votre carrière avec E RAY
                        </h1>

                        <p>
                            Découvrez nos offres d'emploi, postulez en quelques
                            minutes et suivez un processus de recrutement clair,
                            de la candidature à l'entretien.
                        </p>

                        <div className="hero-actions">
                            <Link to="/jobs" className="ui-btn ui-btn-light">
                                Voir les offres
                                <Icon name="arrow" />
                            </Link>

                            <Link to="/entreprise" className="hero-link">
                                Découvrir l'entreprise
                            </Link>
                        </div>

                        {!loading && jobs.length > 0 && (
                            <div className="hero-stat">
                                <strong>{jobs.length}</strong>

                                <span>
                                    offre{jobs.length > 1 ? "s" : ""}{" "}
                                    actuellement ouverte
                                    {jobs.length > 1 ? "s" : ""}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="hero-media">
                        <img
                            src="/recrutement.png"
                            alt="Une équipe accueille une nouvelle recrue"
                        />
                    </div>
                </div>
            </section>

            {/* PROCESSUS */}
            <section className="section">
                <div className="site-container">
                    <div className="section-head">
                        <span className="section-eyebrow">Comment ça marche</span>
                        <h2>Un recrutement en quatre étapes</h2>
                    </div>

                    <ol className="steps">
                        {STEPS.map((step, index) => (
                            <li key={step.title} className="step">
                                <div className="step-icon">
                                    <Icon name={step.icon} size={22} />
                                </div>

                                <span className="step-number">
                                    Étape {index + 1}
                                </span>

                                <h3>{step.title}</h3>
                                <p>{step.text}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* DERNIÈRES OFFRES */}
            <section className="section section-alt">
                <div className="site-container">
                    <div className="section-head section-head-row">
                        <div>
                            <span className="section-eyebrow">Opportunités</span>
                            <h2>Nos dernières offres</h2>
                        </div>

                        <Link to="/jobs" className="ui-btn ui-btn-secondary">
                            Toutes les offres
                        </Link>
                    </div>

                    {loading ? (
                        <div className="ui-state">
                            <div className="ui-spinner"></div>
                        </div>
                    ) : latestJobs.length === 0 ? (
                        <div className="ui-state">
                            <Icon name="inbox" size={36} />
                            <h3>Aucune offre pour le moment</h3>
                            <p>
                                De nouveaux postes seront publiés prochainement.
                                Revenez bientôt.
                            </p>
                        </div>
                    ) : (
                        <div className="jobs-grid">
                            {latestJobs.map((job) => (
                                <JobCard
                                    key={job.id}
                                    job={job}
                                    onApply={setSelectedJob}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* POURQUOI NOUS REJOINDRE */}
            <section className="section">
                <div className="site-container">
                    <div className="section-head">
                        <span className="section-eyebrow">Pourquoi postuler</span>
                        <h2>Une expérience candidat pensée pour vous</h2>
                    </div>

                    <div className="features">
                        {VALUES.map((value) => (
                            <div key={value.title} className="feature">
                                <div className="feature-icon">
                                    <Icon name={value.icon} size={20} />
                                </div>

                                <h3>{value.title}</h3>
                                <p>{value.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* APPEL À L'ACTION */}
            <section className="site-container">
                <div className="cta">
                    <div>
                        <h2>Prêt à nous rejoindre ?</h2>

                        <p>
                            Consultez nos postes ouverts ou contactez-nous pour
                            toute question sur le recrutement.
                        </p>
                    </div>

                    <div className="cta-actions">
                        <Link to="/jobs" className="ui-btn ui-btn-light">
                            Voir les offres
                        </Link>

                        <Link to="/contact" className="hero-link">
                            Nous contacter
                        </Link>
                    </div>
                </div>
            </section>

            {selectedJob && (
                <ApplyForm
                    job={selectedJob}
                    onClose={() => setSelectedJob(null)}
                />
            )}
        </>
    );
}
