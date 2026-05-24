<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>⚡ Smart EV Route Planner</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"/>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #080c14;
      --surface: #0e1420;
      --surface2: #161d2e;
      --surface3: #1e2740;
      --border: #1f2d4a;
      --border2: #2a3d60;
      --green: #00e5a0;
      --green-dim: rgba(0,229,160,0.12);
      --blue: #3d8bff;
      --blue-dim: rgba(61,139,255,0.12);
      --red: #ff4d6a;
      --red-dim: rgba(255,77,106,0.12);
      --yellow: #ffcd3c;
      --yellow-dim: rgba(255,205,60,0.12);
      --text: #d8e4ff;
      --text-dim: #5a728a;
      --text-mid: #8fa4c0;
      --glow-green: 0 0 20px rgba(0,229,160,0.3);
      --glow-blue: 0 0 20px rgba(61,139,255,0.3);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Noto Sans Thai', sans-serif;
      background: var(--bg);
      color: var(--text);
      height: 100vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    /* ── Header ── */
    header {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 10px 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      z-index: 1000;
      flex-shrink: 0;
    }
    .logo {
      font-family: 'Space Mono', monospace;
      font-size: 15px;
      font-weight: 700;
      color: var(--green);
      letter-spacing: -0.5px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .logo-badge {
      background: var(--green-dim);
      border: 1px solid var(--green);
      border-radius: 4px;
      padding: 2px 8px;
      font-size: 10px;
      color: var(--green);
      letter-spacing: 2px;
    }
    .header-subtitle {
      font-size: 11px;
      color: var(--text-dim);
      margin-left: auto;
    }

    /* ── Layout ── */
    .app { display: flex; flex: 1; overflow: hidden; }

    /* ── Sidebar ── */
    .sidebar {
      width: 360px;
      background: var(--surface);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      z-index: 500;
      flex-shrink: 0;
      scrollbar-width: thin;
      scrollbar-color: var(--border2) transparent;
    }

    .panel {
      padding: 16px;
      border-bottom: 1px solid var(--border);
    }
    .panel-title {
      font-family: 'Space Mono', monospace;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--text-dim);
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .panel-title::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--border);
    }

    /* ── Car Selector ── */
    .car-select {
      width: 100%;
      background: var(--surface2);
      border: 1px solid var(--border2);
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 13px;
      font-family: 'Noto Sans Thai', sans-serif;
      color: var(--text);
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235a728a' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 32px;
      transition: border-color 0.2s;
    }
    .car-select:focus { outline: none; border-color: var(--green); }
    .car-select option { background: var(--surface2); }

    .car-stats {
      display: none;
      margin-top: 10px;
      background: var(--surface3);
      border: 1px solid var(--border2);
      border-radius: 8px;
      padding: 10px 12px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .car-stat { text-align: center; }
    .car-stat-val {
      font-family: 'Space Mono', monospace;
      font-size: 16px;
      font-weight: 700;
      color: var(--green);
    }
    .car-stat-label { font-size: 10px; color: var(--text-dim); margin-top: 2px; }

    /* ── Battery Slider ── */
    .battery-wrap { margin-top: 4px; }
    .battery-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .battery-pct {
      font-family: 'Space Mono', monospace;
      font-size: 20px;
      font-weight: 700;
      transition: color 0.3s;
    }
    .battery-range-label { font-size: 11px; color: var(--text-dim); }
    input[type=range] {
      width: 100%;
      height: 6px;
      -webkit-appearance: none;
      background: var(--surface3);
      border-radius: 3px;
      outline: none;
      position: relative;
    }
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 18px; height: 18px;
      border-radius: 50%;
      background: var(--green);
      cursor: pointer;
      box-shadow: var(--glow-green);
    }
    .battery-bar-wrap {
      height: 8px;
      background: var(--surface3);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 8px;
    }
    .battery-bar {
      height: 100%;
      border-radius: 4px;
      transition: width 0.3s, background 0.3s;
    }

    /* ── Location Input ── */
    .location-block {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      margin-bottom: 6px;
    }
    .loc-dot {
      width: 32px; height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Space Mono', monospace;
      font-size: 12px;
      font-weight: 700;
      flex-shrink: 0;
      margin-top: 6px;
    }
    .dot-a { background: var(--green); color: #080c14; }
    .dot-b { background: var(--red); color: #fff; }

    .loc-input-wrap { flex: 1; min-width: 0; }

    /* new search box */
    .loc-search-box {
      display: flex;
      align-items: center;
      background: var(--surface2);
      border: 1px solid var(--border2);
      border-radius: 8px;
      padding: 0 8px;
      gap: 6px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .loc-search-box:focus-within {
      border-color: var(--green);
      box-shadow: 0 0 0 2px rgba(0,229,160,0.12);
    }
    .loc-search-box.has-value { border-color: var(--blue); }
    .loc-search-icon { font-size: 13px; flex-shrink: 0; color: var(--text-dim); }
    .loc-search-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: var(--text);
      font-family: 'Noto Sans Thai', sans-serif;
      font-size: 12px;
      padding: 9px 0;
      min-width: 0;
    }
    .loc-search-input::placeholder { color: var(--text-dim); font-size: 11px; }
    .loc-clear-btn {
      background: none;
      border: none;
      color: var(--text-dim);
      cursor: pointer;
      font-size: 11px;
      padding: 2px 4px;
      border-radius: 4px;
      display: none;
      flex-shrink: 0;
      line-height: 1;
    }
    .loc-clear-btn:hover { color: var(--red); }
    .loc-clear-btn.show { display: block; }

    /* swap button */
    .btn-swap {
      background: var(--surface3);
      border: 1px solid var(--border2);
      border-radius: 6px;
      color: var(--text-dim);
      font-size: 14px;
      cursor: pointer;
      padding: 2px 10px;
      transition: all 0.2s;
      line-height: 1.4;
    }
    .btn-swap:hover { border-color: var(--green); color: var(--green); }

    .search-results {
      background: var(--surface2);
      border: 1px solid var(--border2);
      border-radius: 8px;
      overflow: hidden;
      display: none;
      margin-top: 4px;
      max-height: 220px;
      overflow-y: auto;
      z-index: 9999;
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
    }
    .search-result-item {
      padding: 9px 12px;
      font-size: 11px;
      cursor: pointer;
      border-bottom: 1px solid var(--border);
      transition: background 0.15s;
      line-height: 1.5;
      display: flex;
      gap: 6px;
      align-items: flex-start;
    }
    .search-result-item:last-child { border-bottom: none; }
    .search-result-item:hover, .search-result-item.focused { background: var(--surface3); color: var(--green); }
    .search-result-item .sri-icon { flex-shrink: 0; }
    .search-result-item .sri-name { font-weight: 600; }
    .search-result-item .sri-sub { color: var(--text-dim); font-size: 10px; }
    .search-result-status {
      padding: 10px 12px;
      font-size: 11px;
      color: var(--text-dim);
      text-align: center;
    }

    .pick-actions {
      display: flex;
      gap: 6px;
    }
    .btn-pick-map {
      flex: 1;
      padding: 6px;
      border-radius: 6px;
      font-size: 10px;
      font-family: 'Noto Sans Thai', sans-serif;
      cursor: pointer;
      border: 1px solid var(--green);
      background: var(--green-dim);
      color: var(--green);
      transition: all 0.2s;
      text-align: center;
    }
    .btn-pick-map:hover { background: var(--green); color: #080c14; }

    /* ── Departure Time ── */
    .time-input {
      background: var(--surface2);
      border: 1px solid var(--border2);
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 13px;
      font-family: 'Space Mono', monospace;
      color: var(--text);
      outline: none;
      width: 100%;
      transition: border-color 0.2s;
    }
    .time-input:focus { border-color: var(--green); }

    /* ── Calc Method Toggle ── */
    .toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .toggle-label { font-size: 12px; color: var(--text-mid); }
    .toggle-switch {
      position: relative;
      width: 42px; height: 22px;
    }
    .toggle-switch input { opacity: 0; width: 0; height: 0; }
    .toggle-slider {
      position: absolute; cursor: pointer;
      top: 0; left: 0; right: 0; bottom: 0;
      background: var(--surface3);
      border: 1px solid var(--border2);
      border-radius: 22px;
      transition: 0.3s;
    }
    .toggle-slider::before {
      content: '';
      position: absolute;
      height: 14px; width: 14px;
      left: 3px; bottom: 3px;
      background: var(--text-dim);
      border-radius: 50%;
      transition: 0.3s;
    }
    .toggle-switch input:checked + .toggle-slider { background: var(--green-dim); border-color: var(--green); }
    .toggle-switch input:checked + .toggle-slider::before { transform: translateX(20px); background: var(--green); }

    /* ── Go Button ── */
    .btn-go {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #00e5a0, #00c880);
      border: none;
      border-radius: 10px;
      color: #080c14;
      font-size: 14px;
      font-weight: 700;
      font-family: 'Noto Sans Thai', sans-serif;
      cursor: pointer;
      transition: all 0.2s;
      letter-spacing: 0.3px;
      box-shadow: 0 4px 20px rgba(0,229,160,0.25);
    }
    .btn-go:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 28px rgba(0,229,160,0.4); }
    .btn-go:disabled {
      background: var(--surface3);
      color: var(--text-dim);
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }
    .btn-clear {
      width: 100%;
      padding: 8px;
      background: transparent;
      border: 1px solid var(--border2);
      border-radius: 8px;
      color: var(--text-dim);
      font-size: 11px;
      font-family: 'Noto Sans Thai', sans-serif;
      cursor: pointer;
      margin-top: 6px;
      transition: all 0.2s;
    }
    .btn-clear:hover { border-color: var(--red); color: var(--red); }

    /* ── Loading ── */
    .loading {
      display: none;
      align-items: center;
      gap: 10px;
      padding: 10px 0;
      font-size: 12px;
      color: var(--text-dim);
    }
    .loading.show { display: flex; }
    .spinner {
      width: 16px; height: 16px;
      border: 2px solid var(--border2);
      border-top-color: var(--green);
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      flex-shrink: 0;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── Error ── */
    .error-msg {
      display: none;
      background: var(--red-dim);
      border: 1px solid rgba(255,77,106,0.3);
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 11px;
      color: var(--red);
      margin-top: 8px;
    }
    .error-msg.show { display: block; }

    /* ── Result ── */
    .result-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 12px;
    }
    .result-tile {
      background: var(--surface3);
      border: 1px solid var(--border2);
      border-radius: 8px;
      padding: 10px;
    }
    .result-tile-label { font-size: 9px; color: var(--text-dim); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px; }
    .result-tile-val {
      font-family: 'Space Mono', monospace;
      font-size: 16px;
      font-weight: 700;
    }
    .result-tile-val.green { color: var(--green); }
    .result-tile-val.blue { color: var(--blue); }
    .result-tile-val.yellow { color: var(--yellow); }

    /* ── Timeline ── */
    .timeline { padding: 4px 0; }
    .tl-item {
      display: flex;
      gap: 12px;
      padding: 8px 0;
      position: relative;
    }
    .tl-item:not(:last-child)::after {
      content: '';
      position: absolute;
      left: 14px;
      top: 32px;
      bottom: 0;
      width: 2px;
      background: var(--border2);
    }
    .tl-icon {
      width: 28px; height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
    }
    .tl-icon.green-bg { background: var(--green-dim); border: 1px solid var(--green); }
    .tl-icon.blue-bg { background: var(--blue-dim); border: 1px solid var(--blue); }
    .tl-icon.red-bg { background: var(--red-dim); border: 1px solid var(--red); }
    .tl-icon.yellow-bg { background: var(--yellow-dim); border: 1px solid var(--yellow); }
    .tl-body { flex: 1; }
    .tl-time {
      font-family: 'Space Mono', monospace;
      font-size: 11px;
      color: var(--text-dim);
      margin-bottom: 2px;
    }
    .tl-label { font-size: 12px; font-weight: 600; }
    .tl-sub { font-size: 11px; color: var(--text-dim); margin-top: 2px; }

    /* ── Station Card ── */
    .station-card {
      background: var(--surface3);
      border: 1px solid var(--green);
      border-radius: 10px;
      padding: 12px;
      margin-bottom: 10px;
    }
    .station-name { font-size: 13px; font-weight: 600; color: var(--green); margin-bottom: 4px; }
    .station-meta { font-size: 11px; color: var(--text-dim); line-height: 1.8; }
    .station-badge {
      display: inline-block;
      background: var(--yellow-dim);
      border: 1px solid var(--yellow);
      border-radius: 4px;
      padding: 1px 7px;
      font-size: 9px;
      color: var(--yellow);
      font-family: 'Space Mono', monospace;
      letter-spacing: 1px;
      margin-left: 6px;
    }

    /* ── XAI Panel ── */
    .xai-item {
      display: flex;
      gap: 8px;
      font-size: 11px;
      padding: 4px 0;
      color: var(--text-mid);
      line-height: 1.5;
    }
    .xai-check { color: var(--green); flex-shrink: 0; }

    /* ── Alt Stations ── */
    .alt-station {
      background: var(--surface2);
      border: 1px solid var(--border2);
      border-radius: 8px;
      padding: 8px 12px;
      margin-bottom: 6px;
      font-size: 11px;
    }
    .alt-station-name { color: var(--text); font-weight: 600; margin-bottom: 2px; }
    .alt-station-meta { color: var(--text-dim); }

    /* ── Map ── */
    #map { flex: 1; background: var(--surface); }
    .map-status {
      position: absolute;
      top: 12px; left: 50%;
      transform: translateX(-50%);
      z-index: 999;
      background: var(--surface);
      border: 1px solid var(--green);
      border-radius: 20px;
      padding: 7px 18px;
      font-size: 12px;
      color: var(--green);
      pointer-events: none;
      display: none;
      white-space: nowrap;
      box-shadow: var(--glow-green);
    }
    .map-status.show { display: block; }
    .map-picking { cursor: crosshair !important; }

    /* ── Leaflet dark overrides ── */
    .leaflet-tile { filter: brightness(0.75) saturate(0.6) hue-rotate(200deg); }
    .leaflet-popup-content-wrapper {
      background: var(--surface);
      color: var(--text);
      border: 1px solid var(--border2);
      border-radius: 8px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.6);
      font-family: 'Noto Sans Thai', sans-serif;
      font-size: 12px;
    }
    .leaflet-popup-tip { background: var(--surface); }

    /* ── Responsive ── */
    @media (max-width: 700px) {
      .sidebar { width: 100%; height: 50vh; border-right: none; border-top: 1px solid var(--border); }
      .app { flex-direction: column-reverse; }
      #map { height: 50vh; }
    }
  </style>
  <meta name="theme-color" content="#080c14">
  <link rel="manifest" href="manifest.json">
  <link rel="apple-touch-icon" href="icon-192.png">

  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
          .then(reg => console.log('Service Worker Registered!', reg))
          .catch(err => console.error('Service Worker Error', err));
      });
    }
  </script>
