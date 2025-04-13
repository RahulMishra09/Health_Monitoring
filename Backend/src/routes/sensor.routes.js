const express = require('express');
const router = express.Router();
const SensorData = require('../models/sensor.model');
const auth = require('../middleware/auth');

// Add new sensor data
router.post('/', auth, async (req, res) => {
  try {
    const sensorData = new SensorData({
      userId: req.user.id,
      ...req.body
    });
    const newData = await sensorData.save();
    res.status(201).json(newData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get latest sensor data
router.get('/latest', auth, async (req, res) => {
  try {
    const data = await SensorData.findOne({ userId: req.user.id })
      .sort({ timestamp: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get sensor data by date range
router.get('/range', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await SensorData.find({
      userId: req.user.id,
      timestamp: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ timestamp: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get sensor data by device
router.get('/device/:deviceId', auth, async (req, res) => {
  try {
    const data = await SensorData.find({
      userId: req.user.id,
      deviceId: req.params.deviceId
    }).sort({ timestamp: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get sensor data statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await SensorData.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: null,
          avgTemperature: { $avg: '$temperature.value' },
          maxTemperature: { $max: '$temperature.value' },
          minTemperature: { $min: '$temperature.value' },
          avgHumidity: { $avg: '$humidity.value' },
          maxHumidity: { $max: '$humidity.value' },
          minHumidity: { $min: '$humidity.value' }
        }
      }
    ]);
    res.json(stats[0] || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 