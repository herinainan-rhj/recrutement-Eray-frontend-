import { Link } from "react-router-dom";
import Icon from "../../components/Icon";

const DOMAINS = [
    {
        icon: "dashboard",
        title: "Développement web",
        text: "Conception d'applications et de plateformes web, du back-end à l'interface.",
    },
    {
        icon: "file",
        title: "Applications mobiles",
        text: "Création d'applications mobiles pensées pour un usage quotidien.",
    },
    {
        icon: "edit",
        title: "UI / UX Design",
        text: "Des interfaces claires et accessibles, conçues à partir des besoins des utilisateurs.",
    },
    {
        icon: "settings",
        title: "Cloud & infrastructure",
        text: "Déploiement, hébergement et exploitation de services fiables.",
    },
];

const CULTURE = [
    {
        title: "Travail en équipe",
        text: "Les projets avancent grâce à l'entraide : chacun partage ce qu'il sait et apprend des autres.",
    },
    {
        title: "Montée en compétences",
        text: "Chaque collaborateur est encouragé à progresser, quel que soit son niveau d'expérience à l'arrivée.",
    },
    {
        title: "Exigence et qualité",
        text: "Nous accordons de l'importance au travail bien fait et au respect des engagements pris.",
    },
    {
        title: "Égalité des chances",
        text: "Toutes les candidatures sont évaluées selon les mêmes critères : les compétences et la motivation.",
    },
];

export default function CompanyPage() {
    return (
        <>
            <section className="page-banner">
                <div className="site-container">
                    <h1>L'entreprise</h1>

                    <p>
                        Découvrez nos métiers et la manière dont nous
                        travaillons au quotidien.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="site-container split">
                    <div className="split-text">
                        <span className="section-eyebrow">Qui sommes-nous</span>
                        <h2>Une équipe au service de projets numériques</h2>

                        <p>
                            E RAY réunit des profils techniques et créatifs
                            autour de projets numériques : développement,
                            design et infrastructure.
                        </p>

                        <p>
                            Nous recherchons des personnes curieuses,
                            rigoureuses et qui aiment travailler en équipe.
                            Que vous soyez en début de carrière ou déjà
                            expérimenté, nos offres couvrent plusieurs niveaux
                            et types de contrat.
                        </p>

                        <Link to="/jobs" className="ui-btn">
                            Voir nos offres
                            <Icon name="arrow" />
                        </Link>
                    </div>

                    <div className="split-media">
                        <img
                            src="/eray.png"
                            alt="Logo E RAY et poignée de main"
                        />
                    </div>
                </div>
            </section>

            <section className="section section-alt">
                <div className="site-container">
                    <div className="section-head">
                        <span className="section-eyebrow">Nos métiers</span>
                        <h2>Les domaines dans lesquels nous recrutons</h2>
                    </div>

                    <div className="features features-4">
                        {DOMAINS.map((domain) => (
                            <div key={domain.title} className="feature">
                                <div className="feature-icon">
                                    <Icon name={domain.icon} size={20} />
                                </div>

                                <h3>{domain.title}</h3>
                                <p>{domain.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="site-container">
                    <div className="section-head">
                        <span className="section-eyebrow">Notre culture</span>
                        <h2>Ce qui compte pour nous</h2>
                    </div>

                    <div className="culture">
                        {CULTURE.map((item) => (
                            <div key={item.title} className="culture-item">
                                <Icon name="check" size={18} />

                                <div>
                                    <h3>{item.title}</h3>
                                    <p>{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
