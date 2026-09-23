import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const rawKeys = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY;

    if (!rawKeys) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEYS belum dipasang di .env.local' },
        { status: 500 }
      );
    }

    const apiKeys = rawKeys.split(',').map((k) => k.trim()).filter(Boolean);

    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: 'Gambar tidak boleh kosong' },
        { status: 400 }
      );
    }

    const base64Data = image.includes(',') ? image.split(',')[1] : image;

    const randomSeed = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const prompt = `
      [Request ID: ${randomSeed}]
      Analisis gambar bahan makanan ini.

      SANGAT PENTING: Berikan 3 variasi resep yang BEDA, KREATIF, dan TIDAK MONOTON. Sertakan takaran bumbu yang sesuai.
      Hindari memberikan resep pasaran yang terlalu standar. Cobalah memvariasikan gaya memasak (contoh: 1 menu tumis/gulai, 1 menu olahan goreng/krispi, dan 1 menu kreasi unik ala anak kos).

      Kembalikan respons HANYA dalam bentuk JSON valid dengan format persis seperti ini:
      {
        "detectedIngredients": ["bahan1", "bahan2"],
        "recipes": [
          {
            "id": "1",
            "title": "Nama Resep",
            "time": "15 menit",
            "difficulty": "Mudah/Sedang",
            "missingIngredients": ["bahan tambahan"],
            "steps": ["Langkah 1", "Langkah 2"]
          }
        ]
      }
      Pastikan resep sangat cocok untuk anak kos dengan alat sederhana (panci/wajan/rice cooker).
    `;

    let responseText: string | null = null;
    let lastError: any = null;

    // Lakukan percobaan ulang (retry) hingga 3 kali
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const selectedKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
        const ai = new GoogleGenAI({ apiKey: selectedKey });

        const res = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: [
            prompt,
            { 
              inlineData: { 
                mimeType: 'image/jpeg', 
                data: base64Data 
              }, 
            },
          ],
          config: {
            temperature: 1.0,
            topP: 0.95,
          },
        });

        if (res?.text) {
          responseText = res.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[Percobaan ${attempt}/3] AI sibuk/error. Mencoba lagi...`);
        if (attempt < 3) {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Jeda 1 detik
        }
      }
    }

    if (!responseText) {
      throw lastError || new Error('Gagal terhubung ke model AI setelah 3 kali percobaan.');
    }

    const cleanedText = responseText.replace(/```json|```/g, '').trim();
    const parsedData = JSON.parse(cleanedText);

    return NextResponse.json({ result: parsedData });

  } catch (error: any) {
    console.error('BACKEND ERROR DETAIL:', error);

    const isRateLimit =
      error?.status === 429 ||
      error?.message?.includes('429') ||
      error?.message?.includes('Quota exceeded') ||
      error?.message?.includes('RESOURCE_EXHAUSTED');

    if (isRateLimit) {
      return NextResponse.json(
        { error: 'Batas kuota pencarian tercapai. Silakan tunggu 1–2 menit sebelum mencoba lagi.' },
        { status: 429 }
      );
    }

    const is503 =
      error?.status === 503 ||
      error?.message?.includes('503') ||
      error?.message?.includes('high demand');

    if (is503) {
      return NextResponse.json(
        { error: 'Server AI sedang padat pengunjung. Silakan klik "Cari Resep" kembali dalam beberapa detik.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: error?.message || 'Terjadi kesalahan pada server.' },
      { status: 500 }
    );
  }
}