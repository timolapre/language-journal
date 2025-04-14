"use client"; // Required for useState and useEffect

import React, { useState, useEffect, useCallback } from 'react';
import type { WordPair, Language } from '@/lib/words';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"; // Using shadcn Card
import { Progress } from "@/components/ui/progress"; // Using shadcn Progress
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label"; // Keep Label for Select

interface FlashcardProps {
    category: string;
    words: WordPair[];
}

// Language options helper
const LANGUAGES: Language[] = ['english', 'spanish', 'dutch'];

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
    const [promptLanguage, setPromptLanguage] = useState<Language>('english');
    const [answerLanguage, setAnswerLanguage] = useState<Language>('spanish');

    // Shuffle words once on component mount or when words change
    useEffect(() => {
        if (words && words.length > 0) {
            setShuffledWords(shuffleArray(words));
            setCurrentIndex(0); // Reset index
        }
    }, [words]);

    // Reset index when languages change to avoid confusion
    useEffect(() => {
        setCurrentIndex(0);
    }, [promptLanguage, answerLanguage]);

    const handleNextCard = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % shuffledWords.length);
    }, [shuffledWords.length]);

    const handlePromptLangChange = (value: string) => {
        // Prevent selecting the same language for prompt and answer
        if (value as Language !== answerLanguage) {
            setPromptLanguage(value as Language);
        }
    };

    const handleAnswerLangChange = (value: string) => {
        // Prevent selecting the same language for prompt and answer
        if (value as Language !== promptLanguage) {
            setAnswerLanguage(value as Language);
        }
    };

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

    // Determine prompt and answer based on selected languages, handle missing dutch
    const prompt = currentWord[promptLanguage] ?? "-"; // Use nullish coalescing for placeholder
    const answer = currentWord[answerLanguage] ?? "-"; // Use nullish coalescing for placeholder
    // Helper function to capitalize language names for display
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    return (
        <div className="flex flex-col items-center gap-4 w-full max-w-md">
            {/* Language Selection Controls */}
            <div className="flex items-center justify-center gap-4 mb-2 w-full">
                {/* Prompt Language Select */}
                <div className="flex flex-col items-start gap-1.5 w-1/2">
                    <Label htmlFor="prompt-lang-select" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Show (Prompt)
                    </Label>
                    <Select value={promptLanguage} onValueChange={handlePromptLangChange}>
                        <SelectTrigger id="prompt-lang-select" className="w-full capitalize">
                            <SelectValue placeholder="Select prompt language" />
                        </SelectTrigger>
                        <SelectContent>
                            {LANGUAGES.map(lang => (
                                <SelectItem
                                    key={`prompt-${lang}`}
                                    value={lang}
                                    disabled={lang === answerLanguage} // Disable if selected as answer
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
                    <Label htmlFor="answer-lang-select" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Answer With
                    </Label>
                    <Select value={answerLanguage} onValueChange={handleAnswerLangChange}>
                        <SelectTrigger id="answer-lang-select" className="w-full capitalize">
                            <SelectValue placeholder="Select answer language" />
                        </SelectTrigger>
                        <SelectContent>
                            {LANGUAGES.map(lang => (
                                <SelectItem
                                    key={`answer-${lang}`}
                                    value={lang}
                                    disabled={lang === promptLanguage} // Disable if selected as prompt
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
                onClick={handleNextCard}
                tabIndex={0}
                onKeyPress={(e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') handleNextCard(); }}
                aria-live="polite"
                aria-label={`Flashcard ${currentIndex + 1} of ${shuffledWords.length}. Prompt in ${promptLanguage}: ${prompt}. Answer in ${answerLanguage}: ${answer}. Click to see next card.`}
            >
                <CardContent className="flex flex-col items-center justify-center min-h-[150px] sm:min-h-[200px] text-center mt-8">
                    <div className="mb-4">
                        {/* Display prompt, ensuring it doesn't show '-' if the language exists but is an empty string */}
                        <p className="text-4xl sm:text-5xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                            {currentWord[promptLanguage] !== undefined ? prompt : '-'}
                        </p>
                        {/* Display answer */}
                        <p className="text-2xl sm:text-3xl text-slate-600 dark:text-slate-300">
                            {currentWord[answerLanguage] !== undefined ? answer : '-'}
                        </p>
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