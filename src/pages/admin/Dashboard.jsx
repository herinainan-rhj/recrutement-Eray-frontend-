import { Link } from "react-router-dom";
import Icon from "../../components/Icon";
import useApi from "../../hooks/useApi";
import { fetchCandidates, fetchJobs } from "../../services/api";
import {
    STATUSES,
    fullName,
    getStatus,
    initials,
} from "../../utils/candidates";

function Bars({ rows, emptyText }) {
    const max = Math.max(...rows.map((row) => row.value), 1);

    if (rows.every((row) => row.value === 0)) {
        return <p className="bo-muted">{emptyText}</p>;
    }

    return (
        <div className="bo-bars">
            {rows.map((row) => (
                <div
                    key={row.label}
                    className="bo-bar-row"
                    title={`${row.label} : ${row.value}`}
                >
                    <span className="bo-bar-label">{row.label}</span>

                    <div className="bo-bar-track">
                        {row.value > 0 && (
                            <div
                                className="bo-bar-fill"
                                style={{ width: `${(row.value / max) * 100}%` }}
                            ></div>
                        )}
                    </div>

                    <span className="bo-bar-value">{row.value}</span>
                </div>
            ))}
        </div>
    );
}

export default function Dashboard() {
    const jobs = useApi(fetchJobs, "Impossible de charger les offres.");
    const candidates = useApi(
        fetchCandidates,
        "Impossible de charger les candidatures."
    );

    const loading = jobs.loading || candidates.loading;
    const error = jobs.error || candidates.error;

    const count = (status) =>
        candidates.data.filter(
            (candidate) => candidate.etat_candidature === status
        ).length;

    const stats = [
        { label: "Candidatures", value: candidates.data.length, icon: "users" },
        { label: "Offres publiées", value: jobs.data.length, icon: "briefcase" },
        { label: "Tests terminés", value: count("test_termine"), icon: "clipboard" },
        { label: "Entretiens", value: count("entretien"), icon: "calendar" },
    ];

    const pipeline = STATUSES.map((status) => ({
        label: status.label,
        value: count(status.value),
    }));

    const perJob = jobs.data
        .map((job) => ({
            label: job.titre,
            value: candidates.data.filter(
                (candidate) =>
                    (candidate.job?.id ?? candidate.job_id) === job.id
            ).length,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);

    const recent = [...candidates.data]
        .sort((a, b) => (b.id || 0) - (a.id || 0))
        .slice(0, 6);

    const reload = () => {
        jobs.reload();
        candidates.reload();
    };

    return (
        <div className="bo-page">

            <div className="bo-head">
                <div>
                    <h1>Tableau de bord</h1>
                    <p>Vue d'ensemble de l'activité de recrutement.</p>
                </div>

                <div className="bo-head-actions">
                    <button
                        type="button"
                        className="ui-btn ui-btn-secondary"
                        onClick={reload}
                        disabled={loading}
                    >
                        <Icon name="refresh" size={16} />
                        Actualiser
                    </button>

                    <Link to="/admin/jobs" className="ui-btn">
                        <Icon name="plus" size={16} />
                        Nouvelle offre
                    </Link>
                </div>
            </div>

            {error && (
                <div className="ui-alert error" role="alert">
                    <Icon name="alert" />
                    {error}
                </div>
            )}

            {/* INDICATEURS */}
            <div className="bo-stats">
                {stats.map((stat) => (
                    <div key={stat.label} className="bo-stat">
                        <div className="bo-stat-icon">
                            <Icon name={stat.icon} size={20} />
                        </div>

                        <div>
                            <span>{stat.label}</span>
                            <strong>{loading ? "…" : stat.value}</strong>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bo-grid-2">

                <section className="bo-card">
                    <div className="bo-card-head">
                        <h2>Candidatures par étape</h2>
                    </div>

                    <div className="bo-card-body">
                        {loading ? (
                            <p className="bo-muted">Chargement...</p>
                        ) : (
                            <Bars
                                rows={pipeline}
                                emptyText="Aucune candidature pour le moment."
                            />
                        )}
                    </div>
                </section>

                <section className="bo-card">
                    <div className="bo-card-head">
                        <h2>Candidatures par offre</h2>
                        <Link to="/admin/jobs">Gérer les offres</Link>
                    </div>

                    <div className="bo-card-body">
                        {loading ? (
                            <p className="bo-muted">Chargement...</p>
                        ) : perJob.length === 0 ? (
                            <p className="bo-muted">Aucune offre publiée.</p>
                        ) : (
                            <Bars
                                rows={perJob}
                                emptyText="Aucune candidature reçue sur les offres publiées."
                            />
                        )}
                    </div>
                </section>

            </div>

            {/* DERNIÈRES CANDIDATURES */}
            <section className="bo-card">
                <div className="bo-card-head">
                    <h2>Dernières candidatures</h2>
                    <Link to="/admin/candidates">Tout voir</Link>
                </div>

                {loading ? (
                    <div className="ui-state">
                        <div className="ui-spinner"></div>
                    </div>
                ) : recent.length === 0 ? (
                    <div className="ui-state">
                        <Icon name="inbox" size={34} />
                        <h3>Aucune candidature</h3>
                        <p>Les candidatures envoyées apparaîtront ici.</p>
                    </div>
                ) : (
                    <div className="bo-table-wrap">
                        <table className="bo-table">
                            <thead>
                                <tr>
                                    <th>Candidat</th>
                                    <th>Poste</th>
                                    <th>Conformité CV</th>
                                    <th>Note test</th>
                                    <th>Étape</th>
                                </tr>
                            </thead>

                            <tbody>
                                {recent.map((candidate) => {
                                    const status = getStatus(
                                        candidate.etat_candidature
                                    );

                                    return (
                                        <tr key={candidate.id}>
                                            <td>
                                                <div className="bo-person">
                                                    <span className="bo-avatar">
                                                        {initials(candidate)}
                                                    </span>

                                                    <div>
                                                        <strong>
                                                            {fullName(candidate)}
                                                        </strong>
                                                        <small>
                                                            {candidate.email}
                                                        </small>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                {candidate.job?.titre || "—"}
                                            </td>

                                            <td className="num">
                                                {candidate.note_cv ?? 0} %
                                            </td>

                                            <td className="num">
                                                {candidate.note_test ?? "—"}
                                            </td>

                                            <td>
                                                <span
                                                    className={`ui-badge ${status.tone}`}
                                                >
                                                    {status.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

        </div>
    );
}
