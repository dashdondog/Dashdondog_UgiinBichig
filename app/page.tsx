'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import SearchBar from './components/SearchBar';

const FamilyTree = dynamic(() => import('./components/FamilyTree'), { ssr: false });

export default function Home() {
  const [search, setSearch] = useState('');

  return (
    <div className="flex flex-col h-screen bg-green-50">
      {/* Header */}
      <header className="bg-white border-b border-green-100 shadow-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌳</span>
          <div>
            <h1 className="text-xl font-bold text-green-700">Угийн Мод</h1>
            <p className="text-xs text-gray-400">С.Гиймаа · Г.Лонжид</p>
          </div>
        </div>
        <SearchBar value={search} onChange={setSearch} />
      </header>

      <FamilyTree searchQuery={search} />

      {/* Legend */}
      <div className="fixed bottom-4 left-4 bg-white border border-green-100 rounded-xl px-4 py-2 shadow text-xs text-gray-500 flex gap-4">
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