</head>
<body>

<header>
  <div class="logo">
    ⚡ EV Route Planner
    <span class="logo-badge">SMART</span>
  </div>
  <span class="header-subtitle">ระบบวางแผนเส้นทางรถยนต์ไฟฟ้า</span>
</header>

<div class="app">
  <div class="sidebar">

    <!-- STEP 1: Car Selection -->
    <div class="panel">
      <div class="panel-title">🚗 Step 1 · เลือกรุ่นรถ</div>
      <select class="car-select" id="car-select" onchange="onCarChange()">
        <option value="">— เลือกรุ่นรถยนต์ไฟฟ้า —</option>
        <!-- populated by JS from EV_CARS data -->
      </select>
      <div class="car-stats" id="car-stats">
        <div class="car-stat">
          <div class="car-stat-val" id="car-battery">—</div>
          <div class="car-stat-label">แบตเตอรี่ (kWh)</div>
        </div>
        <div class="car-stat">
          <div class="car-stat-val" id="car-efficiency">—</div>
          <div class="car-stat-label">ประสิทธิภาพ (km/kWh)</div>
        </div>
        <div class="car-stat" style="grid-column:1/-1">
          <div class="car-stat-val" id="car-max-range">—</div>
          <div class="car-stat-label">รัศมีสูงสุด (กม.) เมื่อแบต 100%</div>
        </div>
      </div>
    </div>

    <!-- STEP 2: Battery -->
    <div class="panel">
      <div class="panel-title">🔋 Step 2 · ระดับแบตเตอรี่</div>
      <div class="battery-wrap">
        <div class="battery-header">
          <div>
            <div class="battery-pct" id="battery-pct" style="color:var(--green)">80%</div>
            <div class="battery-range-label">วิ่งได้ประมาณ <span id="battery-range-est">— กม.</span></div>
          </div>
          <div style="text-align:right;font-size:11px;color:var(--text-dim)">
            ลากเพื่อปรับ
          </div>
        </div>
        <div class="battery-bar-wrap">
          <div class="battery-bar" id="battery-bar" style="width:80%;background:var(--green)"></div>
        </div>
        <input type="range" id="battery-slider" min="1" max="100" value="80" oninput="onBatteryChange()">
      </div>
    </div>

    <!-- STEP 3: Locations -->
    <div class="panel">
      <div class="panel-title">📍 Step 3 · ต้นทาง & ปลายทาง</div>

      <!-- Start -->
      <div class="location-block">
        <div class="loc-dot dot-a">A</div>
        <div class="loc-input-wrap">
          <div class="loc-search-box" id="start-box">
            <span class="loc-search-icon">🔍</span>
            <input type="text" class="loc-search-input" id="start-text"
              placeholder="ต้นทาง — ค้นหาชื่อสถานที่..."
              oninput="onSearchInput('start')"
              onkeydown="onSearchKey(event,'start')"
              onfocus="onSearchFocus('start')"
            >
            <button class="loc-clear-btn" id="start-clear" onclick="clearPoint('start')" title="ล้าง">✕</button>
          </div>
          <div class="search-results" id="start-results"></div>
          <div class="pick-actions" style="margin-top:4px">
            <div class="btn-pick-map" onclick="startMapPick('start')">🗺️ จิ้มบนแผนที่</div>
          </div>
        </div>
      </div>

      <!-- swap button -->
      <div style="display:flex;justify-content:center;margin:-4px 0 2px 42px">
        <button class="btn-swap" onclick="swapPoints()" title="สลับต้นทาง-ปลายทาง">⇅</button>
      </div>

      <!-- End -->
      <div class="location-block">
        <div class="loc-dot dot-b">B</div>
        <div class="loc-input-wrap">
          <div class="loc-search-box" id="end-box">
            <span class="loc-search-icon">🔍</span>
            <input type="text" class="loc-search-input" id="end-text"
              placeholder="ปลายทาง — เช่น เชียงใหม่, ภูเก็ต..."
              oninput="onSearchInput('end')"
              onkeydown="onSearchKey(event,'end')"
              onfocus="onSearchFocus('end')"
            >
            <button class="loc-clear-btn" id="end-clear" onclick="clearPoint('end')" title="ล้าง">✕</button>
          </div>
          <div class="search-results" id="end-results"></div>
          <div class="pick-actions" style="margin-top:4px">
            <div class="btn-pick-map" onclick="startMapPick('end')">🗺️ จิ้มบนแผนที่</div>
          </div>
        </div>
      </div>

      <!-- Departure time -->
      <div style="margin-top:10px;">
        <div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">⏰ เวลาออกเดินทาง</div>
        <input type="time" class="time-input" id="departure-time" value="">
      </div>
    </div>

    <!-- STEP 4: Settings -->
    <div class="panel">
      <div class="panel-title">⚙️ Step 4 · ตั้งค่า</div>
      <div class="toggle-row">
        <div class="toggle-label">ใช้ OSRM API (ถนนจริง)</div>
        <label class="toggle-switch">
          <input type="checkbox" id="use-api" checked>
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div style="font-size:10px;color:var(--text-dim);margin-top:6px;">
        เปิด = ระยะทางถนนจริง (แม่นยำกว่า) &nbsp;|&nbsp; ปิด = สูตร Haversine (ประมาณ)
      </div>
    </div>

    <!-- Go -->
    <div class="panel">
      <div class="loading" id="loading"><div class="spinner"></div><span>กำลังวิเคราะห์เส้นทาง...</span></div>
      <div class="error-msg" id="error-msg"></div>
      <button class="btn-go" id="btn-go" onclick="planRoute()" disabled>⚡ วางแผนเส้นทาง</button>
      <button class="btn-clear" onclick="clearAll()">✕ ล้างทั้งหมด</button>
    </div>

    <!-- Results (hidden until computed) -->
    <div id="result-section" style="display:none">

      <!-- Summary -->
      <div class="panel" id="res-summary">
        <div class="panel-title">📋 สรุปเส้นทาง</div>
        <div class="result-grid">
          <div class="result-tile">
            <div class="result-tile-label">ระยะทาง</div>
            <div class="result-tile-val green" id="r-dist">—</div>
          </div>
          <div class="result-tile">
            <div class="result-tile-label">เวลารวม</div>
            <div class="result-tile-val blue" id="r-time">—</div>
          </div>
          <div class="result-tile">
            <div class="result-tile-label">แบตเมื่อถึง</div>
            <div class="result-tile-val yellow" id="r-soc">—</div>
          </div>
          <div class="result-tile">
            <div class="result-tile-label">วิธีคำนวณ</div>
            <div class="result-tile-val" id="r-method" style="font-size:11px;color:var(--text-dim)">—</div>
          </div>
        </div>
      </div>

      <!-- Station -->
      <div class="panel" id="res-station-panel" style="display:none">
        <div class="panel-title">⚡ สถานีชาร์จแนะนำ</div>
        <div id="res-station-card"></div>
        <div id="res-alt-stations"></div>
      </div>

      <!-- Timeline -->
      <div class="panel" id="res-timeline-panel" style="display:none">
        <div class="panel-title">🗓️ Timeline การเดินทาง</div>
        <div class="timeline" id="res-timeline"></div>
      </div>

      <!-- XAI -->
      <div class="panel" id="res-xai-panel" style="display:none">
        <div class="panel-title">🧠 เหตุผลในการเลือก (XAI)</div>
        <div id="res-xai"></div>
      </div>

    </div>
  </div>

  <!-- Map -->
  <div style="position:relative;flex:1;display:flex;">
    <div class="map-status" id="map-status"></div>
    <div id="map"></div>
  </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
