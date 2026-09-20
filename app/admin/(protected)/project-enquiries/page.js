import { getProjectEnquiries } from '../../../../lib/submissions';
import { fmtDateTime } from '../../../../lib/deep';
import ExportCsv from '../../../../components/admin/ExportCsv';

export const metadata = { title: 'Project Enquiries' };

export default async function ProjectEnquiries() {
  const { rows, error } = await getProjectEnquiries();

  // Grouped by project so you can see which developments are pulling interest.
  const byProject = (rows || []).reduce((acc, r) => {
    (acc[r.project] ||= []).push(r);
    return acc;
  }, {});
  const projects = Object.keys(byProject).sort((a, b) => byProject[b].length - byProject[a].length);

  return (
    <div>
      <div className="admin-topbar">
        <div>
          <h1 className="admin-h1">Project Enquiries</h1>
          <p className="admin-sub" style={{ marginBottom: 0 }}>
            Enquiries sent from an individual project page, grouped by development.
          </p>
        </div>
        {rows?.length > 0 && (
          <ExportCsv
            filename="realterra-project-enquiries.csv"
            rows={rows.map((r) => ({
              Date: fmtDateTime(r.created_at),
              Project: r.project,
              'First name': r.first_name,
              'Last name': r.last_name,
              Email: r.email,
              Phone: r.phone || '',
              Message: r.message || '',
            }))}
          />
        )}
      </div>

      {error && <p className="a-error">{error.message}</p>}
      {!error && rows?.length === 0 && (
        <div className="a-section">
          <p className="admin-sub" style={{ marginBottom: 0 }}>
            No project enquiries yet. They appear here as soon as someone submits the form on a
            project page.
          </p>
        </div>
      )}

      {projects.map((project) => (
        <div className="a-section" key={project}>
          <div className="a-section-body">
            <div className="a-section-title" style={{ marginBottom: '1rem' }}>
              {project}
              <span>{byProject[project].length} enquir{byProject[project].length === 1 ? 'y' : 'ies'}</span>
            </div>
            {byProject[project].map((row) => (
              <div className="a-repeat-item" key={row.id}>
                <div className="a-repeat-head">
                  <div className="a-repeat-label"><span className="a-repeat-name">{fmtDateTime(row.created_at)}</span></div>
                </div>
                <p className="sub-name">{row.first_name} {row.last_name}</p>
                <p className="a-help">
                  <a href={`mailto:${row.email}`}>{row.email}</a>
                  {row.phone && <> · <a href={`tel:${row.phone}`}>{row.phone}</a></>}
                </p>
                {row.message && <p className="sub-message">{row.message}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
