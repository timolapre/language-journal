"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { WordPair } from '@/lib/words';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FlashcardProps {
  category: string;
  words: WordPair[];
}

// Fisher-Yates (aka Knuth) Shuffle algorithm (same as before)
function shuffleArray<T>(array: T[]): T[] {
    let currentIndex = array.length, randomIndex;
    const newArray = [...array];
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [newArray[currentIndex], newArray[randomIndex]] = [
            newArray[randomIndex], newArray[currentIndex]];
    }
    return newArray;
}

export default function FlashcardWithoutAnswers({ category, words }: FlashcardProps) {
    const [shuffledWords, setShuffledWords] = useState<WordPair[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnswerVisible, setIsAnswerVisible] = useState(false);
    const [isSwapped, setIsSwapped] = useState(false);

    // Shuffle words on mount or when words change
    useEffect(() => {
        if (words && words.length > 0) {
            setShuffledWords(shuffleArray(words));
            setCurrentIndex(0);
            setIsAnswerVisible(false);
            setIsSwapped(false);
        }
    }, [words]);

    // Combined handler for interaction
    const handleInteraction = useCallback(() => {
        if (!isAnswerVisible) {
            setIsAnswerVisible(true);
        } else {
            setIsAnswerVisible(false);
            setCurrentIndex((prevIndex) => (prevIndex + 1) % shuffledWords.length);
        }
    }, [isAnswerVisible, shuffledWords.length]);

    // Handler for Switch change
    const handleSwapChange = (checked: boolean) => {
        setIsSwapped(checked);
        setIsAnswerVisible(false); // Always hide answer when swapping direction
    };

    if (shuffledWords.length === 0) {
        return (
            <Card className="w-full max-w-md p-6 text-center">
                 <CardHeader>
                    <CardTitle>Flashcards: {category} (Test Mode)</CardTitle>
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
    const promptLang = isSwapped ? "Spanish" : "English";
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
                    onCheckedChange={handleSwapChange}
                    aria-label={`Switch language direction, currently asking in ${promptLang}`}
                />
            </div>

            <Card
                className="w-full cursor-pointer transform transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                onClick={handleInteraction}
                tabIndex={0}
                onKeyPress={(e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') handleInteraction(); }}
                aria-live="polite"
            >
                <CardHeader>
                    <CardTitle className="text-center text-xl sm:text-2xl">Flashcards: {category} (Test)</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center min-h-[150px] sm:min-h-[200px] text-center">
                    <p className="text-4xl sm:text-5xl font-semibold text-slate-800 dark:text-slate-100 mb-4">{prompt}</p>
                    <div className="h-8">
                        {isAnswerVisible && (
                            <p className="text-2xl sm:text-3xl text-blue-600 dark:text-blue-400 animate-in fade-in duration-300">
                                {answer}
                            </p>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 items-center">
                    <Progress value={progressValue} className="w-full h-2" aria-label={`Progress: ${currentIndex + 1} of ${shuffledWords.length}`} />
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Card {currentIndex + 1} / {shuffledWords.length}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 h-4">
                        {isAnswerVisible ? "Click card for next word" : "Click card to reveal answer"}
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
} 