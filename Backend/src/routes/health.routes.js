const express = require('express');
const router = express.Router();
const HealthMetrics = require('../models/health.model');
const auth = require('../middleware/auth');

// Get all health metrics for a user
router.get('/', auth, async (req, res) => {
  try {
    const metrics = await HealthMetrics.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(100);
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get latest health metrics
router.get('/latest', auth, async (req, res) => {
  try {
    const metrics = await HealthMetrics.findOne({ userId: req.user.id })
      .sort({ timestamp: -1 });
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new health metrics
router.post('/', auth, async (req, res) => {
  try {
    const metrics = new HealthMetrics({
      userId: req.user.id,
      ...req.body
    });
    const newMetrics = await metrics.save();
    res.status(201).json(newMetrics);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get health metrics by date range
router.get('/range', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const metrics = await HealthMetrics.find({
      userId: req.user.id,
      timestamp: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ timestamp: 1 });
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get health metrics statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await HealthMetrics.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: null,
          avgHeartRate: { $avg: '$heartRate.value' },
          maxHeartRate: { $max: '$heartRate.value' },
          minHeartRate: { $min: '$heartRate.value' },
          avgBloodPressure: {
            $avg: {
              $add: ['$bloodPressure.systolic', '$bloodPressure.diastolic']
            }
          },
          avgBloodSugar: { $avg: '$bloodSugar.value' },
          avgSpO2: { $avg: '$spo2.value' }
        }
      }
    ]);
    res.json(stats[0] || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 