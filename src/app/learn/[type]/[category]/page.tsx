import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getCategoryWords } from '@/lib/words'; // Import the utility
import WordList from '@/components/learn/WordList'; // Import the view component
import FlashcardWithAnswers from '@/components/learn/FlashcardWithAnswers'; // Import placeholder
import FlashcardWithoutAnswers from '@/components/learn/FlashcardWithoutAnswers'; // Import placeholder

interface LearnPageProps {
  params: {
    type: string;
    category: string; // Still encoded here
  };
}

// Removed WordPair interface (now in words.ts)
// Removed getCategoryWords function (now in words.ts)

export default function LearnPage({ params }: LearnPageProps) {
  const { type, category: encodedCategory } = params;
  const category = decodeURIComponent(encodedCategory);

  // Fetch words using the utility function
  const words = getCategoryWords(category);

  // Handle case where file not found or is empty/invalid
  if (!words) {
    // Maybe show a more specific message instead of just 404?
    // For now, 404 is fine.
    notFound();
  }

  // Determine which component to render based on type
  let contentComponent;
  switch (type) {
    case 'list':
      contentComponent = <WordList category={category} words={words} />;
      break;
    case 'flashcard-with-answers':
      contentComponent = <FlashcardWithAnswers category={category} words={words} />;
      break;
    case 'flashcard-without-answers':
      contentComponent = <FlashcardWithoutAnswers category={category} words={words} />;
      break;
    default:
      // Handle unknown type - show 404 or a specific error message
      notFound();
      // Alternatively, render an error component:
      // contentComponent = <p>Unknown learning type: {type}</p>; 
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-8 bg-gradient-to-br from-sky-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      {/* Apply similar responsive width/alignment to the Back button container */}
      <div className="w-full max-w-xs sm:max-w-6xl flex items-stretch sm:justify-start mb-4">
        <Button asChild variant="outline" className="w-full">
          <Link href="/">← Back to Categories</Link>
        </Button>
      </div>

      <h3 className="text-4xl sm:text-5xl font-semibold text-slate-800 dark:text-slate-100 mb-4">{category}</h3>

      {/* Navigation between types */}
      <div className="mb-8 flex flex-col items-stretch sm:flex-row sm:justify-center gap-2 sm:gap-4 w-full max-w-xs sm:max-w-none"> {/* Changed flex classes and added width constraints */}
        <Button asChild variant={type === 'list' ? 'default' : 'outline'}>
          <Link href={`/learn/list/${encodedCategory}`}>List</Link>
        </Button>
        <Button asChild variant={type === 'flashcard-with-answers' ? 'default' : 'outline'}>
          <Link href={`/learn/flashcard-with-answers/${encodedCategory}`}>Flashcards (Answers)</Link>
        </Button>
        <Button asChild variant={type === 'flashcard-without-answers' ? 'default' : 'outline'}>
          <Link href={`/learn/flashcard-without-answers/${encodedCategory}`}>Flashcards (Test)</Link>
        </Button>
      </div>

      {/* Render the selected content component */}
      {contentComponent}
    </main>
  );
}

// Optional: Re-enable generateStaticParams if needed, using the utility function
// import { getCategoryWords } from '@/lib/words';
// import path from 'path';
// import fs from 'fs';

// export async function generateStaticParams() {
//   const publicDir = path.join(process.cwd(), './public/spanish');
//   let categoryFiles: string[] = [];
//   try {
//     categoryFiles = fs.readdirSync(publicDir)
//       .filter(file => file.endsWith('.txt'));
//   } catch (error) {
//     console.error("Error reading directory for static params:", error);
//     return [];
//   }
//   const categories = categoryFiles.map(file => path.basename(file, '.txt'));
//   const types = ['list', 'flashcard-with-answers', 'flashcard-without-answers'];

//   // Filter out categories that don't have valid word files
//   const validCategories = categories.filter(category => {
//      const words = getCategoryWords(category);
//      return words !== null && words.length > 0;
//   });

//   return validCategories.flatMap(category =>
//     types.map(type => ({
//       type: type,
//       category: encodeURIComponent(category),
//     }))
//   );
// }

// export const dynamic = 'auto'; // Or 'force-static' if using generateStaticParams

// Optional: Set dynamic = 'force-dynamic' if files change often,
// or 'force-static' if you use generateStaticParams and files are fixed at build time.
// export const dynamic = 'auto'; // Default Next.js behavior 