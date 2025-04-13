import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Assuming shadcn Button is here

export default function HomePage() {
  const publicDir = path.join(process.cwd(), './public/spanish');
  let categoryFiles: string[] = [];
  try {
    categoryFiles = fs.readdirSync(publicDir)
      .filter(file => file.endsWith('.txt')) // Only include .txt files
      .sort(); // Sort alphabetically
  } catch (error) {
    console.error("Error reading directory:", error);
    // Handle the error appropriately, maybe show a message to the user
    return <p>Error loading categories. Please check the server logs.</p>;
  }

  const categories = categoryFiles.map(file => path.basename(file, '.txt'));

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-sky-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center text-slate-800 dark:text-slate-100">
        Learn Spanish
      </h1>
      <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 text-center">
        Select a topic below to start practicing vocabulary.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-6 max-w-6xl w-full items-stretch">
        {categories.map((category) => (
          <Button
            key={category}
            variant="outline"
            className="text-lg p-4 transition-transform transform hover:scale-105 hover:shadow-lg dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-50 w-full h-full flex items-center justify-center text-center whitespace-normal break-words"
            asChild // Use asChild to make the Button act as a Link
          >
            <Link href={`/learn/list/${encodeURIComponent(category)}`} title={category} className="whitespace-normal break-words">
              {category}
            </Link>
          </Button>
        ))}
      </div>
    </main>
  );
}
