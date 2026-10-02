import { useRef, useState } from "react";
import api from "../../services/api";

export default function QuestionnaireManagement() {

    const inputFileRef = useRef(null);

    const [fichier, setFichier] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    /* =========================================
       SÉLECTION DU FICHIER
    ========================================= */

    const handleFileChange = (event) => {

        const selectedFile = event.target.files[0];

        setMessage("");
        setError("");

        if (!selectedFile) {
            setFichier(null);
            return;
        }

        const extension = selectedFile.name
            .split(".")
            .pop()
            .toLowerCase();

        if (extension !== "txt") {

            setFichier(null);

            setError(
                "Veuillez sélectionner un fichier au format .txt."
            );

            event.target.value = "";

            return;
        }

        if (selectedFile.size > 2 * 1024 * 1024) {

            setFichier(null);

            setError(
                "Le fichier ne doit pas dépasser 2 Mo."
            );

            event.target.value = "";

            return;
        }

        setFichier(selectedFile);
    };


    /* =========================================
       IMPORTATION
    ========================================= */

    const handleImport = async () => {

        setMessage("");
        setError("");

        if (!fichier) {

            setError(
                "Veuillez sélectionner un fichier questionnaire."
            );

            return;
        }

        const formData = new FormData();

        formData.append("fichier", fichier);

        setLoading(true);

        try {

            const response = await api.post(
                "/questions/import",
                formData
            );

            const data = response.data;

            setMessage(
                `${data.message} ${data.questions_importees} questions ont été importées.`
            );

            setFichier(null);

            if (inputFileRef.current) {
                inputFileRef.current.value = "";
            }

        } catch (error) {

            console.error(
                "ERREUR COMPLETE :",
                error
            );

            console.log(
                "STATUS :",
                error.response?.status
            );

            console.log(
                "DATA :",
                error.response?.data
            );

            console.log(
                "MESSAGE :",
                error.message
            );

            if (error.response) {

                const data = error.response.data;

                if (data.erreur) {

                    setError(
                        data.erreur
                    );

                } else {

                    setError(
                        data.message ||
                        "Une erreur est survenue pendant l'importation."
                    );
                }

            } else {

                setError(
                    "Erreur réseau : " + error.message
                );
            }

        } finally {

            setLoading(false);
        }
    };


    return (
        <div className="questionnaire-page">

            <div className="questionnaire-container">

                {/* =========================================
                   EN-TÊTE
                ========================================= */}

                <div className="page-header">

                    <div>

                        <div className="breadcrumb">
                            Administration
                            <span>›</span>
                            Tests QCM
                        </div>

                        <h1>
                            Gestion des questionnaires
                        </h1>

                        <p>
                            Importez et gérez la banque de questions
                            utilisée pour les tests des candidats.
                        </p>

                    </div>

                </div>


                {/* =========================================
                   CARTE PRINCIPALE
                ========================================= */}

                <div className="questionnaire-card">

                    {/* TITRE */}

                    <div className="card-title">

                        <div className="icon-box">
                            📚
                        </div>

                        <div>

                            <h2>
                                Nouveau questionnaire
                            </h2>

                            <p>
                                Importez un fichier contenant les
                                questions et leurs réponses.
                            </p>

                        </div>

                    </div>


                    {/* =====================================
                       AVERTISSEMENT
                    ===================================== */}

                    <div className="warning-box">

                        <div className="warning-icon">
                            ⚠️
                        </div>

                        <div>

                            <strong>
                                Attention
                            </strong>

                            <p>
                                L'importation d'un nouveau questionnaire
                                remplacera les questions et réponses
                                actuellement enregistrées.
                            </p>

                            <p>
                                Le remplacement ne sera effectué que si
                                le nouveau fichier est valide.
                            </p>

                        </div>

                    </div>


                    {/* =====================================
                       FICHIER
                    ===================================== */}

                    <div className="file-section">

                        <label className="file-label">
                            Fichier questionnaire
                        </label>

                        <input
                            ref={inputFileRef}
                            type="file"
                            accept=".txt,text/plain"
                            onChange={handleFileChange}
                            className="file-input"
                        />


                        <div
                            className={`file-dropzone ${
                                fichier
                                    ? "file-selected"
                                    : ""
                            }`}
                            onClick={() =>
                                inputFileRef.current?.click()
                            }
                        >

                            <div className="upload-icon">
                                {fichier ? "✅" : "📄"}
                            </div>

                            <h3>

                                {fichier
                                    ? fichier.name
                                    : "Sélectionner votre fichier"
                                }

                            </h3>

                            <p>

                                {fichier
                                    ? "Fichier prêt à être importé"
                                    : "Cliquez ici pour sélectionner votre fichier"
                                }

                            </p>

                            <span>
                                Format accepté : TXT
                                <span className="separator">•</span>
                                Taille maximale : 2 Mo
                            </span>

                        </div>

                    </div>


                    {/* =====================================
                       FORMAT
                    ===================================== */}

                    <div className="format-box">

                        <div className="format-header">

                            <div className="format-icon">
                                ℹ️
                            </div>

                            <div>

                                <h3>
                                    Format du fichier
                                </h3>

                                <p>
                                    Le fichier doit respecter cette structure :
                                </p>

                            </div>

                        </div>


                        <pre>
{`PYTHON

Question 1 : Quel mot-clé permet de définir une fonction en Python ?
A - function
B - def
C - func
D - define
Réponse : B`}
                        </pre>


                        <div className="format-note">

                            <span>✓</span>

                            Plusieurs réponses correctes sont
                            également acceptées :

                            <code>
                                Réponse : A, C
                            </code>

                        </div>

                    </div>


                    {/* =====================================
                       MESSAGE SUCCÈS
                    ===================================== */}

                    {message && (

                        <div className="success-message">

                            <div className="message-icon">
                                ✓
                            </div>

                            <div>

                                <strong>
                                    Importation réussie
                                </strong>

                                <p>
                                    {message}
                                </p>

                            </div>

                        </div>

                    )}


                    {/* =====================================
                       MESSAGE ERREUR
                    ===================================== */}

                    {error && (

                        <div className="error-message">

                            <div className="message-icon">
                                ✕
                            </div>

                            <div>

                                <strong>
                                    Erreur
                                </strong>

                                <p>
                                    {error}
                                </p>

                            </div>

                        </div>

                    )}


                    {/* =====================================
                       BOUTON
                    ===================================== */}

                    <div className="button-section">

                        <button
                            type="button"
                            className="import-button"
                            onClick={handleImport}
                            disabled={
                                loading ||
                                !fichier
                            }
                        >

                            {loading ? (

                                <>
                                    <span className="spinner"></span>

                                    Importation en cours...
                                </>

                            ) : (

                                <>
                                    <span className="button-icon">
                                        ↑
                                    </span>

                                    Importer le questionnaire
                                </>

                            )}

                        </button>

                    </div>

                </div>

            </div>


            {/* =========================================
               CSS
            ========================================= */}

            <style>{`

                * {
                    box-sizing: border-box;
                }


                /* =========================================
                   PAGE
                ========================================= */

                .questionnaire-page {

                    width: 100%;
                    min-height: calc(100vh - 70px);

                    background: #f5f7fb;

                    padding: 32px 40px 50px;

                }


                .questionnaire-container {

                    width: 100%;
                    max-width: 1250px;

                    margin: 0 auto;

                }


                /* =========================================
                   BREADCRUMB
                ========================================= */

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


                /* =========================================
                   HEADER
                ========================================= */

                .page-header {

                    margin-bottom: 28px;

                }


                .page-header h1 {

                    margin: 0 0 8px;

                    font-size: 30px;
                    line-height: 1.2;

                    font-weight: 750;

                    color: #172033;

                }


                .page-header p {

                    margin: 0;

                    color: #697386;

                    font-size: 15px;

                    line-height: 1.6;

                }


                /* =========================================
                   CARD
                ========================================= */

                .questionnaire-card {

                    width: 100%;

                    background: #ffffff;

                    border: 1px solid #e6e9ef;

                    border-radius: 16px;

                    padding: 32px;

                    box-shadow:
                        0 8px 30px
                        rgba(25, 35, 55, 0.06);

                }


                /* =========================================
                   CARD TITLE
                ========================================= */

                .card-title {

                    display: flex;

                    align-items: center;

                    gap: 16px;

                    padding-bottom: 25px;

                    border-bottom: 1px solid #edf0f4;

                }


                .icon-box {

                    width: 54px;
                    height: 54px;

                    flex-shrink: 0;

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    background: #eef2ff;

                    border-radius: 13px;

                    font-size: 25px;

                }


                .card-title h2 {

                    margin: 0 0 5px;

                    color: #1b2435;

                    font-size: 20px;

                }


                .card-title p {

                    margin: 0;

                    color: #737d90;

                    font-size: 14px;

                    line-height: 1.5;

                }


                /* =========================================
                   WARNING
                ========================================= */

                .warning-box {

                    margin-top: 25px;

                    padding: 18px;

                    display: flex;

                    gap: 13px;

                    border: 1px solid #f0dca5;

                    background: #fffaf0;

                    border-radius: 10px;

                }


                .warning-icon {

                    flex-shrink: 0;

                    font-size: 20px;

                }


                .warning-box strong {

                    color: #765b14;

                    font-size: 14px;

                }


                .warning-box p {

                    margin: 5px 0 0;

                    color: #806f42;

                    font-size: 13px;

                    line-height: 1.5;

                }


                /* =========================================
                   FILE
                ========================================= */

                .file-section {

                    margin-top: 30px;

                }


                .file-label {

                    display: block;

                    margin-bottom: 10px;

                    color: #293246;

                    font-size: 14px;

                    font-weight: 600;

                }


                .file-input {

                    display: none;

                }


                .file-dropzone {

                    width: 100%;

                    border: 2px dashed #cdd3df;

                    border-radius: 14px;

                    padding: 45px 20px;

                    text-align: center;

                    cursor: pointer;

                    transition:
                        border-color 0.2s ease,
                        background 0.2s ease,
                        transform 0.2s ease;

                }


                .file-dropzone:hover {

                    border-color: #7c3aed;

                    background: #f7f7fd;

                    transform: translateY(-1px);

                }


                .file-dropzone.file-selected {

                    border-color: #2f2c95;

                    background: #f7f7fd;

                }


                .upload-icon {

                    font-size: 42px;

                    margin-bottom: 12px;

                }


                .file-dropzone h3 {

                    margin: 0 0 7px;

                    color: #293246;

                    font-size: 17px;

                    font-weight: 600;

                    word-break: break-word;

                }


                .file-dropzone p {

                    margin: 0 0 8px;

                    color: #737d90;

                    font-size: 14px;

                }


                .file-dropzone > span {

                    color: #9aa2b1;

                    font-size: 12px;

                }


                .separator {

                    margin: 0 7px;

                }


                /* =========================================
                   FORMAT
                ========================================= */

                .format-box {

                    margin-top: 25px;

                    padding: 22px;

                    background: #f8f9fc;

                    border: 1px solid #e8ebf1;

                    border-radius: 10px;

                }


                .format-header {

                    display: flex;

                    align-items: flex-start;

                    gap: 12px;

                }


                .format-icon {

                    font-size: 18px;

                }


                .format-box h3 {

                    margin: 0 0 5px;

                    font-size: 15px;

                    color: #30394c;

                }


                .format-box p {

                    margin: 0;

                    color: #737d90;

                    font-size: 13px;

                }


                .format-box pre {

                    margin: 17px 0 0;

                    padding: 18px;

                    background: #1d2433;

                    color: #e7eaf0;

                    border-radius: 9px;

                    overflow-x: auto;

                    font-size: 13px;

                    line-height: 1.65;

                    font-family:
                        Consolas,
                        Monaco,
                        monospace;

                }


                .format-note {

                    display: flex;

                    align-items: center;

                    flex-wrap: wrap;

                    gap: 7px;

                    margin-top: 14px;

                    color: #737d90;

                    font-size: 13px;

                }


                .format-note > span {

                    color: #35a064;

                    font-weight: bold;

                }


                .format-note code {

                    padding: 3px 7px;

                    background: #eceff5;

                    border-radius: 5px;

                    color: #4d5566;

                    font-family: monospace;

                }


                /* =========================================
                   MESSAGES
                ========================================= */

                .success-message,
                .error-message {

                    margin-top: 25px;

                    padding: 16px;

                    display: flex;

                    align-items: flex-start;

                    gap: 12px;

                    border-radius: 10px;

                }


                .success-message {

                    background: #effaf3;

                    border: 1px solid #b9e5c7;

                    color: #23643a;

                }


                .error-message {

                    background: #fff1f1;

                    border: 1px solid #efc0c0;

                    color: #8b2e2e;

                }


                .message-icon {

                    width: 24px;
                    height: 24px;

                    flex-shrink: 0;

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    border-radius: 50%;

                    font-size: 13px;

                    font-weight: bold;

                }


                .success-message .message-icon {

                    background: #ccefd7;

                }


                .error-message .message-icon {

                    background: #f6d0d0;

                }


                .success-message strong,
                .error-message strong {

                    font-size: 14px;

                }


                .success-message p,
                .error-message p {

                    margin: 4px 0 0;

                    font-size: 13px;

                    line-height: 1.5;

                    word-break: break-word;

                }


                /* =========================================
                   BUTTON
                ========================================= */

                .button-section {

                    display: flex;

                    justify-content: flex-end;

                    margin-top: 28px;

                }


                .import-button {

                    min-height: 46px;

                    border: none;

                    border-radius: 9px;

                    padding: 13px 22px;

                    background: #2f2c95;

                    color: white;

                    font-size: 14px;

                    font-weight: 600;

                    cursor: pointer;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    gap: 9px;

                    transition:
                        background 0.2s ease,
                        transform 0.2s ease,
                        box-shadow 0.2s ease;

                }


                .import-button:hover:not(:disabled) {

                    background: #232070;

                    transform: translateY(-1px);

                    box-shadow:
                        0 5px 15px
                        rgba(47, 44, 149, 0.2);

                }


                .import-button:disabled {

                    background: #b9b7c4;

                    cursor: not-allowed;

                    box-shadow: none;

                    transform: none;

                }


                .button-icon {

                    font-size: 19px;

                    line-height: 1;

                }


                /* =========================================
                   SPINNER
                ========================================= */

                .spinner {

                    width: 15px;
                    height: 15px;

                    border: 2px solid
                        rgba(255,255,255,0.4);

                    border-top-color: white;

                    border-radius: 50%;

                    animation:
                        spin 0.7s linear infinite;

                }


                @keyframes spin {

                    to {
                        transform: rotate(360deg);
                    }

                }


                /* =========================================
                   TABLETTE
                ========================================= */

                @media (max-width: 1000px) {

                    .questionnaire-page {

                        padding: 28px 25px 40px;

                    }

                    .questionnaire-card {

                        padding: 25px;

                    }

                }


                /* =========================================
                   MOBILE
                ========================================= */

                @media (max-width: 768px) {

                    .questionnaire-page {

                        min-height: calc(100vh - 60px);

                        padding: 24px 18px 35px;

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


                    .questionnaire-card {

                        padding: 20px;

                        border-radius: 13px;

                    }


                    .card-title {

                        align-items: flex-start;

                    }


                    .warning-box {

                        padding: 15px;

                    }


                    .file-dropzone {

                        padding: 35px 15px;

                    }


                    .format-box {

                        padding: 17px;

                    }


                    .format-box pre {

                        font-size: 12px;

                        padding: 14px;

                    }


                    .button-section {

                        justify-content: stretch;

                    }


                    .import-button {

                        width: 100%;

                    }

                }


                /* =========================================
                   PETIT MOBILE
                ========================================= */

                @media (max-width: 480px) {

                    .questionnaire-page {

                        padding: 18px 12px 30px;

                    }


                    .questionnaire-card {

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


                    .card-title {

                        gap: 11px;

                    }


                    .icon-box {

                        width: 45px;
                        height: 45px;

                        font-size: 21px;

                    }


                    .card-title h2 {

                        font-size: 17px;

                    }


                    .card-title p {

                        font-size: 13px;

                    }


                    .warning-box {

                        flex-direction: column;

                        gap: 7px;

                    }


                    .file-dropzone {

                        padding: 30px 12px;

                    }


                    .file-dropzone h3 {

                        font-size: 15px;

                    }


                    .format-note {

                        align-items: flex-start;

                        flex-direction: column;

                    }

                }

            `}</style>

        </div>
    );
}