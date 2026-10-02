import { Link } from "react-router-dom";

export default function Logo({ to = "/", light = false }) {
    return (
        <Link
            to={to}
            className={`logo ${light ? "logo-light" : ""}`}
            aria-label="E RAY — accueil"
        >
            <span className="logo-circle">E</span>
            <span className="logo-text">RAY</span>
        </Link>
    );
}
