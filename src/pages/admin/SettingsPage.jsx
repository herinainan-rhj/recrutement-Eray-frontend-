import { useState } from "react";
import Icon from "../../components/Icon";
import { API_URL, fetchJobs, getErrorMessage } from "../../services/api";
import {
    DEFAULT_SETTINGS,
    loadSettings,
    saveSettings,
} from "../../utils/settings";

export default function SettingsPage() {
    const [settings, setSettings] = useState(loadSettings);
    const [notice, setNotice] = useState(null);

    /* État du test de connexion : null | "loading" | {ok, text} */
    const [apiStatus, setApiStatus] = useState(null);

    const handleChange = (e) => {
        setSettings({
            ...settings,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setNotice(
            saveSettings(settings)
                ? { type: "success", text: "Paramètres enregistrés." }
                : {
                      type: "error",
                      text: "Les paramètres n'ont pas pu être enregistrés dans ce navigateur.",
                  }
        );
    };

    const handleReset = () => {
        setSettings(DEFAULT_SETTINGS);
        saveSettings(DEFAULT_SETTINGS);
        setNotice({ type: "success", text: "Paramètres réinitialisés." });
    };

    const testApi = async () => {
        setApiStatus("loading");

        try {
            const jobs = await fetchJobs();

            setApiStatus({
                ok: true,
                text: `Connexion réussie : ${jobs.length} offre(s) trouvée(s).`,
            });
        } catch (err) {
            setApiStatus({ ok: false, text: getErrorMessage(err) });
        }
    };

    return (
        <div className="bo-page bo-form-narrow">

            <div className="bo-head">
                <div>
                    <h1>Paramètres</h1>
                    <p>Informations utilisées dans le backoffice et les emails.</p>
                </div>
            </div>

            {notice && (
                <div
                    className={`ui-alert ${notice.type}`}
                    role={notice.type === "error" ? "alert" : "status"}
                >
                    <Icon name={notice.type === "error" ? "alert" : "check"} />
                    {notice.text}
                </div>
            )}

            {/* ENTREPRISE */}
            <form className="bo-card" onSubmit={handleSubmit}>
                <div className="bo-card-head">
                    <h2>Entreprise et équipe RH</h2>
                    <span>Enregistré dans ce navigateur</span>
                </div>

                <div className="bo-card-body">
                    <div className="ui-row">
                        <div className="ui-field">
                            <label htmlFor="entreprise">Nom de l'entreprise</label>

                            <input
                                id="entreprise"
                                className="ui-input"
                                type="text"
                                name="entreprise"
                                value={settings.entreprise}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="ui-field">
                            <label htmlFor="emailRh">Email du service RH</label>

                            <input
                                id="emailRh"
                                className="ui-input"
                                type="email"
                                name="emailRh"
                                value={settings.emailRh}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="ui-row">
                        <div className="ui-field">
                            <label htmlFor="telephone">Téléphone</label>

                            <input
                                id="telephone"
                                className="ui-input"
                                type="tel"
                                name="telephone"
                                value={settings.telephone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="ui-field">
                            <label htmlFor="adresse">Adresse</label>

                            <input
                                id="adresse"
                                className="ui-input"
                                type="text"
                                name="adresse"
                                value={settings.adresse}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="ui-field">
                        <label htmlFor="signature">Signature des emails</label>

                        <textarea
                            id="signature"
                            className="ui-input"
                            name="signature"
                            rows="3"
                            value={settings.signature}
                            onChange={handleChange}
                        />

                        <small>
                            Insérée à la place de la variable {"{{signature}}"} dans
                            les modèles d'emails.
                        </small>
                    </div>

                    <div className="bo-actions">
                        <button type="submit" className="ui-btn">
                            Enregistrer
                        </button>

                        <button
                            type="button"
                            className="ui-btn ui-btn-secondary"
                            onClick={handleReset}
                        >
                            Réinitialiser
                        </button>
                    </div>
                </div>
            </form>

            {/* API */}
            <section className="bo-card">
                <div className="bo-card-head">
                    <h2>Connexion à l'API</h2>
                </div>

                <div className="bo-card-body">
                    <div className="ui-field">
                        <label htmlFor="api-url">Adresse de l'API</label>

                        <input
                            id="api-url"
                            className="ui-input"
                            type="text"
                            value={API_URL}
                            readOnly
                        />

                        <small>
                            Se modifie avec la variable VITE_API_URL du fichier
                            .env, puis en redémarrant l'application.
                        </small>
                    </div>

                    {apiStatus && apiStatus !== "loading" && (
                        <div
                            className={`ui-alert ${apiStatus.ok ? "success" : "error"}`}
                            role="status"
                        >
                            <Icon name={apiStatus.ok ? "check" : "alert"} />
                            {apiStatus.text}
                        </div>
                    )}

                    <button
                        type="button"
                        className="ui-btn ui-btn-secondary"
                        onClick={testApi}
                        disabled={apiStatus === "loading"}
                    >
                        <Icon name="refresh" size={16} />
                        {apiStatus === "loading"
                            ? "Test en cours..."
                            : "Tester la connexion"}
                    </button>
                </div>
            </section>

        </div>
    );
}
