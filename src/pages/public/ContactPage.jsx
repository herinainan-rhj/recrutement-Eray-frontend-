import { useState } from "react";
import Icon from "../../components/Icon";
import site from "../../config/site";
import { getErrorMessage, sendContactMessage } from "../../services/api";

const EMPTY_FORM = {
    nom: "",
    email: "",
    sujet: "",
    message: "",
};

export default function ContactPage() {
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            await sendContactMessage(formData);

            setSuccess(true);
            setFormData(EMPTY_FORM);
        } catch (err) {
            console.error("Erreur contact :", err);

            setError(
                getErrorMessage(err, "Votre message n'a pas pu être envoyé.")
            );
        } finally {
            setLoading(false);
        }
    };

    const details = [
        { icon: "pin", label: "Adresse", value: site.adresse },
        {
            icon: "mail",
            label: "Email",
            value: site.email,
            href: `mailto:${site.email}`,
        },
        {
            icon: "send",
            label: "Téléphone",
            value: site.telephone,
            href: `tel:${site.telephone}`,
        },
        { icon: "clock", label: "Horaires", value: site.horaires },
    ].filter((detail) => detail.value);

    return (
        <>
            <section className="page-banner">
                <div className="site-container">
                    <h1>Contact</h1>

                    <p>
                        Une question sur une offre ou sur votre candidature ?
                        Écrivez-nous.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="site-container contact-layout">

                    <div className="contact-info">
                        <h2>Parlons de votre candidature</h2>

                        <p>
                            Notre équipe RH répond aux questions concernant
                            les offres, le dépôt de CV et le déroulement du
                            test.
                        </p>

                        {details.length > 0 && (
                            <ul>
                                {details.map((detail) => (
                                    <li key={detail.label}>
                                        <span className="feature-icon">
                                            <Icon name={detail.icon} />
                                        </span>

                                        <div>
                                            <span>{detail.label}</span>

                                            {detail.href ? (
                                                <a href={detail.href}>
                                                    {detail.value}
                                                </a>
                                            ) : (
                                                <strong>{detail.value}</strong>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <form className="contact-form" onSubmit={handleSubmit}>

                        {success && (
                            <div className="ui-alert success" role="status">
                                <Icon name="check" />
                                Votre message a bien été envoyé. Nous vous
                                répondrons dès que possible.
                            </div>
                        )}

                        {error && (
                            <div className="ui-alert error" role="alert">
                                <Icon name="alert" />
                                {error}
                            </div>
                        )}

                        <div className="ui-row">
                            <div className="ui-field">
                                <label htmlFor="contact-nom">Nom complet</label>

                                <input
                                    id="contact-nom"
                                    className="ui-input"
                                    type="text"
                                    name="nom"
                                    autoComplete="name"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="ui-field">
                                <label htmlFor="contact-email">Email</label>

                                <input
                                    id="contact-email"
                                    className="ui-input"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="ui-field">
                            <label htmlFor="contact-sujet">Sujet</label>

                            <input
                                id="contact-sujet"
                                className="ui-input"
                                type="text"
                                name="sujet"
                                value={formData.sujet}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="ui-field">
                            <label htmlFor="contact-message">Message</label>

                            <textarea
                                id="contact-message"
                                className="ui-input"
                                name="message"
                                rows="6"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="ui-btn"
                            disabled={loading}
                        >
                            <Icon name="send" />
                            {loading ? "Envoi en cours..." : "Envoyer le message"}
                        </button>
                    </form>

                </div>
            </section>
        </>
    );
}
