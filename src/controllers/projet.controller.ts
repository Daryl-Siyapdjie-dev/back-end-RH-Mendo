import { Request, Response, NextFunction } from 'express';
import { Projet } from '../models/projet.model'; 

const creerProjet = async (req: Request, res: Response, next: NextFunction) => {
 try {
 const { nom, description, membres, taches } = req.body;

 if (!nom || !description || !membres || !taches) {
   return res.status(400).json({ error: 'Nom, description, membres et tâches sont requis.' });
 }

 const nouveauProjet = new Projet({
   nom,
   description,
   membres,
   taches
 });

 await nouveauProjet.save();

 res.status(201).json({ message: 'Projet créé avec succès', projet: nouveauProjet });
 } catch (error) {
 console.error(error);
 res.status(500).json({ error: 'Une erreur est survenue lors de la création du projet.' });
 }
};

const supprimerProjet = async (req: Request, res: Response, next: NextFunction) => {
    try {
    const { id } = req.params;
   
    if (!id) {
      return res.status(400).json({ error: 'ID du projet est requis.' });
    }
   
    const projet = await Projet.findByIdAndDelete(id);
   
    if (!projet) {
      return res.status(404).json({ error: 'Projet non trouvé.' });
    }
   
    res.status(200).json({ message: 'Projet supprimé avec succès', projet });
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la suppression du projet.' });
    }
   };

   const mettreAJourProjet = async (req: Request, res: Response, next: NextFunction) => {
    try {
    const { id } = req.params;
    const { nom, description, membres, taches } = req.body;
   
    if (!id || !nom || !description || !membres || !taches) {
      return res.status(400).json({ error: 'ID, nom, description, membres et tâches sont requis.' });
    }
   
    const projet = await Projet.findByIdAndUpdate(id, { nom, description, membres, taches }, { new: true });
   
    if (!projet) {
      return res.status(404).json({ error: 'Projet non trouvé.' });
    }
   
    res.status(200).json({ message: 'Projet mis à jour avec succès', projet });
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour du projet.' });
    }
   };


   const lireProjet = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (id) {
            // Recherchez un projet spécifique par son ID
            const projet = await Projet.findById(id);
            if (!projet) {
                return res.status(404).json({ error: 'Projet non trouvé.' });
            }
            res.json(projet);
        } else {
            // Recherchez tous les projets
            const projets = await Projet.find({});
            res.json(projets);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la lecture du projet.' });
    }
};


export default {creerProjet, lireProjet, mettreAJourProjet, supprimerProjet  };