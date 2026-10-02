/*
 * Paramètres du backoffice.
 * Ils sont enregistrés dans le navigateur (localStorage) :
 * aucune route API n'existe encore pour les stocker côté serveur.
 */

const SETTINGS_KEY = "eray.settings";
const TEMPLATES_KEY = "eray.emailTemplates";

export const DEFAULT_SETTINGS = {
    entreprise: "E RAY",
    emailRh: "",
    telephone: "",
    adresse: "",
    signature: "L'équipe Recrutement",
};

export const DEFAULT_TEMPLATES = [
    {
        id: "invitation-test",
        nom: "Invitation au test",
        objet: "Votre candidature au poste de {{poste}} — test de recrutement",
        corps:
            "Bonjour {{prenom}} {{nom}},\n\n" +
            "Nous avons bien reçu votre candidature au poste de {{poste}} et votre profil a retenu notre attention.\n\n" +
            "L'étape suivante est un test de compétences en ligne. Vous pouvez y accéder ici :\n{{lien_test}}\n\n" +
            "Cordialement,\n{{signature}}\n{{entreprise}}",
    },
    {
        id: "convocation-entretien",
        nom: "Convocation à un entretien",
        objet: "Entretien pour le poste de {{poste}}",
        corps:
            "Bonjour {{prenom}} {{nom}},\n\n" +
            "Suite à votre test, nous souhaitons vous rencontrer pour un entretien concernant le poste de {{poste}}.\n\n" +
            "Merci de nous indiquer vos disponibilités pour les prochains jours.\n\n" +
            "Cordialement,\n{{signature}}\n{{entreprise}}",
    },
    {
        id: "refus",
        nom: "Réponse négative",
        objet: "Votre candidature au poste de {{poste}}",
        corps:
            "Bonjour {{prenom}} {{nom}},\n\n" +
            "Nous vous remercions de l'intérêt que vous portez à {{entreprise}} et du temps consacré à votre candidature au poste de {{poste}}.\n\n" +
            "Après étude de votre dossier, nous sommes au regret de ne pas pouvoir y donner une suite favorable.\n\n" +
            "Nous vous souhaitons une pleine réussite dans vos recherches.\n\n" +
            "Cordialement,\n{{signature}}\n{{entreprise}}",
    },
];

const read = (key, fallback) => {
    try {
        const raw = localStorage.getItem(key);

        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
};

const write = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));

        return true;
    } catch {
        return false;
    }
};

export const loadSettings = () => ({
    ...DEFAULT_SETTINGS,
    ...read(SETTINGS_KEY, {}),
});

export const saveSettings = (settings) => write(SETTINGS_KEY, settings);

export const loadTemplates = () => {
    const templates = read(TEMPLATES_KEY, null);

    return Array.isArray(templates) && templates.length > 0
        ? templates
        : DEFAULT_TEMPLATES;
};

export const saveTemplates = (templates) => write(TEMPLATES_KEY, templates);

/* Remplace les variables {{nom}} d'un modèle par leurs valeurs. */
export const fillTemplate = (text, values) =>
    (text || "").replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) =>
        values[key] !== undefined && values[key] !== "" ? values[key] : match
    );
