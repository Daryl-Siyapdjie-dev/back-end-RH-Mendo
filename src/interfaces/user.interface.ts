import { Document } from 'mongoose';

export interface IUser extends Document {
  matricule: string;
  password: string;
  email: string;
  telephone: number|string;
  statut: string;
  poste: string;
  role: string;
  roleIdrole: number;
  idpersonnel: number;
  nom: string;
  prifile: string;
  prenom: string;
  sexe: string;
}