const Analytics = require('../models/Analytics');

// @desc    Get system-wide analytics and usage metrics
// @route   GET /api/analytics
const getAnalytics = async (req, res, next) => {
  try {
    const totalEvents = await Analytics.countDocuments();
    const eventBreakdown = await Analytics.aggregate([
      { $group: { _id: '$eventType', count: { $sum: 1 } } }
    ]);

    const recentEvents = await Analytics.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('userId', 'username email role');

    res.json({
      success: true,
      totalEvents,
      eventBreakdown,
      recentEvents,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAnalytics };
