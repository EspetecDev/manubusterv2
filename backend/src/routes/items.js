const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController');
const requireAuth = require('../middleware/auth');

router.use(requireAuth);

router.get('/', itemsController.getItems);
router.post('/', itemsController.createItem);
router.put('/lend', itemsController.lendItem );
router.put('/return', itemsController.returnItem);
router.put('/setReturned', itemsController.setItemReturned);


module.exports = router;