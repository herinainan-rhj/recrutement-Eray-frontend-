import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="logo">Recruiting</h2>

      <nav>
        

        <Link to="/admin/jobs">
          💼 Offres d'emploi
        </Link>

        <Link to="/admin/candidates">
          👥 Candidats
        </Link>

        

        <Link to="/admin/tests">
          📝 Tests QCM
        </Link>

        <Link to="/admin/emails">
          ✉️ Emails
        </Link>


        <Link to="/admin/settings">
          🔧 Paramètres
        </Link>
      </nav>
    </aside>
  );
}