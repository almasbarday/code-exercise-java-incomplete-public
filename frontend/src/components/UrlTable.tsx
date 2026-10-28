import type { UrlListItem } from '../types/api';

interface UrlTableProps {
  urls: UrlListItem[];
  onDelete: (alias: string) => void;
}

export function UrlTable({ urls, onDelete }: UrlTableProps) {
  if (urls.length === 0) {
    return (
      <div className="empty-state">
        <p>No shortened URLs yet.</p>
      </div>
    );
  }

  return (
    <div className="url-table-wrapper">
      <table className="url-table" aria-label="Shortened URL list">
        <thead>
          <tr>
            <th scope="col">Alias</th>
            <th scope="col">Original URL</th>
            <th scope="col">Short URL</th>
            <th scope="col" aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {urls.map(({ alias, fullUrl, shortUrl }) => (
            <tr key={alias}>
              <td>{alias}</td>
              <td>
                <span className="full-url" title={fullUrl}>{fullUrl}</span>
              </td>
              <td>
                <a
                  href={shortUrl}
                  className="short-url-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  {shortUrl}
                </a>
              </td>
              <td className="actions-cell">
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => onDelete(alias)}
                  aria-label={`Delete ${alias}`}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
