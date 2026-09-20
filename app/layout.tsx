import type { Metadata } from 'next';
import './global.css';

export const metadata: Metadata = {
  title: 'KulkasAI',
  description: 'Foto sisa bahan di kulkasmu, dapatkan resep instannya.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-gray-50 min-h-screen text-gray-900">
        {children}
      </body>
    </html>
  );
}