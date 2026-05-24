
# ⚡ Smart EV Route Planner

<div align="center">

![EV Banner](https://img.shields.io/badge/Smart-EV%20Route%20Planner-00e5a0?style=for-the-badge&logo=googlemaps&logoColor=white)

### 🚗 Intelligent EV Trip Planning System  
### ลดความกังวลเรื่องแบตหมดกลางทาง (Range Anxiety)

แอปพลิเคชันวางแผนเส้นทางสำหรับรถยนต์ไฟฟ้า ที่ช่วยคำนวณระยะทาง  
วิเคราะห์พลังงานแบตเตอรี่ และแนะนำสถานีชาร์จที่เหมาะสมแบบอัตโนมัติ

<br>

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/Vanilla_JS-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=flat-square&logo=leaflet&logoColor=white)
![OSRM](https://img.shields.io/badge/OSRM-Routing-blue?style=flat-square)

</div>

---

## 🚀 Live Demo

> 🌐 ทดลองใช้งานระบบได้ทันที

🔗 **[Open Smart EV Route Planner](https://gilded-griffin-22fa9f.netlify.app/)**

> ⚠️ เปลี่ยนลิงก์ด้านบนเป็น GitHub Pages / Vercel / Netlify ของคุณ

---

# ✨ Key Features

## 🚙 EV Database Integration
- รองรับฐานข้อมูลรถยนต์ไฟฟ้ายอดนิยม
- ดึงข้อมูลแบตเตอรี่และอัตราการใช้พลังงานอัตโนมัติ
- คำนวณระยะทางได้แม่นยำตามรุ่นรถจริง

---

## 🗺️ Interactive Map & Smart Search
- ค้นหาสถานที่ด้วย Text Search
- รองรับภาษาไทย
- เลือกพิกัดโดยตรงจากแผนที่
- Interactive UI แบบ Real-time

---

## 🔋 Smart Charging Suggestion
หากแบตเตอรี่ไม่เพียงพอสำหรับการเดินทาง:

✅ ระบบจะค้นหาสถานีชาร์จที่ใกล้เส้นทางที่สุด  
✅ คำนวณเวลาชาร์จโดยอัตโนมัติ  
✅ ลดระยะอ้อมให้น้อยที่สุด  

---

## 🧠 Explainable AI (XAI)
ระบบสามารถอธิบายเหตุผลในการเลือกสถานีชาร์จ เช่น:

- ระยะอ้อมน้อยที่สุด
- แบตเตอรี่เพียงพอไปถึง
- เวลาเดินทางรวมดีที่สุด

---

## ⏱️ Detailed Journey Timeline
แสดงผล Timeline การเดินทางแบบละเอียด

- เวลาออกเดินทาง
- จุดแวะชาร์จ
- ระยะทาง
- เวลาเดินทางรวม
- เวลาถึงปลายทาง

---

# ⚙️ System Workflow

```text
📍 รับพิกัดต้นทาง-ปลายทาง
        │
        ▼
🔋 ประเมินระดับแบตเตอรี่
        │
        ▼
⚡ ค้นหาสถานีชาร์จที่เหมาะสม
        │
        ▼
🛣️ คำนวณเส้นทางถนนจริงผ่าน OSRM
        │
        ▼
🏁 สรุปผลและแสดงบนแผนที่
```

---

# 🧠 Route Planning Logic

### 1️⃣ Pre-filter
ใช้สูตร Haversine เพื่อกรองสถานีชาร์จที่อยู่นอกเส้นทาง

### 2️⃣ Scoring
ประเมินค่า Detour Ratio เพื่อหาสถานีที่อ้อมน้อยที่สุด

### 3️⃣ Routing
เรียกใช้ OSRM API เพื่อคำนวณ:
- ระยะทางถนนจริง
- เวลาเดินทาง
- เส้นทาง GeoJSON

---

# 🛠 Tech Stack

| Category | Technology | Purpose |
|---|---|---|
| Frontend | HTML5, CSS3, Vanilla JS | UI & Logic |
| Mapping | Leaflet.js | Interactive Map |
| Routing | OSRM API | Route Calculation |
| Geocoding | Nominatim (OSM) | Search & Coordinates |
| PWA | Service Worker | Installable Web App |

---

# 📱 Mobile Installation

## 🍎 iPhone (Safari)
1. กดปุ่ม **Share**
2. เลือก **Add to Home Screen**

## 🤖 Android (Chrome)
1. กดเมนู **⋮**
2. เลือก **Install App** หรือ **Add to Home Screen**

---

# 💻 Local Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/ev-route-planner.git
```

## 2️⃣ Open Project

```bash
cd ev-route-planner
```

จากนั้นเปิดไฟล์:

```bash
ev_route_planner.html
```

ผ่าน Browser ได้ทันที

---

# 📂 Project Structure

```bash
📦 ev-route-planner
 ┣ 📄 ev_route_planner.html
 ┣ 📄 index.js
 ┣ 📄 manifest.json
 ┣ 📄 sw.js
 ┣ 📄 README.md
 ┗ 📁 assets
```

---

# 🌍 APIs Used

| API | Description |
|---|---|
| OSRM API | Routing & Navigation |
| Nominatim API | Geocoding & Search |
| Leaflet.js | Interactive Mapping |

---

# ⚠️ Disclaimer

- ระบบนี้เป็น Prototype
- ข้อมูลสถานีชาร์จยังเป็น Hardcoded Dataset
- ยังไม่มีการเชื่อมต่อสถานีชาร์จแบบ Real-time
- ใช้ Public APIs สำหรับการศึกษาและทดลองระบบ

---

# 📸 Preview

> แนะนำให้อัปโหลด Screenshot ของระบบไว้ในโฟลเดอร์ `/assets`

```md
![Preview](./assets/preview.png)
```

---

# 👨‍💻 Developer

**Smart EV Route Planner**  
Developed for learning, research, and EV route optimization experiments.

---

<div align="center">

### ⭐ หากโปรเจกต์นี้มีประโยชน์ อย่าลืมกด Star บน GitHub ⭐

</div>
