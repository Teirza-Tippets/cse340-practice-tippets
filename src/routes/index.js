import { Router } from 'express';
import { getRandomVehicles } from '../models/vehicleModel.js';
const router = Router();
 
// The home page route
router.get('/', async (req, res) => {
    try {
      const vehicles = await getRandomVehicles(3);
      res.render('index', {
        title: 'Home Page',
        vehicles
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

export default router;