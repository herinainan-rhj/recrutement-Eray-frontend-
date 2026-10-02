import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";
import "./CandidatesManagement.css";

export default function CandidatesManagement() {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadCandidates();
    }, []);

    const loadCandidates = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/candidates");

            setCandidates(response.data.candidates || []);
        } catch (err) {
            console.error("Erreur récupération candidats :", err);

            setError(
                "Impossible de récupérer la liste des candidatures."
            );
        } finally {
            setLoading(false);
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "refuse":
                return "Refusé";

            case "test_a_passer":
                return "À tester";

            case "test_en_cours":
                return "Test en cours";

            case "test_termine":
                return "Test terminé";

            case "entretien":
                return "Entretien";

            case "termine":
                return "Terminé";

            default:
                return status || "En attente";
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "refuse":
                return "status-refused";

            case "test_a_passer":
                return "status-test";

            case "test_en_cours":
                return "status-progress";

            case "test_termine":
                return "status-completed";

            case "entretien":
                return "status-interview";

            case "termine":
                return "status-finished";

            default:
                return "status-pending";
        }
    };

    const getScoreClass = (score) => {
        const value = Number(score);

        if (value >= 80) {
            return "score-high";
        }

        if (value >= 50) {
            return "score-medium";
        }

        return "score-low";
    };

    const getCvUrl = (candidateId) => {
        return `http://127.0.0.1:8000/api/candidates/${candidateId}/cv`;
    };

    return (
        <AdminLayout>
            <div className="candidates-page">

                {/* HEADER */}
                <div className="candidates-header">
                    <div>
                        <h1>Gestion des candidatures</h1>

                        <p>
                            Consultez et suivez les candidatures reçues.
                        </p>
                    </div>

                    <button
                        className="refresh-button"
                        onClick={loadCandidates}
                    >
                        ↻ Actualiser
                    </button>
                </div>

                {/* STATISTIQUES */}
                <div className="candidate-stats">

                    <div className="stat-card">
                        <div className="stat-icon">👥</div>

                        <div>
                            <span>Total candidats</span>
                            <strong>{candidates.length}</strong>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">📄</div>

                        <div>
                            <span>À tester</span>

                            <strong>
                                {
                                    candidates.filter(
                                        (candidate) =>
                                            candidate.etat_candidature ===
                                            "test_a_passer"
                                    ).length
                                }
                            </strong>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">🧪</div>

                        <div>
                            <span>Tests terminés</span>

                            <strong>
                                {
                                    candidates.filter(
                                        (candidate) =>
                                            candidate.etat_candidature ===
                                            "test_termine"
                                    ).length
                                }
                            </strong>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">🎯</div>

                        <div>
                            <span>Entretiens</span>

                            <strong>
                                {
                                    candidates.filter(
                                        (candidate) =>
                                            candidate.etat_candidature ===
                                            "entretien"
                                    ).length
                                }
                            </strong>
                        </div>
                    </div>

                </div>

                {/* ERREUR */}
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* TABLEAU */}
                <div className="candidates-card">

                    <div className="table-header">
                        <div>
                            <h2>Candidatures reçues</h2>

                            <span>
                                {candidates.length} candidature
                                {candidates.length > 1 ? "s" : ""}
                            </span>
                        </div>
                    </div>

                    {loading ? (

                        <div className="loading-container">
                            <div className="loader"></div>

                            <p>
                                Chargement des candidatures...
                            </p>
                        </div>

                    ) : candidates.length === 0 ? (

                        <div className="empty-container">

                            <div className="empty-icon">
                                📭
                            </div>

                            <h3>
                                Aucune candidature
                            </h3>

                            <p>
                                Les candidatures envoyées apparaîtront ici.
                            </p>

                        </div>

                    ) : (

                        <div className="table-container">

                            <table className="candidates-table">

                                <thead>
                                    <tr>
                                        <th>Candidat</th>
                                        <th>Email</th>
                                        <th>Poste</th>
                                        <th>CV</th>
                                        <th>Conformité</th>
                                        <th>Note test</th>
                                        <th>Étape</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {candidates.map((candidate) => (

                                        <tr key={candidate.id}>

                                            {/* CANDIDAT */}
                                            <td>

                                                <div className="candidate-info">

                                                    <div className="candidate-avatar">
                                                        {candidate.prenom
                                                            ?.charAt(0)
                                                            .toUpperCase()}

                                                        {candidate.nom
                                                            ?.charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {candidate.prenom}{" "}
                                                            {candidate.nom}
                                                        </strong>

                                                        <small>
                                                            Candidat #{candidate.id}
                                                        </small>
                                                    </div>

                                                </div>

                                            </td>

                                            {/* EMAIL */}
                                            <td>
                                                <span className="email">
                                                    {candidate.email}
                                                </span>
                                            </td>

                                            {/* POSTE */}
                                            <td>

                                                <div className="job-info">

                                                    <strong>
                                                        {candidate.job?.titre ||
                                                            "Poste inconnu"}
                                                    </strong>

                                                </div>

                                            </td>

                                            {/* CV */}
                                            <td>

                                                {candidate.cv ? (

                                                    <a
                                                        href={getCvUrl(candidate.id)}
                                                        className="cv-button"
                                                    >
                                                        📄 Voir CV
                                                    </a>

                                                ) : (

                                                    <span className="no-cv">
                                                        Aucun CV
                                                    </span>

                                                )}

                                            </td>

                                            {/* CONFORMITE */}
                                            <td>

                                                <div className="score-container">

                                                    <div
                                                        className={`score-value ${getScoreClass(
                                                            candidate.note_cv
                                                        )}`}
                                                    >
                                                        {candidate.note_cv ?? 0}%
                                                    </div>

                                                    <div className="score-bar">

                                                        <div
                                                            className={`score-fill ${getScoreClass(
                                                                candidate.note_cv
                                                            )}`}
                                                            style={{
                                                                width: `${Math.min(
                                                                    Number(
                                                                        candidate.note_cv
                                                                    ) || 0,
                                                                    100
                                                                )}%`,
                                                            }}
                                                        ></div>

                                                    </div>

                                                </div>

                                            </td>

                                            {/* NOTE TEST */}
                                            <td>

                                                {candidate.note_test !== null &&
                                                candidate.note_test !==
                                                    undefined ? (

                                                    <strong className="test-score">
                                                        {candidate.note_test}
                                                        <small>
                                                            / 100
                                                        </small>
                                                    </strong>

                                                ) : (

                                                    <span className="not-tested">
                                                        —
                                                    </span>

                                                )}

                                            </td>

                                            {/* ETAPE */}
                                            <td>

                                                <span
                                                    className={`status-badge ${getStatusClass(
                                                        candidate.etat_candidature
                                                    )}`}
                                                >
                                                    <span className="status-dot"></span>

                                                    {getStatusLabel(
                                                        candidate.etat_candidature
                                                    )}
                                                </span>

                                            </td>

                                            {/* ACTION */}
                                            <td>

                                                <button
                                                    className="details-button"
                                                    onClick={() =>
                                                        alert(
                                                            `Candidat : ${candidate.prenom} ${candidate.nom}`
                                                        )
                                                    }
                                                >
                                                    👁
                                                </button>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>
        </AdminLayout>
    );
}