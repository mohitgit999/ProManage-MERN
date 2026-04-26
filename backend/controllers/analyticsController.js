const Visit = require('../models/Visit');

const ADMIN_EMAIL = 'SEARX@gmail.com';

// Middleware to log every visit to the landing page
const trackVisit = async (req, res, next) => {
  try {
    const ua = req.headers['user-agent'] || '';
    const referrer = req.headers['referer'] || req.headers['referrer'] || 'direct';
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || 'unknown';

    // Detect device type
    let device = 'desktop';
    if (/mobile/i.test(ua)) device = 'mobile';
    else if (/tablet|ipad/i.test(ua)) device = 'tablet';

    // Detect browser
    let browser = 'Other';
    if (/chrome/i.test(ua) && !/edg/i.test(ua)) browser = 'Chrome';
    else if (/firefox/i.test(ua)) browser = 'Firefox';
    else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
    else if (/edg/i.test(ua)) browser = 'Edge';
    else if (/msie|trident/i.test(ua)) browser = 'IE';

    await Visit.create({
      page: req.query.page || '/',
      ip,
      userAgent: ua,
      referrer: referrer === 'direct' ? 'direct' : new URL(referrer).hostname,
      device,
      browser,
    });
  } catch (err) {
    // Silently ignore tracking errors
  }
  next();
};

// Get analytics data (admin only)
const getAnalytics = async (req, res) => {
  try {
    if (req.user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const now = new Date();
    const last24h = new Date(now - 24 * 60 * 60 * 1000);
    const last7d = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const last30d = new Date(now - 30 * 24 * 60 * 60 * 1000);

    const [total, today, week, month, recentVisits, byDevice, byBrowser, byPage, dailyVisits] = await Promise.all([
      Visit.countDocuments(),
      Visit.countDocuments({ createdAt: { $gte: last24h } }),
      Visit.countDocuments({ createdAt: { $gte: last7d } }),
      Visit.countDocuments({ createdAt: { $gte: last30d } }),
      Visit.find().sort({ createdAt: -1 }).limit(20),
      Visit.aggregate([{ $group: { _id: '$device', count: { $sum: 1 } } }]),
      Visit.aggregate([{ $group: { _id: '$browser', count: { $sum: 1 } } }]),
      Visit.aggregate([{ $group: { _id: '$page', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
      Visit.aggregate([
        { $match: { createdAt: { $gte: last7d } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.json({ total, today, week, month, recentVisits, byDevice, byBrowser, byPage, dailyVisits });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { trackVisit, getAnalytics };
