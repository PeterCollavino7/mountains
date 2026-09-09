const PEAK_COLOR = "#b8703f";
const LAKE_COLOR = "#2dd4bf";
const RIFUGIO_COLOR = "#c1443c";
const PASSO_COLOR = "#8b8f98";

const TYPE_LABELS = {
  peak: "Peaks",
  lake: "Lakes",
  rifugio: "Huts",
  passo: "Passes"
};

const LOCAL_RANGES = ["Julian Alps", "Carnic Alps", "Julian Prealps", "Carnic Prealps"];

const map = L.map("map", { zoomControl: false }).setView([46.5, 12.9], 10);
L.control.zoom({ position: "bottomright" }).addTo(map);

L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: "abc",
    maxZoom: 19
  }
).addTo(map);

// Defensive resize: if the container's size wasn't final at construction
// time, Leaflet caches a stale size/pixel origin and tiles render at the
// wrong offset (or not at all) even though the box itself looks fine.
// A ResizeObserver catches every actual size change of the container,
// not just a one-off check after "load", so this self-corrects regardless
// of what caused the mismatch.
new ResizeObserver(() => map.invalidateSize()).observe(document.getElementById("map-wrap"));

function markerColor(loc) {
  if (loc.type === "lake") return LAKE_COLOR;
  if (loc.type === "rifugio") return RIFUGIO_COLOR;
  if (loc.type === "passo") return PASSO_COLOR;
  return PEAK_COLOR;
}

function markerIcon(loc) {
  const color = markerColor(loc);

  if (loc.type === "lake") {
    return L.divIcon({
      className: "loc-marker",
      html: `<svg width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="${color}" stroke="#0f1115" stroke-width="1.5"/></svg>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -8]
    });
  }

  if (loc.type === "rifugio") {
    return L.divIcon({
      className: "loc-marker",
      html: `<svg width="24" height="24" viewBox="0 0 24 24"><path d="M4 21 V11 L12 4 L20 11 V21 Z" fill="${color}" stroke="#0f1115" stroke-width="1.5"/><rect x="10" y="14" width="4" height="7" fill="#0f1115"/></svg>`,
      iconSize: [24, 24],
      iconAnchor: [12, 21],
      popupAnchor: [0, -19]
    });
  }

  if (loc.type === "passo") {
    return L.divIcon({
      className: "loc-marker",
      html: `<svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 2 L22 12 L12 22 L2 12 Z" fill="${color}" stroke="#0f1115" stroke-width="1.5"/></svg>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -8]
    });
  }

  return L.divIcon({
    className: "loc-marker",
    html: `<svg width="26" height="26" viewBox="0 0 24 24"><path d="M12 3 L21 20 L3 20 Z" fill="${color}" stroke="#0f1115" stroke-width="1.5"/></svg>`,
    iconSize: [26, 26],
    iconAnchor: [13, 20],
    popupAnchor: [0, -18]
  });
}

const peakElevations = locations
  .filter((l) => l.type === "peak" && l.elevation != null)
  .map((l) => l.elevation);
const minElevation = Math.min(...peakElevations);
const maxElevation = Math.max(...peakElevations);

function popupHtml(loc) {
  const elevationBar =
    loc.type === "peak" && loc.elevation != null
      ? `<div class="elevation-bar"><div class="elevation-bar-fill" style="width:${Math.round(
          ((loc.elevation - minElevation) / (maxElevation - minElevation || 1)) * 100
        )}%; background:${PEAK_COLOR}"></div></div>`
      : "";

  const visits = allDates(loc);
  const verb = loc.type === "peak" || loc.type === "passo" ? "Climbed" : "Visited";
  const dateLine = visits.length
    ? `<span class="popup-status">${verb} on ${visits.map(formatDate).join(", ")}</span>`
    : "";

  return `
    <div class="popup">
      <strong>${loc.name}</strong>
      <span class="popup-range">${loc.range}</span>
      ${elevationBar}
      ${loc.elevation != null ? `<span class="popup-elevation">${loc.elevation} m</span>` : ""}
      ${dateLine}
      ${loc.note ? `<p class="popup-note">${loc.note}</p>` : ""}
    </div>
  `;
}