<script>
// ─────────────────────────────────────────────────────────────────────────────
// EV DATA (Built-in cars for demo; replace with Excel load if needed)
// ─────────────────────────────────────────────────────────────────────────────
const EV_CARS = [
  { model: 'Tesla Model 3 Long Range', battery: 82, efficiency: 6.5 },
  { model: 'Tesla Model Y Long Range', battery: 82, efficiency: 6.0 },
  { model: 'BYD Atto 3', battery: 60.5, efficiency: 5.5 },
  { model: 'BYD Han EV', battery: 85.4, efficiency: 5.8 },
  { model: 'BYD Seal', battery: 82.5, efficiency: 6.2 },
  { model: 'MG ZS EV', battery: 51, efficiency: 5.8 },
  { model: 'MG4 Electric', battery: 64, efficiency: 6.4 },
  { model: 'Neta V', battery: 38.5, efficiency: 5.5 },
  { model: 'ORA Good Cat', battery: 63, efficiency: 6.0 },
  { model: 'Volvo XC40 Recharge', battery: 82, efficiency: 5.2 },
  { model: 'BMW iX3', battery: 80, efficiency: 5.8 },
  { model: 'Mercedes EQA 250', battery: 66.5, efficiency: 5.4 },
  { model: 'Hyundai IONIQ 6', battery: 77.4, efficiency: 6.8 },
  { model: 'Kia EV6 Long Range', battery: 77.4, efficiency: 6.3 },
  { model: 'Nissan Leaf e+', battery: 62, efficiency: 5.4 },
  { model: 'GWM Ora 03', battery: 49, efficiency: 6.0 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Constants (same as notebook)
// ─────────────────────────────────────────────────────────────────────────────
const SAFETY_BUFFER_KM = 20;
const MIN_SOC_ON_ARRIVAL = 15;
const AVERAGE_SPEED_KMH = 80;
const FAST_CHARGE_RATE_KW = 50;
const NORMAL_CHARGE_RATE_KW = 7.4;
const TARGET_SOC_AFTER_CHARGE = 80;
const OSRM_API = 'https://router.project-osrm.org/route/v1/driving';

// ─────────────────────────────────────────────────────────────────────────────
// Charging Stations — ครบทั่วประเทศไทย (EA, PEA Volta, Tesla, PTT EV, Shell, Charge Now, Voltio ฯลฯ)
// ─────────────────────────────────────────────────────────────────────────────
const EV_STATIONS = [
  // ══ กรุงเทพมหานคร ══
  { name:'PEA Volta สยามพารากอน', category:'DC Fast CCS', lat:13.7463, lon:100.5340 },
  { name:'PEA Volta เซ็นทรัลเวิลด์', category:'DC Fast CCS', lat:13.7469, lon:100.5393 },
  { name:'EA Anywhere เซ็นทรัล พระราม 9', category:'DC CCS Charge', lat:13.7578, lon:100.5697 },
  { name:'Tesla Supercharger Icon Siam', category:'Tesla Supercharger', lat:13.7267, lon:100.5089 },
  { name:'PTT EV Station เพลินจิต', category:'DC Fast CCS', lat:13.7428, lon:100.5491 },
  { name:'Shell Recharge เอกมัย', category:'DC Fast CCS', lat:13.7207, lon:100.5862 },
  { name:'Charge Now เอ็มควอเทียร์', category:'DC Fast CCS', lat:13.7300, lon:100.5695 },
  { name:'EA Anywhere เมเจอร์ รัชโยธิน', category:'DC CCS Charge', lat:13.8319, lon:100.5707 },
  { name:'PEA Volta บิ๊กซี แจ้งวัฒนะ', category:'DC Fast CCS', lat:13.8961, lon:100.5396 },
  { name:'EA Anywhere เซ็นทรัล ลาดพร้าว', category:'DC CCS Charge', lat:13.8150, lon:100.5720 },
  { name:'Voltio เทอร์มินอล 21 อโศก', category:'DC Fast CCS', lat:13.7368, lon:100.5608 },
  { name:'PTT EV Station สุขุมวิท 71', category:'DC Fast CCS', lat:13.7156, lon:100.5878 },
  { name:'PEA Volta ซีคอนบางแค', category:'DC Fast CCS', lat:13.7124, lon:100.4082 },
  { name:'EA Anywhere เซ็นทรัล บางนา', category:'DC CCS Charge', lat:13.6636, lon:100.6033 },
  { name:'EA Anywhere เมกาบางนา', category:'DC CCS Charge', lat:13.6575, lon:100.6889 },
  { name:'Tesla Supercharger เมเจอร์ บางนา', category:'Tesla Supercharger', lat:13.6598, lon:100.6120 },
  { name:'PEA Volta ฟิวเจอร์พาร์ค รังสิต', category:'DC Fast CCS', lat:14.0221, lon:100.6134 },
  { name:'Tesla Supercharger เมเจอร์ รังสิต', category:'Tesla Supercharger', lat:14.0262, lon:100.6174 },
  { name:'EA Anywhere วังน้อย อยุธยา', category:'DC CCS Charge', lat:14.4137, lon:100.7382 },
  { name:'Shell Recharge ดอนเมือง', category:'DC Fast CCS', lat:13.9125, lon:100.6066 },
  { name:'EA Anywhere ดอนเมือง', category:'DC CCS Charge', lat:13.9140, lon:100.6055 },
  { name:'Charge Now เซ็นทรัล รามอินทรา', category:'DC Fast CCS', lat:13.8608, lon:100.6280 },
  { name:'PEA Volta ศาลายา', category:'DC Fast CCS', lat:13.7901, lon:100.3181 },
  { name:'EA Anywhere นครปฐม', category:'DC CCS Charge', lat:13.8196, lon:100.0630 },
  { name:'Voltio เซ็นทรัล ปิ่นเกล้า', category:'DC Fast CCS', lat:13.7747, lon:100.4828 },
  { name:'PTT EV Station พระราม 4', category:'DC Fast CCS', lat:13.7230, lon:100.5290 },
  { name:'EA Anywhere สยาม', category:'DC CCS Charge', lat:13.7455, lon:100.5335 },
  { name:'Shell Recharge พหลโยธิน', category:'DC Fast CCS', lat:13.8050, lon:100.5498 },

  // ══ ปริมณฑล / สนามบิน ══
  { name:'PEA Volta สนามบินสุวรรณภูมิ', category:'DC Fast CCS', lat:13.6881, lon:100.7505 },
  { name:'EA Anywhere สนามบินสุวรรณภูมิ', category:'DC CCS Charge', lat:13.6895, lon:100.7510 },
  { name:'PTT EV Station สมุทรปราการ', category:'DC Fast CCS', lat:13.5970, lon:100.5969 },
  { name:'EA Anywhere สมุทรสาคร', category:'DC CCS Charge', lat:13.5500, lon:100.2740 },
  { name:'Charge Now นนทบุรี เซ็นทรัล', category:'DC Fast CCS', lat:13.8605, lon:100.5027 },

  // ══ กรุงเทพ-โคราช (ทางหลวง 1 / มอเตอร์เวย์ M6) ══
  { name:'PTT EV Station สระบุรี (ขาออก)', category:'DC Fast CCS', lat:14.5292, lon:100.9176 },
  { name:'Tesla Supercharger โรบินสัน สระบุรี', category:'Tesla Supercharger', lat:14.5309, lon:100.9213 },
  { name:'EA Anywhere สระบุรี', category:'DC CCS Charge', lat:14.5380, lon:100.9106 },
  { name:'PEA Volta มวกเหล็ก', category:'DC Fast CCS', lat:14.7182, lon:101.0215 },
  { name:'Shell Recharge ปากช่อง', category:'DC Fast CCS', lat:14.7215, lon:101.4060 },
  { name:'EA Anywhere ปากช่อง', category:'DC CCS Charge', lat:14.7221, lon:101.4098 },
  { name:'Tesla Supercharger ปากช่อง', category:'Tesla Supercharger', lat:14.7198, lon:101.4052 },
  { name:'PTT EV Station สีคิ้ว', category:'DC Fast CCS', lat:14.8869, lon:101.7279 },
  { name:'PEA Volta โคราช Terminal 21', category:'DC Fast CCS', lat:14.9758, lon:102.0815 },
  { name:'EA Anywhere โคราช โรบินสัน', category:'DC CCS Charge', lat:14.9793, lon:102.0879 },
  { name:'Tesla Supercharger นครราชสีมา', category:'Tesla Supercharger', lat:14.9912, lon:102.0780 },
  { name:'Charge Now โคราช เซ็นทรัล', category:'DC Fast CCS', lat:14.9780, lon:102.0960 },
  { name:'EA Anywhere นครราชสีมา บิ๊กซี', category:'DC CCS Charge', lat:14.9820, lon:102.0860 },

  // ══ กรุงเทพ-เชียงใหม่ (ทางหลวง 1 ผ่านนครสวรรค์) ══
  { name:'PTT EV Station สิงห์บุรี', category:'DC Fast CCS', lat:14.8900, lon:100.3985 },
  { name:'EA Anywhere นครสวรรค์ บิ๊กซี', category:'DC CCS Charge', lat:15.7025, lon:100.1369 },
  { name:'PEA Volta นครสวรรค์', category:'DC Fast CCS', lat:15.7040, lon:100.1420 },
  { name:'Tesla Supercharger นครสวรรค์', category:'Tesla Supercharger', lat:15.6998, lon:100.1348 },
  { name:'Shell Recharge พิจิตร', category:'DC Fast CCS', lat:16.4432, lon:100.3488 },
  { name:'EA Anywhere กำแพงเพชร', category:'DC CCS Charge', lat:16.4811, lon:99.5225 },
  { name:'PTT EV Station กำแพงเพชร', category:'DC Fast CCS', lat:16.4750, lon:99.5196 },
  { name:'PEA Volta ตาก', category:'DC Fast CCS', lat:16.8796, lon:99.1266 },
  { name:'EA Anywhere ตาก', category:'DC CCS Charge', lat:16.8810, lon:99.1255 },
  { name:'PTT EV Station ลำปาง (ขาเหนือ)', category:'DC Fast CCS', lat:18.2870, lon:99.4930 },
  { name:'Tesla Supercharger ลำปาง', category:'Tesla Supercharger', lat:18.2880, lon:99.4945 },
  { name:'EA Anywhere ลำปาง โลตัส', category:'DC CCS Charge', lat:18.2874, lon:99.4950 },
  { name:'PEA Volta ลำปาง บิ๊กซี', category:'DC Fast CCS', lat:18.2910, lon:99.5010 },
  { name:'Shell Recharge ลำพูน', category:'DC Fast CCS', lat:18.5737, lon:99.0082 },
  { name:'EA Anywhere ลำพูน', category:'DC CCS Charge', lat:18.5720, lon:99.0070 },
  { name:'PEA Volta เชียงใหม่ เมย์แฟร์', category:'DC Fast CCS', lat:18.7883, lon:98.9853 },
  { name:'Tesla Supercharger เชียงใหม่ นิมมาน', category:'Tesla Supercharger', lat:18.8005, lon:98.9597 },
  { name:'EA Anywhere เชียงใหม่ เซ็นทรัล เฟสติวัล', category:'DC CCS Charge', lat:18.7976, lon:98.9650 },
  { name:'PEA Volta เชียงใหม่ สนามบิน', category:'DC Fast CCS', lat:18.7706, lon:98.9626 },
  { name:'Charge Now เชียงใหม่ พรอมเมนาดา', category:'DC Fast CCS', lat:18.8121, lon:99.0271 },
  { name:'PTT EV Station เชียงใหม่ ถ.มหิดล', category:'DC Fast CCS', lat:18.7620, lon:98.9680 },
  { name:'Voltio เชียงใหม่ วันไนมอลล์', category:'DC Fast CCS', lat:18.7891, lon:98.9921 },

  // ══ กรุงเทพ-เชียงใหม่ (ทางหลวง 11 ผ่านพิษณุโลก) ══
  { name:'EA Anywhere พิษณุโลก', category:'DC CCS Charge', lat:16.8175, lon:100.2659 },
  { name:'Tesla Supercharger พิษณุโลก', category:'Tesla Supercharger', lat:16.8244, lon:100.2690 },
  { name:'PTT EV Station พิษณุโลก', category:'DC Fast CCS', lat:16.8200, lon:100.2680 },
  { name:'EA Anywhere อุตรดิตถ์', category:'DC CCS Charge', lat:17.6236, lon:100.0993 },
  { name:'PEA Volta แพร่', category:'DC Fast CCS', lat:18.1435, lon:100.1200 },
  { name:'EA Anywhere เด่นชัย', category:'DC CCS Charge', lat:18.1398, lon:100.0550 },
  { name:'PTT EV Station ลำปาง (ทางหลวง 11)', category:'DC Fast CCS', lat:18.2760, lon:99.4800 },

  // ══ ภาคเหนือ (เชียงราย / แม่ฮ่องสอน) ══
  { name:'EA Anywhere เชียงราย', category:'DC CCS Charge', lat:19.9105, lon:99.8406 },
  { name:'PEA Volta เชียงราย', category:'DC Fast CCS', lat:19.9080, lon:99.8360 },
  { name:'Tesla Supercharger เชียงราย', category:'Tesla Supercharger', lat:19.9130, lon:99.8430 },
  { name:'PTT EV Station เชียงราย เซ็นทรัล', category:'DC Fast CCS', lat:19.9060, lon:99.8270 },
  { name:'EA Anywhere แม่สาย', category:'DC CCS Charge', lat:20.4293, lon:99.8831 },
  { name:'PEA Volta พะเยา', category:'DC Fast CCS', lat:19.1656, lon:99.9017 },
  { name:'EA Anywhere น่าน', category:'DC CCS Charge', lat:18.7800, lon:100.7726 },

  // ══ กรุงเทพ-ใต้ (ทางหลวง 4 / มอเตอร์เวย์ M82) ══
  { name:'PTT EV Station เพชรบุรี (ขาออก)', category:'DC Fast CCS', lat:13.1100, lon:99.9390 },
  { name:'PEA Volta เพชรบุรี', category:'DC Fast CCS', lat:13.1080, lon:99.9375 },
  { name:'EA Anywhere ชะอำ', category:'DC CCS Charge', lat:12.7939, lon:99.9643 },
  { name:'Shell Recharge หัวหิน', category:'DC Fast CCS', lat:12.5700, lon:99.9600 },
  { name:'Tesla Supercharger หัวหิน', category:'Tesla Supercharger', lat:12.5671, lon:99.9590 },
  { name:'PEA Volta หัวหิน บลูพอร์ต', category:'DC Fast CCS', lat:12.5720, lon:99.9620 },
  { name:'EA Anywhere ประจวบคีรีขันธ์', category:'DC CCS Charge', lat:11.8219, lon:99.7953 },
  { name:'PTT EV Station ชุมพร', category:'DC Fast CCS', lat:10.4910, lon:99.1785 },
  { name:'PEA Volta ชุมพร', category:'DC Fast CCS', lat:10.4934, lon:99.1800 },
  { name:'EA Anywhere ชุมพร โลตัส', category:'DC CCS Charge', lat:10.4960, lon:99.1826 },
  { name:'Shell Recharge หลังสวน', category:'DC Fast CCS', lat:10.0886, lon:99.0633 },
  { name:'Tesla Supercharger สุราษฎร์ธานี', category:'Tesla Supercharger', lat:9.1390, lon:99.3230 },
  { name:'PEA Volta สุราษฎร์ธานี', category:'DC Fast CCS', lat:9.1382, lon:99.3218 },
  { name:'EA Anywhere สุราษฎร์ธานี บิ๊กซี', category:'DC CCS Charge', lat:9.1350, lon:99.3180 },
  { name:'PTT EV Station สุราษฎร์ธานี', category:'DC Fast CCS', lat:9.1400, lon:99.3250 },
  { name:'Charge Now เกาะสมุย', category:'DC Fast CCS', lat:9.5363, lon:100.0618 },
  { name:'PEA Volta นครศรีธรรมราช', category:'DC Fast CCS', lat:8.4304, lon:99.9631 },
  { name:'EA Anywhere ทุ่งสง', category:'DC CCS Charge', lat:8.1650, lon:99.6800 },
  { name:'PTT EV Station นครศรีธรรมราช', category:'DC Fast CCS', lat:8.4320, lon:99.9650 },
  { name:'Tesla Supercharger หาดใหญ่', category:'Tesla Supercharger', lat:7.0067, lon:100.4747 },
  { name:'PEA Volta หาดใหญ่ เซ็นทรัล', category:'DC Fast CCS', lat:7.0080, lon:100.4760 },
  { name:'EA Anywhere สงขลา', category:'DC CCS Charge', lat:7.1840, lon:100.5970 },
  { name:'Shell Recharge หาดใหญ่', category:'DC Fast CCS', lat:7.0050, lon:100.4680 },
  { name:'PTT EV Station หาดใหญ่', category:'DC Fast CCS', lat:7.0090, lon:100.4800 },
  { name:'EA Anywhere ปัตตานี', category:'DC CCS Charge', lat:6.8660, lon:101.2500 },
  { name:'PEA Volta ยะลา', category:'DC Fast CCS', lat:6.5449, lon:101.2800 },

  // ══ ภาคใต้ฝั่งอันดามัน ══
  { name:'PTT EV Station ระนอง', category:'DC Fast CCS', lat:9.9600, lon:98.6350 },
  { name:'PEA Volta กระบี่', category:'DC Fast CCS', lat:8.0863, lon:98.9063 },
  { name:'EA Anywhere กระบี่', category:'DC CCS Charge', lat:8.0850, lon:98.9050 },
  { name:'Shell Recharge พังงา', category:'DC Fast CCS', lat:8.4511, lon:98.5258 },
  { name:'Tesla Supercharger ภูเก็ต สนามบิน', category:'Tesla Supercharger', lat:8.1132, lon:98.3016 },
  { name:'Tesla Supercharger ภูเก็ต นิมมาน', category:'Tesla Supercharger', lat:7.8845, lon:98.3917 },
  { name:'EA Anywhere ภูเก็ต เซ็นทรัล ภูเก็ต', category:'DC CCS Charge', lat:7.8851, lon:98.3930 },
  { name:'PEA Volta ภูเก็ต ป่าตอง', category:'DC Fast CCS', lat:7.8965, lon:98.2980 },
  { name:'PTT EV Station ภูเก็ต', category:'DC Fast CCS', lat:7.8800, lon:98.3850 },
  { name:'Charge Now ภูเก็ต จังซีลอน', category:'DC Fast CCS', lat:7.8900, lon:98.2960 },
  { name:'Shell Recharge ภูเก็ต ถลาง', category:'DC Fast CCS', lat:8.0840, lon:98.3560 },
  { name:'EA Anywhere ตรัง', category:'DC CCS Charge', lat:7.5586, lon:99.6110 },
  { name:'PEA Volta สตูล', category:'DC Fast CCS', lat:6.6250, lon:100.0670 },

  // ══ ภาคตะวันออก (EEC) ══
  { name:'EA Anywhere ชลบุรี', category:'DC CCS Charge', lat:13.3611, lon:100.9838 },
  { name:'PTT EV Station ชลบุรี (มอเตอร์เวย์)', category:'DC Fast CCS', lat:13.2800, lon:101.0200 },
  { name:'Shell Recharge ศรีราชา', category:'DC Fast CCS', lat:13.1639, lon:101.0311 },
  { name:'PEA Volta พัทยา', category:'DC Fast CCS', lat:12.9236, lon:100.8825 },
  { name:'Tesla Supercharger พัทยา', category:'Tesla Supercharger', lat:12.9250, lon:100.8840 },
  { name:'EA Anywhere พัทยา', category:'DC CCS Charge', lat:12.9240, lon:100.8835 },
  { name:'Charge Now พัทยา ฮาร์เบอร์', category:'DC Fast CCS', lat:12.9310, lon:100.8770 },
  { name:'PTT EV Station ระยอง', category:'DC Fast CCS', lat:12.6820, lon:101.2530 },
  { name:'EA Anywhere ระยอง', category:'DC CCS Charge', lat:12.6824, lon:101.2538 },
  { name:'PEA Volta อมตะซิตี้', category:'DC Fast CCS', lat:13.1840, lon:101.0610 },
  { name:'EA Anywhere จันทบุรี', category:'DC CCS Charge', lat:12.6097, lon:102.1043 },
  { name:'PTT EV Station จันทบุรี', category:'DC Fast CCS', lat:12.6050, lon:102.1030 },
  { name:'PEA Volta ตราด', category:'DC Fast CCS', lat:12.2429, lon:102.5178 },
  { name:'EA Anywhere ตราด', category:'DC CCS Charge', lat:12.2440, lon:102.5190 },

  // ══ ภาคตะวันออกเฉียงเหนือ ══
  { name:'EA Anywhere ขอนแก่น เซ็นทรัล', category:'DC CCS Charge', lat:16.4282, lon:102.8359 },
  { name:'Tesla Supercharger ขอนแก่น', category:'Tesla Supercharger', lat:16.4300, lon:102.8370 },
  { name:'PTT EV Station ขอนแก่น', category:'DC Fast CCS', lat:16.4260, lon:102.8340 },
  { name:'Shell Recharge ขอนแก่น', category:'DC Fast CCS', lat:16.4311, lon:102.8300 },
  { name:'PEA Volta อุดรธานี', category:'DC Fast CCS', lat:17.4138, lon:102.7878 },
  { name:'EA Anywhere อุดรธานี โลตัส', category:'DC CCS Charge', lat:17.4150, lon:102.7890 },
  { name:'PTT EV Station อุดรธานี', category:'DC Fast CCS', lat:17.4120, lon:102.7860 },
  { name:'Tesla Supercharger อุดรธานี', category:'Tesla Supercharger', lat:17.4160, lon:102.7900 },
  { name:'PEA Volta หนองคาย', category:'DC Fast CCS', lat:17.8782, lon:102.7463 },
  { name:'EA Anywhere หนองคาย', category:'DC CCS Charge', lat:17.8800, lon:102.7480 },
  { name:'PEA Volta อุบลราชธานี', category:'DC Fast CCS', lat:15.2449, lon:104.8473 },
  { name:'EA Anywhere อุบลราชธานี', category:'DC CCS Charge', lat:15.2440, lon:104.8460 },
  { name:'PTT EV Station อุบลราชธานี', category:'DC Fast CCS', lat:15.2460, lon:104.8490 },
  { name:'PEA Volta บุรีรัมย์', category:'DC Fast CCS', lat:14.9937, lon:103.1028 },
  { name:'EA Anywhere สุรินทร์', category:'DC CCS Charge', lat:14.8824, lon:103.4939 },
  { name:'PTT EV Station มุกดาหาร', category:'DC Fast CCS', lat:16.5430, lon:104.7240 },
  { name:'EA Anywhere สกลนคร', category:'DC CCS Charge', lat:17.1547, lon:104.1362 },
  { name:'EA Anywhere นครพนม', category:'DC CCS Charge', lat:17.3920, lon:104.7730 },
  { name:'PEA Volta ร้อยเอ็ด', category:'DC Fast CCS', lat:16.0549, lon:103.6524 },
  { name:'EA Anywhere ชัยภูมิ', category:'DC CCS Charge', lat:15.8059, lon:102.0314 },
  { name:'PTT EV Station โคราช-บุรีรัมย์ (แวะพัก)', category:'DC Fast CCS', lat:14.9930, lon:102.5600 },

  // ══ ภาคตะวันตก ══
  { name:'EA Anywhere กาญจนบุรี', category:'DC CCS Charge', lat:14.0023, lon:99.5448 },
  { name:'PTT EV Station กาญจนบุรี', category:'DC Fast CCS', lat:14.0010, lon:99.5430 },
  { name:'PEA Volta ราชบุรี', category:'DC Fast CCS', lat:13.5282, lon:99.8134 },
  { name:'Shell Recharge สุพรรณบุรี', category:'DC Fast CCS', lat:14.4724, lon:100.1179 },
  { name:'EA Anywhere สุพรรณบุรี', category:'DC CCS Charge', lat:14.4740, lon:100.1200 },
  { name:'PTT EV Station ตาก (แม่สอด)', category:'DC Fast CCS', lat:16.7154, lon:98.5703 },
  { name:'EA Anywhere แม่สอด', category:'DC CCS Charge', lat:16.7140, lon:98.5690 },
];


// ─────────────────────────────────────────────────────────────────────────────
// State
// ─────────────────────────────────────────────────────────────────────────────
let pickingFor = null;
let points = { start: null, end: null };
let markers = { start: null, end: null };
let routeLayer = null;
let stationMarkers = [];
let searchTimeout = null;

// ─────────────────────────────────────────────────────────────────────────────
// Map Init
// ─────────────────────────────────────────────────────────────────────────────
const map = L.map('map', { zoomControl: true }).setView([13.0, 101.0], 7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors', maxZoom: 19
}).addTo(map);

// ─────────────────────────────────────────────────────────────────────────────
// Populate Car Dropdown
// ─────────────────────────────────────────────────────────────────────────────
(function buildCarSelect() {
  const sel = document.getElementById('car-select');
  EV_CARS.forEach((c, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${c.model} (${(c.battery * c.efficiency).toFixed(0)} กม.)`;
    sel.appendChild(opt);
  });

  // Set departure time default
  const now = new Date();
  const hh = String(now.getHours()).padStart(2,'0');
  const mm = String(now.getMinutes()).padStart(2,'0');
  document.getElementById('departure-time').value = `${hh}:${mm}`;
})();

// ─────────────────────────────────────────────────────────────────────────────
// Car Change
// ─────────────────────────────────────────────────────────────────────────────
function onCarChange() {
  const idx = document.getElementById('car-select').value;
  const stats = document.getElementById('car-stats');
  if (idx === '') { stats.style.display = 'none'; return; }
  const car = EV_CARS[idx];
  document.getElementById('car-battery').textContent = car.battery;
  document.getElementById('car-efficiency').textContent = car.efficiency;
  document.getElementById('car-max-range').textContent = (car.battery * car.efficiency).toFixed(0);
  stats.style.display = 'grid';
  updateBatteryRange();
  checkGoBtn();
}

// ─────────────────────────────────────────────────────────────────────────────
// Battery
// ─────────────────────────────────────────────────────────────────────────────
function onBatteryChange() {
  const soc = parseInt(document.getElementById('battery-slider').value);
  const pctEl = document.getElementById('battery-pct');
  const bar = document.getElementById('battery-bar');
  pctEl.textContent = soc + '%';
  bar.style.width = soc + '%';
  if (soc >= 60) { pctEl.style.color = 'var(--green)'; bar.style.background = 'var(--green)'; }
  else if (soc >= 30) { pctEl.style.color = 'var(--yellow)'; bar.style.background = 'var(--yellow)'; }
  else { pctEl.style.color = 'var(--red)'; bar.style.background = 'var(--red)'; }
  updateBatteryRange();
}

function updateBatteryRange() {
  const idx = document.getElementById('car-select').value;
  const soc = parseInt(document.getElementById('battery-slider').value);
  if (idx === '') { document.getElementById('battery-range-est').textContent = '— กม.'; return; }
  const car = EV_CARS[idx];
  const range = (car.battery * (soc/100) * car.efficiency).toFixed(0);
  document.getElementById('battery-range-est').textContent = `${range} กม.`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Location Search — live dropdown
// ─────────────────────────────────────────────────────────────────────────────
const searchState = { start: { selected: false }, end: { selected: false } };

function onSearchFocus(which) {
  const val = document.getElementById(`${which}-text`).value.trim();
  if (val.length >= 2 && !searchState[which].selected) doSearch(which);
}

function onSearchInput(which) {
  clearTimeout(searchTimeout);
  searchState[which].selected = false;
  const q = document.getElementById(`${which}-text`).value.trim();
  const clearBtn = document.getElementById(`${which}-clear`);
  const box = document.getElementById(`${which}-box`);

  clearBtn.classList.toggle('show', q.length > 0);
  box.classList.toggle('has-value', searchState[which].selected);

  if (q.length < 2) {
    document.getElementById(`${which}-results`).style.display = 'none';
    return;
  }
  showSearchStatus(which, '⏳ กำลังค้นหา...');
  searchTimeout = setTimeout(() => doSearch(which), 400);
}

function onSearchKey(e, which) {
  if (e.key === 'Escape') {
    document.getElementById(`${which}-results`).style.display = 'none';
  }
  // arrow key navigation
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    const items = document.querySelectorAll(`#${which}-results .search-result-item`);
    if (!items.length) return;
    let idx = [...items].findIndex(el => el.classList.contains('focused'));
    items.forEach(el => el.classList.remove('focused'));
    idx = e.key === 'ArrowDown' ? Math.min(idx + 1, items.length - 1) : Math.max(idx - 1, 0);
    if (idx < 0) idx = 0;
    items[idx].classList.add('focused');
    items[idx].scrollIntoView({ block: 'nearest' });
  }
  if (e.key === 'Enter') {
    const focused = document.querySelector(`#${which}-results .search-result-item.focused`);
    if (focused) focused.click();
    else doSearch(which);
  }
}

function showSearchStatus(which, msg, isError = false) {
  const el = document.getElementById(`${which}-results`);
  el.style.display = 'block';
  el.innerHTML = `<div class="search-result-status" style="${isError ? 'color:var(--red)' : ''}">${msg}</div>`;
}

async function doSearch(which) {
  const q = document.getElementById(`${which}-text`).value.trim();
  if (!q) return;
  showSearchStatus(which, '⏳ กำลังค้นหา...');
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q + ' ประเทศไทย')}&countrycodes=th&limit=6&accept-language=th,en&addressdetails=1`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'th,en' } });
    const data = await res.json();
    if (!data.length) {
      showSearchStatus(which, '❌ ไม่พบสถานที่ ลองพิมพ์ชื่อใหม่');
      return;
    }
    const el = document.getElementById(`${which}-results`);
    el.innerHTML = '';
    el.style.display = 'block';
    data.forEach(item => {
      const parts = item.display_name.split(',');
      const name = parts.slice(0, 2).join(', ').trim();
      const sub = parts.slice(2, 4).join(', ').trim();
      const typeIcon = getPlaceIcon(item.type || item.class);
      const div = document.createElement('div');
      div.className = 'search-result-item';
      div.innerHTML = `<span class="sri-icon">${typeIcon}</span><div><div class="sri-name">${name}</div>${sub ? `<div class="sri-sub">${sub}</div>` : ''}</div>`;
      div.onclick = () => {
        searchState[which].selected = true;
        const displayName = name;
        document.getElementById(`${which}-text`).value = displayName;
        document.getElementById(`${which}-clear`).classList.add('show');
        document.getElementById(`${which}-box`).classList.add('has-value');
        el.style.display = 'none';
        setPoint(which, parseFloat(item.lat), parseFloat(item.lon), displayName);
        map.setView([item.lat, item.lon], 13);
      };
      el.appendChild(div);
    });
  } catch(e) {
    showSearchStatus(which, '⚠️ เชื่อมต่อไม่ได้ ลองใหม่อีกครั้ง', true);
  }
}

function getPlaceIcon(type) {
  const icons = {
    airport: '✈️', aerodrome: '✈️', hotel: '🏨', hospital: '🏥',
    restaurant: '🍽️', mall: '🏬', shopping: '🏬', university: '🎓',
    school: '🏫', station: '🚉', bus_stop: '🚌', park: '🌳',
    beach: '🏖️', temple: '⛩️', museum: '🏛️', city: '🏙️',
    town: '🏘️', village: '🏡', administrative: '📍',
  };
  for (const [k, v] of Object.entries(icons)) {
    if (type && type.includes(k)) return v;
  }
  return '📍';
}

function clearPoint(which) {
  document.getElementById(`${which}-text`).value = '';
  document.getElementById(`${which}-clear`).classList.remove('show');
  document.getElementById(`${which}-box`).classList.remove('has-value');
  document.getElementById(`${which}-results`).style.display = 'none';
  searchState[which].selected = false;
  if (markers[which]) { map.removeLayer(markers[which]); markers[which] = null; }
  points[which] = null;
  checkGoBtn();
  clearRoute();
  document.getElementById('result-section').style.display = 'none';
  document.getElementById(`${which}-text`).focus();
}

function swapPoints() {
  // swap text
  const startEl = document.getElementById('start-text');
  const endEl = document.getElementById('end-text');
  [startEl.value, endEl.value] = [endEl.value, startEl.value];
  // swap clear buttons
  const sc = document.getElementById('start-clear');
  const ec = document.getElementById('end-clear');
  const scShow = sc.classList.contains('show');
  sc.classList.toggle('show', ec.classList.contains('show'));
  ec.classList.toggle('show', scShow);
  // swap has-value
  const sb = document.getElementById('start-box');
  const eb = document.getElementById('end-box');
  const sbHas = sb.classList.contains('has-value');
  sb.classList.toggle('has-value', eb.classList.contains('has-value'));
  eb.classList.toggle('has-value', sbHas);
  // swap points data
  [points.start, points.end] = [points.end, points.start];
  [searchState.start.selected, searchState.end.selected] = [searchState.end.selected, searchState.start.selected];
  // swap markers
  if (markers.start) map.removeLayer(markers.start);
  if (markers.end) map.removeLayer(markers.end);
  markers = { start: null, end: null };
  if (points.start) {
    markers.start = L.marker([points.start.lat, points.start.lon], { icon: makeIcon('A','#00e5a0',true) }).addTo(map).bindPopup('A — ต้นทาง');
  }
  if (points.end) {
    markers.end = L.marker([points.end.lat, points.end.lon], { icon: makeIcon('B','#ff4d6a',false) }).addTo(map).bindPopup('B — ปลายทาง');
  }
  checkGoBtn();
  clearRoute();
}

// close dropdown when clicking outside
document.addEventListener('click', e => {
  ['start','end'].forEach(which => {
    const box = document.getElementById(`${which}-box`);
    const res = document.getElementById(`${which}-results`);
    if (box && !box.contains(e.target) && res && !res.contains(e.target)) {
      res.style.display = 'none';
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Map Picking
// ─────────────────────────────────────────────────────────────────────────────
function closeAllDropdowns() {
  ['start','end'].forEach(w => {
    const el = document.getElementById(`${w}-results`);
    if (el) el.style.display = 'none';
  });
}

function startMapPick(which) {
  closeAllDropdowns();
  pickingFor = which;
  const msgs = { start: '📍 คลิกบนแผนที่ — เลือกจุดเริ่มต้น A', end: '📍 คลิกบนแผนที่ — เลือกจุดปลายทาง B' };
  const ms = document.getElementById('map-status');
  ms.textContent = msgs[which];
  ms.classList.add('show');
  map.getContainer().classList.add('map-picking');
}

map.on('click', async function(e) {
  if (!pickingFor) return;
  const { lat, lng } = e.latlng;
  const which = pickingFor;
  pickingFor = null;
  document.getElementById('map-status').classList.remove('show');
  map.getContainer().classList.remove('map-picking');
  const label = await reverseGeocode(lat, lng);
  setPoint(which, lat, lng, label);
});

async function reverseGeocode(lat, lng) {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=th,en`);
    const d = await r.json();
    return d.display_name?.split(',').slice(0,3).join(',').trim() || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } catch { return `${lat.toFixed(5)}, ${lng.toFixed(5)}`; }
}

