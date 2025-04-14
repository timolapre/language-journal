"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { WordPair, Language } from '@/lib/words';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FlashcardProps {
  category: string;
  words: WordPair[];
}

// Language options helper
const LANGUAGES: Language[] = ['english', 'spanish', 'dutch'];

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
    const [promptLanguage, setPromptLanguage] = useState<Language>('english');
    const [answerLanguage, setAnswerLanguage] = useState<Language>('spanish');

    // Shuffle words on mount or when words change
    useEffect(() => {
        if (words && words.length > 0) {
            setShuffledWords(shuffleArray(words));
            setCurrentIndex(0);
            setIsAnswerVisible(false);
        }
    }, [words]);

    // Reset index and hide answer when languages change
    useEffect(() => {
        setCurrentIndex(0);
        setIsAnswerVisible(false);
    }, [promptLanguage, answerLanguage]);

    // Combined handler for interaction
    const handleInteraction = useCallback(() => {
        if (!isAnswerVisible) {
            setIsAnswerVisible(true);
        } else {
            setIsAnswerVisible(false);
            setCurrentIndex((prevIndex) => (prevIndex + 1) % shuffledWords.length);
        }
    }, [isAnswerVisible, shuffledWords.length]);

    const handlePromptLangChange = (value: string) => {
        if (value as Language !== answerLanguage) {
            setPromptLanguage(value as Language);
        }
    };

    const handleAnswerLangChange = (value: string) => {
        if (value as Language !== promptLanguage) {
            setAnswerLanguage(value as Language);
        }
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

    // Determine prompt and answer based on selected languages, handle missing dutch
    const prompt = currentWord[promptLanguage] ?? "-"; // Use nullish coalescing
    const answer = currentWord[answerLanguage] ?? "-"; // Use nullish coalescing
    // Helper function to capitalize language names for display
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    return (
        <div className="flex flex-col items-center gap-4 w-full max-w-md">
            {/* Language Selection Controls */}
            <div className="flex items-center justify-center gap-4 mb-2 w-full">
                {/* Prompt Language Select */}
                <div className="flex flex-col items-start gap-1.5 w-1/2">
                    <Label htmlFor="prompt-lang-select-test" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Ask In
                    </Label>
                    <Select value={promptLanguage} onValueChange={handlePromptLangChange}>
                        <SelectTrigger id="prompt-lang-select-test" className="w-full capitalize">
                            <SelectValue placeholder="Select prompt language" />
                        </SelectTrigger>
                        <SelectContent>
                            {LANGUAGES.map(lang => (
                                <SelectItem
                                    key={`prompt-test-${lang}`}
                                    value={lang}
                                    disabled={lang === answerLanguage}
                                    className="capitalize"
                                >
                                    {capitalize(lang)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Answer Language Select */}
                <div className="flex flex-col items-start gap-1.5 w-1/2">
                    <Label htmlFor="answer-lang-select-test" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Answer Is In
                    </Label>
                    <Select value={answerLanguage} onValueChange={handleAnswerLangChange}>
                        <SelectTrigger id="answer-lang-select-test" className="w-full capitalize">
                            <SelectValue placeholder="Select answer language" />
                        </SelectTrigger>
                        <SelectContent>
                            {LANGUAGES.map(lang => (
                                <SelectItem
                                    key={`answer-test-${lang}`}
                                    value={lang}
                                    disabled={lang === promptLanguage}
                                    className="capitalize"
                                >
                                    {capitalize(lang)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card
                className="w-full cursor-pointer transform transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                onClick={handleInteraction}
                tabIndex={0}
                onKeyPress={(e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') handleInteraction(); }}
                aria-live="polite"
                aria-label={`Flashcard ${currentIndex + 1} of ${shuffledWords.length}. Test mode. Prompt in ${promptLanguage}: ${prompt}. Click to ${isAnswerVisible ? 'go to next card' : 'reveal answer'}.`}
            >
                <CardContent className="flex flex-col items-center justify-center min-h-[150px] sm:min-h-[200px] text-center mt-8">
                    <p className="text-4xl sm:text-5xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                         {currentWord[promptLanguage] !== undefined ? prompt : '-'}
                    </p>
                    <div className="h-8">
                        {isAnswerVisible && (
                            <p className="text-2xl sm:text-3xl text-blue-600 dark:text-blue-400 animate-in fade-in duration-300">
                                {currentWord[answerLanguage] !== undefined ? answer : '-'}
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