function formatDate(isoDate) {
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}/${y}`;
}

const markersByName = {};
const bounds = [];

locations.forEach((loc) => {
  const marker = L.marker([loc.lat, loc.lng], { icon: markerIcon(loc) })
    .addTo(map)
    .bindPopup(popupHtml(loc));

  marker.on("click", () => setActiveLocation(loc.name));

  markersByName[loc.name] = marker;
  if (LOCAL_RANGES.includes(loc.range)) bounds.push([loc.lat, loc.lng]);
});

if (bounds.length) {
  map.fitBounds(bounds, { padding: [40, 40] });
}

// --- Stats bar ---
const statsBar = document.getElementById("stats-bar");
const peaks = locations.filter((l) => l.type === "peak");
const peaksWithElevation = peaks.filter((l) => l.elevation != null);
const highest = peaksWithElevation.length
  ? peaksWithElevation.reduce((a, b) => (a.elevation > b.elevation ? a : b))
  : null;
const rawRanges = [...new Set(locations.map((l) => l.range))];
const ranges = LOCAL_RANGES.filter((r) => rawRanges.includes(r)).concat(
  rawRanges.filter((r) => !LOCAL_RANGES.includes(r)).sort()
);
const lakeCount = locations.filter((l) => l.type === "lake").length;
const rifugioCount = locations.filter((l) => l.type === "rifugio").length;
const passoCount = locations.filter((l) => l.type === "passo").length;

statsBar.innerHTML = `
  <div class="stat"><span class="stat-value">${peaks.length}</span><span class="stat-label">Peaks</span></div>
  ${highest ? `<div class="stat" title="${highest.name}"><span class="stat-value">${highest.elevation} m</span><span class="stat-label">Highest</span></div>` : ""}
  <div class="stat"><span class="stat-value">${lakeCount}</span><span class="stat-label">Lakes</span></div>
  <div class="stat"><span class="stat-value">${rifugioCount}</span><span class="stat-label">Huts</span></div>
  <div class="stat"><span class="stat-value">${passoCount}</span><span class="stat-label">Passes</span></div>
  <div class="stat"><span class="stat-value">${ranges.length}</span><span class="stat-label">Ranges</span></div>
