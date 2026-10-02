import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../../components/Icon";

const PROCESS = [
    {
        title: "Candidature en ligne",
        text: "Vous remplissez un court formulaire et joignez votre CV au format PDF.",
    },
    {
        title: "Analyse automatique du CV",
        text: "Votre CV est comparé aux critères de l'offre : compétences, niveau d'étude et expérience. Vous obtenez un score de correspondance immédiatement.",
    },
    {
        title: "Test de compétences",
        text: "À partir de 50 % de correspondance, vous accédez à un questionnaire à choix multiples en ligne.",
    },
    {
        title: "Entretien",
        text: "Notre équipe RH étudie les résultats et contacte les candidats retenus pour un entretien.",
    },
];

const FAQ = [
    {
        question: "Quel format de CV est accepté ?",
        answer: "Uniquement le format PDF. Privilégiez un CV dont le texte est sélectionnable (et non une image scannée), afin que l'analyse puisse lire son contenu.",
    },
    {
        question: "Comment mon CV est-il évalué ?",
        answer: "Le contenu de votre CV est comparé aux compétences, au niveau d'étude et à l'expérience demandés dans l'offre. Le résultat est un pourcentage de correspondance.",
    },
    {
        question: "Que se passe-t-il si mon score est inférieur à 50 % ?",
        answer: "Votre profil est considéré comme insuffisamment proche de cette offre et le test ne vous est pas proposé. Vous pouvez postuler à une autre offre plus adaptée à votre profil.",
    },
    {
        question: "Comment se déroule le test ?",
        answer: "Le test est un QCM de dix questions. Une question peut avoir plusieurs bonnes réponses. Vous pouvez revenir sur les questions précédentes avant de terminer.",
    },
    {
        question: "Quand serai-je recontacté ?",
        answer: "Après le test, votre dossier est étudié par l'équipe RH, qui vous recontacte par email si votre candidature est retenue pour un entretien.",
    },
];

export default function AboutPage() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <>
            <section className="page-banner">
                <div className="site-container">
                    <h1>À propos</h1>

                    <p>
                        Comment fonctionne notre plateforme de recrutement et
                        ce que vous pouvez en attendre.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="site-container narrow">
                    <div className="section-head">
                        <span className="section-eyebrow">La plateforme</span>
                        <h2>Un recrutement plus simple et plus équitable</h2>
                    </div>

                    <p className="lead">
                        Cette plateforme a été conçue pour rendre le
                        recrutement plus rapide pour les candidats et plus
                        objectif pour les recruteurs : chaque candidature suit
                        les mêmes étapes et est évaluée selon les mêmes
                        critères.
                    </p>

                    <ol className="timeline">
                        {PROCESS.map((step, index) => (
                            <li key={step.title}>
                                <span className="timeline-number">
                                    {index + 1}
                                </span>

                                <div>
                                    <h3>{step.title}</h3>
                                    <p>{step.text}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section className="section section-alt">
                <div className="site-container narrow">
                    <div className="section-head">
                        <span className="section-eyebrow">Questions fréquentes</span>
                        <h2>Vous vous demandez peut-être…</h2>
                    </div>

                    <div className="faq">
                        {FAQ.map((item, index) => {
                            const open = openIndex === index;

                            return (
                                <div
                                    key={item.question}
                                    className={`faq-item ${open ? "open" : ""}`}
                                >
                                    <button
                                        type="button"
                                        aria-expanded={open}
                                        onClick={() =>
                                            setOpenIndex(open ? -1 : index)
                                        }
                                    >
                                        {item.question}
                                        <Icon name={open ? "x" : "plus"} size={16} />
                                    </button>

                                    {open && <p>{item.answer}</p>}
                                </div>
                            );
                        })}
                    </div>

                    <div className="about-actions">
                        <Link to="/jobs" className="ui-btn">
                            Voir les offres
                        </Link>

                        <Link to="/contact" className="ui-btn ui-btn-secondary">
                            Poser une question
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