// ─────────────────────────────────────────────────────────────────────────────
// Set Point
// ─────────────────────────────────────────────────────────────────────────────
function makeIcon(letter, color, bgDark) {
  return L.divIcon({
    html: `<div style="
      background:${color};color:${bgDark?'#080c14':'#fff'};
      width:32px;height:32px;border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);display:flex;align-items:center;
      justify-content:center;font-weight:700;font-size:13px;
      box-shadow:0 3px 16px rgba(0,0,0,0.6);
      border:2px solid rgba(255,255,255,0.15);
      font-family:'Space Mono',monospace;
    "><span style="transform:rotate(45deg)">${letter}</span></div>`,
    className:'', iconSize:[32,32], iconAnchor:[16,32], popupAnchor:[0,-36]
  });
}

function setPoint(which, lat, lng, label) {
  points[which] = { lat, lon: lng };
  if (markers[which]) map.removeLayer(markers[which]);
  const isStart = which === 'start';
  markers[which] = L.marker([lat, lng], { icon: makeIcon(isStart?'A':'B', isStart?'#00e5a0':'#ff4d6a', isStart) })
    .addTo(map)
    .bindPopup(`<b>${isStart?'A — ต้นทาง':'B — ปลายทาง'}</b><br>${label}`);

  // sync text input
  const inp = document.getElementById(`${which}-text`);
  if (inp.value !== label) inp.value = label;
  document.getElementById(`${which}-clear`).classList.add('show');
  document.getElementById(`${which}-box`).classList.add('has-value');
  searchState[which].selected = true;

  checkGoBtn();
  clearRoute();
  document.getElementById('result-section').style.display = 'none';
}

