export interface Recipe {
  id: string;
  title: string;
  cooking_method: string;
  prep_time_minutes: number;
  difficulty: string;
  ingredients_used: string[];
  pantry_used: string[];
  steps: string[];
  kos_tip: string;
}

const FAVORITES_KEY = "kos_chef_starred_recipes";

// Mengambil daftar resep berbintang dari LocalStorage
export const getStarredRecipes = (): Recipe[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Menambah / menghapus tanda favorit
export const toggleStarRecipe = (recipe: Recipe): boolean => {
  const favorites = getStarredRecipes();
  const existsIndex = favorites.findIndex((item) => item.id === recipe.id);

  let updated: Recipe[];
  let isStarred: boolean;

  if (existsIndex >= 0) {
    updated = favorites.filter((item) => item.id !== recipe.id);
    isStarred = false;
  } else {
    updated = [...favorites, recipe];
    isStarred = true;
  }

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return isStarred;
};

// Cek apakah resep sudah ditandai sebagai favorit
export const isRecipeStarred = (id: string): boolean => {
  const favorites = getStarredRecipes();
  return favorites.some((item) => item.id === id);
};

export function saveFavoriteRecipe(recipe: any) {
  if (typeof window !== 'undefined') {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    favorites.push(recipe);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}