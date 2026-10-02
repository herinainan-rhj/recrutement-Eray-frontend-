import { Link } from "react-router-dom";
import Icon from "./Icon";

export default function JobCard({ job, onApply }) {
    return (
        <article className="job-card">
            <div className="job-card-top">
                <span className="job-card-dept">
                    {job.departement || "E RAY"}
                </span>

                {job.type_contrat && (
                    <span className="ui-pill">{job.type_contrat}</span>
                )}
            </div>

            <h3>
                <Link to={`/jobs/${job.id}`}>{job.titre}</Link>
            </h3>

            <div className="job-card-meta">
                {job.localisation && (
                    <span>
                        <Icon name="pin" size={15} />
                        {job.localisation}
                    </span>
                )}

                {job.experience_requise !== null &&
                    job.experience_requise !== undefined &&
                    job.experience_requise !== "" && (
                        <span>
                            <Icon name="clock" size={15} />
                            {Number(job.experience_requise) === 0
                                ? "Débutant accepté"
                                : `${job.experience_requise} an(s) d'expérience`}
                        </span>
                    )}
            </div>

            {job.description && (
                <p className="job-card-desc">{job.description}</p>
            )}

            <div className="job-card-actions">
                <Link
                    to={`/jobs/${job.id}`}
                    className="ui-btn ui-btn-secondary ui-btn-sm"
                >
                    Détails
                </Link>

                <button
                    type="button"
                    className="ui-btn ui-btn-sm"
                    onClick={() => onApply(job)}
                >
                    Postuler
                </button>
            </div>
        </article>
    );
}
