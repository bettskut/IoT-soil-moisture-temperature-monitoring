/*
 * ESP8266 Soil Moisture + Temperature DS18B20
 * Kirim ke Backend Lokal (XAMPP)
 * Board: NodeMCU ESP8266
 */

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>

/* ===== WIFI ===== */
const char* WIFI_SSID = "oktobert";
const char* WIFI_PASS = "12348765";

/* ===== BACKEND ===== */
// GANTI IP sesuai ipconfig laptop kamu
const char* serverUrl = "http://192.168.100.8/iot/save.php";

/* ===== Sensor Soil ===== */
#define SENSOR_PIN A0
#define SAMPLE_TIME 10000
#define DRY_VALUE 565
#define WET_VALUE 100

/* ===== Sensor Suhu ===== */
#define ONE_WIRE_BUS D4
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature tempSensor(&oneWire);

unsigned long lastSend = 0;
WiFiClient client;

/* ===== WiFi Connect ===== */
void connectWiFi() {
  Serial.print("Menghubungkan WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✓ WiFi Terhubung");
}

/* ===== Read Soil ===== */
int readSoil() {
  long sum = 0;
  for (int i = 0; i < 20; i++) {
    sum += analogRead(SENSOR_PIN);
    delay(10);
  }
  return sum / 20;
}

/* ===== Kirim ke Backend ===== */
void sendToBackend(int moisture, float tempC) {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;

  String url = String(serverUrl) +
               "?moisture=" + String(moisture) +
               "&temperature=" + String(tempC, 2);

  Serial.println("Kirim ke backend:");
  Serial.println(url);

  http.begin(client, url);
  int code = http.GET();

  if (code > 0) {
    Serial.print("✓ HTTP ");
    Serial.println(code);
  } else {
    Serial.print("✗ ERROR ");
    Serial.println(code);
  }

  http.end();
}

/* ===== Setup ===== */
void setup() {
  Serial.begin(115200);
  connectWiFi();
  tempSensor.begin();
}

/* ===== Loop ===== */
void loop() {
  if (millis() - lastSend >= SAMPLE_TIME) {
    lastSend = millis();

    int raw = readSoil();
    int moisture = map(raw, DRY_VALUE, WET_VALUE, 0, 100);
    moisture = constrain(moisture, 0, 100);

    tempSensor.requestTemperatures();
    float tempC = tempSensor.getTempCByIndex(0);

    Serial.println("===============================");
    Serial.printf("Moisture    : %d %%\n", moisture);
    Serial.printf("Temperature : %.2f °C\n", tempC);
    Serial.println("===============================\n");

    sendToBackend(moisture, tempC);
  }
}
