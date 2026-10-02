import { useState } from "react";
import api from "../../services/api";

export default function JobsManagement() {

    const [formData, setFormData] = useState({
        titre: "",
        description: "",
        departement: "",
        localisation: "",
        type_contrat: "",
        niveau_etude: "",
        experience_requise: "",
        competences: ""
    });

    const [message, setMessage] = useState("");


    /* =========================================
       MODIFICATION DES CHAMPS
    ========================================= */

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    /* =========================================
       ENVOI DU FORMULAIRE
    ========================================= */

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");

        try {

            await api.post(
                "/admin/jobs",
                formData
            );

            setMessage(
                "✅ Offre créée avec succès"
            );

            setFormData({
                titre: "",
                description: "",
                departement: "",
                localisation: "",
                type_contrat: "",
                niveau_etude: "",
                experience_requise: "",
                competences: ""
            });

        } catch (error) {

            console.error(
                "Erreur création offre :",
                error
            );

            if (error.response) {

                console.log(
                    "Réponse Laravel :",
                    error.response.data
                );

                setMessage(
                    "❌ Erreur : vérifiez les champs du formulaire"
                );

            } else {

                setMessage(
                    "❌ Impossible de contacter le serveur Laravel"
                );

            }
        }
    };


    return (

        <div className="jobs-page">

            <div className="jobs-container">


                {/* =====================================
                   HEADER
                ===================================== */}

                <div className="page-header">

                    <div>

                        <div className="breadcrumb">
                            Administration
                            <span>›</span>
                            Offres d'emploi
                        </div>

                        <h1>
                            Créer une offre d'emploi
                        </h1>

                        <p>
                            Ajoutez une nouvelle offre de recrutement
                            à votre plateforme.
                        </p>

                    </div>

                </div>


                {/* =====================================
                   MESSAGE
                ===================================== */}

                {message && (

                    <div
                        className={`alert-message ${
                            message.startsWith("✅")
                                ? "success"
                                : "error"
                        }`}
                    >
                        {message}
                    </div>

                )}


                {/* =====================================
                   FORMULAIRE
                ===================================== */}

                <form
                    className="job-form"
                    onSubmit={handleSubmit}
                >


                    {/* TITRE */}

                    <div className="form-group">

                        <label htmlFor="titre">
                            Titre du poste
                        </label>

                        <input
                            id="titre"
                            type="text"
                            name="titre"
                            value={formData.titre}
                            onChange={handleChange}
                            placeholder="Ex : Développeur Laravel"
                            required
                        />

                    </div>


                    {/* DESCRIPTION */}

                    <div className="form-group">

                        <label htmlFor="description">
                            Description du poste
                        </label>

                        <textarea
                            id="description"
                            rows="6"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Décrivez le poste, les missions et les responsabilités..."
                            required
                        />

                    </div>


                    {/* DEPARTEMENT + LOCALISATION */}

                    <div className="form-row">

                        <div className="form-group">

                            <label htmlFor="departement">
                                Département
                            </label>

                            <input
                                id="departement"
                                type="text"
                                name="departement"
                                value={formData.departement}
                                onChange={handleChange}
                                placeholder="Ex : Informatique"
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label htmlFor="localisation">
                                Localisation
                            </label>

                            <input
                                id="localisation"
                                type="text"
                                name="localisation"
                                value={formData.localisation}
                                onChange={handleChange}
                                placeholder="Ex : Antananarivo"
                                required
                            />

                        </div>

                    </div>


                    {/* CONTRAT + NIVEAU */}

                    <div className="form-row">

                        <div className="form-group">

                            <label htmlFor="type_contrat">
                                Type de contrat
                            </label>

                            <select
                                id="type_contrat"
                                name="type_contrat"
                                value={formData.type_contrat}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Choisir un type
                                </option>

                                <option value="CDI">
                                    CDI
                                </option>

                                <option value="CDD">
                                    CDD
                                </option>

                                <option value="Stage">
                                    Stage
                                </option>

                                <option value="Freelance">
                                    Freelance
                                </option>

                            </select>

                        </div>


                        <div className="form-group">

                            <label htmlFor="niveau_etude">
                                Niveau d'étude
                            </label>

                            <select
                                id="niveau_etude"
                                name="niveau_etude"
                                value={formData.niveau_etude}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Choisir un niveau
                                </option>

                                <option value="Bac">
                                    Bac
                                </option>

                                <option value="Bac+2">
                                    Bac+2
                                </option>

                                <option value="Licence">
                                    Licence
                                </option>

                                <option value="Master 1">
                                    Master 1
                                </option>

                                <option value="Master 2">
                                    Master 2
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* EXPERIENCE */}

                    <div className="form-group">

                        <label htmlFor="experience_requise">
                            Expérience requise
                        </label>

                        <div className="input-with-suffix">

                            <input
                                id="experience_requise"
                                type="number"
                                name="experience_requise"
                                value={formData.experience_requise}
                                onChange={handleChange}
                                min="0"
                                placeholder="0"
                                required
                            />

                            <span>
                                année(s)
                            </span>

                        </div>

                    </div>


                    {/* COMPETENCES */}

                    <div className="form-group">

                        <label htmlFor="competences">
                            Compétences recherchées
                        </label>

                        <textarea
                            id="competences"
                            rows="5"
                            name="competences"
                            value={formData.competences}
                            onChange={handleChange}
                            placeholder="Ex : Laravel, React, PostgreSQL, Git..."
                            required
                        />

                        <small>
                            Séparez les différentes compétences par des virgules.
                        </small>

                    </div>


                    {/* BOUTON */}

                    <div className="form-actions">

                        <button
                            type="submit"
                            className="btn-primary"
                        >
                            <span>
                                ＋
                            </span>

                            Créer l'offre
                        </button>

                    </div>

                </form>

            </div>


            {/* =========================================
               CSS
            ========================================= */}

            <style>{`

                * {
                    box-sizing: border-box;
                }


                /* =====================================
                   PAGE
                ===================================== */

                .jobs-page {

                    width: 100%;

                    min-height:
                        calc(100vh - 70px);

                    background: #f5f7fb;

                    padding:
                        32px 40px 50px;

                }


                .jobs-container {

                    width: 100%;

                    max-width: 1250px;

                    margin: 0 auto;

                }


                /* =====================================
                   BREADCRUMB
                ===================================== */

                .breadcrumb {

                    display: flex;

                    align-items: center;

                    gap: 8px;

                    margin-bottom: 10px;

                    color: #8a93a5;

                    font-size: 13px;

                    font-weight: 500;

                }


                .breadcrumb span {

                    color: #b4bac5;

                }


                /* =====================================
                   HEADER
                ===================================== */

                .page-header {

                    margin-bottom: 28px;

                }


                .page-header h1 {

                    margin: 0 0 8px;

                    color: #172033;

                    font-size: 30px;

                    line-height: 1.2;

                    font-weight: 750;

                }


                .page-header p {

                    margin: 0;

                    color: #697386;

                    font-size: 15px;

                    line-height: 1.6;

                }


                /* =====================================
                   MESSAGE
                ===================================== */

                .alert-message {

                    margin-bottom: 20px;

                    padding: 15px 18px;

                    border-radius: 10px;

                    font-size: 14px;

                    font-weight: 500;

                }


                .alert-message.success {

                    background: #effaf3;

                    border: 1px solid #b9e5c7;

                    color: #23643a;

                }


                .alert-message.error {

                    background: #fff1f1;

                    border: 1px solid #efc0c0;

                    color: #8b2e2e;

                }


                /* =====================================
                   FORMULAIRE
                ===================================== */

                .job-form {

                    width: 100%;

                    background: #ffffff;

                    border: 1px solid #e6e9ef;

                    border-radius: 16px;

                    padding: 32px;

                    box-shadow:
                        0 8px 30px
                        rgba(25, 35, 55, 0.06);

                }


                /* =====================================
                   GROUPES
                ===================================== */

                .form-group {

                    width: 100%;

                    margin-bottom: 22px;

                }


                .form-group label {

                    display: block;

                    margin-bottom: 8px;

                    color: #293246;

                    font-size: 14px;

                    font-weight: 600;

                }


                .form-group input,
                .form-group textarea,
                .form-group select {

                    width: 100%;

                    border: 1px solid #dfe3ea;

                    border-radius: 9px;

                    padding: 12px 14px;

                    background: #ffffff;

                    color: #293246;

                    font-family: inherit;

                    font-size: 14px;

                    outline: none;

                    transition:
                        border-color 0.2s ease,
                        box-shadow 0.2s ease;

                }


                .form-group input {

                    height: 46px;

                }


                .form-group textarea {

                    resize: vertical;

                    min-height: 110px;

                    line-height: 1.6;

                }


                .form-group select {

                    height: 46px;

                    cursor: pointer;

                }


                .form-group input:focus,
                .form-group textarea:focus,
                .form-group select:focus {

                    border-color: #6d45d9;

                    box-shadow:
                        0 0 0 3px
                        rgba(109, 69, 217, 0.10);

                }


                .form-group input::placeholder,
                .form-group textarea::placeholder {

                    color: #a2a9b6;

                }


                .form-group small {

                    display: block;

                    margin-top: 7px;

                    color: #8a93a5;

                    font-size: 12px;

                }


                /* =====================================
                   DEUX COLONNES
                ===================================== */

                .form-row {

                    width: 100%;

                    display: grid;

                    grid-template-columns:
                        repeat(2, minmax(0, 1fr));

                    gap: 20px;

                }


                .form-row .form-group {

                    min-width: 0;

                }


                /* =====================================
                   EXPERIENCE
                ===================================== */

                .input-with-suffix {

                    position: relative;

                }


                .input-with-suffix input {

                    padding-right: 90px;

                }


                .input-with-suffix span {

                    position: absolute;

                    right: 14px;

                    top: 50%;

                    transform:
                        translateY(-50%);

                    color: #8a93a5;

                    font-size: 13px;

                    pointer-events: none;

                }


                /* =====================================
                   ACTIONS
                ===================================== */

                .form-actions {

                    display: flex;

                    justify-content: flex-end;

                    padding-top: 5px;

                }


                .btn-primary {

                    min-height: 46px;

                    padding:
                        12px 22px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    gap: 8px;

                    border: none;

                    border-radius: 9px;

                    background: #5b35d5;

                    color: #ffffff;

                    font-size: 14px;

                    font-weight: 600;

                    cursor: pointer;

                    transition:
                        background 0.2s ease,
                        transform 0.2s ease,
                        box-shadow 0.2s ease;

                }


                .btn-primary:hover {

                    background: #4725b5;

                    transform:
                        translateY(-1px);

                    box-shadow:
                        0 5px 15px
                        rgba(91, 53, 213, 0.20);

                }


                .btn-primary span {

                    font-size: 18px;

                    line-height: 1;

                }


                /* =====================================
                   TABLETTE
                ===================================== */

                @media (max-width: 1000px) {

                    .jobs-page {

                        padding:
                            28px 25px 40px;

                    }


                    .job-form {

                        padding: 25px;

                    }

                }


                /* =====================================
                   MOBILE
                ===================================== */

                @media (max-width: 768px) {

                    .jobs-page {

                        min-height:
                            calc(100vh - 60px);

                        padding:
                            24px 18px 35px;

                    }


                    .page-header {

                        margin-bottom: 20px;

                    }


                    .page-header h1 {

                        font-size: 25px;

                    }


                    .page-header p {

                        font-size: 14px;

                    }


                    .job-form {

                        padding: 20px;

                        border-radius: 13px;

                    }


                    .form-row {

                        grid-template-columns: 1fr;

                        gap: 0;

                    }


                    .form-actions {

                        justify-content: stretch;

                    }


                    .btn-primary {

                        width: 100%;

                    }

                }


                /* =====================================
                   PETIT MOBILE
                ===================================== */

                @media (max-width: 480px) {

                    .jobs-page {

                        padding:
                            18px 12px 30px;

                    }


                    .job-form {

                        padding: 16px;

                    }


                    .breadcrumb {

                        font-size: 12px;

                    }


                    .page-header h1 {

                        font-size: 22px;

                    }


                    .page-header p {

                        font-size: 13px;

                    }


                    .form-group {

                        margin-bottom: 18px;

                    }


                    .form-group input,
                    .form-group textarea,
                    .form-group select {

                        font-size: 13px;

                    }

                }

            `}</style>

        </div>
    );
}