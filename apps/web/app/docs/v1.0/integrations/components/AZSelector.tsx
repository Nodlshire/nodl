import React from 'react';

interface AZSelectorProps {
    activeLetter: string | null;
    onSelectLetter: (letter: string | null) => void;
    availableLetters: string[];
}

export default function AZSelector({ activeLetter, onSelectLetter, availableLetters }: AZSelectorProps) {
    const alphabet = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    
    return (
        <div className="flex flex-wrap gap-1 mb-6 items-center">
            <button
                onClick={() => onSelectLetter(null)}
                className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${
                    activeLetter === null 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
            >
                ALL
            </button>
            <div className="w-px h-6 bg-slate-700 mx-2"></div>
            {alphabet.map(letter => {
                const isAvailable = availableLetters.includes(letter);
                const isActive = activeLetter === letter;
                
                return (
                    <button
                        key={letter}
                        onClick={() => isAvailable && onSelectLetter(isActive ? null : letter)}
                        disabled={!isAvailable}
                        className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-bold transition-all ${
                            isActive 
                            ? 'bg-blue-600 text-white shadow-md transform scale-110' 
                            : isAvailable 
                                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white' 
                                : 'bg-slate-900/50 text-slate-600 cursor-not-allowed'
                        }`}
                    >
                        {letter}
                    </button>
                );
            })}
            
            {availableLetters.includes('#') && (
                <button
                    onClick={() => onSelectLetter(activeLetter === '#' ? null : '#')}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-bold transition-all ${
                        activeLetter === '#' 
                        ? 'bg-blue-600 text-white shadow-md transform scale-110' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                >
                    #
                </button>
            )}
        </div>
    );
}
