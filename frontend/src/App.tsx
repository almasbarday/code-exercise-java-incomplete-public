import { useUrlShortener } from './hooks/useUrlShortener';
import { ShortenForm } from './components/ShortenForm';
import { ResultBanner } from './components/ResultBanner';
import { UrlTable } from './components/UrlTable';

export default function App() {
  const {
    urls,
    loading,
    error,
    lastCreated,
    currentPage,
    pageSize,
    totalCount,
    hasPreviousPage,
    hasNextPage,
    previousPage,
    nextPage,
    shorten,
    deleteUrl,
    clearLastCreated,
  } = useUrlShortener();

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const previousDisabled = loading || currentPage <= 0 || totalPages <= 1;
  const nextDisabled = loading || currentPage >= totalPages - 1 || totalPages <= 1;

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__inner">
          <div className="logo">
            <span className="logo__mark" aria-hidden="true">⌁</span>
            <span className="logo__name">Snip</span>
          </div>
          <p className="tagline">Long URLs, made short.</p>
        </div>
      </header>

      <main className="app-main">
        <section className="card shorten-card" aria-labelledby="shorten-heading">
          <h2 id="shorten-heading" className="card__title">
            Shorten a URL
          </h2>
          <ShortenForm onSubmit={shorten} />
        </section>

        {lastCreated && (
          <ResultBanner result={lastCreated} onDismiss={clearLastCreated} />
        )}

        {error && (
          <div className="banner banner--error" role="alert">
            <strong>Error:</strong> {error}
          </div>
        )}

        <section className="card" aria-labelledby="list-heading">
          <h2 id="list-heading" className="card__title">
            All shortened URLs
            {urls.length > 0 && (
              <span className="badge">{totalCount}</span>
            )}
          </h2>

          {loading ? (
            <div className="loading" aria-live="polite" aria-busy="true">
              Loading…
            </div>
          ) : (
            <>
              <UrlTable urls={urls} onDelete={deleteUrl} />

              {totalCount > pageSize && (
                <div className="pagination" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    disabled={previousDisabled}
                    aria-disabled={previousDisabled}
                    onClick={() => {
                      if (!previousDisabled) {
                        void previousPage();
                      }
                    }}
                  >
                    Previous
                  </button>

                  <span aria-live="polite">
                    Page {currentPage + 1} of {totalPages}
                  </span>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    disabled={nextDisabled}
                    aria-disabled={nextDisabled}
                    onClick={() => {
                      if (!nextDisabled) {
                        void nextPage();
                      }
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>Snip URL Shortener</p>
      </footer>
    </div>
  );
}
