"use client";

import { useState, useEffect } from "react";
import { Recipe, toggleStarRecipe, isRecipeStarred } from "@/lib/storage";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [starred, setStarred] = useState(false);

  useEffect(() => {
    setStarred(isRecipeStarred(recipe.id));
  }, [recipe.id]);

  const handleToggleStar = () => {
    const newState = toggleStarRecipe(recipe);
    setStarred(newState);
  };

  return (
    <div className="border rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg text-gray-800">{recipe.title}</h3>
          <button
            onClick={handleToggleStar}
            className="text-2xl transition-transform active:scale-125"
            title={starred ? "Hapus dari Favorit" : "Simpan ke Favorit"}
          >
            {starred ? "⭐" : "☆"}
          </button>
        </div>

        <div className="flex gap-2 mb-4 text-xs font-medium">
          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
            ⏱️ {recipe.prep_time_minutes} Menit
          </span>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            🍳 {recipe.cooking_method}
          </span>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Bahan Digunakan
          </p>
          <p className="text-sm text-gray-700">{recipe.ingredients_used.join(", ")}</p>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Langkah Memasak
          </p>
          <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1.5">
            {recipe.steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      {recipe.kos_tip && (
        <div className="mt-4 p-3 bg-emerald-50 rounded-xl text-xs text-emerald-800 border border-emerald-100">
          💡 <strong>Tip Anak Kos:</strong> {recipe.kos_tip}
        </div>
      )}
    </div>
  );
}