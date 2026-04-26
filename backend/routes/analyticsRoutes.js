const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { trackVisit, getAnalytics } = require('../controllers/analyticsController');

// Public: log a visit (called from frontend)
router.post('/track', trackVisit, (req, res) => res.status(200).json({ ok: true }));

// Protected: get analytics (admin only)
router.get('/stats', protect, getAnalytics);

module.exports = router;
