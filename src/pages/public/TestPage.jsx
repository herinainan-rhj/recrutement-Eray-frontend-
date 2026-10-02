
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function TestPage() {

    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [answers, setAnswers] = useState({});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [finished, setFinished] = useState(false);
    const [score, setScore] = useState(null);

    /*
     * ==========================================
     * CHARGEMENT DES QUESTIONS
     * ==========================================
     */

    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = async () => {

        setLoading(true);
        setError("");

        try {

            const response = await api.get(
                "/questions/random?nombre=10"
            );

            console.log(
                "Questions reçues :",
                response.data
            );

            setQuestions(response.data);

        } catch (error) {

            console.error(
                "Erreur chargement questions :",
                error
            );

            setError(
                error.response?.data?.message ||
                "Impossible de charger les questions du test."
            );

        } finally {
            setLoading(false);
        }
    };

    /*
     * ==========================================
     * SELECTION D'UNE REPONSE
     * ==========================================
     *
     * Une question peut avoir plusieurs
     * bonnes réponses.
     */

    const handleAnswer = (questionId, lettre) => {

        setAnswers((previousAnswers) => {

            const currentAnswers =
                previousAnswers[questionId] || [];

            /*
             * Si la réponse est déjà sélectionnée,
             * on la retire.
             */

            if (currentAnswers.includes(lettre)) {

                return {
                    ...previousAnswers,
                    [questionId]:
                        currentAnswers.filter(
                            (answer) => answer !== lettre
                        ),
                };
            }

            /*
             * Sinon on l'ajoute.
             */

            return {
                ...previousAnswers,
                [questionId]: [
                    ...currentAnswers,
                    lettre
                ],
            };
        });
    };

    /*
     * ==========================================
     * QUESTION ACTUELLE
     * ==========================================
     */

    const currentQuestion =
        questions[currentIndex];

    /*
     * ==========================================
     * NOMBRE DE QUESTIONS REPONDUES
     * ==========================================
     */

    const answeredCount =
        Object.values(answers).filter(
            (answer) => answer.length > 0
        ).length;

    /*
     * ==========================================
     * TERMINER LE TEST
     * ==========================================
     */

    const handleFinish = async () => {

        const unanswered =
            questions.filter(
                (question) =>
                    !answers[question.id] ||
                    answers[question.id].length === 0
            ).length;

        if (unanswered > 0) {

            const confirmation = window.confirm(
                `Il reste ${unanswered} question(s) sans réponse.\n\n` +
                "Voulez-vous vraiment terminer le test ?"
            );

            if (!confirmation) {
                return;
            }
        }

        try {

            const params =
                new URLSearchParams(
                    window.location.search
                );

            const candidateId =
                params.get("candidate_id");

            console.log("Réponses envoyées :", answers);

            const response =
                await api.post(
                    "/questions/submit",
                    {
                        candidate_id: candidateId,
                        reponses: answers
                    }
                );

            console.log(
                "Résultat Laravel :",
                response.data
            );

            setScore({
                correct:
                    response.data.bonnes_reponses,

                total:
                    response.data.nombre_questions,

                percentage:
                    response.data.pourcentage
            });

            setFinished(true);

        } catch (error) {

            console.error(
                "Erreur correction :",
                error
            );

            alert(
                error.response?.data?.message ||
                "Erreur lors de la correction du test."
            );
        }
    };

    /*
     * ==========================================
     * LOADING
     * ==========================================
     */

    if (loading) {

        return (
            <div className="test-page">

                <div className="test-loading">

                    <div className="loading-spinner"></div>

                    <h2>
                        Préparation du test...
                    </h2>

                    <p>
                        Nous préparons vos questions.
                    </p>

                </div>

                <TestStyles />

            </div>
        );
    }

    /*
     * ==========================================
     * ERREUR
     * ==========================================
     */

    if (error) {

        return (
            <div className="test-page">

                <div className="test-error">

                    <div className="error-icon">
                        ⚠️
                    </div>

                    <h2>
                        Impossible de charger le test
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        className="retry-btn"
                        onClick={loadQuestions}
                    >
                        Réessayer
                    </button>

                </div>

                <TestStyles />

            </div>
        );
    }

    /*
     * ==========================================
     * RESULTAT FINAL
     * ==========================================
     */

    if (finished && score) {

        return (
            <div className="test-page">

                <div className="result-page">

                    <div className="result-icon">
                        {score.percentage >= 50
                            ? "🎉"
                            : "📋"}
                    </div>

                    <h1>
                        Test terminé
                    </h1>

                    <p className="result-subtitle">
                        Merci d'avoir participé au test.
                    </p>

                    <div className="final-score">

                        <span>
                            Votre score
                        </span>

                        <strong>
                            {score.percentage}%
                        </strong>

                    </div>

                    <div className="result-details">

                        <div>
                            <span>Bonnes réponses</span>
                            <strong>
                                {score.correct}
                            </strong>
                        </div>

                        <div>
                            <span>Questions</span>
                            <strong>
                                {score.total}
                            </strong>
                        </div>

                    </div>

                    <p className="result-message">

                        {score.percentage >= 50
                            ? "Félicitations ! Vous avez atteint le seuil requis pour ce test."
                            : "Merci pour votre participation. Votre résultat sera pris en compte dans le processus de recrutement."
                        }

                    </p>

                </div>

                <TestStyles />

            </div>
        );
    }

    /*
     * ==========================================
     * AUCUNE QUESTION
     * ==========================================
     */

    if (!currentQuestion) {

        return (
            <div className="test-page">

                <div className="test-error">

                    <div className="error-icon">
                        📝
                    </div>

                    <h2>
                        Aucune question disponible
                    </h2>

                    <p>
                        Le test ne contient actuellement
                        aucune question.
                    </p>

                </div>

                <TestStyles />

            </div>
        );
    }

    /*
     * ==========================================
     * PROGRESSION
     * ==========================================
     */

    const progress =
        ((currentIndex + 1) / questions.length) * 100;

    const selectedAnswers =
        answers[currentQuestion.id] || [];

    /*
     * ==========================================
     * AFFICHAGE DU TEST
     * ==========================================
     */

    return (
        <div className="test-page">

            <div className="test-container">

                {/* HEADER */}

                <div className="test-header">

                    <div>

                        <span className="test-label">
                            TEST DE RECRUTEMENT
                        </span>

                        <h1>
                            Évaluation des compétences
                        </h1>

                        <p>
                            Répondez aux questions suivantes.
                        </p>

                    </div>

                    <div className="question-counter">

                        <strong>
                            {currentIndex + 1}
                        </strong>

                        <span>
                            / {questions.length}
                        </span>

                    </div>

                </div>

                {/* PROGRESSION */}

                <div className="progress-section">

                    <div className="progress-info">

                        <span>
                            Progression
                        </span>

                        <span>
                            {answeredCount} / {questions.length}
                            {" "}répondue(s)
                        </span>

                    </div>

                    <div className="progress-bar">

                        <div
                            className="progress-value"
                            style={{
                                width: `${progress}%`
                            }}
                        ></div>

                    </div>

                </div>

                {/* QUESTION */}

                <div className="question-card">

                    <div className="question-top">

                        <span className="category-badge">
                            {currentQuestion.categorie}
                        </span>

                        <span className="question-number">
                            Question {currentIndex + 1}
                        </span>

                    </div>

                    <h2 className="question-text">
                        {currentQuestion.question}
                    </h2>

                    <p className="question-help">
                        Sélectionnez la ou les bonnes réponses.
                    </p>

                    {/* CHOIX */}

                    <div className="choices-list">

                        {currentQuestion.choices?.map(
                            (choice) => {

                                const selected =
                                    selectedAnswers.includes(
                                        choice.lettre
                                    );

                                return (
                                    <button
                                        key={choice.id}
                                        type="button"
                                        className={
                                            `choice ${
                                                selected
                                                    ? "choice-selected"
                                                    : ""
                                            }`
                                        }
                                        onClick={() =>
                                            handleAnswer(
                                                currentQuestion.id,
                                                choice.lettre
                                            )
                                        }
                                    >

                                        <span
                                            className="choice-letter"
                                        >
                                            {choice.lettre}
                                        </span>

                                        <span
                                            className="choice-text"
                                        >
                                            {choice.texte}
                                        </span>

                                        <span
                                            className="choice-check"
                                        >
                                            {selected
                                                ? "✓"
                                                : ""}
                                        </span>

                                    </button>
                                );
                            }
                        )}

                    </div>

                </div>

                {/* NAVIGATION */}

                <div className="navigation">

                    <button
                        type="button"
                        className="navigation-btn previous"
                        disabled={currentIndex === 0}
                        onClick={() =>
                            setCurrentIndex(
                                currentIndex - 1
                            )
                        }
                    >
                        ← Précédente
                    </button>

                    {currentIndex <
                    questions.length - 1 ? (

                        <button
                            type="button"
                            className="navigation-btn next"
                            onClick={() =>
                                setCurrentIndex(
                                    currentIndex + 1
                                )
                            }
                        >
                            Suivante →
                        </button>

                    ) : (

                        <button
                            type="button"
                            className="navigation-btn finish"
                            onClick={handleFinish}
                        >
                            Terminer le test ✓
                        </button>

                    )}

                </div>

            </div>

            <TestStyles />

        </div>
    );
}


