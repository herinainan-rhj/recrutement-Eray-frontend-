/*
 * Étapes d'une candidature, dans l'ordre du processus.
 * Les clés correspondent au champ `etat_candidature` de l'API.
 */
export const STATUSES = [
    { value: "test_a_passer", label: "À tester", tone: "warning" },
    { value: "test_en_cours", label: "Test en cours", tone: "info" },
    { value: "test_termine", label: "Test terminé", tone: "success" },
    { value: "entretien", label: "Entretien", tone: "accent" },
    { value: "termine", label: "Terminé", tone: "success" },
    { value: "refuse", label: "Refusé", tone: "danger" },
];

export const getStatus = (value) =>
    STATUSES.find((status) => status.value === value) || {
        value,
        label: value || "En attente",
        tone: "neutral",
    };

export const getScoreTone = (score) => {
    const value = Number(score) || 0;

    if (value >= 80) {
        return "success";
    }

    if (value >= 50) {
        return "warning";
    }

    return "danger";
};

export const fullName = (candidate) =>
    `${candidate?.prenom || ""} ${candidate?.nom || ""}`.trim() || "Candidat";

export const initials = (candidate) =>
    `${candidate?.prenom?.charAt(0) || ""}${candidate?.nom?.charAt(0) || ""}`.toUpperCase() || "?";

export const formatDate = (value) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

export const splitSkills = (competences) =>
    (competences || "")
        .split(/[,;\n]/)
        .map((skill) => skill.trim())
        .filter(Boolean);
