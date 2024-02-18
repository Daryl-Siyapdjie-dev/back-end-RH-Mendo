import { Router } from 'express';
import Controller from '../controllers/projet.controller'

const router = Router();


router.post('/creerTache', Controller.creerProjet);

router.get('/lireTache/:id?', Controller.lireProjet);

router.patch('/modifierTache/:id', Controller.mettreAJourProjet);

router.delete('/supprimerTache/:id', Controller.supprimerProjet);

export default router;