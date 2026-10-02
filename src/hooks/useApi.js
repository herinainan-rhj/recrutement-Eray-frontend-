import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../services/api";

/*
 * Charge des données depuis l'API et expose
 * l'état de chargement, l'erreur et une fonction de rechargement.
 */
export default function useApi(fetcher, fallbackMessage) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const reload = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            setData(await fetcher());
        } catch (err) {
            console.error(err);
            setError(getErrorMessage(err, fallbackMessage));
        } finally {
            setLoading(false);
        }
    }, [fetcher, fallbackMessage]);

    useEffect(() => {
        reload();
    }, [reload]);

    return { data, setData, loading, error, reload };
}
