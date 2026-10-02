import { useMemo, useState } from "react";
import Icon from "../../components/Icon";
import JobCard from "../../components/JobCard";
import useApi from "../../hooks/useApi";
import { fetchJobs } from "../../services/api";
import ApplyForm from "./ApplyForm";

const includes = (value, search) =>
    (value || "").toLowerCase().includes(search.trim().toLowerCase());

export default function JobsPage() {
    const { data: jobs, loading, error, reload } = useApi(
        fetchJobs,
        "Impossible de charger les offres."
    );

    const [selectedJob, setSelectedJob] = useState(null);
    const [searchTitle, setSearchTitle] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [category, setCategory] = useState("");
    const [contract, setContract] = useState("");
    const [sort, setSort] = useState("recent");

    /* Les catégories sont les départements des offres publiées. */
    const categories = useMemo(() => {
        const counts = {};

        jobs.forEach((job) => {
            if (job.departement) {
                counts[job.departement] = (counts[job.departement] || 0) + 1;
            }
        });

        return Object.entries(counts).sort((a, b) =>
            a[0].localeCompare(b[0])
        );
    }, [jobs]);

    const contracts = useMemo(
        () => [...new Set(jobs.map((job) => job.type_contrat).filter(Boolean))],
        [jobs]
    );

    const filteredJobs = useMemo(() => {
        const result = jobs.filter(
            (job) =>
                (includes(job.titre, searchTitle) ||
                    includes(job.competences, searchTitle) ||
                    includes(job.description, searchTitle)) &&
                includes(job.localisation, searchLocation) &&
                (!category || job.departement === category) &&
                (!contract || job.type_contrat === contract)
        );

        if (sort === "title") {
            return result.sort((a, b) =>
                (a.titre || "").localeCompare(b.titre || "")
            );
        }

        return result.sort((a, b) => (b.id || 0) - (a.id || 0));
    }, [jobs, searchTitle, searchLocation, category, contract, sort]);

    const hasFilters = searchTitle || searchLocation || category || contract;

    const resetFilters = () => {
        setSearchTitle("");
        setSearchLocation("");
        setCategory("");
        setContract("");
    };

    return (
        <>
            {/* BANNIÈRE / RECHERCHE */}
            <section className="page-banner">
                <div className="site-container">
                    <h1>Offres d'emploi</h1>

                    <p>
                        Trouvez le poste qui vous correspond et postulez en
                        ligne.
                    </p>

                    <div className="search-box">
                        <label className="search-group">
                            <Icon name="search" />

                            <input
                                type="search"
                                placeholder="Poste, compétence, mot-clé"
                                aria-label="Poste, compétence, mot-clé"
                                value={searchTitle}
                                onChange={(e) => setSearchTitle(e.target.value)}
                            />
                        </label>

                        <label className="search-group">
                            <Icon name="pin" />

                            <input
                                type="search"
                                placeholder="Ville"
                                aria-label="Ville"
                                value={searchLocation}
                                onChange={(e) => setSearchLocation(e.target.value)}
                            />
                        </label>
                    </div>
                </div>
            </section>

            <div className="site-container jobs-layout">

                {/* FILTRES */}
                <aside className="filters">
                    <h2>Département</h2>

                    <ul className="filter-list">
                        <li>
                            <button
                                type="button"
                                className={!category ? "active" : ""}
                                onClick={() => setCategory("")}
                            >
                                <span>Tous les départements</span>
                                <span>{jobs.length}</span>
                            </button>
                        </li>

                        {categories.map(([name, count]) => (
                            <li key={name}>
                                <button
                                    type="button"
                                    className={category === name ? "active" : ""}
                                    onClick={() => setCategory(name)}
                                >
                                    <span>{name}</span>
                                    <span>{count}</span>
                                </button>
                            </li>
                        ))}
                    </ul>

                    {contracts.length > 0 && (
                        <>
                            <h2>Type de contrat</h2>

                            <div className="filter-chips">
                                {contracts.map((name) => (
                                    <button
                                        key={name}
                                        type="button"
                                        className={contract === name ? "active" : ""}
                                        onClick={() =>
                                            setContract(contract === name ? "" : name)
                                        }
                                    >
                                        {name}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {hasFilters && (
                        <button
                            type="button"
                            className="filter-reset"
                            onClick={resetFilters}
                        >
                            Réinitialiser les filtres
                        </button>
                    )}
                </aside>

                {/* LISTE DES OFFRES */}
                <section className="jobs-results">
                    <div className="jobs-toolbar">
                        <span>
                            <strong>{filteredJobs.length}</strong> offre
                            {filteredJobs.length > 1 ? "s" : ""}
                        </span>

                        <label>
                            Trier par
                            <select
                                className="ui-input"
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                            >
                                <option value="recent">Plus récentes</option>
                                <option value="title">Titre (A → Z)</option>
                            </select>
                        </label>
                    </div>

                    {loading ? (
                        <div className="ui-state">
                            <div className="ui-spinner"></div>
                            <p>Chargement des offres...</p>
                        </div>
                    ) : error ? (
                        <div className="ui-state">
                            <Icon name="alert" size={36} />
                            <h3>Offres indisponibles</h3>
                            <p>{error}</p>

                            <button
                                type="button"
                                className="ui-btn ui-btn-secondary"
                                onClick={reload}
                            >
                                Réessayer
                            </button>
                        </div>
                    ) : filteredJobs.length === 0 ? (
                        <div className="ui-state">
                            <Icon name="inbox" size={36} />

                            <h3>Aucune offre trouvée</h3>

                            <p>
                                {hasFilters
                                    ? "Aucune offre ne correspond à votre recherche."
                                    : "Aucun poste n'est ouvert pour le moment."}
                            </p>

                            {hasFilters && (
                                <button
                                    type="button"
                                    className="ui-btn ui-btn-secondary"
                                    onClick={resetFilters}
                                >
                                    Effacer les filtres
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="jobs-grid">
                            {filteredJobs.map((job) => (
                                <JobCard
                                    key={job.id}
                                    job={job}
                                    onApply={setSelectedJob}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {selectedJob && (
                <ApplyForm
                    job={selectedJob}
                    onClose={() => setSelectedJob(null)}
                />
            )}
        </>
    );
}
