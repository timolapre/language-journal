import fs from 'fs';
import path from 'path';

export interface WordPair {
  word: string;
  translation: string;
}

/**
 * Reads and parses a category word file.
 * Assumes file format: "word,translation" per line.
 * @param category The category name (without .txt extension)
 * @returns An array of WordPair objects or null if the file is not found or empty/invalid.
 */
export function getCategoryWords(category: string): WordPair[] | null {
  const decodedCategory = decodeURIComponent(category);
  const filePath = path.join(process.cwd(), `./public/spanish/${decodedCategory}.txt`);

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split(/\r?\n/).filter(line => line.trim() !== ''); // Split by newline (Windows/Unix), remove empty lines

    if (lines.length === 0) {
        console.warn(`Category file ${decodedCategory}.txt is empty.`);
        return null;
    }

    const words = lines.map(line => {
      const parts = line.split(','); // Use comma as separator
      const word = parts[0]?.trim();
      const translation = parts[1]?.trim();

      // Basic validation: Ensure both parts exist after splitting
      if (word && translation) {
        return {
          word: word,
          translation: translation
        };
      } else {
          console.warn(`Invalid line format in ${decodedCategory}.txt: "${line}"`);
          return null; // Indicate invalid line
      }
    }).filter((pair): pair is WordPair => pair !== null); // Filter out invalid lines and assert type

    return words.length > 0 ? words : null; // Return null if all lines were invalid

  } catch (error) {
    // Specifically check for file not found errors
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
        console.warn(`Category file not found: ${filePath}`);
    } else {
        console.error(`Error reading category file ${decodedCategory}.txt:`, error);
    }
    return null; // Indicate file not found or other read error
  }
} 