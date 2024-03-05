import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import config from './config/config';
import logging from './config/logging';
import http from 'http';
import bodyParser from 'body-parser';
import userRoutes from './routes/user.routes';
import tacheRoutes from './routes/tache.routes';
import projetRoutes from './routes/projet.routes';

import * as tacheController from './controllers/tache.controllers';

const NAMESPACE = 'Server';

const router = express();

dotenv.config();

//connectDB();


// app.use(express.json());

// app.use(authenticateToken);

// app.use(authRoutes);

// app.listen(2727, () => console.log('Server started on port 2727'));

// const connectDB = async (): Promise<void> => {
//     try {
//       mongoose.set("strictQuery", false);
//       await mongoose.connect("mongodb+srv://Mendo-company:RH-Mendo2727@rh-mendo.lgjx0to.mongodb.net/DatabaseMendo");
//       console.log("Daryl server connected to the Database ");
//     } catch (err) {
//       console.log(err);
//       process.exit();
//     }
//    };
   
//connectDB();

/** Connect to Mongo */
mongoose
    .connect(config.mongo.url, config.mongo.options)
    .then((result) => {
        logging.info(NAMESPACE, 'Mongo Connected');
    })
    .catch((error) => {
        logging.error(NAMESPACE, error.message, error);
    });

    
/** Consigner la demande */
router.use((req, res, next) => {
    /** Enregistrer la demande*/
    logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        /** Enregistrer la reponse */
        logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });

    next();
});

/** Analyser le corps de la requête */
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

/** Règles de notre API*/
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

/** Les itinéraires vont ici */
router.use('/users', userRoutes);

router.use('/taches', tacheRoutes);

router.use('/projets', projetRoutes)

/** Gestion des erreurs */
router.use((req, res, next) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});

const httpServer = http.createServer(router);

httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Le serveur est en cours d’exécution ${config.server.hostname}:${config.server.port}`));