function checkGoBtn() {
  const hasPoints = points.start && points.end;
  const hasCar = document.getElementById('car-select').value !== '';
  document.getElementById('btn-go').disabled = !(hasPoints && hasCar);
}

// ─────────────────────────────────────────────────────────────────────────────
// Calculation Logic (ported from notebook)
// ─────────────────────────────────────────────────────────────────────────────
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371, toR = d => d * Math.PI / 180;
  const dLat = toR(lat2-lat1), dLon = toR(lon2-lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toR(lat1))*Math.cos(toR(lat2))*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * 1.35;
}

async function getOSRMDistance(lat1,lon1,lat2,lon2) {
  const url = `${OSRM_API}/${lon1},${lat1};${lon2},${lat2}?overview=false`;
  try {
    const r = await fetch(url);
    const d = await r.json();
    if (d.code === 'Ok') return d.routes[0].distance / 1000;
  } catch {}
  return null;
}

async function getDistance(lat1,lon1,lat2,lon2, useApi=true) {
  if (useApi) {
    const d = await getOSRMDistance(lat1,lon1,lat2,lon2);
    if (d !== null) return { dist: d, method: 'OSRM (ถนนจริง)' };
  }
  return { dist: haversine(lat1,lon1,lat2,lon2), method: 'Haversine (ประมาณ)' };
}

