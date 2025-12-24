const express = require('express');
const router = express.Router();
const friendsController = require('../controllers/friendsController');
const requireAuth = require('../middleware/auth');

router.use(requireAuth);

router.get('/', friendsController.getFriends);
router.post('/request', friendsController.sendRequest);
router.put('/accept', friendsController.acceptRequest );
router.delete('/:id', friendsController.removeFriend);

module.exports = router;