/*
 * ==================================================
 * STYLES
 * ==================================================
 */

function TestStyles() {

    return (
        <style>{`

            * {
                box-sizing: border-box;
            }

            .test-page {
                width: 100%;
                min-height: 100vh;

                padding: 40px 20px;

                background: #f5f7fb;
            }

            .test-container {
                width: 100%;
                max-width: 900px;

                margin: 0 auto;
            }

            /*
             * HEADER
             */

            .test-header {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;

                gap: 20px;

                margin-bottom: 25px;
            }

            .test-label {
                display: block;

                margin-bottom: 8px;

                color: #5b35d5;

                font-size: 12px;
                font-weight: 700;

                letter-spacing: 1px;
            }

            .test-header h1 {
                margin: 0 0 7px;

                color: #172033;

                font-size: 29px;
                font-weight: 750;
            }

            .test-header p {
                margin: 0;

                color: #697386;

                font-size: 14px;
            }

            .question-counter {
                min-width: 85px;

                padding: 12px 16px;

                text-align: center;

                border-radius: 11px;

                background: #ffffff;

                border: 1px solid #e5e9f0;
            }

            .question-counter strong {
                color: #5b35d5;

                font-size: 23px;
            }

            .question-counter span {
                color: #8a93a5;

                font-size: 14px;
            }

            /*
             * PROGRESSION
             */

            .progress-section {
                margin-bottom: 22px;
            }

            .progress-info {
                display: flex;
                justify-content: space-between;

                margin-bottom: 8px;

                color: #7b8495;

                font-size: 12px;
            }

            .progress-bar {
                width: 100%;
                height: 7px;

                overflow: hidden;

                border-radius: 10px;

                background: #e4e7ed;
            }

            .progress-value {
                height: 100%;

                border-radius: 10px;

                background: #5b35d5;

                transition: width 0.25s ease;
            }

            /*
             * QUESTION
             */

            .question-card {
                padding: 30px;

                background: #ffffff;

                border: 1px solid #e5e9f0;
                border-radius: 16px;

                box-shadow:
                    0 8px 30px rgba(25, 35, 55, 0.06);
            }

            .question-top {
                display: flex;
                align-items: center;
                justify-content: space-between;

                gap: 15px;

                margin-bottom: 20px;
            }

            .category-badge {
                padding: 6px 11px;

                border-radius: 20px;

                background: #eeeafd;
                color: #5b35d5;

                font-size: 11px;
                font-weight: 700;
            }

            .question-number {
                color: #9aa2b0;

                font-size: 12px;
                font-weight: 600;
            }

            .question-text {
                margin: 0 0 10px;

                color: #172033;

                font-size: 22px;
                line-height: 1.45;
                font-weight: 700;
            }

            .question-help {
                margin: 0 0 24px;

                color: #8992a3;

                font-size: 13px;
            }

            /*
             * CHOIX
             */

            .choices-list {
                display: flex;
                flex-direction: column;

                gap: 12px;
            }

            .choice {
                width: 100%;

                display: flex;
                align-items: center;

                gap: 14px;

                padding: 15px;

                border: 1px solid #dfe4eb;
                border-radius: 11px;

                background: #ffffff;

                text-align: left;

                cursor: pointer;

                transition:
                    border-color 0.2s,
                    background 0.2s,
                    transform 0.2s;
            }

            .choice:hover {
                border-color: #9d8be5;

                background: #faf9ff;

                transform: translateY(-1px);
            }

            .choice-selected {
                border-color: #5b35d5;

                background: #f5f2ff;
            }

            .choice-letter {
                width: 36px;
                height: 36px;

                flex-shrink: 0;

                display: flex;
                align-items: center;
                justify-content: center;

                border-radius: 8px;

                background: #f0f2f6;
                color: #566072;

                font-size: 14px;
                font-weight: 700;
            }

            .choice-selected .choice-letter {
                background: #5b35d5;
                color: #ffffff;
            }

            .choice-text {
                flex: 1;

                color: #3c4658;

                font-size: 14px;
                line-height: 1.5;
            }

            .choice-check {
                width: 22px;

                color: #5b35d5;

                font-size: 18px;
                font-weight: 700;

                text-align: center;
            }

            /*
             * NAVIGATION
             */

            .navigation {
                display: flex;
                justify-content: space-between;

                gap: 15px;

                margin-top: 20px;
            }

            .navigation-btn {
                min-height: 46px;

                padding: 11px 20px;

                border-radius: 9px;

                font-size: 14px;
                font-weight: 600;

                cursor: pointer;

                transition: 0.2s;
            }

            .previous {
                border: 1px solid #dfe3ea;

                background: #ffffff;
                color: #596273;
            }

            .previous:hover:not(:disabled) {
                background: #f0f2f6;
            }

            .previous:disabled {
                opacity: 0.45;

                cursor: not-allowed;
            }

            .next,
            .finish {
                border: none;

                background: #5b35d5;
                color: #ffffff;
            }

            .next:hover,
            .finish:hover {
                background: #4725b5;
            }

            /*
             * LOADING
             */

            .test-loading,
            .test-error,
            .result-page {
                width: 100%;
                max-width: 650px;

                margin: 80px auto;

                padding: 45px 30px;

                text-align: center;

                background: #ffffff;

                border: 1px solid #e5e9f0;
                border-radius: 16px;

                box-shadow:
                    0 8px 30px rgba(25, 35, 55, 0.06);
            }

            .loading-spinner {
                width: 42px;
                height: 42px;

                margin: 0 auto 20px;

                border: 4px solid #e5e1f7;
                border-top-color: #5b35d5;

                border-radius: 50%;

                animation: spin 0.8s linear infinite;
            }

            @keyframes spin {
                to {
                    transform: rotate(360deg);
                }
            }

            .test-loading h2,
            .test-error h2 {
                margin: 0 0 8px;

                color: #172033;

                font-size: 21px;
            }

            .test-loading p,
            .test-error p {
                margin: 0;

                color: #7b8495;

                font-size: 14px;
                line-height: 1.6;
            }

            .error-icon,
            .result-icon {
                font-size: 45px;

                margin-bottom: 15px;
            }

            .retry-btn {
                margin-top: 22px;

                padding: 11px 20px;

                border: none;
                border-radius: 9px;

                background: #5b35d5;
                color: #ffffff;

                font-size: 14px;
                font-weight: 600;

                cursor: pointer;
            }

            /*
             * RESULTAT
             */

            .result-page h1 {
                margin: 0 0 8px;

                color: #172033;

                font-size: 28px;
            }

            .result-subtitle {
                margin: 0 0 25px;

                color: #7b8495;

                font-size: 14px;
            }

            .final-score {
                display: flex;
                flex-direction: column;

                align-items: center;

                padding: 25px;

                margin-bottom: 18px;

                border-radius: 13px;

                background: #f5f2ff;
            }

            .final-score span {
                color: #697386;

                font-size: 13px;
            }

            .final-score strong {
                margin-top: 5px;

                color: #5b35d5;

                font-size: 42px;
            }

            .result-details {
                display: grid;

                grid-template-columns: repeat(2, 1fr);

                gap: 12px;

                margin-bottom: 22px;
            }

            .result-details div {
                display: flex;
                flex-direction: column;

                gap: 5px;

                padding: 15px;

                border-radius: 10px;

                background: #f7f8fa;
            }

            .result-details span {
                color: #8992a3;

                font-size: 12px;
            }

            .result-details strong {
                color: #293246;

                font-size: 20px;
            }

            .result-message {
                margin: 0;

                color: #697386;

                font-size: 14px;
                line-height: 1.7;
            }

            /*
             * RESPONSIVE
             */

            @media (max-width: 700px) {

                .test-page {
                    padding: 25px 15px;
                }

                .test-header {
                    align-items: center;
                }

                .test-header h1 {
                    font-size: 23px;
                }

                .question-card {
                    padding: 22px 18px;
                }

                .question-text {
                    font-size: 19px;
                }

                .navigation-btn {
                    flex: 1;
                }

            }

            @media (max-width: 480px) {

                .test-page {
                    padding: 15px 10px;
                }

                .test-header {
                    flex-direction: column;
                }

                .question-counter {
                    align-self: flex-end;
                }

                .question-top {
                    align-items: flex-start;
                    flex-direction: column;
                }

                .choice {
                    padding: 12px;
                }

                .choice-letter {
                    width: 32px;
                    height: 32px;
                }

                .navigation {
                    flex-direction: column;
                }

                .navigation-btn {
                    width: 100%;
                }

                .result-details {
                    grid-template-columns: 1fr;
                }

            }

        `}</style>
    );
}

