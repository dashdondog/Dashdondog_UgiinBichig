'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FamilyMember } from '../types/family';

interface FamilyStore {
  members: FamilyMember[];
  addMember: (member: FamilyMember) => void;
  updateMember: (id: string, data: Partial<FamilyMember>) => void;
  deleteMember: (id: string) => void;
  getMemberById: (id: string) => FamilyMember | undefined;
}

export const useFamilyStore = create<FamilyStore>()(
  persist(
    (set, get) => ({
      members: [],
      addMember: (member) =>
        set((state) => ({ members: [...state.members, member] })),
      updateMember: (id, data) =>
        set((state) => ({
          members: state.members.map((m) =>
            m.id === id ? { ...m, ...data } : m
          ),
        })),
      deleteMember: (id) =>
        set((state) => ({
          members: state.members
            .filter((m) => m.id !== id)
            .map((m) => ({
              ...m,
              parentIds: m.parentIds.filter((pid) => pid !== id),
              spouseIds: m.spouseIds.filter((sid) => sid !== id),
              childrenIds: m.childrenIds.filter((cid) => cid !== id),
            })),
        })),
      getMemberById: (id) => get().members.find((m) => m.id === id),
    }),
    { name: 'family-tree-storage' }
  )
);
