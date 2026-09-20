'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import {
  Recipe,
  getStarredRecipes,
  toggleFavoriteRecipe,
} from '@/lib/favorites';

interface AnalysisResult {
  detectedIngredients: string[];
  recipes: Recipe[];
}

export default function Home() {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<{ [key: string]: boolean }>({});

  const [starredIds, setStarredIds] = useState<string[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Inisialisasi Favorit
    const saved = getStarredRecipes();
    setStarredIds(saved.map((r: Recipe) => r.id));

    // Inisialisasi darkmode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const isCurrentlyDark = document.documentElement.classList.contains('dark');

    if (isCurrentlyDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result as string);
      setResult(null);
      setError(null);
      setCheckedSteps({});
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!imageBase64) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageBase64 }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal menganalisis gambar');
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memproses gambar');
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = (stepKey: string) => {
    setCheckedSteps((prev) => ({ ...prev, [stepKey]: !prev[stepKey] }));
  };

  const handleToggleFavorite = (recipe: Recipe) => {
    const isNowStarred = toggleFavoriteRecipe(recipe);
    if (isNowStarred) {
      setStarredIds((prev) => [...prev, recipe.id]);
    } else {
      setStarredIds((prev) => prev.filter((id) => id !== recipe.id));
    }
  };

  const recipesToDisplay: Recipe[] = showOnlyFavorites
    ? getStarredRecipes()
    : result?.recipes || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 pb-12">
      {/* Header & Navigation */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setShowOnlyFavorites(false)}
          >
            <span className="font-bold text-xl bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              KulkasAI
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2.5 rounded-xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-slate-800/70 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center"
            >
              {darkMode ? (
                /* Icon Matahari Transparan (Light Mode) */
                <svg
                  className="w-4 h-4 text-amber-500 fill-amber-500/10 transition-transform duration-300 rotate-0 dark:rotate-90"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              ) : (
                /* Icon Bulan Transparan (Dark Mode) */
                <svg
                  className="w-4 h-4 text-indigo-600 dark:text-indigo-400 fill-indigo-500/10 transition-transform duration-300 rotate-0 dark:-rotate-90"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </button>

            {/* Tombol Favorit */}
            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 border ${
                showOnlyFavorites
                  ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                  : 'bg-white/40 dark:bg-slate-800/40 backdrop-blur-md text-slate-700 dark:text-slate-200 border-slate-200/60 dark:border-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-800/70'
              }`}
            >
              <span>❤️</span>
              <span>Favorit ({starredIds.length})</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-8 space-y-8">
        {!showOnlyFavorites && (
          <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 text-center space-y-4 transition-colors">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Ada bahan apa saja di kulkasmu?
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Unggah foto bahan makanan yang tersisa, KulkasAI akan meracik resep lezat dan praktis secara instan.
            </p>

            <div className="flex flex-col items-center justify-center pt-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full max-w-xs text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-500 file:text-white hover:file:bg-emerald-600 cursor-pointer"
              />
            </div>

            {imageBase64 && (
              <div className="mt-4 space-y-4 max-w-md mx-auto">
                <img
                  src={imageBase64}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner"
                />
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition shadow-sm hover:shadow disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">⏳</span> Memproses Bahan...
                    </>
                  ) : (
                    'Analisis & Cari Resep'
                  )}
                </button>
              </div>
            )}
          </section>
        )}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-200 dark:border-red-900 text-center">
            {error}
          </div>
        )}

        {/* Bahan Terdeteksi */}
        {!showOnlyFavorites && result && (
          <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-3 transition-colors">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Bahan yang Terdeteksi:
            </h2>
            <div className="flex flex-wrap gap-2">
              {result.detectedIngredients.map((ingredient: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 font-medium text-xs rounded-full border border-teal-200 dark:border-teal-800"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Kartu Resep */}
        {(recipesToDisplay.length > 0 || showOnlyFavorites) && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {showOnlyFavorites ? 'Resep Favorit Tersimpan' : '💡 Rekomendasi Resep Untukmu'}
              </h2>
              {showOnlyFavorites && (
                <button
                  onClick={() => setShowOnlyFavorites(false)}
                  className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                >
                  ← Kembali ke Pencarian
                </button>
              )}
            </div>

            {recipesToDisplay.length === 0 && showOnlyFavorites ? (
              <div className="text-center py-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 space-y-2">
                <p className="font-medium text-sm">Belum ada resep favorit yang disimpan.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {recipesToDisplay.map((recipe: Recipe, rIdx: number) => {
                  const isStarred = starredIds.includes(recipe.id);

                  return (
                    <div
                      key={recipe.id || rIdx}
                      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col justify-between space-y-4 hover:border-emerald-300 dark:hover:border-emerald-600 transition relative"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-2 pr-6">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 leading-snug">
                            {recipe.title}
                          </h3>
                        </div>

                        <button
                          onClick={() => handleToggleFavorite(recipe)}
                          title={isStarred ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
                          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        >
                          <span className="text-xl">{isStarred ? '❤️' : '🤍'}</span>
                        </button>

                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md whitespace-nowrap font-medium">
                            ⏱️ {recipe.time}
                          </span>
                          <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 rounded border border-amber-200 dark:border-amber-800">
                            {recipe.difficulty}
                          </span>
                        </div>

                        {recipe.missingIngredients?.length > 0 && (
                          <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                            <span className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                              🛒 Perlu Ditambah:
                            </span>
                            {recipe.missingIngredients.join(', ')}
                          </div>
                        )}

                        <div className="space-y-2 pt-2">
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                            👨‍🍳 Langkah Memasak:
                          </span>
                          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                            {recipe.steps.map((step: string, sIdx: number) => {
                              const stepKey = `${recipe.id}-${sIdx}`;
                              const isChecked = checkedSteps[stepKey];

                              return (
                                <li
                                  key={sIdx}
                                  onClick={() => toggleStep(stepKey)}
                                  className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition ${
                                    isChecked
                                      ? 'bg-emerald-50 dark:bg-emerald-950/30 text-slate-400 dark:text-slate-500 line-through'
                                      : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={!!isChecked}
                                    onChange={() => {}}
                                    className="mt-0.5 accent-emerald-600 dark:accent-emerald-400 rounded cursor-pointer"
                                  />
                                  <span>{step}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}