function calcAvailableRange(battery, soc, efficiency) {
  return battery * (soc/100) * efficiency;
}

function calcSOCAtDest(battery, soc, efficiency, distKm) {
  const energyUsed = distKm / efficiency;
  const energyLeft = battery*(soc/100) - energyUsed;
  return Math.max((energyLeft/battery)*100, 0);
}

function calcChargeTime(battery, soc, targetSoc, isFast) {
  const energy = battery * (targetSoc-soc) / 100;
  return (energy / (isFast ? FAST_CHARGE_RATE_KW : NORMAL_CHARGE_RATE_KW)) * 60;
}

async function findStations(startLat, startLon, destLat, destLon, availRange, battery, soc, efficiency, useApi) {
  const safeRange = Math.max(availRange - SAFETY_BUFFER_KM, 10);
  const totalStraight = haversine(startLat, startLon, destLat, destLon);

  // Pre-filter with haversine (fast), relaxed conditions
  const candidates = [];
  for (const st of EV_STATIONS) {
    const straight2st = haversine(startLat, startLon, st.lat, st.lon);
    if (straight2st > safeRange * 1.4) continue;
    const straight2dest = haversine(st.lat, st.lon, destLat, destLon);
    const detourRatio = (straight2st + straight2dest) / Math.max(totalStraight, 1);
    if (detourRatio > 2.2) continue;
    const socAtSt = calcSOCAtDest(battery, soc, efficiency, straight2st);
    if (socAtSt < MIN_SOC_ON_ARRIVAL - 5) continue;
    const rangeAfter = calcAvailableRange(battery, TARGET_SOC_AFTER_CHARGE, efficiency);
    if (rangeAfter < straight2dest + SAFETY_BUFFER_KM) continue;
    candidates.push({ st, straight2st, straight2dest, detourRatio });
  }

  // Sort & take top 15 for accurate distance check
  candidates.sort((a,b) => (a.straight2st + a.straight2dest) - (b.straight2st + b.straight2dest));
  const top = candidates.slice(0, 15);

  const suitable = [];
  for (const { st, detourRatio } of top) {
    const { dist: dist2st, method } = await getDistance(startLat, startLon, st.lat, st.lon, useApi);
    const socAtSt = calcSOCAtDest(battery, soc, efficiency, dist2st);
    if (socAtSt < MIN_SOC_ON_ARRIVAL - 5) continue;
    const { dist: dist2dest } = await getDistance(st.lat, st.lon, destLat, destLon, useApi);
    const rangeAfter = calcAvailableRange(battery, TARGET_SOC_AFTER_CHARGE, efficiency);
    if (rangeAfter < dist2dest + SAFETY_BUFFER_KM) continue;
    const isFast = /Quick|Fast|DC|CCS|Supercharger/i.test(st.category);
    const total = dist2st + dist2dest;
    suitable.push({ ...st, dist_from_start: dist2st, dist_to_dest: dist2dest, soc_on_arrival: socAtSt, total_journey: total, is_fast_charge: isFast, calc_method: method, score: total + detourRatio * 5 });
  }
  suitable.sort((a,b) => a.score - b.score);
  return suitable;
}

