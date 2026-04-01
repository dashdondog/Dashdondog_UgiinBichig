'use client';

import { useState, useEffect, useRef } from 'react';
import { FamilyMember } from '../types/family';
import { useFamilyStore } from '../store/familyStore';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  memberId?: string | null;
  defaultParentId?: string | null;
  onClose: () => void;
}

export default function MemberModal({ memberId, defaultParentId, onClose }: Props) {
  const { members, addMember, updateMember, getMemberById } = useFamilyStore();
  const existing = memberId ? getMemberById(memberId) : null;
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Omit<FamilyMember, 'id'>>({
    name: '',
    birthDate: '',
    deathDate: '',
    gender: 'male',
    photo: '',
    bio: '',
    parentIds: defaultParentId ? [defaultParentId] : [],
    spouseIds: [],
    childrenIds: [],
  });

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name,
        birthDate: existing.birthDate || '',
        deathDate: existing.deathDate || '',
        gender: existing.gender,
        photo: existing.photo || '',
        bio: existing.bio || '',
        parentIds: existing.parentIds,
        spouseIds: existing.spouseIds,
        childrenIds: existing.childrenIds,
      });
    }
  }, [existing]);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((f) => ({ ...f, photo: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const toggleRelation = (field: 'parentIds' | 'spouseIds' | 'childrenIds', id: string) => {
    setForm((f) => {
      const arr = f[field];
      return {
        ...f,
        [field]: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (existing) {
      updateMember(memberId!, form);
    } else {
      const newId = uuidv4();
      addMember({ id: newId, ...form });
      // Update parents' childrenIds
      form.parentIds.forEach((pid) => {
        const parent = getMemberById(pid);
        if (parent && !parent.childrenIds.includes(newId)) {
          updateMember(pid, { childrenIds: [...parent.childrenIds, newId] });
        }
      });
      // Update spouses' spouseIds
      form.spouseIds.forEach((sid) => {
        const spouse = getMemberById(sid);
        if (spouse && !spouse.spouseIds.includes(newId)) {
          updateMember(sid, { spouseIds: [...spouse.spouseIds, newId] });
        }
      });
    }
    onClose();
  };

  const otherMembers = members.filter((m) => m.id !== memberId);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="bg-green-600 text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-lg font-bold">{existing ? 'Гишүүн засах' : 'Гишүүн нэмэх'}</h2>
          <button onClick={onClose} className="text-white hover:text-green-200 text-2xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Photo */}
          <div className="flex flex-col items-center gap-2">
            {form.photo ? (
              <img src={form.photo} alt="photo" className="w-24 h-24 rounded-full object-cover border-4 border-green-200" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-green-400 text-4xl border-4 border-green-200">
                {form.gender === 'female' ? '👩' : '👨'}
              </div>
            )}
            <button type="button" onClick={() => fileRef.current?.click()} className="text-sm text-green-600 underline">
              Зураг сонгох
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Нэр *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Хүйс</label>
            <select
              value={form.gender}
              onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value as FamilyMember['gender'] }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="male">Эрэгтэй</option>
              <option value="female">Эмэгтэй</option>
              <option value="other">Бусад</option>
            </select>
          </div>

          {/* Birth & Death */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Төрсөн огноо</label>
              <input
                type="date"
                value={form.birthDate}
                onChange={(e) => setForm((f) => ({ ...f, birthDate: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Нас барсан огноо</label>
              <input
                type="date"
                value={form.deathDate}
                onChange={(e) => setForm((f) => ({ ...f, deathDate: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Товч мэдээлэл</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
            />
          </div>

          {/* Relations */}
          {otherMembers.length > 0 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Эцэг/Эх</label>
                <div className="max-h-28 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
                  {otherMembers.map((m) => (
                    <label key={m.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.parentIds.includes(m.id)}
                        onChange={() => toggleRelation('parentIds', m.id)}
                        className="accent-green-500"
                      />
                      <span className="text-sm">{m.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Эхнэр/Нөхөр</label>
                <div className="max-h-28 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
                  {otherMembers.map((m) => (
                    <label key={m.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.spouseIds.includes(m.id)}
                        onChange={() => toggleRelation('spouseIds', m.id)}
                        className="accent-green-500"
                      />
                      <span className="text-sm">{m.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              {existing ? 'Хадгалах' : 'Нэмэх'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Болих
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
