import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY belum dipasang di .env.local' },
        { status: 500 }
      );
    }

    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: 'Gambar tidak boleh kosong' }, { status: 400 });
    }

    const base64Data = image.includes(',') ? image.split(',')[1] : image;
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      Analisis gambar bahan makanan ini. Berikan keluaran berupa data JSON murni dengan struktur berikut:
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

    const modelName = 'gemini-3.6-flash';
    let responseText: string | null = null;
    let lastError: any = null;

    // Lakukan percobaan ulang (retry) hingga 3 kali jika server mengalami lonjakan beban singkat (503)
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await ai.models.generateContent({
          model: modelName,
          contents: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
            prompt,
          ],
          config: { responseMimeType: 'application/json' },
        });

        if (res?.text) {
          responseText = res.text;
          break; 
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[Percobaan ${attempt}/3] ${modelName} sibuk/error. Mencoba lagi...`);
        if (attempt < 3) {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Jedah 1 detik
        }
      }
    }

    if (!responseText) {
      throw lastError || new Error('Gagal terhubung ke model AI.');
    }

    const parsedData = JSON.parse(responseText);
    return NextResponse.json({ result: parsedData });

  } catch (error: any) {
    console.error('BACKEND ERROR DETAIL:', error);

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