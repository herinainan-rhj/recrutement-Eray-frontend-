import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../../components/Icon";
import Modal from "../../components/Modal";
import api, { getErrorMessage } from "../../services/api";

const MAX_CV_SIZE = 5 * 1024 * 1024;

export default function ApplyForm({ job, onClose }) {
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        adresse: "",
        email: "",
    });

    const [cv, setCv] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0] || null;

        setError("");

        if (file && file.type !== "application/pdf") {
            setCv(null);
            setError("Le CV doit être au format PDF.");
            e.target.value = "";
            return;
        }

        if (file && file.size > MAX_CV_SIZE) {
            setCv(null);
            setError("Le CV ne doit pas dépasser 5 Mo.");
            e.target.value = "";
            return;
        }

        setCv(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!cv) {
            setError("Veuillez sélectionner votre CV au format PDF.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const data = new FormData();

            data.append("job_id", job.id);
            data.append("nom", formData.nom);
            data.append("prenom", formData.prenom);
            data.append("adresse", formData.adresse);
            data.append("email", formData.email);
            data.append("cv", cv);

            const response = await api.post("/candidates", data);

            setResult(response.data);

        } catch (err) {
            console.error("Erreur candidature :", err);

            setError(
                getErrorMessage(
                    err,
                    "Erreur lors de l'envoi de la candidature."
                )
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
        <Modal
            title={result ? "Résultat de l'analyse" : "Postuler à cette offre"}
            onClose={onClose}
        >

            {!result ? (

                <form onSubmit={handleSubmit}>

                    <div className="apply-job">
                        <Icon name="briefcase" />

                        <div>
                            <strong>{job.titre}</strong>

                            <span>
                                {[job.departement, job.localisation]
                                    .filter(Boolean)
                                    .join(" · ")}
                            </span>
                        </div>
                    </div>

                    {error && (
                        <div className="ui-alert error" role="alert">
                            <Icon name="alert" />
                            {error}
                        </div>
                    )}

                    <div className="ui-row">
                        <div className="ui-field">
                            <label htmlFor="apply-prenom">Prénom</label>

                            <input
                                id="apply-prenom"
                                className="ui-input"
                                type="text"
                                name="prenom"
                                autoComplete="given-name"
                                value={formData.prenom}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="ui-field">
                            <label htmlFor="apply-nom">Nom</label>

                            <input
                                id="apply-nom"
                                className="ui-input"
                                type="text"
                                name="nom"
                                autoComplete="family-name"
                                value={formData.nom}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="ui-field">
                        <label htmlFor="apply-email">Email</label>

                        <input
                            id="apply-email"
                            className="ui-input"
                            type="email"
                            name="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="ui-field">
                        <label htmlFor="apply-adresse">Adresse</label>

                        <input
                            id="apply-adresse"
                            className="ui-input"
                            type="text"
                            name="adresse"
                            autoComplete="street-address"
                            value={formData.adresse}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="ui-field">
                        <label htmlFor="apply-cv">CV (PDF)</label>

                        <label
                            htmlFor="apply-cv"
                            className={`apply-file ${cv ? "selected" : ""}`}
                        >
                            <Icon name={cv ? "check" : "upload"} size={20} />

                            <span>
                                {cv
                                    ? cv.name
                                    : "Cliquez pour sélectionner votre CV"}
                            </span>
                        </label>

                        <input
                            id="apply-cv"
                            className="apply-file-input"
                            type="file"
                            accept="application/pdf,.pdf"
                            onChange={handleFileChange}
                        />

                        <small>Format PDF, 5 Mo maximum.</small>
                    </div>

                    <button
                        type="submit"
                        className="ui-btn ui-btn-block"
                        disabled={loading}
                    >
                        {loading
                            ? "Analyse du CV en cours..."
                            : "Envoyer ma candidature"}
                    </button>

                </form>

            ) : (

                <div className={`apply-result ${cvConforme ? "ok" : "ko"}`}>

                    <div className="apply-result-icon">
                        <Icon name={cvConforme ? "check" : "x"} size={34} />
                    </div>

                    <h3>
                        {cvConforme ? "Félicitations !" : "Désolé"}
                    </h3>

                    <p className="apply-result-title">
                        {cvConforme
                            ? "Votre CV est conforme à cette offre."
                            : "Votre profil ne convient pas à cette offre."}
                    </p>

                    <div className="apply-score">
                        <span>Score de correspondance</span>
                        <strong>{score} %</strong>
                    </div>

                    <p className="apply-result-message">
                        {cvConforme
                            ? "Votre profil correspond suffisamment aux critères recherchés. Vous pouvez maintenant passer le test de recrutement."
                            : "Après analyse de votre CV, votre profil ne correspond pas suffisamment aux critères recherchés pour cette offre."}
                    </p>

                    {cvConforme ? (
                        <Link
                            to={`/test?candidate_id=${result.candidate?.id}`}
                            className="ui-btn"
                        >
                            Accéder au test
                            <Icon name="arrow" />
                        </Link>
                    ) : (
                        <button
                            type="button"
                            className="ui-btn ui-btn-secondary"
                            onClick={onClose}
                        >
                            Fermer
                        </button>
                    )}

                </div>

            )}

        </Modal>
    );
}