// ─────────────────────────────────────────────────────────────────────────────
// Route Plan (Main)
// ─────────────────────────────────────────────────────────────────────────────
async function planRoute() {
  if (!points.start || !points.end) return;
  const carIdx = parseInt(document.getElementById('car-select').value);
  if (isNaN(carIdx)) return;
  const car = EV_CARS[carIdx];
  const soc = parseInt(document.getElementById('battery-slider').value);
  const useApi = document.getElementById('use-api').checked;

  setLoading(true); clearError(); clearRoute(); clearStationMarkers();
  document.getElementById('result-section').style.display = 'none';

  try {
    const { dist: totalDist, method } = await getDistance(
      points.start.lat, points.start.lon, points.end.lat, points.end.lon, useApi
    );

    const availRange = calcAvailableRange(car.battery, soc, car.efficiency);
    const needCharge = (availRange - SAFETY_BUFFER_KM) < totalDist;

    let stations = [];
    if (needCharge) {
      stations = await findStations(
        points.start.lat, points.start.lon,
        points.end.lat, points.end.lon,
        availRange, car.battery, soc, car.efficiency, useApi
      );
    }

    // Draw route line
    await drawRoute();

    // Parse departure time
    const timeVal = document.getElementById('departure-time').value;
    const now = new Date();
    let departure = new Date();
    if (timeVal) {
      const [h,m] = timeVal.split(':').map(Number);
      departure = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
    }

    renderResults(car, soc, totalDist, availRange, method, stations, departure, needCharge);

  } catch(e) {
    showError('เกิดข้อผิดพลาด กรุณาลองใหม่: ' + e.message);
  }

  setLoading(false);
}

async function drawRoute() {
  try {
    const url = `${OSRM_API}/${points.start.lon},${points.start.lat};${points.end.lon},${points.end.lat}?overview=full&geometries=geojson`;
    const r = await fetch(url);
    const d = await r.json();
    if (d.routes && d.routes[0]) {
      routeLayer = L.geoJSON(d.routes[0].geometry, {
        style: { color: '#00e5a0', weight: 5, opacity: 0.8 }
      }).addTo(map);
      map.fitBounds(routeLayer.getBounds(), { padding: [40, 60] });
    } else {
      if (markers.start && markers.end) {
        map.fitBounds([
          [points.start.lat, points.start.lon],
          [points.end.lat, points.end.lon]
        ], { padding: [60, 60] });
      }
    }
  } catch {}
}

