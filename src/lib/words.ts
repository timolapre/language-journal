import fs from 'fs';
import path from 'path';

// Define the languages explicitly
export type Language = 'english' | 'spanish' | 'dutch';

// Update the WordPair interface to handle three languages, making Dutch optional
export interface WordPair {
  english: string;
  spanish: string;
  dutch?: string; // Make dutch optional
}

/**
 * Reads and parses a category word file.
 * Assumes file format: "english,spanish" or "english,spanish,dutch" per line.
 * @param category The category name (without .txt extension)
 * @returns An array of WordPair objects or null if the file is not found or empty/invalid.
 */
export function getCategoryWords(category: string): WordPair[] | null {
  const decodedCategory = decodeURIComponent(category);
  // Keep the path logic, assuming files are still under /public/spanish/ for now
  // TODO: Consider renaming the directory if it now contains more than just Spanish
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
      const english = parts[0]?.trim();
      const spanish = parts[1]?.trim();
      const dutch = parts[2]?.trim(); // Get Dutch if present

      // Basic validation: Ensure at least English and Spanish exist
      if (english && spanish) {
          const pair: WordPair = {
              english: english,
              spanish: spanish,
          };
          // Add Dutch only if it exists and is not empty
          if (dutch) {
              pair.dutch = dutch;
          }
          return pair;
      } else {
          console.warn(`Invalid line format (expected at least 2 parts) in ${decodedCategory}.txt: "${line}"`);
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

/**
 * Gets a list of available category names (filenames without extension).
 * TODO: Consider renaming the directory if it now contains more than just Spanish
 * @returns An array of category names.
 */
export function getCategoryNames(): string[] {
    const directoryPath = path.join(process.cwd(), './public/spanish');
    try {
        const files = fs.readdirSync(directoryPath);
        return files
            .filter(file => file.endsWith('.txt'))
            .map(file => file.replace('.txt', ''));
    } catch (error) {
        console.error('Error reading category directory:', error);
        return [];
    }
} 