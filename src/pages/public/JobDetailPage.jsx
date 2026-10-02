import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Icon from "../../components/Icon";
import useApi from "../../hooks/useApi";
import { fetchJobs } from "../../services/api";
import { splitSkills } from "../../utils/candidates";
import ApplyForm from "./ApplyForm";

export default function JobDetailPage() {
    const { id } = useParams();
    const { data: jobs, loading, error } = useApi(
        fetchJobs,
        "Impossible de charger cette offre."
    );
    const [applying, setApplying] = useState(false);

    const job = jobs.find((item) => String(item.id) === id);

    if (loading) {
        return (
            <div className="ui-state">
                <div className="ui-spinner"></div>
                <p>Chargement de l'offre...</p>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="ui-state">
                <Icon name="inbox" size={36} />
                <h3>Offre introuvable</h3>

                <p>
                    {error ||
                        "Cette offre n'existe pas ou n'est plus disponible."}
                </p>

                <Link to="/jobs" className="ui-btn">
                    Voir toutes les offres
                </Link>
            </div>
        );
    }

    const skills = splitSkills(job.competences);

    const facts = [
        { label: "Département", value: job.departement },
        { label: "Localisation", value: job.localisation },
        { label: "Type de contrat", value: job.type_contrat },
        { label: "Niveau d'étude", value: job.niveau_etude },
        {
            label: "Expérience",
            value:
                job.experience_requise === null ||
                job.experience_requise === undefined ||
                job.experience_requise === ""
                    ? ""
                    : Number(job.experience_requise) === 0
                      ? "Débutant accepté"
                      : `${job.experience_requise} an(s)`,
        },
    ].filter((fact) => fact.value);

    return (
        <>
            <section className="page-banner">
                <div className="site-container">
                    <Link to="/jobs" className="banner-back">
                        <Icon name="back" size={16} />
                        Toutes les offres
                    </Link>

                    <h1>{job.titre}</h1>

                    <p>
                        {[job.departement, job.localisation, job.type_contrat]
                            .filter(Boolean)
                            .join(" · ")}
                    </p>
                </div>
            </section>

            <div className="site-container detail-layout">
                <article className="detail-main">
                    <h2>Description du poste</h2>
                    <p className="detail-text">{job.description}</p>

                    {skills.length > 0 && (
                        <>
                            <h2>Compétences recherchées</h2>

                            <div className="detail-skills">
                                {skills.map((skill) => (
                                    <span key={skill} className="ui-pill">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </>
                    )}
                </article>

                <aside className="detail-side">
                    <h2>En résumé</h2>

                    <dl>
                        {facts.map((fact) => (
                            <div key={fact.label}>
                                <dt>{fact.label}</dt>
                                <dd>{fact.value}</dd>
                            </div>
                        ))}
                    </dl>

                    <button
                        type="button"
                        className="ui-btn ui-btn-block"
                        onClick={() => setApplying(true)}
                    >
                        Postuler à cette offre
                    </button>
                </aside>
            </div>

            {applying && (
                <ApplyForm job={job} onClose={() => setApplying(false)} />
            )}
        </>
    );
}
