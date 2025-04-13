const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deviceId: {
    type: String,
    required: true
  },
  gyroscope: {
    x: Number,
    y: Number,
    z: Number,
    unit: {
      type: String,
      default: '°/s'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  accelerometer: {
    x: Number,
    y: Number,
    z: Number,
    unit: {
      type: String,
      default: 'm/s²'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  temperature: {
    value: Number,
    unit: {
      type: String,
      default: '°C'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  humidity: {
    value: Number,
    unit: {
      type: String,
      default: '%'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  location: {
    latitude: Number,
    longitude: Number,
    altitude: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }
});

// Index for faster queries
sensorDataSchema.index({ userId: 1, timestamp: -1 });
sensorDataSchema.index({ deviceId: 1, timestamp: -1 });

module.exports = mongoose.model('SensorData', sensorDataSchema); 