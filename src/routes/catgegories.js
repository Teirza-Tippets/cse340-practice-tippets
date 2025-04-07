import express from 'express';
import { getAllCategories } from '../models/categoryModel.js';
import { getVehiclesByCategory } from '../models/vehicleModel.js';
const router = express.Router();

router.get('/', async( req, res) =>{
 try{   
    const categories = await getAllCategories();
    res.render('categories/index', {
        title: 'Vehicle Categories', 
        categories
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });


router.get('/:categoryId', async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const vehicles = await getVehiclesByCategory(categoryId);
    res.render('categories/show', {
      title: 'Vehicles by Category',
      vehicles
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


export default router;