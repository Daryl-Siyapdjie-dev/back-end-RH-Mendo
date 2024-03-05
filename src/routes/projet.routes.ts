import { Router } from 'express';
import Controller from '../controllers/projet.controller'

const router = Router();


router.post('/creerProjet', Controller.creerProjet);

router.get('/lireProjet/:id?', Controller.lireProjet);

router.patch('/modifierProjet/:id', Controller.mettreAJourProjet);

router.delete('/supprimerProjet/:id', Controller.supprimerProjet);

export default router;