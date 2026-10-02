import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../../components/Icon";
import Modal from "../../components/Modal";
import useApi from "../../hooks/useApi";
import {
    fetchCandidates,
    getCvUrl,
    getErrorMessage,
    updateCandidateStatus,
} from "../../services/api";
import {
    STATUSES,
    formatDate,
    fullName,
    getScoreTone,
    getStatus,
    initials,
} from "../../utils/candidates";

export default function CandidatesManagement() {
    const {
        data: candidates,
        setData: setCandidates,
        loading,
        error,
        reload,
    } = useApi(
        fetchCandidates,
        "Impossible de récupérer la liste des candidatures."
    );

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [jobFilter, setJobFilter] = useState("");

    const [selected, setSelected] = useState(null);
    const [newStatus, setNewStatus] = useState("");
    const [saving, setSaving] = useState(false);
    const [statusError, setStatusError] = useState("");

    const jobTitles = useMemo(
        () =>
            [
                ...new Set(
                    candidates
                        .map((candidate) => candidate.job?.titre)
                        .filter(Boolean)
                ),
            ].sort(),
        [candidates]
    );

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();

        return candidates.filter(
            (candidate) =>
                `${fullName(candidate)} ${candidate.email || ""}`
                    .toLowerCase()
                    .includes(term) &&
                (!statusFilter ||
                    candidate.etat_candidature === statusFilter) &&
                (!jobFilter || candidate.job?.titre === jobFilter)
        );
    }, [candidates, search, statusFilter, jobFilter]);

    const count = (status) =>
        candidates.filter(
            (candidate) => candidate.etat_candidature === status
        ).length;

    const stats = [
        { label: "Total candidats", value: candidates.length, icon: "users" },
        { label: "À tester", value: count("test_a_passer"), icon: "file" },
        { label: "Tests terminés", value: count("test_termine"), icon: "clipboard" },
        { label: "Entretiens", value: count("entretien"), icon: "calendar" },
    ];

    const openDetails = (candidate) => {
        setSelected(candidate);
        setNewStatus(candidate.etat_candidature || "");
        setStatusError("");
    };

    const handleStatusSave = async () => {
        setSaving(true);
        setStatusError("");

        try {
            await updateCandidateStatus(selected.id, newStatus);

            const updated = { ...selected, etat_candidature: newStatus };

            setCandidates(
                candidates.map((candidate) =>
                    candidate.id === selected.id ? updated : candidate
                )
            );

            setSelected(updated);

        } catch (err) {
            console.error("Erreur changement d'étape :", err);

            setStatusError(
                getErrorMessage(err, "L'étape n'a pas pu être modifiée.")
            );
        } finally {
            setSaving(false);
        }
    };

    const selectedStatus = selected
        ? getStatus(selected.etat_candidature)
        : null;

    return (
        <div className="bo-page">

            {/* HEADER */}
            <div className="bo-head">
                <div>
                    <h1>Gestion des candidatures</h1>
                    <p>Consultez et suivez les candidatures reçues.</p>
                </div>

                <button
                    type="button"
                    className="ui-btn ui-btn-secondary"
                    onClick={reload}
                    disabled={loading}
                >
                    <Icon name="refresh" size={16} />
                    Actualiser
                </button>
            </div>

            {/* STATISTIQUES */}
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

            {/* ERREUR */}
            {error && (
                <div className="ui-alert error" role="alert">
                    <Icon name="alert" />
                    {error}
                </div>
            )}

            {/* TABLEAU */}
            <section className="bo-card">

                <div className="bo-card-head">
                    <h2>Candidatures reçues</h2>

                    <span>
                        {filtered.length} candidature
                        {filtered.length > 1 ? "s" : ""}
                        {filtered.length !== candidates.length &&
                            ` sur ${candidates.length}`}
                    </span>
                </div>

                <div className="bo-toolbar">
                    <div className="ui-search">
                        <Icon name="search" size={16} />

                        <input
                            className="ui-input"
                            type="search"
                            placeholder="Rechercher par nom ou email..."
                            aria-label="Rechercher un candidat"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        className="ui-input"
                        aria-label="Filtrer par étape"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Toutes les étapes</option>

                        {STATUSES.map((status) => (
                            <option key={status.value} value={status.value}>
                                {status.label}
                            </option>
                        ))}
                    </select>

                    <select
                        className="ui-input"
                        aria-label="Filtrer par poste"
                        value={jobFilter}
                        onChange={(e) => setJobFilter(e.target.value)}
                    >
                        <option value="">Tous les postes</option>

                        {jobTitles.map((title) => (
                            <option key={title} value={title}>
                                {title}
                            </option>
                        ))}
                    </select>
                </div>

                {loading ? (

                    <div className="ui-state">
                        <div className="ui-spinner"></div>
                        <p>Chargement des candidatures...</p>
                    </div>

                ) : filtered.length === 0 ? (

                    <div className="ui-state">
                        <Icon name="inbox" size={34} />

                        <h3>Aucune candidature</h3>

                        <p>
                            {candidates.length === 0
                                ? "Les candidatures envoyées apparaîtront ici."
                                : "Aucune candidature ne correspond aux filtres."}
                        </p>
                    </div>

                ) : (

                    <div className="bo-table-wrap">
                        <table className="bo-table">

                            <thead>
                                <tr>
                                    <th>Candidat</th>
                                    <th>Poste</th>
                                    <th>CV</th>
                                    <th>Conformité</th>
                                    <th>Note test</th>
                                    <th>Étape</th>
                                    <th aria-label="Actions"></th>
                                </tr>
                            </thead>

                            <tbody>
                                {filtered.map((candidate) => {
                                    const status = getStatus(
                                        candidate.etat_candidature
                                    );
                                    const tone = getScoreTone(candidate.note_cv);

                                    return (
                                        <tr key={candidate.id}>

                                            {/* CANDIDAT */}
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

                                            {/* POSTE */}
                                            <td>
                                                {candidate.job?.titre ||
                                                    "Poste inconnu"}
                                            </td>

                                            {/* CV */}
                                            <td>
                                                {candidate.cv ? (
                                                    <a
                                                        href={getCvUrl(candidate.id)}
                                                        className="ui-btn ui-btn-secondary ui-btn-sm"
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        <Icon name="file" size={14} />
                                                        Voir
                                                    </a>
                                                ) : (
                                                    <span className="bo-muted">
                                                        Aucun CV
                                                    </span>
                                                )}
                                            </td>

                                            {/* CONFORMITE */}
                                            <td>
                                                <div className="bo-score">
                                                    <div className="bo-score-value">
                                                        {candidate.note_cv ?? 0} %
                                                    </div>

                                                    <div className="bo-score-track">
                                                        <div
                                                            className={`bo-score-fill ${tone}`}
                                                            style={{
                                                                width: `${Math.min(
                                                                    Number(candidate.note_cv) || 0,
                                                                    100
                                                                )}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* NOTE TEST */}
                                            <td className="num">
                                                {candidate.note_test !== null &&
                                                candidate.note_test !== undefined ? (
                                                    <>
                                                        <strong>
                                                            {candidate.note_test}
                                                        </strong>
                                                        <span className="bo-muted">
                                                            {" "}/ 100
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="bo-muted">—</span>
                                                )}
                                            </td>

                                            {/* ETAPE */}
                                            <td>
                                                <span
                                                    className={`ui-badge ${status.tone}`}
                                                >
                                                    {status.label}
                                                </span>
                                            </td>

                                            {/* ACTION */}
                                            <td>
                                                <div className="bo-table-actions">
                                                    <button
                                                        type="button"
                                                        className="ui-icon-btn"
                                                        onClick={() =>
                                                            openDetails(candidate)
                                                        }
                                                        title="Voir la fiche"
                                                        aria-label={`Voir la fiche de ${fullName(candidate)}`}
                                                    >
                                                        <Icon name="eye" size={16} />
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    );
                                })}
                            </tbody>

                        </table>
                    </div>

                )}

            </section>


            {/* FICHE CANDIDAT */}
            {selected && (
                <Modal
                    wide
                    title="Fiche candidat"
                    onClose={() => setSelected(null)}
                    footer={
                        <>
                            {selected.cv && (
                                <a
                                    href={getCvUrl(selected.id)}
                                    className="ui-btn ui-btn-secondary"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <Icon name="file" size={16} />
                                    Voir le CV
                                </a>
                            )}

                            <Link
                                to={`/admin/emails?candidate=${selected.id}`}
                                className="ui-btn"
                            >
                                <Icon name="mail" size={16} />
                                Préparer un email
                            </Link>
                        </>
                    }
                >
                    <div className="bo-detail-head">
                        <span className="bo-avatar">{initials(selected)}</span>

                        <div>
                            <h3>{fullName(selected)}</h3>

                            <span className={`ui-badge ${selectedStatus.tone}`}>
                                {selectedStatus.label}
                            </span>
                        </div>
                    </div>

                    <dl className="bo-detail-grid">
                        <div>
                            <dt>Email</dt>
                            <dd>{selected.email || "—"}</dd>
                        </div>

                        <div>
                            <dt>Adresse</dt>
                            <dd>{selected.adresse || "—"}</dd>
                        </div>

                        <div>
                            <dt>Poste visé</dt>
                            <dd>{selected.job?.titre || "Poste inconnu"}</dd>
                        </div>

                        <div>
                            <dt>Date de candidature</dt>
                            <dd>{formatDate(selected.created_at)}</dd>
                        </div>

                        <div>
                            <dt>Conformité du CV</dt>
                            <dd>{selected.note_cv ?? 0} %</dd>
                        </div>

                        <div>
                            <dt>Note du test</dt>
                            <dd>
                                {selected.note_test !== null &&
                                selected.note_test !== undefined
                                    ? `${selected.note_test} / 100`
                                    : "Test non passé"}
                            </dd>
                        </div>
                    </dl>

                    {statusError && (
                        <div className="ui-alert error" role="alert">
                            <Icon name="alert" />
                            {statusError}
                        </div>
                    )}

                    <div className="bo-inline">
                        <div className="ui-field">
                            <label htmlFor="candidate-status">
                                Étape de la candidature
                            </label>

                            <select
                                id="candidate-status"
                                className="ui-input"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                            >
                                {!STATUSES.some(
                                    (status) => status.value === newStatus
                                ) && (
                                    <option value={newStatus}>
                                        {getStatus(newStatus).label}
                                    </option>
                                )}

                                {STATUSES.map((status) => (
                                    <option
                                        key={status.value}
                                        value={status.value}
                                    >
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="button"
                            className="ui-btn"
                            onClick={handleStatusSave}
                            disabled={
                                saving ||
                                newStatus === (selected.etat_candidature || "")
                            }
                        >
                            {saving ? "Enregistrement..." : "Mettre à jour"}
                        </button>
                    </div>
                </Modal>
            )}

        </div>
    );
}
