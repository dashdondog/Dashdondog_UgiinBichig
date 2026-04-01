'use client';

import { FamilyMember } from '../types/family';
import { seedMembers } from '../data/seedData';

interface Props {
  member: FamilyMember;
  onClose: () => void;
}

export default function MemberDetail({ member, onClose }: Props) {
  const getMember = (id: string) => seedMembers.find((m) => m.id === id);

  const parents = member.parentIds.map(getMember).filter(Boolean) as FamilyMember[];
  const spouses = member.spouseIds.map(getMember).filter(Boolean) as FamilyMember[];
  const children = member.childrenIds.map(getMember).filter(Boolean) as FamilyMember[];

  const formatYear = (d?: string) => d ? new Date(d).getFullYear() : null;

  return (
    <div className="h-full w-80 bg-white border-l border-green-100 shadow-xl flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="bg-green-600 text-white px-5 py-4 flex items-center justify-between">
        <h2 className="font-bold text-base">Дэлгэрэнгүй мэдээлэл</h2>
        <button onClick={onClose} className="text-white hover:text-green-200 text-2xl leading-none">&times;</button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Photo & name */}
        <div className="flex flex-col items-center gap-3">
          {member.photo ? (
            <img src={member.photo} alt={member.name} className="w-24 h-24 rounded-full object-cover border-4 border-green-200 shadow" />
          ) : (
            <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center text-5xl shadow
              ${member.gender === 'female' ? 'bg-pink-50 border-pink-200' : 'bg-blue-50 border-blue-200'}`}>
              {member.gender === 'female' ? '👩' : '👨'}
            </div>
          )}
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
            {(member.birthDate || member.deathDate) && (
              <p className="text-sm text-gray-500 mt-0.5">
                {formatYear(member.birthDate) && `${formatYear(member.birthDate)} онд төрсөн`}
                {member.deathDate && ` · ${formatYear(member.deathDate)} онд нас барсан`}
              </p>
            )}
            <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full
              ${member.gender === 'female' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>
              {member.gender === 'female' ? 'Эмэгтэй' : 'Эрэгтэй'}
            </span>
          </div>
        </div>

        {/* Bio */}
        {member.bio && (
          <div className="bg-green-50 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">Намтар</h4>
            <p className="text-sm text-gray-700 leading-relaxed">{member.bio}</p>
          </div>
        )}

        {parents.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Эцэг / Эх</h4>
            <div className="space-y-1">
              {parents.map((p) => (
                <div key={p.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <span>{p.gender === 'female' ? '👩' : '👨'}</span>
                  <span className="text-sm font-medium text-gray-700">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {spouses.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Хань ижил</h4>
            <div className="space-y-1">
              {spouses.map((s) => (
                <div key={s.id} className="flex items-center gap-2 bg-red-50 rounded-lg px-3 py-2">
                  <span>❤️</span>
                  <span className="text-sm font-medium text-gray-700">{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {children.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Хүүхдүүд ({children.length})</h4>
            <div className="space-y-1">
              {children.map((c) => (
                <div key={c.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <span>{c.gender === 'female' ? '👧' : '👦'}</span>
                  <span className="text-sm font-medium text-gray-700">{c.name}</span>
                  {c.birthDate && <span className="text-xs text-gray-400 ml-auto">{formatYear(c.birthDate)}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