`;

// --- Last outing: the most recent visit, not the most recent first visit, so a
// return climb of an old peak still counts as the latest time out. ---
const lastOutingEl = document.getElementById("last-outing");

if (lastOutingEl) {
  const latestVisit = (loc) =>
    loc.dates && loc.dates.length ? loc.dates[loc.dates.length - 1] : loc.date || "";

  const mostRecent = locations.reduce(
    (latest, loc) => (!latest || latestVisit(loc) > latestVisit(latest) ? loc : latest),
    null
  );

  if (mostRecent && latestVisit(mostRecent)) {
    lastOutingEl.innerHTML =
      `Last outing: <strong>${mostRecent.name}</strong> &middot; ${formatDate(latestVisit(mostRecent))}`;
  }
}

// --- Filter chips: mountain range ---
const rangeChips = document.getElementById("range-chips");
const activeRanges = new Set(ranges);

let tripGroupStarted = false;

ranges.forEach((range) => {
  if (!LOCAL_RANGES.includes(range) && !tripGroupStarted) {
    tripGroupStarted = true;
    const groupLabel = document.createElement("div");
    groupLabel.className = "range-group-label";
    groupLabel.textContent = "Trips further afield";
    rangeChips.appendChild(groupLabel);
  }

  const row = document.createElement("button");
  row.className = "chip active";
  row.textContent = range;
  row.addEventListener("click", () => {
    if (activeRanges.has(range)) {
      activeRanges.delete(range);
      row.classList.remove("active");
    } else {
      activeRanges.add(range);
      row.classList.add("active");
    }
    renderList();
    applyFilter();
  });
  rangeChips.appendChild(row);
});

// --- Filter chips: type ---
const typeChips = document.getElementById("type-chips");
const activeTypes = new Set(Object.keys(TYPE_LABELS));
const TYPE_COLORS = { peak: PEAK_COLOR, lake: LAKE_COLOR, rifugio: RIFUGIO_COLOR, passo: PASSO_COLOR };

function typeIconSvg(type) {
  if (type === "lake") {
    return `<svg width="13" height="13" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="currentColor"/></svg>`;
  }
  if (type === "rifugio") {
    return `<svg width="13" height="13" viewBox="0 0 24 24"><path d="M4 21 V11 L12 4 L20 11 V21 Z" fill="currentColor"/></svg>`;
  }
  if (type === "passo") {
    return `<svg width="13" height="13" viewBox="0 0 24 24"><path d="M12 2 L22 12 L12 22 L2 12 Z" fill="currentColor"/></svg>`;
  }
  return `<svg width="13" height="13" viewBox="0 0 24 24"><path d="M12 3 L21 20 L3 20 Z" fill="currentColor"/></svg>`;
}

Object.entries(TYPE_LABELS).forEach(([type, label]) => {
  const chip = document.createElement("button");
  chip.className = "chip active";
  chip.innerHTML = `<span class="chip-icon">${typeIconSvg(type)}</span>${label}`;
  chip.style.setProperty("--chip-color", TYPE_COLORS[type]);
  chip.addEventListener("click", () => {
    if (activeTypes.has(type)) {
      activeTypes.delete(type);
      chip.classList.remove("active");
    } else {
      activeTypes.add(type);
      chip.classList.add("active");
    }
    renderList();
    applyFilter();
  });
  typeChips.appendChild(chip);
});

function applyFilter() {
  const cutoff = timelineCutoffDate();
  locations.forEach((loc) => {
    const marker = markersByName[loc.name];
    const visible =
      activeRanges.has(loc.range) &&
      activeTypes.has(loc.type) &&
      (!cutoff || firstDate(loc) <= cutoff);
    if (visible && !map.hasLayer(marker)) {
      marker.addTo(map);
    } else if (!visible && map.hasLayer(marker)) {
      map.removeLayer(marker);
    }
  });
}

// --- Sort toggle ---
const sortToggle = document.getElementById("sort-toggle");
let sortMode = "elevation";

sortToggle.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", () => {
    sortMode = btn.dataset.sort;
    sortToggle.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b === btn));
    renderList();
  });
});

// --- Location table (list view) ---
const TYPE_LABELS_SINGULAR = { peak: "Peak", lake: "Lake", rifugio: "Hut", passo: "Pass" };
const tableBodyEl = document.getElementById("peak-table-body");
const searchInput = document.getElementById("search-input");
let activeLocationName = null;

function setActiveLocation(name, { switchToMap = false } = {}) {
  activeLocationName = name;
  if (switchToMap) setView("map");
  renderList();
  const marker = markersByName[name];
  if (marker) {
    map.flyTo(marker.getLatLng(), 12, { duration: 0.8 });
    marker.openPopup();
  }
}

function firstDate(loc) {
  return loc.dates && loc.dates.length ? loc.dates[0] : loc.date || "";
}

function allDates(loc) {
  return loc.dates && loc.dates.length ? loc.dates : loc.date ? [loc.date] : [];
}

function renderList() {
  const query = searchInput.value.trim().toLowerCase();

  tableBodyEl.innerHTML = "";

  const base = locations
    .filter((l) => activeRanges.has(l.range) && activeTypes.has(l.type))
    .filter((l) => l.name.toLowerCase().includes(query));

  let currentYear = null;

  function appendYearHeaderIfNeeded(dateStr) {
    const year = dateStr.slice(0, 4) || "Undated";
    if (year !== currentYear) {
      currentYear = year;
      const header = document.createElement("tr");
      header.className = "year-row";
      header.innerHTML = `<td colspan="5">${year}</td>`;
      tableBodyEl.appendChild(header);
    }
  }

  function appendRow(loc, dateStr, extraHtml) {
    const row = document.createElement("tr");
    row.className = "peak-row" + (loc.name === activeLocationName ? " active" : "");
    row.innerHTML = `
      <td><span class="peak-dot" style="background:${markerColor(loc)}"></span>${loc.name}${extraHtml || ""}</td>
      <td>${TYPE_LABELS_SINGULAR[loc.type]}</td>
      <td>${loc.range}</td>
      <td>${loc.elevation != null ? loc.elevation + " m" : "—"}</td>
      <td>${formatDate(dateStr)}</td>
    `;
    row.addEventListener("click", () => setActiveLocation(loc.name, { switchToMap: true }));
    tableBodyEl.appendChild(row);
  }

  if (sortMode === "date") {
    // One row per visit date (not per location) so a revisit shows up under
    // the year it actually happened, instead of only under the year of the
    // first ascent — Peter wants "did X again on this date" visible directly
    // in the year it happened, not just discoverable as a hover tooltip.
    const visits = [];
    base.forEach((loc) => {
      const dates = loc.dates && loc.dates.length ? loc.dates : loc.date ? [loc.date] : [];
      dates.forEach((date, i) => visits.push({ loc, date, isRevisit: i > 0 }));
    });
    visits.sort((a, b) => b.date.localeCompare(a.date));

    visits.forEach(({ loc, date, isRevisit }) => {
      appendYearHeaderIfNeeded(date);
      appendRow(loc, date, isRevisit ? ` <span class="visit-count">revisit</span>` : "");
    });
  } else {
    // Elevation sort: one row per location — visit dates don't affect the
    // ranking, so collapse back to the first ascent date + a "+N" count.
    base
      .sort((a, b) => (b.elevation ?? -1) - (a.elevation ?? -1))
      .forEach((loc) => {
        const extraVisits = loc.dates && loc.dates.length > 1
          ? ` <span class="visit-count" title="All visits: ${loc.dates.map(formatDate).join(", ")}">+${loc.dates.length - 1}</span>`
          : "";
        appendRow(loc, firstDate(loc), extraVisits);
      });
  }
}

searchInput.addEventListener("input", renderList);

renderList();

// --- View toggle: Map / List ---
const viewToggle = document.getElementById("view-toggle");
const mapWrapEl = document.getElementById("map-wrap");
const listViewEl = document.getElementById("list-view");

function setView(view) {
  viewToggle.querySelectorAll(".view-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === view);
  });
  mapWrapEl.hidden = view !== "map";
  listViewEl.hidden = view !== "list";
  if (view === "map") map.invalidateSize();
}

viewToggle.querySelectorAll(".view-btn").forEach((btn) => {
  btn.addEventListener("click", () => setView(btn.dataset.view));
});

// --- Timeline scrubber: replay the hiking history chronologically ---
const timelineSlider = document.getElementById("timeline-slider");
const timelineLabel = document.getElementById("timeline-label");
const timelinePlay = document.getElementById("timeline-play");
const timelineTicks = document.getElementById("timeline-ticks");

const timelineDates = [...locations]
  .map(firstDate)
  .filter(Boolean)
  .sort();

timelineSlider.max = String(Math.max(timelineDates.length - 1, 0));
timelineSlider.value = timelineSlider.max;

let timelineIndex = timelineDates.length - 1;
let timelineTimer = null;

// One tick per year visited, positioned along the slider and clickable
// to jump straight to it — richer than a bare drag handle.
const timelineTickEls = [...new Set(timelineDates.map((d) => d.slice(0, 4)))].map((year) => {
  let lastIndex = 0;
  timelineDates.forEach((d, i) => {
    if (d.slice(0, 4) <= year) lastIndex = i;
  });
  const pct = timelineDates.length > 1 ? (lastIndex / (timelineDates.length - 1)) * 100 : 100;

  const tick = document.createElement("button");
  tick.type = "button";
  tick.className = "timeline-tick";
  tick.style.left = `${pct}%`;
  tick.title = year;
  tick.setAttribute("aria-label", `Jump to ${year}`);
  tick.addEventListener("click", () => {
    stopTimelinePlayback();
    setTimelineIndex(lastIndex);
  });
  timelineTicks.appendChild(tick);

  return { el: tick, lastIndex };
});

function updateTimelineTicks() {
  timelineTickEls.forEach(({ el, lastIndex }) => el.classList.toggle("reached", lastIndex <= timelineIndex));
}

function timelineCutoffDate() {
  return timelineIndex >= 0 ? timelineDates[timelineIndex] : "";
}

function updateTimelineLabel() {
  const d = timelineCutoffDate();
  timelineLabel.textContent = d ? `${d.slice(0, 4)} · ${timelineIndex + 1}/${timelineDates.length}` : "";
}

function stopTimelinePlayback() {
  if (timelineTimer) {
    clearInterval(timelineTimer);
    timelineTimer = null;
    timelinePlay.innerHTML = "&#9654;";
    timelinePlay.setAttribute("aria-label", "Replay journey");
  }
}

function setTimelineIndex(i) {
  timelineIndex = Math.max(0, Math.min(i, timelineDates.length - 1));
  timelineSlider.value = String(timelineIndex);
  updateTimelineLabel();
  updateTimelineTicks();
  applyFilter();
}

function startTimelinePlayback() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setTimelineIndex(timelineDates.length - 1);
    return;
  }

  setTimelineIndex(0);
  timelinePlay.innerHTML = "&#9208;";
  timelinePlay.setAttribute("aria-label", "Pause replay");

  timelineTimer = setInterval(() => {
    if (timelineIndex >= timelineDates.length - 1) {
      stopTimelinePlayback();
      return;
    }
    setTimelineIndex(timelineIndex + 1);
  }, 90);
}

timelineSlider.addEventListener("input", () => {
  stopTimelinePlayback();
  setTimelineIndex(Number(timelineSlider.value));
});

timelinePlay.addEventListener("click", () => {
  if (timelineTimer) {
    stopTimelinePlayback();
  } else {
    startTimelinePlayback();
  }
});

updateTimelineLabel();
updateTimelineTicks();

// --- Timeline toggle: hidden until requested, so the map opens uncluttered ---
const timelineBar = document.getElementById("timeline-bar");
const timelineToggle = document.getElementById("timeline-toggle");

timelineToggle.addEventListener("click", () => {
  const open = !timelineBar.classList.contains("open");
  timelineBar.classList.toggle("open", open);
  timelineToggle.classList.toggle("active", open);
  timelineToggle.setAttribute("aria-pressed", String(open));
  if (!open) stopTimelinePlayback();
});

// --- Trend charts: plain SVG bar charts, no charting library ---
const SVG_NS = "http://www.w3.org/2000/svg";
const CHARTS_REDUCE_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Grows freshly-drawn bars in from the baseline, staggered slightly per bar.
// Skipped outright under prefers-reduced-motion.
function animateBarsIn(bars) {
  if (CHARTS_REDUCE_MOTION || !bars.length) return;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      bars.forEach((bar, i) => {
        bar.style.transitionDelay = `${i * 45}ms`;
        bar.classList.remove("chart-bar-enter");
      });
    });
  });
}

const chartTooltip = document.createElement("div");
chartTooltip.className = "chart-tooltip";
document.body.appendChild(chartTooltip);

function showChartTooltip(e, text) {
  chartTooltip.textContent = text;
  chartTooltip.classList.add("visible");
  moveChartTooltip(e);
}

function moveChartTooltip(e) {
  chartTooltip.style.left = `${e.clientX + 12}px`;
  chartTooltip.style.top = `${e.clientY + 12}px`;
}

function hideChartTooltip() {
  chartTooltip.classList.remove("visible");
}

// Rounds up to a "clean" step (1/2/5/10 x a power of ten).
function niceStep(value) {
  if (value <= 1) return 1;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const residual = value / magnitude;
  const niceResidual = residual <= 1 ? 1 : residual <= 2 ? 2 : residual <= 5 ? 5 : 10;
  return niceResidual * magnitude;
}

// Picks a gridline step sized so ~targetTicks steps cover maxVal, then rounds
// the axis max up to the next whole step — tighter than a blind "round up to
// 10/100" ceiling, so the tallest bar doesn't leave the chart half-empty.
function niceAxisScale(maxVal, targetTicks = 4) {
  const step = niceStep(maxVal / targetTicks);
  const numSteps = Math.max(1, Math.ceil(maxVal / step));
  return { step, numSteps, axisMax: step * numSteps };
}

function truncateLabel(text, max) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

// A bar rounded only on its "data end" (the tip growing away from the
// baseline) — square where it meets the axis, per the site's mark spec.
function roundedTopRectPath(x, y, w, h, r) {
  if (h <= 0) return "";
  r = Math.min(r, w / 2, h);
  return `M${x},${y + h} V${y + r} A${r},${r} 0 0 1 ${x + r},${y} H${x + w - r} A${r},${r} 0 0 1 ${x + w},${y + r} V${y + h} Z`;
}

function roundedRightRectPath(x, y, w, h, r) {
  if (w <= 0) return "";
  r = Math.min(r, w, h / 2);
  return `M${x},${y} H${x + w - r} A${r},${r} 0 0 1 ${x + w},${y + r} V${y + h - r} A${r},${r} 0 0 1 ${x + w - r},${y + h} H${x} Z`;
}

function renderVerticalBarChart(svg, items, { color, valueLabel }) {
  const width = 320;
  const height = 190;
  const marginLeft = 26;
  const marginRight = 6;
  const marginTop = 10;
  const marginBottom = 22;
  const plotW = width - marginLeft - marginRight;
  const plotH = height - marginTop - marginBottom;
  const { step, numSteps, axisMax } = niceAxisScale(Math.max(1, ...items.map((d) => d.value)));
  const slot = plotW / items.length;
  const barW = Math.min(24, slot * 0.55);

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.textContent = "";

  for (let i = 0; i <= numSteps; i++) {
    const y = marginTop + plotH * (1 - i / numSteps);
    const line = document.createElementNS(SVG_NS, "line");
    line.setAttribute("x1", marginLeft);
    line.setAttribute("x2", width - marginRight);
    line.setAttribute("y1", y);
    line.setAttribute("y2", y);
    line.setAttribute("class", "chart-grid");
    svg.appendChild(line);

    const tick = document.createElementNS(SVG_NS, "text");
    tick.setAttribute("x", marginLeft - 5);
    tick.setAttribute("y", y + 3);
    tick.setAttribute("text-anchor", "end");
    tick.setAttribute("class", "chart-axis-label");
    tick.textContent = i * step;
    svg.appendChild(tick);
  }

  const peakValue = Math.max(...items.map((d) => d.value));
  const bars = [];

  items.forEach((d, i) => {
    const barH = plotH * (d.value / axisMax);
    const x = marginLeft + i * slot + (slot - barW) / 2;
    const y = marginTop + plotH - barH;

    const bar = document.createElementNS(SVG_NS, "path");
    bar.setAttribute("d", roundedTopRectPath(x, y, barW, barH, 3));
    bar.setAttribute("fill", typeof color === "function" ? color(d, i) : color);
    bar.setAttribute("fill-opacity", d.value === peakValue ? "1" : "0.5");
    bar.setAttribute("class", `chart-bar chart-bar-vertical${CHARTS_REDUCE_MOTION ? "" : " chart-bar-enter"}`);
    bar.addEventListener("mouseenter", (e) => showChartTooltip(e, `${d.tooltipLabel || d.label}: ${valueLabel(d.value)}`));
    bar.addEventListener("mousemove", moveChartTooltip);
    bar.addEventListener("mouseleave", hideChartTooltip);
    svg.appendChild(bar);
    bars.push(bar);

    const label = document.createElementNS(SVG_NS, "text");
    label.setAttribute("x", x + barW / 2);
    label.setAttribute("y", height - marginBottom + 12);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("class", "chart-axis-label");
    label.textContent = d.label;
    svg.appendChild(label);
  });

  animateBarsIn(bars);
}

function renderHorizontalBarChart(svg, items, { color, valueLabel }) {
  const width = 320;
  const marginLeft = 92;
  const marginRight = 28;
  const marginTop = 6;
  const rowH = 20;
  const rowGap = 6;
  const plotW = width - marginLeft - marginRight;
  const height = marginTop + items.length * (rowH + rowGap) - rowGap + 6;
  const { axisMax: maxVal } = niceAxisScale(Math.max(1, ...items.map((d) => d.value)));

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.textContent = "";

  const peakValue = Math.max(...items.map((d) => d.value));
  const bars = [];

  items.forEach((d, i) => {
    const y = marginTop + i * (rowH + rowGap);
    const barW = Math.max(2, plotW * (d.value / maxVal));

    const label = document.createElementNS(SVG_NS, "text");
    label.setAttribute("x", marginLeft - 8);
    label.setAttribute("y", y + rowH / 2 + 3);
    label.setAttribute("text-anchor", "end");
    label.setAttribute("class", "chart-axis-label");
    label.textContent = truncateLabel(d.label, 14);
    svg.appendChild(label);

    const bar = document.createElementNS(SVG_NS, "path");
    bar.setAttribute("d", roundedRightRectPath(marginLeft, y + (rowH - 12) / 2, barW, 12, 3));
    bar.setAttribute("fill", typeof color === "function" ? color(d, i) : color);
    bar.setAttribute("fill-opacity", d.value === peakValue ? "1" : "0.5");
    bar.setAttribute("class", `chart-bar chart-bar-horizontal${CHARTS_REDUCE_MOTION ? "" : " chart-bar-enter"}`);
    bar.addEventListener("mouseenter", (e) => showChartTooltip(e, `${d.tooltipLabel || d.label}: ${valueLabel(d.value)}`));
    bar.addEventListener("mousemove", moveChartTooltip);
    bar.addEventListener("mouseleave", hideChartTooltip);
    svg.appendChild(bar);
    bars.push(bar);

    const valueEl = document.createElementNS(SVG_NS, "text");
    valueEl.setAttribute("x", marginLeft + barW + 6);
    valueEl.setAttribute("y", y + rowH / 2 + 3);
    valueEl.setAttribute("class", "chart-value-label");
    valueEl.textContent = d.value;
    svg.appendChild(valueEl);
  });

  animateBarsIn(bars);
}

// 1. Hikes per year — distinct days out, not locations. Deliberately NOT
// timelineDates: that one holds a single first-visit date per location, which
// both double-counts a day that took in two places and hides every return climb
// in the year it was first reached. A day on a trail is one hike whether it
// bagged one summit or three, so the year gets the size of the day's set.
const daysByYear = {};
locations.forEach((loc) => {
  allDates(loc).forEach((d) => {
    const y = d.slice(0, 4);
    (daysByYear[y] || (daysByYear[y] = new Set())).add(d);
  });
});
const yearItems = Object.keys(daysByYear).sort().map((y) => ({ label: y, value: daysByYear[y].size }));
const chartYearEl = document.getElementById("chart-year");
if (chartYearEl && yearItems.length) {
  renderVerticalBarChart(chartYearEl, yearItems, {
    color: "#5b8cff",
    valueLabel: (v) => `${v} hike${v === 1 ? "" : "s"}`
  });
  const topYear = yearItems.reduce((a, b) => (b.value > a.value ? b : a));
  document.getElementById("chart-year-caption").innerHTML = `Busiest year: <strong>${topYear.label}</strong> (${topYear.value} hikes)`;
}

// 2. Peak elevation distribution — bin size picked so ~6 bins cover the
// range, instead of a fixed width that over- or under-fills the chart.
const ELEVATION_BIN = niceStep((maxElevation - minElevation) / 6);
const elevationBinStart = Math.floor(minElevation / ELEVATION_BIN) * ELEVATION_BIN;
const elevationBinEnd = Math.ceil((maxElevation + 1) / ELEVATION_BIN) * ELEVATION_BIN;
const elevationBins = [];
for (let b = elevationBinStart; b < elevationBinEnd; b += ELEVATION_BIN) {
  elevationBins.push({ min: b, max: b + ELEVATION_BIN, value: 0 });
}
peakElevations.forEach((elevation) => {
  const bin = elevationBins.find((b) => elevation >= b.min && elevation < b.max) || elevationBins[elevationBins.length - 1];
  bin.value += 1;
});
const chartElevationEl = document.getElementById("chart-elevation");
if (chartElevationEl && elevationBins.length) {
  renderVerticalBarChart(
    chartElevationEl,
    elevationBins.map((b) => ({ label: `${b.min}`, tooltipLabel: `${b.min}–${b.max} m`, value: b.value })),
    { color: PEAK_COLOR, valueLabel: (v) => `${v} peak${v === 1 ? "" : "s"}` }
  );
  const topBin = elevationBins.reduce((a, b) => (b.value > a.value ? b : a));
  document.getElementById("chart-elevation-caption").innerHTML = `Most peaks sit between <strong>${topBin.min}–${topBin.max} m</strong>`;
}

// 3. Locations by mountain range
const rangeCounts = {};
locations.forEach((loc) => {
  rangeCounts[loc.range] = (rangeCounts[loc.range] || 0) + 1;
});
const rangeItems = Object.entries(rangeCounts)
  .map(([label, value]) => ({ label, value }))
  .sort((a, b) => b.value - a.value)
  .slice(0, 6);
const chartRangeEl = document.getElementById("chart-range");
if (chartRangeEl && rangeItems.length) {
  renderHorizontalBarChart(chartRangeEl, rangeItems, {
    color: LAKE_COLOR,
    valueLabel: (v) => `${v} location${v === 1 ? "" : "s"}`
  });
  document.getElementById("chart-range-caption").innerHTML = `Most explored: <strong>${rangeItems[0].label}</strong> (${rangeItems[0].value})`;
}
