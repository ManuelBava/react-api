import { useState, useEffect } from "react";

export default function RecipesList() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getRecipes() {
      try {
        setIsLoading(true);

        const response = await fetch("https://dummyjson.com/recipes");

        if (!response.ok) {
          const e = new Error("Error fetching your data, please try later");
          console.log(e);
          throw e;
        }

        const data = await response.json();

        // Precarica tutte le immagini prima di mostrare le card
        await Promise.all(
          data.recipes.map((recipe) => {
            return new Promise((resolve) => {
              if (!recipe.image) return resolve();
              // questa costante non usata  serve a fare il "pre-caricamento" (preloading)
              // delle immagini nella cache del browser. Non importa se l'immagine è visibile a schermo o no: per il browser impostare un .src significa "scarica subito questa risorsa".
              const img = new Image();
              img.src = recipe.image;
              img.onload = resolve;
              img.onerror = resolve; // se una singola immagine fallisce, non blocca l'applicazione
            });
          }),
        );
        // SPIEGAZIONE DOPO IL PRE CARICAMENTO DELLE IMMAGINI
        // subito dopo, quando il componente React finisce il caricamento e renderizza le card, il browser noterà che ha già scaricato quell'immagine pochi istanti prima e la prenderà direttamente dalla memoria cache.

        setRecipes(data.recipes);
      } catch (error) {
        console.log(error.message);

        setError(error.message);
      } finally {
        // blocco di codice che verrà eseguito sia in caso di errore che viceversa
        setIsLoading(false);
      }
    }
    getRecipes();
  }, []);

  return (
    <section className="container my-4">
      <h2 className="mb-4 text-center">Recipes List</h2>

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

      {!isLoading && !error && (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 my-3">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="col">
              <div className="card h-100 shadow-sm">
                <img
                  className="card-img-top recipe-card-img"
                  src={recipe.image}
                  alt={recipe.name}
                />
                <div className="card-body d-flex flex-column justify-content-between">
                  <h3 className="h6 card-title mb-3">{recipe.name}</h3>
                  <span className="badge bg-light text-dark align-self-start border">
                    {recipe.caloriesPerServing} Calorie per porzione
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
