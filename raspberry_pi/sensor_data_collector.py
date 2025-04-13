import requests
import json
import time
import socketio
from datetime import datetime
import serial
import threading
from typing import Dict, Any, List
import numpy as np
from collections import deque

# Configuration
SERIAL_PORT = '/dev/ttyUSB0'  # Adjust based on your connection
BAUD_RATE = 115200
BACKEND_URL = 'http://localhost:5000'
SOCKET_URL = 'http://localhost:5000'

# Initialize Socket.IO client
sio = socketio.Client()

# Health metric thresholds
THRESHOLDS = {
    'heartRate': {'min': 60, 'max': 100},
    'spo2': {'min': 95, 'max': 100},
    'temperature': {'min': 36.1, 'max': 37.2},
    'bloodPressure': {
        'systolic': {'min': 90, 'max': 120},
        'diastolic': {'min': 60, 'max': 80}
    },
    'bloodSugar': {'min': 70, 'max': 140}
}

# Data smoothing window size
SMOOTHING_WINDOW = 5

# Store recent readings for trend analysis
recent_readings = {
    'heartRate': deque(maxlen=10),
    'spo2': deque(maxlen=10),
    'temperature': deque(maxlen=10),
    'bloodPressure': {
        'systolic': deque(maxlen=10),
        'diastolic': deque(maxlen=10)
    },
    'bloodSugar': deque(maxlen=10)
}

def moving_average(data: List[float]) -> float:
    """Calculate moving average of the data."""
    return np.mean(data) if data else 0

def detect_trend(data: List[float]) -> str:
    """Detect trend in the data (increasing, decreasing, or stable)."""
    if len(data) < 2:
        return "stable"
    
    x = np.arange(len(data))
    slope = np.polyfit(x, data, 1)[0]
    
    if slope > 0.1:
        return "increasing"
    elif slope < -0.1:
        return "decreasing"
    else:
        return "stable"

def detect_anomaly(data: List[float], current_value: float) -> bool:
    """Detect if current value is an anomaly using standard deviation."""
    if len(data) < 3:
        return False
    
    mean = np.mean(data)
    std = np.std(data)
    return abs(current_value - mean) > 2 * std

def preprocess_health_metrics(data: Dict[str, Any]) -> Dict[str, Any]:
    """Preprocess health metrics with smoothing and trend analysis."""
    processed_data = data.copy()
    
    # Process each metric
    for metric in ['heartRate', 'spo2', 'temperature', 'bloodSugar']:
        if metric in data:
            # Add to recent readings
            recent_readings[metric].append(data[metric])
            
            # Apply smoothing
            processed_data[metric] = moving_average(list(recent_readings[metric]))
            
            # Add trend information
            processed_data[f'{metric}_trend'] = detect_trend(list(recent_readings[metric]))
            
            # Add anomaly detection
            processed_data[f'{metric}_anomaly'] = detect_anomaly(
                list(recent_readings[metric])[:-1],
                data[metric]
            )
    
    # Process blood pressure separately
    if 'bloodPressure' in data:
        bp = data['bloodPressure']
        for reading in ['systolic', 'diastolic']:
            if reading in bp:
                recent_readings['bloodPressure'][reading].append(bp[reading])
                processed_data['bloodPressure'][reading] = moving_average(
                    list(recent_readings['bloodPressure'][reading])
                )
                processed_data['bloodPressure'][f'{reading}_trend'] = detect_trend(
                    list(recent_readings['bloodPressure'][reading])
                )
                processed_data['bloodPressure'][f'{reading}_anomaly'] = detect_anomaly(
                    list(recent_readings['bloodPressure'][reading])[:-1],
                    bp[reading]
                )
    
    return processed_data