// ─────────────────────────────────────────────────────────────────────────────
// Render Results
// ─────────────────────────────────────────────────────────────────────────────
function fmtTime(min) {
  const h = Math.floor(min/60), m = Math.round(min%60);
  return h > 0 ? `${h}ชม. ${m}น.` : `${m} นาที`;
}
function addMins(date, mins) {
  return new Date(date.getTime() + mins*60000);
}
function fmtHHMM(date) {
  return `${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
}

function renderResults(car, soc, totalDist, availRange, method, stations, departure, needCharge) {
  // Summary
  let totalTimeMin = (totalDist / AVERAGE_SPEED_KMH) * 60;
  let socAtDest, stationHTML = '', altHTML = '', timelineHTML = '', xaiHTML = '';

  if (!needCharge) {
    socAtDest = calcSOCAtDest(car.battery, soc, car.efficiency, totalDist);
    const arrival = addMins(departure, totalTimeMin);
    timelineHTML = buildTimeline([
      { icon:'🟢', cls:'green-bg', time: fmtHHMM(departure), label:'ออกเดินทาง', sub:`แบต ${soc}%` },
      { icon:'🏁', cls:'red-bg',   time: fmtHHMM(arrival),   label:'ถึงจุดหมาย', sub:`แบตเหลือ ${socAtDest.toFixed(1)}%` },
    ]);
  } else if (!stations.length) {
    socAtDest = 0;
    timelineHTML = `<div style="color:var(--red);font-size:12px;padding:8px 0">❌ ไม่พบสถานีชาร์จที่เหมาะสม กรุณาชาร์จแบตให้มากขึ้นก่อนออกเดินทาง</div>`;
  } else {
    const best = stations[0];
    const chargeTime = calcChargeTime(car.battery, best.soc_on_arrival, TARGET_SOC_AFTER_CHARGE, best.is_fast_charge);
    totalTimeMin = (best.dist_from_start/AVERAGE_SPEED_KMH)*60 + chargeTime + (best.dist_to_dest/AVERAGE_SPEED_KMH)*60;
    socAtDest = calcSOCAtDest(car.battery, TARGET_SOC_AFTER_CHARGE, car.efficiency, best.dist_to_dest);

    const t0 = departure;
    const t1 = addMins(t0, (best.dist_from_start/AVERAGE_SPEED_KMH)*60);
    const t2 = addMins(t1, chargeTime);
    const t3 = addMins(t2, (best.dist_to_dest/AVERAGE_SPEED_KMH)*60);

    // Station marker on map
    addStationMarker(best, true);
    stations.slice(1,4).forEach(s => addStationMarker(s, false));

    const fastLabel = best.is_fast_charge ? '<span class="station-badge">FAST DC</span>' : '<span class="station-badge" style="border-color:var(--blue);color:var(--blue);background:var(--blue-dim)">AC NORMAL</span>';
    stationHTML = `
      <div class="station-card">
        <div class="station-name">⭐ ${best.name} ${fastLabel}</div>
        <div class="station-meta">
          🏷️ ${best.category}<br>
          📐 พิกัด: ${best.lat.toFixed(4)}, ${best.lon.toFixed(4)}<br>
          🚗 ห่างจากต้นทาง: ${best.dist_from_start.toFixed(1)} กม.<br>
          🏁 ถึงปลายทาง: ${best.dist_to_dest.toFixed(1)} กม.<br>
          🔋 แบตเมื่อถึงสถานี: ${best.soc_on_arrival.toFixed(1)}%<br>
          ⏱️ เวลาชาร์จ (→${TARGET_SOC_AFTER_CHARGE}%): ${chargeTime.toFixed(0)} นาที
        </div>
      </div>`;

    if (stations.length > 1) {
      altHTML = `<div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;margin-top:4px">📌 ทางเลือกสำรอง</div>`;
      stations.slice(1,4).forEach((s,i) => {
        const ct = calcChargeTime(car.battery, s.soc_on_arrival, TARGET_SOC_AFTER_CHARGE, s.is_fast_charge);
        altHTML += `<div class="alt-station">
          <div class="alt-station-name">อันดับ ${i+2}: ${s.name}</div>
          <div class="alt-station-meta">ห่าง ${s.dist_from_start.toFixed(1)} กม. | ชาร์จ ~${ct.toFixed(0)} นาที | แบตถึงสถานี ${s.soc_on_arrival.toFixed(0)}%</div>
        </div>`;
      });
    }

    timelineHTML = buildTimeline([
      { icon:'🟢', cls:'green-bg',  time: fmtHHMM(t0), label:'ออกเดินทาง', sub:`แบต ${soc}%` },
      { icon:'🔌', cls:'yellow-bg', time: fmtHHMM(t1), label:`ถึงสถานีชาร์จ: ${best.name}`, sub:`แบต ${best.soc_on_arrival.toFixed(0)}% → ชาร์จ ${chargeTime.toFixed(0)} นาที` },
      { icon:'🚀', cls:'blue-bg',   time: fmtHHMM(t2), label:'ออกจากสถานีชาร์จ', sub:`แบต ${TARGET_SOC_AFTER_CHARGE}%` },
      { icon:'🏁', cls:'red-bg',    time: fmtHHMM(t3), label:'ถึงจุดหมาย', sub:`แบตเหลือ ${socAtDest.toFixed(1)}%` },
    ]);

    xaiHTML = `
      <div class="xai-item"><span class="xai-check">✅</span> อยู่ในระยะที่แบตวิ่งถึงได้ (${best.dist_from_start.toFixed(1)} กม. &lt; ${(availRange - SAFETY_BUFFER_KM).toFixed(1)} กม.)</div>
      <div class="xai-item"><span class="xai-check">✅</span> รวมระยะทาง (ต้นทาง→สถานี→ปลายทาง) = ${best.total_journey.toFixed(1)} กม. (ต่ำสุดในบรรดาทางเลือก)</div>
      <div class="xai-item"><span class="xai-check">✅</span> หลังชาร์จแล้วถึงปลายทางได้ (แบตเหลือ ${socAtDest.toFixed(1)}%)</div>
    `;
  }

  // Fill in
  document.getElementById('r-dist').textContent = totalDist.toFixed(1) + ' กม.';
  document.getElementById('r-time').textContent = fmtTime(totalTimeMin);
  document.getElementById('r-soc').textContent = (socAtDest || 0).toFixed(1) + '%';
  document.getElementById('r-method').textContent = method;

  const stPanel = document.getElementById('res-station-panel');
  const tlPanel = document.getElementById('res-timeline-panel');
  const xaiPanel = document.getElementById('res-xai-panel');

  if (stationHTML) {
    document.getElementById('res-station-card').innerHTML = stationHTML;
    document.getElementById('res-alt-stations').innerHTML = altHTML;
    stPanel.style.display = 'block';
  } else {
    stPanel.style.display = 'none';
  }

  if (timelineHTML) {
    document.getElementById('res-timeline').innerHTML = timelineHTML;
    tlPanel.style.display = 'block';
  } else {
    tlPanel.style.display = 'none';
  }

  if (xaiHTML) {
    document.getElementById('res-xai').innerHTML = xaiHTML;
    xaiPanel.style.display = 'block';
  } else {
    xaiPanel.style.display = 'none';
  }

  document.getElementById('result-section').style.display = 'block';
  // Scroll results into view on sidebar
  document.getElementById('result-section').scrollIntoView({ behavior: 'smooth' });
}

function buildTimeline(items) {
  return items.map(item => `
    <div class="tl-item">
      <div class="tl-icon ${item.cls}">${item.icon}</div>
      <div class="tl-body">
        <div class="tl-time">${item.time}</div>
        <div class="tl-label">${item.label}</div>
        <div class="tl-sub">${item.sub}</div>
      </div>
    </div>
  `).join('');
}

function addStationMarker(st, isBest) {
  const icon = L.divIcon({
    html: `<div style="
      background:${isBest?'#ffcd3c':'#1e2740'};
      color:${isBest?'#080c14':'#ffcd3c'};
      border:2px solid #ffcd3c;
      width:26px;height:26px;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.5);
    ">⚡</div>`,
    className:'', iconSize:[26,26], iconAnchor:[13,13]
  });
  const m = L.marker([st.lat, st.lon], { icon })
    .addTo(map)
    .bindPopup(`<b>⚡ ${st.name}</b><br>${st.category}<br>📏 ${st.dist_from_start.toFixed(1)} กม. จากต้นทาง`);
  stationMarkers.push(m);
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function clearAll() {
  if (markers.start) map.removeLayer(markers.start);
  if (markers.end) map.removeLayer(markers.end);
  markers = { start: null, end: null };
  points = { start: null, end: null };
  clearRoute(); clearStationMarkers();
  document.getElementById('result-section').style.display = 'none';
  clearError(); stopPicking();

  ['start','end'].forEach(w => {
    document.getElementById(`${w}-text`).value = '';
    document.getElementById(`${w}-clear`).classList.remove('show');
    document.getElementById(`${w}-box`).classList.remove('has-value');
    document.getElementById(`${w}-results`).style.display = 'none';
    searchState[w].selected = false;
  });
  document.getElementById('btn-go').disabled = true;
}

function clearRoute() {
  if (routeLayer) { map.removeLayer(routeLayer); routeLayer = null; }
}
function clearStationMarkers() {
  stationMarkers.forEach(m => map.removeLayer(m));
  stationMarkers = [];
}
function stopPicking() {
  pickingFor = null;
  document.getElementById('map-status').classList.remove('show');
  map.getContainer().classList.remove('map-picking');
}
function setLoading(v) {
  document.getElementById('loading').classList.toggle('show', v);
  document.getElementById('btn-go').disabled = v;
}
function showError(msg) {
  const el = document.getElementById('error-msg');
  el.textContent = msg; el.classList.add('show');
}
function clearError() {
  document.getElementById('error-msg').classList.remove('show');
}
</script>
</body>
</html>
