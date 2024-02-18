import { Schema, model, Document } from 'mongoose';
import { IUser } from '../models/user.model'; // Assurez-vous d'avoir importé le modèle utilisateur
import { ITache } from '../models/tache.model'; // Assurez-vous d'avoir importé le modèle tâche

interface IProjet extends Document {
 nom: string;
 description: string;
 membres: IUser[];
 taches: ITache[];
}

const ProjetSchema = new Schema<IProjet>({
 nom: { type: String, required: true },
 description: { type: String, required: true },
 membres: [{ type: Schema.Types.ObjectId, ref: 'User' }],
 taches: [{ type: Schema.Types.ObjectId, ref: 'Tache' }],
});

export const Projet = model<IProjet>('Projet', ProjetSchema);