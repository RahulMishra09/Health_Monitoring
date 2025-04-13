# Health Monitoring System 

A comprehensive health monitoring system that collects, processes, and analyzes health metrics in real-time using Raspberry Pi and NodeMCU.

## Features

### 1. Health Metrics Monitoring
- **Heart Rate Monitoring**
  - Real-time heart rate measurement
  - BPM tracking with threshold alerts
  - Trend analysis for heart rate patterns

- **Blood Oxygen (SpO2) Monitoring**
  - Continuous SpO2 level tracking
  - Low oxygen level alerts
  - Oxygen saturation trend analysis

- **Temperature Monitoring**
  - Body temperature tracking
  - Fever detection and alerts
  - Temperature trend monitoring

- **Blood Pressure Monitoring**
  - Systolic and diastolic pressure tracking
  - High blood pressure alerts
  - Blood pressure trend analysis

- **Blood Sugar Monitoring**
  - Glucose level tracking
  - High blood sugar alerts
  - Sugar level trend monitoring

- **Activity Tracking**
  - Step counting
  - Calorie estimation
  - Distance tracking
  - Activity patterns analysis

- **Sleep Monitoring**
  - Sleep quality assessment
  - Sleep duration tracking
  - Sleep pattern analysis

### 2. Data Processing and Analysis
- **Real-time Data Collection**
  - Continuous sensor data acquisition
  - Timestamp synchronization
  - Data validation and cleaning

- **Advanced Data Preprocessing**
  - Moving average smoothing
  - Noise reduction algorithms
  - Data normalization

- **Trend Analysis**
  - Pattern recognition
  - Trend detection (increasing/decreasing/stable)
  - Historical data comparison

- **Anomaly Detection**
  - Statistical anomaly detection
  - Sudden change alerts
  - Sensor error detection

### 3. Alert System
- **Smart Alert Generation**
  - Threshold-based alerts
  - Trend-based warnings
  - Anomaly notifications

- **Alert Categories**
  - Warning alerts for minor deviations
  - Danger alerts for critical conditions
  - Information alerts for trends

- **Alert Context**
  - Current value
  - Historical trend
  - Anomaly status
  - Recommended actions

### 4. Real-time Monitoring
- **Live Data Streaming**
  - WebSocket-based real-time updates
  - Low-latency data transmission
  - Bidirectional communication

- **Dashboard Display**
  - Real-time metric visualization
  - Interactive charts and graphs
  - Customizable views

### 5. Data Storage and Management
- **Secure Data Storage**
  - MongoDB database integration
  - Data encryption
  - Backup systems

- **Data Retrieval**
  - Historical data access
  - Custom date range queries
  - Data export capabilities

### 6. User Interface
- **Responsive Dashboard**
  - Real-time metric display
  - Alert notifications
  - Trend visualization

- **User Management**
  - Secure authentication
  - User profiles
  - Access control

## Technical Specifications

### Hardware Requirements
- Raspberry Pi (Model 3B+ or higher)
- NodeMCU ESP8266
- Health Sensors:
  - MAX30100 Pulse Oximeter
  - MLX90614 Temperature Sensor
  - ADS1115 ADC
  - Additional health monitoring sensors

### Software Requirements
- Python 3.8+
- Node.js 14+
- MongoDB 4.4+
- Required Python Packages:
  - numpy
  - pyserial
  - python-socketio
  - requests
  - python-dotenv

## Installation

1. **Hardware Setup**
   ```bash
   # Connect sensors to NodeMCU
   # Connect NodeMCU to Raspberry Pi via USB
   ```

2. **Software Setup**
   ```bash
   # Clone the repository
   git clone https://github.com/yourusername/Health_Monitoring.git

   # Install backend dependencies
   cd backend
   npm install

   # Install Python dependencies
   pip install -r requirements.txt
   ```

3. **Configuration**
   ```bash
   # Set up environment variables
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Running the System**
   ```bash
   # Start the backend server
   npm run dev

   # Start the data collector
   python sensor_data_collector.py
   ```

## Usage

1. **Access the Dashboard**
   - Open web browser
   - Navigate to `http://localhost:3000`

2. **Monitor Health Metrics**
   - View real-time data
   - Check alerts and notifications
   - Analyze trends and patterns

3. **Configure Alerts**
   - Set threshold values
   - Customize alert preferences
   - Manage notification settings

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

## Acknowledgments

- Thanks to all contributors
- Special thanks to the open-source community
- Inspired by healthcare monitoring needs