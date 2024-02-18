import { Schema, model } from 'mongoose';

enum EtatTache {
 AFAIRE = 'à faire',
 ENCOURS = 'en cours',
 TERMINEE = 'terminée'
}

export interface ITache {
 description: string;
 nomProjet: string;
 etat: EtatTache;
}

const tacheSchema = new Schema<ITache>({
 description: { type: String, required: true },
 nomProjet: { type: String, required: true },
 etat: { type: String, enum: Object.values(EtatTache), required: true }
});


export const Tache = model<ITache>('Tache', tacheSchema);