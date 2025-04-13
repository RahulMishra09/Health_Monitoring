#include <ESP8266WiFi.h>
#include <Wire.h>
#include <ArduinoJson.h>
#include <MAX30100_PulseOximeter.h>
#include <Adafruit_MLX90614.h>
#include <Adafruit_ADS1X15.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Device ID
const String deviceId = "NODEMCU_001";

// Initialize sensors
PulseOximeter pox;
Adafruit_MLX90614 mlx = Adafruit_MLX90614();
Adafruit_ADS1115 ads;

// Variables for sensor readings
float heartRate = 0;
float spo2 = 0;
float temperature = 0;
float bloodPressureSystolic = 0;
float bloodPressureDiastolic = 0;
float bloodSugar = 0;
int steps = 0;
float sleepQuality = 0;

// Timers
unsigned long lastBeat = 0;
unsigned long lastStep = 0;
unsigned long lastSleepCheck = 0;

void onBeatDetected() {
    lastBeat = millis();
}

void setup() {
    Serial.begin(115200);
    
    // Initialize Pulse Oximeter
    if (!pox.begin()) {
        Serial.println("Failed to initialize pulse oximeter!");
    }
    pox.setOnBeatDetectedCallback(onBeatDetected);
    
    // Initialize MLX90614 (Temperature)
    if (!mlx.begin()) {
        Serial.println("Failed to initialize MLX90614!");
    }
    
    // Initialize ADS1115 (Blood Pressure and Sugar)
    ads.begin();
    
    // Connect to WiFi
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("Connected to WiFi");
}

void readSensors() {
    // Update Pulse Oximeter
    pox.update();
    heartRate = pox.getHeartRate();
    spo2 = pox.getSpO2();
    
    // Read Temperature
    temperature = mlx.readObjectTempC();
    
    // Simulate Blood Pressure (in a real system, use proper BP sensor)
    bloodPressureSystolic = map(analogRead(A0), 0, 1023, 90, 180);
    bloodPressureDiastolic = map(analogRead(A0), 0, 1023, 60, 110);
    
    // Simulate Blood Sugar (in a real system, use proper glucose sensor)
    bloodSugar = map(analogRead(A1), 0, 1023, 70, 200);
    
    // Simulate Steps (in a real system, use accelerometer)
    if (millis() - lastStep > 1000) {
        steps += random(0, 2);
        lastStep = millis();
    }
    
    // Simulate Sleep Quality (in a real system, use proper sleep tracking)
    if (millis() - lastSleepCheck > 5000) {
        sleepQuality = random(0, 100);
        lastSleepCheck = millis();
    }
}

void loop() {
    readSensors();
    
    // Create JSON document
    StaticJsonDocument<512> doc;
    
    // Add health metrics
    doc["deviceId"] = deviceId;
    doc["heartRate"] = heartRate;
    doc["spo2"] = spo2;
    doc["temperature"] = temperature;
    doc["bloodPressure"] = {
        "systolic": bloodPressureSystolic,
        "diastolic": bloodPressureDiastolic
    };
    doc["bloodSugar"] = bloodSugar;
    doc["activity"] = {
        "steps": steps,
        "calories": steps * 0.04, // Approximate calories burned
        "distance": steps * 0.000762 // Approximate distance in km
    };
    doc["sleep"] = {
        "quality": sleepQuality,
        "duration": 0 // This would be calculated based on sleep tracking
    };
    
    // Serialize JSON to string
    String output;
    serializeJson(doc, output);
    
    // Send data over serial
    Serial.println(output);
    
    // Wait before next reading
    delay(5000); // 5 seconds delay
} 