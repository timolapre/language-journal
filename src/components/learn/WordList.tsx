"use client"; // Required for state

import React, { useState } from 'react'; // Import useState
import type { WordPair } from '@/lib/words'; // Adjust path if needed
import { Switch } from "@/components/ui/switch"; // Import Switch
import { Label } from "@/components/ui/label"; // Import Label

interface WordListProps {
  category: string;
  words: WordPair[];
}

export default function WordList({ category, words }: WordListProps) {
  const [isSwapped, setIsSwapped] = useState(false); // State for language swap

  // Determine language labels based on swap state
  const col1Lang = isSwapped ? "Spanish" : "English";
  const col2Lang = isSwapped ? "English" : "Spanish";

  return (
    <div className="w-full max-w-2xl">
        {/* Language Swap Control */}
        <div className="flex items-center justify-end space-x-2 mb-4">
             <Label htmlFor="lang-swap-list" className="text-sm text-slate-600 dark:text-slate-400">
                 Swap Columns ({col1Lang} / {col2Lang})
            </Label>
            <Switch
                id="lang-swap-list"
                checked={isSwapped}
                onCheckedChange={setIsSwapped}
                aria-label={`Swap column order, currently showing ${col1Lang} first`}
            />
        </div>

        <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-slate-800 dark:text-slate-100 text-center">
                Word List: {category}
            </h2>
            {words.length > 0 ? (
                <ul className="space-y-3">
                {/* Optional Header Row */}
                <li className="flex justify-between items-center pb-2 border-b dark:border-slate-600 font-medium text-slate-600 dark:text-slate-300">
                    <span>{col1Lang}</span>
                    <span>{col2Lang}</span>
                </li>
                {/* Word Pairs */}
                {words.map((pair, index) => {
                    const prompt = isSwapped ? pair.translation : pair.word;
                    const answer = isSwapped ? pair.word : pair.translation;
                    return (
                        <li key={index} className="flex justify-between items-center p-2 border-b dark:border-slate-700 last:border-b-0">
                            <span className="text-slate-700 dark:text-slate-300 text-left pr-4">{prompt}</span>
                            <span className="text-slate-500 dark:text-slate-400 text-right pl-4">{answer}</span>
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