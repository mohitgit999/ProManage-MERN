const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  page: { type: String, default: '/' },
  ip: { type: String, default: 'unknown' },
  userAgent: { type: String, default: '' },
  referrer: { type: String, default: 'direct' },
  device: { type: String, default: 'desktop' }, // desktop, mobile, tablet
  browser: { type: String, default: 'unknown' },
}, { timestamps: true });

module.exports = mongoose.model('Visit', visitSchema);
