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


type IconProps = { className?: string };

const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function HeartIcon({
  filled = false,
  tone = 'peach',
  className,
}: IconProps & { filled?: boolean; tone?: 'peach' | 'blue' }) {
  const fill = tone === 'peach' ? 'var(--peach)' : 'var(--royal)';
  const stroke = tone === 'peach' ? 'var(--peach-deep)' : 'var(--royal)';
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
        fill={filled ? fill : 'none'}
        stroke={filled ? stroke : 'currentColor'}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      {filled && (
        <path
          d="M6.2 8.6c.4-1.2 1.4-1.9 2.6-1.9"
          fill="none"
          stroke="#fff"
          strokeOpacity={0.75}
          strokeWidth={1.8}
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function ClockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity={0.14} stroke="currentColor" strokeWidth={2.2} />
      <path d="M12 7.5V12l3 2" {...strokeProps} />
    </svg>
  );
}

function CartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M6.2 7.5h13.3l-1.4 6.6a2 2 0 0 1-2 1.6H9.6a2 2 0 0 1-2-1.6L6.2 7.5Z" fill="currentColor" fillOpacity={0.16} stroke="currentColor" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M3 4h2l1.2 3.5" {...strokeProps} />
      <circle cx="9.8" cy="19.2" r="1.5" fill="currentColor" />
      <circle cx="16.2" cy="19.2" r="1.5" fill="currentColor" />
    </svg>
  );
}

function ChefHatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <g fill="currentColor" fillOpacity={0.16} stroke="currentColor" strokeWidth={2.2} strokeLinejoin="round">
        <path d="M7 14.5A4.5 4.5 0 0 1 6.6 5.6 4.5 4.5 0 0 1 12 3.5a4.5 4.5 0 0 1 5.4 2.1A4.5 4.5 0 0 1 17 14.5" />
        <rect x="7" y="14.5" width="10" height="6" rx="2" />
      </g>
    </svg>
  );
}

function BulbIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.1V17h5v-1.1c0-.8.4-1.5 1.1-2.1A6 6 0 0 0 12 3Z"
        fill="currentColor"
        fillOpacity={0.16}
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <path d="M10 20.5h4" {...strokeProps} />
    </svg>
  );
}

function CameraIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M8.6 6.5 9.8 4.5h4.4l1.2 2H18a3 3 0 0 1 3 3V17a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V9.5a3 3 0 0 1 3-3h2.6Z"
        fill="currentColor"
        fillOpacity={0.16}
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13.2" r="3.2" fill="none" stroke="currentColor" strokeWidth={2.2} />
    </svg>
  );
}

function SpinnerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity={0.25} strokeWidth={3.5} />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" />
    </svg>
  );
}

function ArrowLeftIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M14.5 6 8.5 12l6 6" {...strokeProps} strokeWidth={2.8} />
    </svg>
  );
}

function CheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M5.5 12.5 10 17l8.5-9.5" {...strokeProps} strokeWidth={3.2} />
    </svg>
  );
}

function AlertIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity={0.16} stroke="currentColor" strokeWidth={2.2} />
      <path d="M12 7.5v5" {...strokeProps} strokeWidth={2.6} />
      <circle cx="12" cy="16.3" r="1.3" fill="currentColor" />
    </svg>
  );
}

function SunIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" fill="currentColor" fillOpacity={0.25} stroke="currentColor" strokeWidth={2.2} />
      <path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" {...strokeProps} />
    </svg>
  );
}

function MoonIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
        fill="currentColor"
        fillOpacity={0.2}
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Ilustrasi kulkas clay: pengganti "ikon brand" sekaligus elemen utama di hero */
function FridgeIllustration({ className, uid }: IconProps & { uid: string }) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${uid}-body`} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#3A58D0" />
          <stop offset="0.45" stopColor="#002395" />
          <stop offset="1" stopColor="#00156B" />
        </linearGradient>
        <linearGradient id={`${uid}-peach`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFD08A" />
          <stop offset="1" stopColor="#FFB042" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="132" rx="36" ry="6" fill="#002395" opacity={0.18} />
      <rect x="24" y="8" width="72" height="118" rx="26" fill={`url(#${uid}-body)`} />
      <rect x="24" y="8" width="72" height="118" rx="26" fill="none" stroke="#fff" strokeOpacity={0.22} strokeWidth={2} />
      <path d="M33 54h54" stroke="#fff" strokeOpacity={0.28} strokeWidth={4} strokeLinecap="round" />
      <rect x="76" y="24" width="7" height="20" rx="3.5" fill={`url(#${uid}-peach)`} />
      <rect x="76" y="66" width="7" height="34" rx="3.5" fill={`url(#${uid}-peach)`} />
      <ellipse cx="42" cy="28" rx="8" ry="14" fill="#fff" opacity={0.22} transform="rotate(12 42 28)" />
    </svg>
  );
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
    <div className="min-h-screen bg-cream text-ink pb-16">
      {/* Header & Navigation */}
      <header className="on-blue sticky top-0 z-10 px-3 pt-3">
        <div className="clay-blue mx-auto flex h-16 max-w-4xl items-center justify-between rounded-full px-3 sm:px-4">
          <button
            type="button"
            onClick={() => setShowOnlyFavorites(false)}
            className="clay-press flex items-center gap-2.5 rounded-full py-1 pr-3 text-left"
          >
            <span className="clay-sm clay-xs grid h-10 w-10 place-items-center rounded-full bg-surface">
              <FridgeIllustration uid="nav" className="h-7 w-7" />
            </span>
            <span className="font-display text-xl font-semibold tracking-wide text-white">
              KulkasAI
            </span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleDarkMode}
              aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="clay-sm clay-press grid h-11 w-11 place-items-center rounded-full bg-surface"
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5 text-peach-deep" />
              ) : (
                <MoonIcon className="h-5 w-5 text-royal" />
              )}
            </button>

            {/* Tombol Favorit */}
            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              aria-pressed={showOnlyFavorites}
              className={`clay-press flex h-11 items-center gap-2 rounded-full pl-3.5 pr-4 text-sm font-bold ${
                showOnlyFavorites
                  ? 'clay-peach'
                  : 'clay-sm bg-surface text-heading'
              }`}
            >
              <HeartIcon
                filled
                tone={showOnlyFavorites ? 'blue' : 'peach'}
                className="h-5 w-5"
              />
              <span>Favorit ({starredIds.length})</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-10 px-4 pt-10">
        {!showOnlyFavorites && (
          <section className="clay space-y-5 px-6 py-10 text-center sm:px-10">
            <FridgeIllustration uid="hero" className="mx-auto h-28 w-24" />

            <h1 className="font-display text-3xl font-semibold leading-tight text-heading">
              Ada bahan apa saja di kulkasmu?
            </h1>
            <p className="mx-auto max-w-md text-base text-ink-soft">
              Unggah foto bahan makanan yang tersisa, KulkasAI akan meracik resep lezat dan praktis secara instan.
            </p>

            <div className="flex flex-col items-center pt-2">
              <label className="clay-field clay-well clay-press flex w-full max-w-sm items-center justify-center gap-3 border-2 border-dashed border-royal/30 px-5 py-4 text-sm font-bold text-heading">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="sr-only"
                />
                <span className="clay-peach clay-xs grid h-11 w-11 place-items-center rounded-full">
                  <CameraIcon className="h-5 w-5" />
                </span>
                <span>{imageBase64 ? 'Ganti foto' : 'Pilih foto bahan'}</span>
              </label>
            </div>

            {imageBase64 && (
              <div className="mx-auto mt-4 max-w-md space-y-5">
                <div className="clay-sm rounded-[1.75rem] p-2">
                  <img
                    src={imageBase64}
                    alt="Preview"
                    className="h-48 w-full rounded-[1.35rem] object-cover"
                  />
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="clay-peach clay-press flex w-full items-center justify-center gap-2.5 rounded-full py-4 font-display text-lg font-semibold disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <SpinnerIcon className="h-5 w-5 animate-spin" /> Memproses Bahan...
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
          <div
            role="alert"
            className="clay-sm flex items-center justify-center gap-2.5 bg-danger p-4 text-center text-sm font-semibold text-danger-ink"
          >
            <AlertIcon className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}

        {/* Bahan Terdeteksi */}
        {!showOnlyFavorites && result && (
          <section className="clay space-y-4 p-6">
            <h2 className="font-display text-lg font-semibold text-heading">
              Bahan yang Terdeteksi
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {result.detectedIngredients.map((ingredient: string, idx: number) => (
                <span
                  key={idx}
                  className="clay-chip bg-royal-soft px-4 py-1.5 text-sm font-semibold text-royal-soft-ink"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Kartu Resep */}
        {(recipesToDisplay.length > 0 || showOnlyFavorites) && (
          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-3 font-display text-2xl font-semibold text-heading">
                <span className="clay-peach clay-xs grid h-10 w-10 place-items-center rounded-full">
                  {showOnlyFavorites ? (
                    <HeartIcon filled tone="blue" className="h-5 w-5" />
                  ) : (
                    <BulbIcon className="h-5 w-5" />
                  )}
                </span>
                {showOnlyFavorites ? 'Resep Favorit Tersimpan' : 'Rekomendasi Resep Untukmu'}
              </h2>
              {showOnlyFavorites && (
                <button
                  onClick={() => setShowOnlyFavorites(false)}
                  className="clay-sm clay-press flex items-center gap-1.5 rounded-full bg-surface px-4 py-2 text-xs font-bold text-heading"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Kembali ke Pencarian
                </button>
              )}
            </div>

            {recipesToDisplay.length === 0 && showOnlyFavorites ? (
              <div className="clay-well space-y-3 px-6 py-14 text-center">
                <HeartIcon className="mx-auto h-10 w-10 text-ink-soft" />
                <p className="text-sm font-semibold text-heading">
                  Belum ada resep favorit yang disimpan.
                </p>
                <p className="text-sm text-ink-soft">
                  Ketuk ikon hati pada sebuah resep untuk menyimpannya di sini.
                </p>
              </div>
            ) : (
              <div className="grid gap-7 md:grid-cols-2">
                {recipesToDisplay.map((recipe: Recipe, rIdx: number) => {
                  const isStarred = starredIds.includes(recipe.id);

                  return (
                    <article
                      key={recipe.id || rIdx}
                      className="clay relative flex flex-col space-y-4 p-6"
                    >
                      <button
                        onClick={() => handleToggleFavorite(recipe)}
                        title={isStarred ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
                        aria-label={isStarred ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
                        aria-pressed={isStarred}
                        className="clay-sm clay-press absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-surface text-ink-soft"
                      >
                        <HeartIcon filled={isStarred} className="h-5 w-5" />
                      </button>

                      <h3 className="pr-14 font-display text-xl font-semibold leading-snug text-heading">
                        {recipe.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="clay-chip flex items-center gap-1.5 whitespace-nowrap bg-royal-soft px-3 py-1 text-xs font-bold text-royal-soft-ink">
                          <ClockIcon className="h-4 w-4" />
                          {recipe.time}
                        </span>
                        <span className="clay-chip bg-peach-soft px-3 py-1 text-xs font-bold text-peach-soft-ink">
                          {recipe.difficulty}
                        </span>
                      </div>

                      {recipe.missingIngredients?.length > 0 && (
                        <div className="clay-well space-y-2 p-4 text-sm text-ink">
                          <span className="flex items-center gap-2 font-bold text-heading">
                            <span className="grid h-7 w-7 place-items-center rounded-full bg-peach-soft text-peach-soft-ink">
                              <CartIcon className="h-4 w-4" />
                            </span>
                            Perlu Ditambah
                          </span>
                          <p className="text-ink-soft">{recipe.missingIngredients.join(', ')}</p>
                        </div>
                      )}

                      <div className="space-y-2.5 pt-1">
                        <span className="flex items-center gap-2 text-sm font-bold text-heading">
                          <span className="grid h-7 w-7 place-items-center rounded-full bg-royal-soft text-royal-soft-ink">
                            <ChefHatIcon className="h-4 w-4" />
                          </span>
                          Langkah Memasak
                        </span>
                        <ul className="space-y-2 text-sm">
                          {recipe.steps.map((step: string, sIdx: number) => {
                            const stepKey = `${recipe.id}-${sIdx}`;
                            const isChecked = !!checkedSteps[stepKey];

                            return (
                              <li key={sIdx}>
                                <label
                                  className={`flex cursor-pointer items-start gap-3 rounded-2xl p-3 transition-colors ${
                                    isChecked
                                      ? 'clay-well clay-xs text-ink-soft line-through'
                                      : 'text-ink hover:bg-royal-soft'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => toggleStep(stepKey)}
                                    className="peer sr-only"
                                  />
                                  <span
                                    className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus ${
                                      isChecked
                                        ? 'clay-blue clay-xs'
                                        : 'clay-well clay-xs bg-surface'
                                    }`}
                                  >
                                    {isChecked && <CheckIcon className="h-4 w-4 text-white" />}
                                  </span>
                                  <span className="leading-relaxed">{step}</span>
                                </label>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </article>
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