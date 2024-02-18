
import { Document, Schema, model } from 'mongoose';

export interface IUser extends Document {
  idpersonnel: number;
  nom: string;
  prifile: string;
  prenom: string;
  sexe: string;
  email: string;
  telephone: number;
  statut: string;
  poste: string;
  role: string;
  roleIdrole: number;
  matricule: string;
  password: string;
}

const UserSchema: Schema = new Schema(
  {
  matricule: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  idpersonnel: { type: Number },
  nom: { type: String },
  personnelcol: { type: String },
  prenom: { type: String },
  sexe: { type: String },
  telephone: { type: Number },
  statut: { type: String },
  poste: { type: String },
  role: { type: String },
  roleIdrole: { type: Number },
},
{
  timestamps: true
}
);



export default model<IUser>('User', UserSchema);
