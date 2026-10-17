import { useState } from "react";

export default function ValutaConverter() {
  const [importoDaConvertire, setImportoDaConvertire] = useState("");
  const [importoConvertito, setImportoConvertito] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const endpoint = `https://api.frankfurter.dev/v1/latest?amount=${importoDaConvertire || 1}&from=EUR&
  to=USD`;
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setShowOutput(false);
    try {
      setIsLoading(true);
      const response = await fetch(endpoint);
      if (!response.ok)
        throw new Error("ERROR FETCHIND ROUR DATA, PLEASE TRY LATER");

      const data = await response.json();
      setImportoConvertito(data.rates.USD);
      setShowOutput(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section>
      {isLoading && (
        <div className="d-flex justify-content-center align-items-center py-5 gap-3">
          <div className="spinner-border text-primary" role="status"></div>
          <span>Loading recipes...</span>
        </div>
      )}

      {error && !isLoading && (
        <div className="alert alert-danger my-4" role="alert">
          {error}
        </div>
      )}

      {!isLoading && (
        <div>
          <form
            onSubmit={handleSubmit}
            className="d-flex justify-content-center gap-2"
            method="post"
          >
            <input
              onChange={(e) => {
                setImportoDaConvertire(e.target.value);
              }}
              onKeyDown={(e) => {
                // Se l'utente preme il tasto "-" o "e", blocca l'azione
                if (e.key === "-" || e.key === "e") {
                  e.preventDefault();
                }
              }}
              value={importoDaConvertire}
              min={1}
              type="number"
            />
            <button className="btn btn-info">CONVERTI</button>
          </form>
          {showOutput && (
            <div className="my-5 d-flex justify-content-center">
              <div className="card w-50 text-center d-flex align-items-center">
                <div className="card-body">
                  <p>{`importo in euro: ${importoDaConvertire} / importo in dollari: ${importoConvertito}`}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
