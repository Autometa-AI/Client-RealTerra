import { getContactSubmissions } from '../../../../lib/submissions';
import { fmtDateTime } from '../../../../lib/deep';
import ExportCsv from '../../../../components/admin/ExportCsv';

export const metadata = { title: 'Contact Page Fillups' };

export default async function ContactSubmissions() {
  const { rows, error } = await getContactSubmissions();

  return (
    <div>
      <div className="admin-topbar">
        <div>
          <h1 className="admin-h1">Contact Page Fillups</h1>
          <p className="admin-sub" style={{ marginBottom: 0 }}>
            Enquiries submitted through the contact page form, newest first. Project-page enquiries are listed separately.
          </p>
        </div>
        {rows?.length > 0 && (
          <ExportCsv
            filename="realterra-contact-enquiries.csv"
            rows={rows.map((r) => ({
              Date: fmtDateTime(r.created_at),
              'First name': r.first_name,
              'Last name': r.last_name,
              Email: r.email,
              Phone: r.phone || '',
              'Interested in': r.interest || '',
              Budget: r.budget || '',
              Message: r.message || '',
            }))}
          />
        )}
      </div>

      <div className="a-section">
        <div className="a-section-title">
          Enquiries
          <span>{rows?.length || 0} total</span>
        </div>

        {error && <p className="a-error">{error.message}</p>}
        {!error && rows?.length === 0 && (
          <p className="admin-sub" style={{ marginBottom: 0 }}>No enquiries yet.</p>
        )}

        {rows?.map((row) => (
          <div className="a-repeat-item" key={row.id}>
            <div className="a-repeat-head">
              <div className="a-repeat-label">{fmtDateTime(row.created_at)}</div>
            </div>
            <p className="sub-name">
              {row.first_name} {row.last_name}
            </p>
            <p className="a-help">
              <a href={`mailto:${row.email}`}>{row.email}</a>
              {row.phone && <> · <a href={`tel:${row.phone}`}>{row.phone}</a></>}
            </p>
            {(row.interest || row.budget) && (
              <p className="a-help">{[row.interest, row.budget].filter(Boolean).join(' · ')}</p>
            )}
            {row.message && <p className="sub-message">{row.message}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
