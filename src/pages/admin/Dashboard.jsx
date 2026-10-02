import AdminLayout from "../../layouts/AdminLayout";

export default function Dashboard() {
  return (
    <AdminLayout>
      <div className="dashboard">

        <div className="cards">

          <div className="card">
            <h2>125</h2>
            <p>Candidatures</p>
          </div>

          <div className="card">
            <h2>18</h2>
            <p>Offres</p>
          </div>

          <div className="card">
            <h2>34</h2>
            <p>Entretiens</p>
          </div>

          <div className="card">
            <h2>8</h2>
            <p>Recrutés</p>
          </div>

        </div>

        <div className="dashboard-section">
          <h2>Activité récente</h2>

          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Poste</th>
                <th>Statut</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Rakoto</td>
                <td>Développeur Laravel</td>
                <td>Entretien</td>
              </tr>

              <tr>
                <td>Rabe</td>
                <td>Développeur React</td>
                <td>En Test</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </AdminLayout>
  );
}