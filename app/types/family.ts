export interface FamilyMember {
  id: string;
  name: string;
  birthDate?: string;
  deathDate?: string;
  gender: 'male' | 'female' | 'other';
  photo?: string;
  bio?: string;
  parentIds: string[];
  spouseIds: string[];
  childrenIds: string[];
}

export interface FamilyStore {
  members: FamilyMember[];
  addMember: (member: FamilyMember) => void;
  updateMember: (id: string, data: Partial<FamilyMember>) => void;
  deleteMember: (id: string) => void;
  getMemberById: (id: string) => FamilyMember | undefined;
}
