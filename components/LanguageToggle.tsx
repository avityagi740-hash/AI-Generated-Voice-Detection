
import React from 'react';
import { Language } from '../types';

interface Props {
  selected: Language;
  onSelect: (lang: Language) => void;
  disabled: boolean;
}

const LanguageToggle: React.FC<Props> = ({ selected, onSelect, disabled }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-6">
      {Object.values(Language).map((lang) => (
        <button
          key={lang}
          onClick={() => onSelect(lang)}
          disabled={disabled}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selected === lang
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
};

export default LanguageToggle;
