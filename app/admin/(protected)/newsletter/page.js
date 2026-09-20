import { getNewsletterSubscribers } from '../../../../lib/submissions';
import { fmtDateTime } from '../../../../lib/deep';
import ExportCsv from '../../../../components/admin/ExportCsv';

export const metadata = { title: 'Newsletter Subscribed' };

export default async function Newsletter() {
  const { rows, error } = await getNewsletterSubscribers();

  return (
    <div>
      <div className="admin-topbar">
        <div>
          <h1 className="admin-h1">Newsletter Subscribed</h1>
          <p className="admin-sub" style={{ marginBottom: 0 }}>
            Everyone who submitted their email through the newsletter block, newest first.
          </p>
        </div>
        {rows?.length > 0 && (
          <ExportCsv
            filename="realterra-newsletter-subscribers.csv"
            rows={rows.map((r) => ({ Email: r.email, 'Subscribed on': fmtDateTime(r.created_at) }))}
          />
        )}
      </div>

      <div className="a-section">
        <div className="a-section-title">
          Subscribers
          <span>{rows?.length || 0} total</span>
        </div>

        {error && <p className="a-error">{error.message}</p>}
        {!error && rows?.length === 0 && (
          <p className="admin-sub" style={{ marginBottom: 0 }}>No subscribers yet.</p>
        )}

        {rows?.length > 0 && (
          <table className="a-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td><a href={`mailto:${row.email}`}>{row.email}</a></td>
                  <td className="a-table-muted">{fmtDateTime(row.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
