'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import SearchBar from './components/SearchBar';

const FamilyTree = dynamic(() => import('./components/FamilyTree'), { ssr: false });

export default function Home() {
  const [search, setSearch] = useState('');
  const [focusTrigger, setFocusTrigger] = useState(0);

  return (
    <div className="flex flex-col h-screen bg-green-50">
      {/* Header */}
      <header className="bg-white border-b border-green-100 shadow-sm px-3 py-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-2xl flex-shrink-0">🌳</span>
          <div className="min-w-0">
            <h1 className="text-base font-bold text-green-700 leading-tight">Угийн Мод</h1>
            <p className="text-[10px] text-gray-400 leading-tight">С.Гиймаа · Г.Лонжид</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFocusTrigger((t) => t + 1)}
            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg shadow transition-colors whitespace-nowrap"
          >
            ⭐ Г.Дашдондог
          </button>
          <SearchBar value={search} onChange={setSearch} />
        </div>
      </header>

      <FamilyTree searchQuery={search} focusTrigger={focusTrigger} />

      {/* Legend — desktop only */}
      <div className="hidden sm:flex fixed bottom-4 left-4 bg-white border border-green-100 rounded-xl px-4 py-2 shadow text-xs text-gray-500 gap-4">
        <span className="flex items-center gap-1">
          <span className="w-6 border-t-2 border-green-500 inline-block"></span> Эцэг/эх–Хүүхэд
        </span>
        <span className="flex items-center gap-1">
          <span className="w-6 border-t-2 border-dashed border-red-400 inline-block"></span> Хань ижил
        </span>
        <span className="text-gray-400">· Гишүүн дээр дарж дэлгэрэнгүй харна</span>
      </div>
    </div>
  );
}
