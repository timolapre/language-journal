"use client"; // Required for useState and useEffect

import React, { useState, useEffect, useCallback } from 'react';
import type { WordPair } from '@/lib/words';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"; // Using shadcn Card
import { Progress } from "@/components/ui/progress"; // Using shadcn Progress
import { Switch } from "@/components/ui/switch"; // Import Switch
import { Label } from "@/components/ui/label"; // Import Label

interface FlashcardProps {
    category: string;
    words: WordPair[];
}

// Fisher-Yates (aka Knuth) Shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
    let currentIndex = array.length, randomIndex;
    const newArray = [...array]; // Create a copy

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [newArray[currentIndex], newArray[randomIndex]] = [
            newArray[randomIndex], newArray[currentIndex]];
    }

    return newArray;
}

export default function FlashcardWithAnswers({ category, words }: FlashcardProps) {
    const [shuffledWords, setShuffledWords] = useState<WordPair[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSwapped, setIsSwapped] = useState(false);

    // Shuffle words once on component mount or when words change
    useEffect(() => {
        if (words && words.length > 0) {
            setShuffledWords(shuffleArray(words));
            setCurrentIndex(0); // Reset index
            setIsSwapped(false); // Reset swap state
        }
    }, [words]);

    const handleNextCard = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % shuffledWords.length);
    }, [shuffledWords.length]);

    if (shuffledWords.length === 0) {
        // Handle case where words might be empty or still loading/shuffling
        return (
            <Card className="w-full max-w-md p-6 text-center">
                <CardHeader>
                    <CardTitle>Flashcards: {category} (With Answers)</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-slate-500 dark:text-slate-400">
                        No words loaded for this category, or the list is empty.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const currentWord = shuffledWords[currentIndex];
    const progressValue = ((currentIndex + 1) / shuffledWords.length) * 100;

    // Determine which language is the prompt and which is the answer
    const prompt = isSwapped ? currentWord.translation : currentWord.word;
    const answer = isSwapped ? currentWord.word : currentWord.translation;
    const promptLang = isSwapped ? "Spanish" : "English"; // Assuming word=English, translation=Spanish
    const answerLang = isSwapped ? "English" : "Spanish";

    return (
        <div className="flex flex-col items-center gap-4 w-full max-w-md">
            {/* Language Swap Control */}
            <div className="flex items-center space-x-2 mb-2">
                <Label htmlFor="lang-swap" className="text-sm text-slate-600 dark:text-slate-400">
                    Show: {promptLang} → {answerLang}
                </Label>
                <Switch
                    id="lang-swap"
                    checked={isSwapped}
                    onCheckedChange={setIsSwapped}
                    aria-label={`Switch language direction, currently showing ${promptLang} first`}
                />
            </div>

            <Card
                className="w-full cursor-pointer transform transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                onClick={handleNextCard}
                tabIndex={0}
                onKeyPress={(e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') handleNextCard(); }}
                aria-live="polite"
            >
                <CardHeader>
                    <CardTitle className="text-center text-xl sm:text-2xl">Flashcards: {category}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center min-h-[150px] sm:min-h-[200px] text-center">
                    <div className="mb-4">
                        <p className="text-2xl sm:text-3xl font-semibold text-slate-800 dark:text-slate-100">{prompt}</p>
                        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mt-2">{answer}</p>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Progress value={progressValue} className="w-full h-2" aria-label={`Progress: ${currentIndex + 1} of ${shuffledWords.length}`}/>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Card {currentIndex + 1} / {shuffledWords.length}
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
} 