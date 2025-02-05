import { Router } from 'express';
import { getNav } from '../utilities/index.js'

const router = Router();
 
// The home page route
router.get('/', async (req, res) => {
    res.render('index', { title: 'Home Page' , nav });
});

//about page route 
router.get('/about', async (req, res) =>{
    res.render('about',  {title: 'About Page', nav });
})

export default router;