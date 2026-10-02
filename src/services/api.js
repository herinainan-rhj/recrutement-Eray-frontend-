import axios from "axios";

export const API_URL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const api = axios.create({

    baseURL: API_URL,

});

export default api;


/* =========================================
   OFFRES
========================================= */

export const fetchJobs = async () => {
    const { data } = await api.get("/jobs");

    if (Array.isArray(data)) {
        return data;
    }

    return data?.jobs || data?.data || [];
};

export const createJob = (job) => api.post("/admin/jobs", job);

export const updateJob = (id, job) => api.put(`/admin/jobs/${id}`, job);

export const deleteJob = (id) => api.delete(`/admin/jobs/${id}`);


/* =========================================
   CANDIDATS
========================================= */

export const fetchCandidates = async () => {
    const { data } = await api.get("/candidates");

    if (Array.isArray(data)) {
        return data;
    }

    return data?.candidates || data?.data || [];
};

export const updateCandidateStatus = (id, etat) =>
    api.patch(`/candidates/${id}`, { etat_candidature: etat });

export const getCvUrl = (candidateId) =>
    `${API_URL}/candidates/${candidateId}/cv`;


/* =========================================
   CONTACT
========================================= */

export const sendContactMessage = (message) => api.post("/contact", message);


/* =========================================
   MESSAGES D'ERREUR
========================================= */

export const getErrorMessage = (error, fallback) => {

    if (!error?.response) {
        return "Impossible de contacter le serveur. Vérifiez que l'API est démarrée.";
    }

    const { status, data } = error.response;

    if (status === 404 || status === 405) {
        return "Cette action n'est pas encore disponible côté serveur (route API manquante).";
    }

    if (status === 422 && data?.errors) {
        return Object.values(data.errors).flat().join(" ");
    }

    return data?.message || data?.erreur || fallback || "Une erreur est survenue.";
};
