import express from 'express';
import { getAllVehicles, getVehicleById } from '../models/vehicleModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const vehicles = await getAllVehicles();
    res.render('vehicles/index', {
      title: 'All Vehicles',
      vehicles
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const vehicle = await getVehicleById(req.params.id);
    if (!vehicle) return res.status(404).send('Vehicle not found');
    res.render('vehicles/show', { vehicle });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

export default router;