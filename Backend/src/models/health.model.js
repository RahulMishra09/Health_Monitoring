const mongoose = require('mongoose');

const healthMetricsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  heartRate: {
    value: Number,
    unit: {
      type: String,
      default: 'BPM'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  bloodPressure: {
    systolic: Number,
    diastolic: Number,
    unit: {
      type: String,
      default: 'mmHg'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  bloodSugar: {
    value: Number,
    unit: {
      type: String,
      default: 'mg/dL'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  spo2: {
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
  activity: {
    steps: Number,
    calories: Number,
    distance: Number,
    unit: {
      type: String,
      default: 'km'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  sleep: {
    duration: Number,
    quality: {
      type: String,
      enum: ['poor', 'fair', 'good', 'excellent']
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }
});

// Index for faster queries
healthMetricsSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('HealthMetrics', healthMetricsSchema); 