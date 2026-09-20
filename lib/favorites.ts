export interface Recipe {
  id: string;
  title: string;
  time: string;
  difficulty: string;
  missingIngredients: string[];
  steps: string[];
}

const FAVORITES_KEY = 'kulkas_ai_favorites';

// 1. Ambil semua resep favorit dari localStorage
export const getStarredRecipes = (): Recipe[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Gagal mengambil data favorit:', error);
    return [];
  }
};

// 2. Cek apakah resep sudah difavoritkan berdasarkan ID
export const isRecipeStarred = (id: string): boolean => {
  const favorites = getStarredRecipes();
  return favorites.some((item) => item.id === id);
};

// 3. Simpan resep ke favorit (cegah duplikat)
export const saveFavoriteRecipe = (recipe: Recipe) => {
  if (typeof window === 'undefined') return;
  const favorites = getStarredRecipes();
  if (!favorites.some((item) => item.id === recipe.id)) {
    favorites.push(recipe);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
};

// 4. Hapus resep dari favorit
export const removeFavoriteRecipe = (id: string) => {
  if (typeof window === 'undefined') return;
  const favorites = getStarredRecipes().filter((item) => item.id !== id);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

// 5. Toggle (simpan jika belum ada, hapus jika sudah ada)
export const toggleFavoriteRecipe = (recipe: Recipe): boolean => {
  if (isRecipeStarred(recipe.id)) {
    removeFavoriteRecipe(recipe.id);
    return false; // tidak difavoritkan
  } else {
    saveFavoriteRecipe(recipe);
    return true; // difavoritkan
  }
};