"use client"; // Required for state

import React, { useState } from 'react'; // Import useState
import type { WordPair, Language } from '@/lib/words'; // Adjust path if needed
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label"; // Import Label

interface WordListProps {
  category: string;
  words: WordPair[];
}

// Language options helper
const LANGUAGES: Language[] = ['english', 'spanish', 'dutch'];
// Helper function to capitalize language names for display
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function WordList({ category, words }: WordListProps) {
  // Replace isSwapped with states for column languages
  const [col1Language, setCol1Language] = useState<Language>('english');
  const [col2Language, setCol2Language] = useState<Language>('spanish');

  const handleCol1LangChange = (value: string) => {
    // Prevent selecting the same language for both columns
    if (value as Language !== col2Language) {
        setCol1Language(value as Language);
    }
  };

  const handleCol2LangChange = (value: string) => {
    // Prevent selecting the same language for both columns
    if (value as Language !== col1Language) {
        setCol2Language(value as Language);
    }
  };

  return (
    <div className="w-full max-w-2xl">
        {/* Language Selection Controls */}
        <div className="flex items-center justify-end gap-4 mb-4">
            {/* Column 1 Language Select */}
            <div className="flex flex-col items-start gap-1.5">
                <Label htmlFor="col1-lang-select" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Column 1
                </Label>
                <Select value={col1Language} onValueChange={handleCol1LangChange}>
                    <SelectTrigger id="col1-lang-select" className="w-[120px] capitalize">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                        {LANGUAGES.map(lang => (
                            <SelectItem
                                key={`col1-${lang}`}
                                value={lang}
                                disabled={lang === col2Language} // Disable if selected for col 2
                                className="capitalize"
                            >
                                {capitalize(lang)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Column 2 Language Select */}
            <div className="flex flex-col items-start gap-1.5">
                <Label htmlFor="col2-lang-select" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Column 2
                </Label>
                <Select value={col2Language} onValueChange={handleCol2LangChange}>
                    <SelectTrigger id="col2-lang-select" className="w-[120px] capitalize">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                        {LANGUAGES.map(lang => (
                            <SelectItem
                                key={`col2-${lang}`}
                                value={lang}
                                disabled={lang === col1Language} // Disable if selected for col 1
                                className="capitalize"
                            >
                                {capitalize(lang)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-6">
            {words.length > 0 ? (
                <ul className="space-y-3">
                {/* Header Row uses selected languages */}
                <li className="flex justify-between items-center pb-2 border-b dark:border-slate-600 font-medium text-slate-600 dark:text-slate-300">
                    <span className="capitalize">{capitalize(col1Language)}</span>
                    <span className="capitalize">{capitalize(col2Language)}</span>
                </li>
                {/* Word Pairs use selected languages */}
                {words.map((pair, index) => {
                    const col1Word = pair[col1Language] ?? "-"; // Use nullish coalescing
                    const col2Word = pair[col2Language] ?? "-"; // Use nullish coalescing
                    return (
                        <li key={index} className="flex justify-between items-center p-2 border-b dark:border-slate-700 last:border-b-0">
                            {/* Display col1 word */}
                            <span className="text-slate-700 dark:text-slate-300 text-left pr-4">
                                {pair[col1Language] !== undefined ? col1Word : '-'}
                            </span>
                            {/* Display col2 word */}
                            <span className="text-slate-500 dark:text-slate-400 text-right pl-4">
                                {pair[col2Language] !== undefined ? col2Word : '-'}
                            </span>
                        </li>
                    );
                })}
                </ul>
            ) : (
                <p className="text-slate-500 dark:text-slate-400 text-center">No words found for this category.</p>
            )}
        </div>
    </div>
  );
} 