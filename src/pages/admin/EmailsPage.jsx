import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Icon from "../../components/Icon";
import useApi from "../../hooks/useApi";
import { fetchCandidates } from "../../services/api";
import { fullName } from "../../utils/candidates";
import {
    DEFAULT_TEMPLATES,
    fillTemplate,
    loadSettings,
    loadTemplates,
    saveTemplates,
} from "../../utils/settings";

const VARIABLES = [
    "prenom",
    "nom",
    "poste",
    "lien_test",
    "entreprise",
    "signature",
];

export default function EmailsPage() {
    const [searchParams] = useSearchParams();
    const { data: candidates, loading, error } = useApi(
        fetchCandidates,
        "Impossible de charger les candidats."
    );

    const [settings] = useState(loadSettings);
    const [templates, setTemplates] = useState(loadTemplates);
    const [templateId, setTemplateId] = useState(templates[0].id);
    const [candidateId, setCandidateId] = useState(
        searchParams.get("candidate") || ""
    );
    const [notice, setNotice] = useState("");

    const template =
        templates.find((item) => item.id === templateId) || templates[0];

    const candidate = candidates.find(
        (item) => String(item.id) === String(candidateId)
    );

    const values = {
        prenom: candidate?.prenom || "",
        nom: candidate?.nom || "",
        poste: candidate?.job?.titre || "",
        lien_test: candidate
            ? `${window.location.origin}/test?candidate_id=${candidate.id}`
            : "",
        entreprise: settings.entreprise,
        signature: settings.signature,
    };

    const subject = fillTemplate(template.objet, values);
    const body = fillTemplate(template.corps, values);

    const flash = (text) => {
        setNotice(text);
        setTimeout(() => setNotice(""), 3000);
    };

    const updateTemplate = (field, value) => {
        setTemplates(
            templates.map((item) =>
                item.id === template.id ? { ...item, [field]: value } : item
            )
        );
    };

    const handleSave = () => {
        flash(
            saveTemplates(templates)
                ? "Modèles enregistrés dans ce navigateur."
                : "Les modèles n'ont pas pu être enregistrés."
        );
    };

    const handleReset = () => {
        setTemplates(DEFAULT_TEMPLATES);
        setTemplateId(DEFAULT_TEMPLATES[0].id);
        saveTemplates(DEFAULT_TEMPLATES);
        flash("Modèles par défaut rétablis.");
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(`${subject}\n\n${body}`);
            flash("Email copié dans le presse-papiers.");
        } catch {
            flash("La copie a échoué : sélectionnez le texte manuellement.");
        }
    };

    const mailto = candidate?.email
        ? `mailto:${candidate.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        : null;

    return (
        <div className="bo-page">

            <div className="bo-head">
                <div>
                    <h1>Emails</h1>

                    <p>
                        Préparez vos messages aux candidats à partir de modèles
                        réutilisables.
                    </p>
                </div>

                <div className="bo-head-actions">
                    <button
                        type="button"
                        className="ui-btn ui-btn-secondary"
                        onClick={handleReset}
                    >
                        Rétablir les modèles
                    </button>

                    <button type="button" className="ui-btn" onClick={handleSave}>
                        <Icon name="check" size={16} />
                        Enregistrer les modèles
                    </button>
                </div>
            </div>

            {notice && (
                <div className="ui-alert info" role="status">
                    <Icon name="check" />
                    {notice}
                </div>
            )}

            <div className="ui-alert info">
                <Icon name="mail" />
                L'envoi se fait depuis votre messagerie habituelle : le bouton
                « Ouvrir dans ma messagerie » prépare l'email avec le
                destinataire, l'objet et le texte.
            </div>

            <div className="bo-emails">

                {/* LISTE DES MODÈLES */}
                <section className="bo-card">
                    <div className="bo-card-head">
                        <h2>Modèles</h2>
                    </div>

                    <div className="bo-template-list">
                        {templates.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                className={item.id === template.id ? "active" : ""}
                                onClick={() => setTemplateId(item.id)}
                            >
                                <Icon name="mail" size={16} />
                                {item.nom}
                            </button>
                        ))}
                    </div>
                </section>

                {/* ÉDITEUR */}
                <section className="bo-card">
                    <div className="bo-card-head">
                        <h2>Modifier le modèle</h2>
                    </div>

                    <div className="bo-card-body">
                        <div className="ui-field">
                            <label htmlFor="template-nom">Nom du modèle</label>

                            <input
                                id="template-nom"
                                className="ui-input"
                                type="text"
                                value={template.nom}
                                onChange={(e) =>
                                    updateTemplate("nom", e.target.value)
                                }
                            />
                        </div>

                        <div className="ui-field">
                            <label htmlFor="template-objet">Objet</label>

                            <input
                                id="template-objet"
                                className="ui-input"
                                type="text"
                                value={template.objet}
                                onChange={(e) =>
                                    updateTemplate("objet", e.target.value)
                                }
                            />
                        </div>

                        <div className="ui-field">
                            <label htmlFor="template-corps">Message</label>

                            <textarea
                                id="template-corps"
                                className="ui-input"
                                rows="12"
                                value={template.corps}
                                onChange={(e) =>
                                    updateTemplate("corps", e.target.value)
                                }
                            />

                            <small>Variables disponibles :</small>
                        </div>

                        <div className="bo-vars">
                            {VARIABLES.map((variable) => (
                                <code key={variable}>{`{{${variable}}}`}</code>
                            ))}
                        </div>
                    </div>
                </section>

                {/* APERÇU */}
                <section className="bo-card">
                    <div className="bo-card-head">
                        <h2>Aperçu et envoi</h2>
                    </div>

                    <div className="bo-card-body">
                        {error && (
                            <div className="ui-alert error" role="alert">
                                <Icon name="alert" />
                                {error}
                            </div>
                        )}

                        <div className="ui-field">
                            <label htmlFor="email-candidate">Destinataire</label>

                            <select
                                id="email-candidate"
                                className="ui-input"
                                value={candidateId}
                                onChange={(e) => setCandidateId(e.target.value)}
                                disabled={loading}
                            >
                                <option value="">
                                    {loading
                                        ? "Chargement..."
                                        : "Choisir un candidat"}
                                </option>

                                {candidates.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {fullName(item)}
                                        {item.job?.titre
                                            ? ` — ${item.job.titre}`
                                            : ""}
                                    </option>
                                ))}
                            </select>

                            {candidate && <small>{candidate.email}</small>}
                        </div>

                        <div className="bo-preview">
                            <strong>{subject}</strong>
                            <p>{body}</p>
                        </div>

                        <div className="bo-actions">
                            {mailto ? (
                                <a href={mailto} className="ui-btn">
                                    <Icon name="send" size={16} />
                                    Ouvrir dans ma messagerie
                                </a>
                            ) : (
                                <button type="button" className="ui-btn" disabled>
                                    <Icon name="send" size={16} />
                                    Ouvrir dans ma messagerie
                                </button>
                            )}

                            <button
                                type="button"
                                className="ui-btn ui-btn-secondary"
                                onClick={handleCopy}
                            >
                                <Icon name="copy" size={16} />
                                Copier
                            </button>
                        </div>
                    </div>
                </section>

            </div>

        </div>
    );
}
