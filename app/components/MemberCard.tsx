'use client';

import { FamilyMember } from '../types/family';

interface Props {
  member: FamilyMember;
  onEdit: () => void;
  onDelete: () => void;
  onAddChild: () => void;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function MemberCard({ member, onEdit, onDelete, onAddChild, isSelected, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`bg-white border-2 rounded-xl p-3 shadow-sm cursor-pointer transition-all w-40
        ${isSelected ? 'border-green-500 shadow-green-200 shadow-md' : 'border-green-200 hover:border-green-400 hover:shadow-md'}`}
    >
      <div className="flex flex-col items-center gap-2">
        {member.photo ? (
          <img src={member.photo} alt={member.name} className="w-14 h-14 rounded-full object-cover border-2 border-green-200" />
        ) : (
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-3xl border-2 border-green-200">
            {member.gender === 'female' ? '👩' : '👨'}
          </div>
        )}
        <div className="text-center">
          <p className="font-semibold text-gray-800 text-sm leading-tight">{member.name}</p>
          {member.birthDate && (
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(member.birthDate).getFullYear()}
              {member.deathDate && ` – ${new Date(member.deathDate).getFullYear()}`}
            </p>
          )}
        </div>
        <div className="flex gap-1 mt-1">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-lg hover:bg-green-100 transition"
          >
            Засах
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onAddChild(); }}
            className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-lg hover:bg-green-600 transition"
          >
            + Хүүхэд
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="text-xs bg-red-50 text-red-500 border border-red-200 px-2 py-0.5 rounded-lg hover:bg-red-100 transition"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
