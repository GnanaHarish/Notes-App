const express = require('express')

const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { isLoggedIn } = require('../middleware/checkAuth');

router.get('/dashboard', isLoggedIn, dashboardController.homepage);
router.get('/dashboard/item/:id', isLoggedIn, dashboardController.homepageViewNote);
router.put('/dashboard/item/:id', isLoggedIn, dashboardController.homepageUpdateNote);
router.delete('/dashboard/item-delete/:id', isLoggedIn, dashboardController.homepageDeleteNote);
router.get('/dashboard/add', isLoggedIn, dashboardController.dashboardAddNote);
router.post('/dashboard/add', isLoggedIn, dashboardController.dashboardAddNoteSubmit);
router.get('/dashboard/search', isLoggedIn, dashboardController.homepageSearch);
router.post('/dashboard/search', isLoggedIn, dashboardController.homepageSearchSubmit);




module.exports = router