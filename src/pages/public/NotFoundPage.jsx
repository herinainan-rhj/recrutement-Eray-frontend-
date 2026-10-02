import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div className="ui-state not-found">
            <strong>404</strong>
            <h3>Page introuvable</h3>
            <p>La page que vous recherchez n'existe pas ou a été déplacée.</p>

            <Link to="/" className="ui-btn">
                Retour à l'accueil
            </Link>
        </div>
    );
}
