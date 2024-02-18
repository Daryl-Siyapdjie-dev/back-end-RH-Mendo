import { Request, Response, NextFunction } from 'express';
import { Tache } from '../models/tache.model';

const creerTache = async (req: Request, res: Response, next: NextFunction) => {
 try {
  const { description, nomProjet, etat } = req.body;

  if (!description || !nomProjet || !etat) {
    return res.status(400).json({ error: 'Description, nom du projet et état sont requis.' });
  }

  const nouvelleTache = new Tache({
    description,
    nomProjet,
    etat
  });

  await nouvelleTache.save();

  res.status(201).json({ message: 'Tâche créée avec succès', tache: nouvelleTache });
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Une erreur est survenue lors de la création de la tâche.' });
 }
};


const modifierTache = async (req: Request, res: Response, next: NextFunction) => {
    try {
    const { id } = req.params;
    const { description, nomProjet, etat } = req.body;
   
    if (!description || !nomProjet || !etat) {
      return res.status(400).json({ error: 'Description, nom du projet et état sont requis.' });
    }
   
    const tache = await Tache.findById(id);
    if (!tache) {
      return res.status(404).json({ error: 'Tâche non trouvée.' });
    }
   
    tache.description = description;
    tache.nomProjet = nomProjet;
    tache.etat = etat;
   
    await tache.save();
   
    res.status(200).json({ message: 'Tâche mise à jour avec succès', tache });
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour de la tâche.' });
    }
   };


 const supprimerTache = async (req: Request, res: Response, next: NextFunction) => {
    try {
    const { id } = req.params;
   
    const tache = await Tache.findByIdAndDelete(id);
    if (!tache) {
    return res.status(404).json({ error: 'Tâche non trouvée.' });
    }
   
    res.status(200).json({ message: 'Tâche supprimée avec succès' });
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la suppression de la tâche.' });
    }
   };

   const lireTache = async (req: Request, res: Response, next: NextFunction) => {
    try {
    const { id } = req.params;
   
    if (id) {
    // Recherchez une tâche spécifique par son ID
    const tache = await Tache.findById(id);
    if (!tache) {
     return res.status(404).json({ error: 'Tâche non trouvée.' });
    }
    res.json(tache);
    } else {
    // Recherchez toutes les tâches
    const taches = await Tache.find({});
    res.json(taches);
    }
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la lecture de la tâche.' });
    }
   };

   export default {lireTache, supprimerTache,  modifierTache, creerTache  }