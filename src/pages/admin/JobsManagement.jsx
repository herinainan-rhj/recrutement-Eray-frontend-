import { useMemo, useState } from "react";
import Icon from "../../components/Icon";
import Modal from "../../components/Modal";
import useApi from "../../hooks/useApi";
import {
    createJob,
    deleteJob,
    fetchJobs,
    getErrorMessage,
    updateJob,
} from "../../services/api";

const EMPTY_JOB = {
    titre: "",
    description: "",
    departement: "",
    localisation: "",
    type_contrat: "",
    niveau_etude: "",
    experience_requise: "",
    competences: "",
};

const CONTRACTS = ["CDI", "CDD", "Stage", "Freelance"];
const LEVELS = ["Bac", "Bac+2", "Licence", "Master 1", "Master 2"];

export default function JobsManagement() {
    const { data: jobs, loading, error, reload } = useApi(
        fetchJobs,
        "Impossible de charger les offres."
    );

    const [search, setSearch] = useState("");
    const [notice, setNotice] = useState(null);

    /* `editing` : null (fermé), {} (création) ou l'offre à modifier */
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState(EMPTY_JOB);
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    const [toDelete, setToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const filteredJobs = useMemo(() => {
        const term = search.trim().toLowerCase();

        return jobs
            .filter((job) =>
                [job.titre, job.departement, job.localisation, job.type_contrat]
                    .join(" ")
                    .toLowerCase()
                    .includes(term)
            )
            .sort((a, b) => (b.id || 0) - (a.id || 0));
    }, [jobs, search]);


    /* =========================================
       FORMULAIRE
    ========================================= */

    const openForm = (job) => {
        setFormError("");

        setFormData(
            job
                ? Object.fromEntries(
                      Object.keys(EMPTY_JOB).map((key) => [key, job[key] ?? ""])
                  )
                : EMPTY_JOB
        );

        setEditing(job || {});
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setFormError("");

        try {
            if (editing.id) {
                await updateJob(editing.id, formData);
            } else {
                await createJob(formData);
            }

            setNotice({
                type: "success",
                text: editing.id
                    ? "L'offre a été modifiée."
                    : "L'offre a été créée.",
            });

            setEditing(null);
            reload();

        } catch (err) {
            console.error("Erreur enregistrement offre :", err);

            setFormError(
                getErrorMessage(err, "Vérifiez les champs du formulaire.")
            );
        } finally {
            setSaving(false);
        }
    };


    /* =========================================
       SUPPRESSION
    ========================================= */

    const handleDelete = async () => {
        setDeleting(true);

        try {
            await deleteJob(toDelete.id);

            setNotice({ type: "success", text: "L'offre a été supprimée." });
            reload();

        } catch (err) {
            console.error("Erreur suppression offre :", err);

            setNotice({
                type: "error",
                text: getErrorMessage(err, "L'offre n'a pas pu être supprimée."),
            });
        } finally {
            setDeleting(false);
            setToDelete(null);
        }
    };


    return (
        <div className="bo-page">

            <div className="bo-head">
                <div>
                    <h1>Offres d'emploi</h1>
                    <p>Créez, modifiez et supprimez les offres publiées sur le site.</p>
                </div>

                <button
                    type="button"
                    className="ui-btn"
                    onClick={() => openForm(null)}
                >
                    <Icon name="plus" size={16} />
                    Nouvelle offre
                </button>
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

            <section className="bo-card">

                <div className="bo-toolbar">
                    <div className="ui-search">
                        <Icon name="search" size={16} />

                        <input
                            className="ui-input"
                            type="search"
                            placeholder="Rechercher une offre..."
                            aria-label="Rechercher une offre"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <button
                        type="button"
                        className="ui-btn ui-btn-secondary"
                        onClick={reload}
                    >
                        <Icon name="refresh" size={16} />
                        Actualiser
                    </button>
                </div>

                {loading ? (
                    <div className="ui-state">
                        <div className="ui-spinner"></div>
                        <p>Chargement des offres...</p>
                    </div>
                ) : error ? (
                    <div className="ui-state">
                        <Icon name="alert" size={34} />
                        <h3>Offres indisponibles</h3>
                        <p>{error}</p>
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="ui-state">
                        <Icon name="inbox" size={34} />

                        <h3>
                            {search ? "Aucun résultat" : "Aucune offre publiée"}
                        </h3>

                        <p>
                            {search
                                ? "Aucune offre ne correspond à votre recherche."
                                : "Créez votre première offre pour commencer à recevoir des candidatures."}
                        </p>

                        {!search && (
                            <button
                                type="button"
                                className="ui-btn"
                                onClick={() => openForm(null)}
                            >
                                <Icon name="plus" size={16} />
                                Créer une offre
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="bo-table-wrap">
                        <table className="bo-table">
                            <thead>
                                <tr>
                                    <th>Poste</th>
                                    <th>Localisation</th>
                                    <th>Contrat</th>
                                    <th>Niveau</th>
                                    <th>Expérience</th>
                                    <th aria-label="Actions"></th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredJobs.map((job) => (
                                    <tr key={job.id}>
                                        <td>
                                            <strong>{job.titre}</strong>

                                            <span className="bo-sub">
                                                {job.departement || "—"}
                                            </span>
                                        </td>

                                        <td>{job.localisation || "—"}</td>

                                        <td>
                                            {job.type_contrat ? (
                                                <span className="ui-pill">
                                                    {job.type_contrat}
                                                </span>
                                            ) : (
                                                "—"
                                            )}
                                        </td>

                                        <td>{job.niveau_etude || "—"}</td>

                                        <td className="num">
                                            {job.experience_requise ?? "—"} an(s)
                                        </td>

                                        <td>
                                            <div className="bo-table-actions">
                                                <a
                                                    className="ui-icon-btn"
                                                    href={`/jobs/${job.id}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    title="Voir sur le site"
                                                    aria-label={`Voir ${job.titre} sur le site`}
                                                >
                                                    <Icon name="external" size={16} />
                                                </a>

                                                <button
                                                    type="button"
                                                    className="ui-icon-btn"
                                                    onClick={() => openForm(job)}
                                                    title="Modifier"
                                                    aria-label={`Modifier ${job.titre}`}
                                                >
                                                    <Icon name="edit" size={16} />
                                                </button>

                                                <button
                                                    type="button"
                                                    className="ui-icon-btn danger"
                                                    onClick={() => setToDelete(job)}
                                                    title="Supprimer"
                                                    aria-label={`Supprimer ${job.titre}`}
                                                >
                                                    <Icon name="trash" size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </section>


            {/* =====================================
               FORMULAIRE CRÉATION / MODIFICATION
            ===================================== */}

            {editing && (
                <Modal
                    wide
                    title={editing.id ? "Modifier l'offre" : "Créer une offre d'emploi"}
                    onClose={() => setEditing(null)}
                    footer={
                        <>
                            <button
                                type="button"
                                className="ui-btn ui-btn-secondary"
                                onClick={() => setEditing(null)}
                            >
                                Annuler
                            </button>

                            <button
                                type="submit"
                                form="job-form"
                                className="ui-btn"
                                disabled={saving}
                            >
                                {saving
                                    ? "Enregistrement..."
                                    : editing.id
                                      ? "Enregistrer"
                                      : "Créer l'offre"}
                            </button>
                        </>
                    }
                >
                    <form id="job-form" onSubmit={handleSubmit}>

                        {formError && (
                            <div className="ui-alert error" role="alert">
                                <Icon name="alert" />
                                {formError}
                            </div>
                        )}

                        <div className="ui-field">
                            <label htmlFor="titre">Titre du poste</label>

                            <input
                                id="titre"
                                className="ui-input"
                                type="text"
                                name="titre"
                                value={formData.titre}
                                onChange={handleChange}
                                placeholder="Ex : Développeur Laravel"
                                required
                            />
                        </div>

                        <div className="ui-field">
                            <label htmlFor="description">Description du poste</label>

                            <textarea
                                id="description"
                                className="ui-input"
                                rows="5"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Décrivez le poste, les missions et les responsabilités..."
                                required
                            />
                        </div>

                        <div className="ui-row">
                            <div className="ui-field">
                                <label htmlFor="departement">Département</label>

                                <input
                                    id="departement"
                                    className="ui-input"
                                    type="text"
                                    name="departement"
                                    value={formData.departement}
                                    onChange={handleChange}
                                    placeholder="Ex : Informatique"
                                    required
                                />
                            </div>

                            <div className="ui-field">
                                <label htmlFor="localisation">Localisation</label>

                                <input
                                    id="localisation"
                                    className="ui-input"
                                    type="text"
                                    name="localisation"
                                    value={formData.localisation}
                                    onChange={handleChange}
                                    placeholder="Ex : Antananarivo"
                                    required
                                />
                            </div>
                        </div>

                        <div className="ui-row">
                            <div className="ui-field">
                                <label htmlFor="type_contrat">Type de contrat</label>

                                <select
                                    id="type_contrat"
                                    className="ui-input"
                                    name="type_contrat"
                                    value={formData.type_contrat}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Choisir un type</option>

                                    {CONTRACTS.map((contract) => (
                                        <option key={contract} value={contract}>
                                            {contract}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="ui-field">
                                <label htmlFor="niveau_etude">Niveau d'étude</label>

                                <select
                                    id="niveau_etude"
                                    className="ui-input"
                                    name="niveau_etude"
                                    value={formData.niveau_etude}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Choisir un niveau</option>

                                    {LEVELS.map((level) => (
                                        <option key={level} value={level}>
                                            {level}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="ui-field">
                            <label htmlFor="experience_requise">
                                Expérience requise (en années)
                            </label>

                            <input
                                id="experience_requise"
                                className="ui-input"
                                type="number"
                                name="experience_requise"
                                value={formData.experience_requise}
                                onChange={handleChange}
                                min="0"
                                placeholder="0"
                                required
                            />
                        </div>

                        <div className="ui-field">
                            <label htmlFor="competences">Compétences recherchées</label>

                            <textarea
                                id="competences"
                                className="ui-input"
                                rows="3"
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

                    </form>
                </Modal>
            )}


            {/* =====================================
               CONFIRMATION DE SUPPRESSION
            ===================================== */}

            {toDelete && (
                <Modal
                    title="Supprimer cette offre ?"
                    onClose={() => setToDelete(null)}
                    footer={
                        <>
                            <button
                                type="button"
                                className="ui-btn ui-btn-secondary"
                                onClick={() => setToDelete(null)}
                            >
                                Annuler
                            </button>

                            <button
                                type="button"
                                className="ui-btn ui-btn-danger"
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? "Suppression..." : "Supprimer"}
                            </button>
                        </>
                    }
                >
                    <p>
                        L'offre <strong>{toDelete.titre}</strong> ne sera plus
                        visible sur le site. Cette action est définitive.
                    </p>
                </Modal>
            )}

        </div>
    );
}
