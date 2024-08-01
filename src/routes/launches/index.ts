import { Router } from 'express';

import {
  getLaunches,
  saveLaunch,
  getSavedLaunches,
  deleteLaunch
} from '../../controllers/launchController';

const router = Router();

router.get('/launches', getLaunches);

router.post('/launches', saveLaunch);

router.get('/saved-launches', getSavedLaunches);

router.delete('/saved-launches/:id', deleteLaunch);

export default router;