def validate_health_metrics(data: Dict[str, Any]) -> Dict[str, Any]:
    """Validate health metrics against thresholds and add alerts if needed."""
    alerts = []
    
    # Check heart rate
    if 'heartRate' in data:
        if data['heartRate'] < THRESHOLDS['heartRate']['min']:
            alerts.append({
                'type': 'warning',
                'message': f'Low heart rate: {data["heartRate"]} BPM',
                'metric': 'heartRate',
                'value': data['heartRate'],
                'trend': data.get('heartRate_trend', 'unknown'),
                'anomaly': data.get('heartRate_anomaly', False)
            })
        elif data['heartRate'] > THRESHOLDS['heartRate']['max']:
            alerts.append({
                'type': 'danger',
                'message': f'High heart rate: {data["heartRate"]} BPM',
                'metric': 'heartRate',
                'value': data['heartRate'],
                'trend': data.get('heartRate_trend', 'unknown'),
                'anomaly': data.get('heartRate_anomaly', False)
            })
    
    # Check SpO2
    if 'spo2' in data:
        if data['spo2'] < THRESHOLDS['spo2']['min']:
            alerts.append({
                'type': 'danger',
                'message': f'Low SpO2: {data["spo2"]}%',
                'metric': 'spo2',
                'value': data['spo2'],
                'trend': data.get('spo2_trend', 'unknown'),
                'anomaly': data.get('spo2_anomaly', False)
            })
    
    # Check temperature
    if 'temperature' in data:
        if data['temperature'] < THRESHOLDS['temperature']['min']:
            alerts.append({
                'type': 'warning',
                'message': f'Low temperature: {data["temperature"]}°C',
                'metric': 'temperature',
                'value': data['temperature'],
                'trend': data.get('temperature_trend', 'unknown'),
                'anomaly': data.get('temperature_anomaly', False)
            })
        elif data['temperature'] > THRESHOLDS['temperature']['max']:
            alerts.append({
                'type': 'danger',
                'message': f'High temperature: {data["temperature"]}°C',
                'metric': 'temperature',
                'value': data['temperature'],
                'trend': data.get('temperature_trend', 'unknown'),
                'anomaly': data.get('temperature_anomaly', False)
            })
    
    # Check blood pressure
    if 'bloodPressure' in data:
        bp = data['bloodPressure']
        for reading in ['systolic', 'diastolic']:
            if reading in bp:
                if bp[reading] > THRESHOLDS['bloodPressure'][reading]['max']:
                    alerts.append({
                        'type': 'danger',
                        'message': f'High {reading} pressure: {bp[reading]} mmHg',
                        'metric': f'bloodPressure_{reading}',
                        'value': bp[reading],
                        'trend': bp.get(f'{reading}_trend', 'unknown'),
                        'anomaly': bp.get(f'{reading}_anomaly', False)
                    })
    
    # Check blood sugar
    if 'bloodSugar' in data:
        if data['bloodSugar'] > THRESHOLDS['bloodSugar']['max']:
            alerts.append({
                'type': 'danger',
                'message': f'High blood sugar: {data["bloodSugar"]} mg/dL',
                'metric': 'bloodSugar',
                'value': data['bloodSugar'],
                'trend': data.get('bloodSugar_trend', 'unknown'),
                'anomaly': data.get('bloodSugar_anomaly', False)
            })
    
    return alerts

def connect_to_backend():
    try:
        sio.connect(SOCKET_URL)
        print("Connected to Socket.IO server")
    except Exception as e:
        print(f"Socket.IO connection error: {e}")

def read_serial_data():
    try:
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
        print(f"Connected to NodeMCU on {SERIAL_PORT}")
        
        while True:
            if ser.in_waiting:
                try:
                    # Read and decode the line
                    line = ser.readline().decode('utf-8').strip()
                    
                    # Parse the JSON data
                    sensor_data = json.loads(line)
                    
                    # Add timestamp
                    sensor_data['timestamp'] = datetime.now().isoformat()
                    
                    # Preprocess the data
                    processed_data = preprocess_health_metrics(sensor_data)
                    
                    # Validate health metrics and get alerts
                    alerts = validate_health_metrics(processed_data)
                    
                    # Send to backend for storage
                    send_to_backend(processed_data)
                    
                    # Emit real-time data via Socket.IO
                    sio.emit('sensor_data', processed_data)
                    
                    # Emit alerts if any
                    if alerts:
                        sio.emit('health_alerts', alerts)
                    
                    print(f"Received data: {processed_data}")
                    if alerts:
                        print(f"Generated alerts: {alerts}")
                    
                except json.JSONDecodeError:
                    print("Invalid JSON data received")
                except Exception as e:
                    print(f"Error processing data: {e}")
                    
            time.sleep(0.1)  # Small delay to prevent CPU overuse
            
    except serial.SerialException as e:
        print(f"Serial connection error: {e}")
    finally:
        if 'ser' in locals():
            ser.close()

def send_to_backend(data):
    try:
        # Add authentication token if needed
        headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_AUTH_TOKEN'  # Replace with actual token
        }
        
        response = requests.post(
            f"{BACKEND_URL}/api/sensors",
            json=data,
            headers=headers
        )
        
        if response.status_code == 201:
            print("Data successfully sent to backend")
        else:
            print(f"Failed to send data to backend: {response.status_code}")
            
    except Exception as e:
        print(f"Error sending data to backend: {e}")

@sio.event
def connect():
    print("Connected to Socket.IO server")

@sio.event
def disconnect():
    print("Disconnected from Socket.IO server")

def main():
    # Connect to Socket.IO server
    connect_to_backend()
    
    # Start reading serial data in a separate thread
    serial_thread = threading.Thread(target=read_serial_data)
    serial_thread.daemon = True
    serial_thread.start()
    
    try:
        # Keep the main thread alive
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Stopping sensor data collection...")
        sio.disconnect()

if __name__ == "__main__":
    main() 