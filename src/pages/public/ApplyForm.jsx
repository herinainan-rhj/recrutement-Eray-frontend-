import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function ApplyForm({ jobId, onClose }) {
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        adresse: "",
        email: "",
    });

    const [cv, setCv] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setCv(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!cv) {
            alert("Veuillez sélectionner un CV PDF.");
            return;
        }

        if (cv.type !== "application/pdf") {
            alert("Le CV doit être au format PDF.");
            return;
        }

        setLoading(true);

        try {
            const data = new FormData();

            data.append("job_id", jobId);
            data.append("nom", formData.nom);
            data.append("prenom", formData.prenom);
            data.append("adresse", formData.adresse);
            data.append("email", formData.email);
            data.append("cv", cv);

            console.log("=== DONNÉES CANDIDATURE ===");
            console.log("jobId :", jobId);
            console.log("nom :", formData.nom);
            console.log("prenom :", formData.prenom);
            console.log("adresse :", formData.adresse);
            console.log("email :", formData.email);
            console.log("cv :", cv?.name);

            const response = await api.post("/candidates", data);

            console.log("Réponse candidature :", response.data);

            setResult(response.data);

        } catch (error) {
            console.error("Erreur candidature :", error);

            if (error.response) {
                console.error(
                    "Réponse Laravel :",
                    error.response.data
                );
            }

            alert(
                error.response?.data?.message ||
                "Erreur lors de l'envoi de la candidature."
            );
        } finally {
            setLoading(false);
        }
    };

    /*
     * Récupération du score.
     * On transforme en nombre pour être sûr
     * que la comparaison avec 50 fonctionne.
     */
    const score = result
        ? Number(result.pourcentage)
        : 0;

    const cvConforme = score >= 50;

    return (
        <div className="modal-overlay">

            <div className="modal">

                {!result ? (

                    <>
                        <div className="modal-header">

                            <h2>Postuler à cette offre</h2>

                            <button
                                type="button"
                                className="close-btn"
                                onClick={onClose}
                            >
                                ✕
                            </button>

                        </div>

                        <form onSubmit={handleSubmit}>

                            <div className="form-group">
                                <label>Nom</label>

                                <input
                                    type="text"
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Prénom</label>

                                <input
                                    type="text"
                                    name="prenom"
                                    value={formData.prenom}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Adresse</label>

                                <input
                                    type="text"
                                    name="adresse"
                                    value={formData.adresse}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>CV PDF</label>

                                <input
                                    type="file"
                                    accept="application/pdf,.pdf"
                                    onChange={handleFileChange}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={loading}
                            >
                                {loading
                                    ? "Analyse du CV..."
                                    : "Envoyer ma candidature"}
                            </button>

                        </form>
                    </>

                ) : (

                    /*
                     * ==================================================
                     * FENÊTRE DE RÉSULTAT
                     * ==================================================
                     */

                    <div
                        className={
                            cvConforme
                                ? "result-box success-result"
                                : "result-box failed-result"
                        }
                    >

                        {cvConforme ? (

                            <>
                                <div className="result-icon">
                                    🎉
                                </div>

                                <h2>
                                    Félicitations !
                                </h2>

                                <p className="result-title">
                                    Votre CV est conforme à cette offre.
                                </p>

                                <div className="score-display">
                                    <span>
                                        Score de correspondance
                                    </span>

                                    <strong>
                                        {score} %
                                    </strong>
                                </div>

                                <p className="result-message">
                                    Votre profil correspond suffisamment
                                    aux critères recherchés. Vous pouvez
                                    maintenant passer le test de recrutement.
                                </p>

                                <div className="test-link-container">

                                    <span>
                                        Étape suivante
                                    </span>

                                    <Link
                                        to={`/test?candidate_id=${result.candidate.id}`}
                                        className="test-link"
                                    >
                                        Accéder au test →
                                    </Link>

                                </div>

                            </>

                        ) : (

                            <>
                                <div className="result-icon">
                                    😔
                                </div>

                                <h2>
                                    Désolé
                                </h2>

                                <p className="result-title">
                                    Votre profil ne convient pas à cette offre.
                                </p>

                                <div className="score-display failed-score">
                                    <span>
                                        Score de correspondance
                                    </span>

                                    <strong>
                                        {score} %
                                    </strong>
                                </div>

                                <p className="result-message">
                                    Après analyse de votre CV, votre profil
                                    ne correspond pas suffisamment aux critères
                                    recherchés pour cette offre.
                                </p>

                                <button
                                    type="button"
                                    className="close-result-btn"
                                    onClick={onClose}
                                >
                                    Fermer
                                </button>

                            </>

                        )}

                    </div>

                )}

            </div>

            <style>{`

                * {
                    box-sizing: border-box;
                }

                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 9999;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    padding: 20px;

                    background: rgba(15, 23, 42, 0.65);

                    backdrop-filter: blur(5px);
                }

                .modal {
                    width: 100%;
                    max-width: 560px;
                    max-height: 90vh;

                    overflow-y: auto;

                    background: #ffffff;
                    border-radius: 18px;

                    box-shadow:
                        0 25px 60px rgba(0, 0, 0, 0.20);

                    animation: modalAppear 0.25s ease;
                }

                @keyframes modalAppear {
                    from {
                        opacity: 0;
                        transform: translateY(15px) scale(0.97);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .modal-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    padding: 22px 25px;

                    border-bottom: 1px solid #e9edf3;
                }

                .modal-header h2 {
                    margin: 0;

                    color: #172033;

                    font-size: 21px;
                    font-weight: 700;
                }

                .close-btn {
                    width: 36px;
                    height: 36px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    border: none;
                    border-radius: 50%;

                    background: #f1f3f6;
                    color: #596273;

                    font-size: 16px;

                    cursor: pointer;

                    transition: 0.2s;
                }

                .close-btn:hover {
                    background: #e4e7ec;
                    color: #172033;
                }

                form {
                    padding: 25px;
                }

                .form-group {
                    margin-bottom: 18px;
                }

                .form-group label {
                    display: block;

                    margin-bottom: 7px;

                    color: #293246;

                    font-size: 14px;
                    font-weight: 600;
                }

                .form-group input {
                    width: 100%;
                    height: 45px;

                    padding: 10px 13px;

                    border: 1px solid #dce1e8;
                    border-radius: 9px;

                    outline: none;

                    font-size: 14px;

                    transition: 0.2s;
                }

                .form-group input:focus {
                    border-color: #5b35d5;

                    box-shadow:
                        0 0 0 3px rgba(91, 53, 213, 0.10);
                }

                .submit-btn {
                    width: 100%;

                    min-height: 47px;

                    margin-top: 5px;

                    border: none;
                    border-radius: 9px;

                    background: #5b35d5;
                    color: #ffffff;

                    font-size: 14px;
                    font-weight: 600;

                    cursor: pointer;

                    transition: 0.2s;
                }

                .submit-btn:hover:not(:disabled) {
                    background: #4725b5;
                }

                .submit-btn:disabled {
                    opacity: 0.65;
                    cursor: not-allowed;
                }

                /*
                 * ==========================================
                 * RESULTAT
                 * ==========================================
                 */

                .result-box {
                    padding: 40px 35px;

                    text-align: center;
                }

                .result-icon {
                    width: 72px;
                    height: 72px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    margin: 0 auto 18px;

                    border-radius: 50%;

                    font-size: 35px;
                }

                .success-result .result-icon {
                    background: #eaf9ef;
                }

                .failed-result .result-icon {
                    background: #fff1f1;
                }

                .result-box h2 {
                    margin: 0 0 10px;

                    color: #172033;

                    font-size: 28px;
                    font-weight: 750;
                }

                .result-title {
                    margin: 0 auto 22px;

                    color: #4b5567;

                    font-size: 16px;
                    line-height: 1.5;
                }

                .score-display {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    gap: 15px;

                    margin: 20px 0;

                    padding: 15px 18px;

                    border-radius: 11px;

                    background: #f5f7fb;
                }

                .score-display span {
                    color: #697386;

                    font-size: 13px;
                }

                .score-display strong {
                    color: #5b35d5;

                    font-size: 22px;
                    font-weight: 750;
                }

                .failed-score strong {
                    color: #c0392b;
                }

                .result-message {
                    margin: 20px 0;

                    color: #697386;

                    font-size: 14px;
                    line-height: 1.7;
                }

                /*
                 * ==========================================
                 * LIEN VERS LE TEST
                 * ==========================================
                 */

                .test-link-container {
                    margin-top: 28px;
                    padding-top: 22px;

                    border-top: 1px solid #e8ebf0;
                }

                .test-link-container > span {
                    display: block;

                    margin-bottom: 10px;

                    color: #8a93a5;

                    font-size: 12px;
                    font-weight: 600;

                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .test-link {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;

                    gap: 7px;

                    padding: 12px 22px;

                    border-radius: 9px;

                    background: #5b35d5;
                    color: #ffffff;

                    text-decoration: none;

                    font-size: 14px;
                    font-weight: 600;

                    transition:
                        background 0.2s,
                        transform 0.2s,
                        box-shadow 0.2s;
                }

                .test-link:hover {
                    background: #4725b5;

                    transform: translateY(-1px);

                    box-shadow:
                        0 6px 16px rgba(91, 53, 213, 0.22);
                }

                .close-result-btn {
                    min-width: 120px;

                    margin-top: 15px;
                    padding: 11px 20px;

                    border: 1px solid #dfe3ea;
                    border-radius: 9px;

                    background: #ffffff;
                    color: #4b5567;

                    font-size: 14px;
                    font-weight: 600;

                    cursor: pointer;

                    transition: 0.2s;
                }

                .close-result-btn:hover {
                    background: #f5f7fb;
                }

                @media (max-width: 600px) {

                    .modal-overlay {
                        padding: 12px;
                    }

                    .modal {
                        max-width: 100%;
                        border-radius: 15px;
                    }

                    .result-box {
                        padding: 32px 22px;
                    }

                    .result-box h2 {
                        font-size: 24px;
                    }

                    .result-title {
                        font-size: 15px;
                    }

                    .score-display {
                        flex-direction: column;
                        gap: 5px;
                    }

                }

            `}</style>

        </div>
    );
}