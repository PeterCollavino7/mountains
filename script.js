const PEAK_COLOR = "#b8703f";
const LAKE_COLOR = "#2dd4bf";
const RIFUGIO_COLOR = "#c1443c";
const PASSO_COLOR = "#8b8f98";
const ACCENT = "#5b8cff";

const TYPE_LABELS = {
  peak: "Peaks",
  lake: "Lakes",
  rifugio: "Huts",
  passo: "Passes"
};
const TYPE_LABELS_SINGULAR = { peak: "Peak", lake: "Lake", rifugio: "Hut", passo: "Pass" };
const TYPE_COLORS = { peak: PEAK_COLOR, lake: LAKE_COLOR, rifugio: RIFUGIO_COLOR, passo: PASSO_COLOR };

const LOCAL_RANGES = ["Julian Alps", "Carnic Alps", "Julian Prealps", "Carnic Prealps"];
const REDUCE_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// --- Date helpers ---
// Two different date rules, both deliberate: firstDate drives the list sort and
// the timeline (when a place was *discovered*); allDates drives hike counting
// (every day out, including return climbs).
function firstDate(loc) {
  return loc.dates && loc.dates.length ? loc.dates[0] : loc.date || "";
}

function allDates(loc) {
  return loc.dates && loc.dates.length ? loc.dates : loc.date ? [loc.date] : [];
}

function formatDate(isoDate) {
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}/${y}`;
}

function formatLongDate(isoDate) {
  const [y, m, d] = isoDate.split("-");
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
}

function formatMeters(n) {
  return n.toLocaleString("en-US");
}

function markerColor(loc) {
  return TYPE_COLORS[loc.type] || PEAK_COLOR;
}

// Small solid glyph per type — the legend in the chips, the list and the charts.
function typeIconSvg(type) {
  if (type === "lake") {
    return `<svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="currentColor"/></svg>`;
  }
  if (type === "rifugio") {
    return `<svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21 V11 L12 4 L20 11 V21 Z" fill="currentColor"/></svg>`;
  }
  if (type === "passo") {
    return `<svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 L22 12 L12 22 L2 12 Z" fill="currentColor"/></svg>`;
  }
  return `<svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 L21 20 L3 20 Z" fill="currentColor"/></svg>`;
}

function coloredTypeIcon(type) {
  return `<span class="type-icon" style="color:${TYPE_COLORS[type]}">${typeIconSvg(type)}</span>`;
}

// --- Map ---
// Whole zoom levels only: at fractional zoom the scaled label tiles show
// hairline seams in Chrome.
const map = L.map("map", { zoomControl: false }).setView([46.5, 12.9], 10);

// Shaded relief as the base (a hiking log should show the mountains), with a
// separate labels layer on top so towns stay readable over the texture.
const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services/";
L.tileLayer(`${ESRI}Elevation/World_Hillshade_Dark/MapServer/tile/{z}/{y}/{x}`, {
  className: "relief-tiles",
  maxZoom: 17,
  maxNativeZoom: 16,
  attribution: 'Relief &amp; labels &copy; <a href="https://www.esri.com/">Esri</a>, USGS, HERE, Garmin, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
L.tileLayer(`${ESRI}Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}`, {
  className: "label-tiles",
  maxZoom: 17,
  maxNativeZoom: 16
}).addTo(map);

L.control.zoom({ position: "bottomright" }).addTo(map);

// Defensive resize: if the container's size wasn't final at construction
// time, Leaflet caches a stale size/pixel origin and tiles render at the
// wrong offset (or not at all) even though the box itself looks fine.
// A ResizeObserver catches every actual size change of the container.
new ResizeObserver(() => map.invalidateSize()).observe(document.getElementById("map-wrap"));

function markerIcon(loc, extraClass = "") {
  const color = markerColor(loc);
  const stroke = `stroke="#0f1115" stroke-width="1.5" stroke-linejoin="round"`;
  let size;
  let anchor;
  let svg;

  if (loc.type === "lake") {
    size = [20, 20];
    anchor = [10, 10];
    svg = `<circle cx="12" cy="12" r="8" fill="${color}" ${stroke}/><path d="M7.5 12.5c1.5-1.2 3-1.2 4.5 0s3 1.2 4.5 0" fill="none" stroke="#0f1115" stroke-width="1.4" stroke-linecap="round" opacity="0.55"/>`;
  } else if (loc.type === "rifugio") {
    size = [24, 24];
    anchor = [12, 21];
    svg = `<path d="M4 21 V11 L12 4 L20 11 V21 Z" fill="${color}" ${stroke}/><rect x="10" y="14" width="4" height="7" fill="#0f1115"/>`;
  } else if (loc.type === "passo") {
    size = [20, 20];
    anchor = [10, 10];
    svg = `<path d="M12 2 L22 12 L12 22 L2 12 Z" fill="${color}" ${stroke}/>`;
  } else {
    size = [26, 26];
    anchor = [13, 20];
    // Snow-capped: a pale tip on the triangle reads as "summit" at a glance.
    svg = `<path d="M12 3 L21 20 L3 20 Z" fill="${color}" ${stroke}/><path d="M12 4.6 L14.9 10 L13.2 9.1 L12 10.4 L10.8 9.1 L9.1 10 Z" fill="#f1ece4" opacity="0.9"/>`;
  }

  return L.divIcon({
    className: `loc-marker ${extraClass}`.trim(),
    html: `<svg class="marker-glyph" viewBox="0 0 24 24">${svg}</svg>`,
    iconSize: size,
    iconAnchor: anchor,
    popupAnchor: [0, -anchor[1] + 2]
  });
}

const peakElevations = locations
  .filter((l) => l.type === "peak" && l.elevation != null)
  .map((l) => l.elevation);
const minElevation = Math.min(...peakElevations);
const maxElevation = Math.max(...peakElevations);
const maxElevationAll = Math.max(...locations.filter((l) => l.elevation != null).map((l) => l.elevation));

function popupHtml(loc) {
  const elevation =
    loc.elevation != null
      ? `<div class="popup-elevation">${formatMeters(loc.elevation)}<small>m</small></div>`
      : "";

  const elevationBar =
    loc.type === "peak" && loc.elevation != null
      ? `<div class="elevation-bar"><div class="elevation-bar-fill" style="width:${Math.round(
          ((loc.elevation - minElevation) / (maxElevation - minElevation || 1)) * 100
        )}%; background:${PEAK_COLOR}"></div></div>
        <div class="elevation-bar-scale"><span>${formatMeters(minElevation)} m</span><span>${formatMeters(maxElevation)} m</span></div>`
      : "";

  const visits = allDates(loc);
  const verb = loc.type === "peak" || loc.type === "passo" ? "Climbed" : "Visited";
  const visitsHtml = visits.length
    ? `<div class="popup-visits"><strong>${verb} ${visits.length === 1 ? "once" : `${visits.length} times`}</strong>
        <div class="visit-dates">${visits.map((d) => `<span class="visit-date">${formatDate(d)}</span>`).join("")}</div></div>`
    : "";

  return `
    <div class="popup">
      <div class="popup-kicker">${coloredTypeIcon(loc.type)}${TYPE_LABELS_SINGULAR[loc.type]} &middot; ${loc.range}</div>
      <strong class="popup-name">${loc.name}</strong>
      ${elevation}
      ${elevationBar}
      ${visitsHtml}
      ${loc.note ? `<p class="popup-note">${loc.note}</p>` : ""}
      <button type="button" class="popup-link" data-slug="${slugByName[loc.name]}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>
        <span>Copy link</span>
      </button>
    </div>
  `;
}

// --- Last outing: the most recent visit, not the most recent first visit, so a
// return climb of an old peak still counts as the latest time out. ---
const latestVisit = (loc) => {
  const dates = allDates(loc);
  return dates.length ? dates[dates.length - 1] : "";
};
const mostRecent = locations.reduce(
  (latest, loc) => (!latest || latestVisit(loc) > latestVisit(latest) ? loc : latest),
  null
);

// Stable URL fragment per place (#monte-coglians), so a single place can be
// linked to directly.
function slugify(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
const slugByName = {};
const nameBySlug = {};
locations.forEach((loc) => {
  let slug = slugify(loc.name);
  for (let n = 2; nameBySlug[slug]; n++) slug = `${slugify(loc.name)}-${n}`;
  slugByName[loc.name] = slug;
  nameBySlug[slug] = loc.name;
});

const markersByName = {};
const bounds = [];

locations.forEach((loc) => {
  const isLatest = mostRecent && loc.name === mostRecent.name;
  const marker = L.marker([loc.lat, loc.lng], {
    icon: markerIcon(loc, isLatest ? "marker-latest" : ""),
    title: loc.name,
    riseOnHover: true,
    zIndexOffset: isLatest ? 1000 : 0
  })
    .addTo(map)
    .bindPopup(popupHtml(loc), { maxWidth: 280, autoPanPadding: [16, 56] });

  marker.on("click", () => setActiveLocation(loc.name));
  marker.on("popupclose", () => {
    if (location.hash === `#${slugByName[loc.name]}`) {
      history.replaceState(null, "", location.pathname + location.search);
    }
  });

  markersByName[loc.name] = marker;
  if (LOCAL_RANGES.includes(loc.range)) bounds.push([loc.lat, loc.lng]);
});

// Initial view covers the home ranges only — fitting the far-away trips too
// would zoom out until the main cluster looks empty.
function fitHome(animate = false) {
  if (bounds.length) map.fitBounds(bounds, { padding: [28, 28], animate });
}
fitHome();

// Smaller markers when zoomed out, so the dense central Carnic cluster
// overlaps less; full size once zoomed in where there is room.
function updateZoomClass() {
  const z = map.getZoom();
  const el = map.getContainer();
  el.classList.toggle("zoom-far", z <= 9);
  el.classList.toggle("zoom-mid", z === 10);
}
map.on("zoomend", updateZoomClass);
updateZoomClass();

const RecenterControl = L.Control.extend({
  options: { position: "bottomright" },
  onAdd() {
    const bar = L.DomUtil.create("div", "leaflet-bar");
    const btn = L.DomUtil.create("a", "recenter-btn", bar);
    btn.href = "#";
    btn.title = "Back to the home ranges";
    btn.setAttribute("role", "button");
    btn.setAttribute("aria-label", "Back to the home ranges");
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>`;
    L.DomEvent.disableClickPropagation(bar);
    L.DomEvent.on(btn, "click", (e) => {
      L.DomEvent.preventDefault(e);
      map.closePopup();
      fitHome(!REDUCE_MOTION);
    });
    return bar;
  }
});
new RecenterControl().addTo(map);

// --- Stats ---
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
const typeCount = (type) => locations.filter((l) => l.type === type).length;

function statHtml(value, label, { type, title } = {}) {
  const icon = type ? `<span style="color:${TYPE_COLORS[type]}">${typeIconSvg(type)}</span>` : "";
  return `<div class="stat"${title ? ` title="${title}"` : ""}><dt class="stat-label">${icon}${label}</dt><dd class="stat-value">${value}</dd></div>`;
}

statsBar.innerHTML = [
  statHtml(peaks.length, "Peaks", { type: "peak" }),
  highest ? statHtml(`${formatMeters(highest.elevation)}<small>m</small>`, "Highest", { title: highest.name }) : "",
  statHtml(typeCount("lake"), "Lakes", { type: "lake" }),
  statHtml(typeCount("rifugio"), "Huts", { type: "rifugio" }),
  statHtml(typeCount("passo"), "Passes", { type: "passo" }),
  statHtml(ranges.length, "Ranges")
].join("");

const lastOutingEl = document.getElementById("last-outing");
if (mostRecent && latestVisit(mostRecent)) {
  lastOutingEl.innerHTML =
    `<span class="live-dot" aria-hidden="true"></span>Last outing: <strong>${mostRecent.name}</strong> &middot; ${formatLongDate(latestVisit(mostRecent))}`;
  lastOutingEl.hidden = false;
  lastOutingEl.addEventListener("click", () => setActiveLocation(mostRecent.name, { switchToMap: true }));
}

// --- Filter chips: type ---
const typeChips = document.getElementById("type-chips");
const activeTypes = new Set(Object.keys(TYPE_LABELS));

Object.entries(TYPE_LABELS).forEach(([type, label]) => {
  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = "chip active";
  chip.setAttribute("aria-pressed", "true");
  chip.innerHTML = `<span class="chip-icon">${typeIconSvg(type)}</span>${label}<span class="chip-count">${typeCount(type)}</span>`;
  chip.style.setProperty("--chip-color", TYPE_COLORS[type]);
  chip.addEventListener("click", () => {
    const on = !activeTypes.has(type);
    if (on) activeTypes.add(type);
    else activeTypes.delete(type);
    chip.classList.toggle("active", on);
    chip.setAttribute("aria-pressed", String(on));
    renderList();
    applyFilter();
  });
  typeChips.appendChild(chip);
});

// --- Period filter: set from the "Hikes by month" calendar. Matches any
// visit in that year/month (return climbs included), since the calendar
// counts every day out. ---
let periodFilter = null; // { year: "2024", month: 8 | null }
const periodChipEl = document.getElementById("period-chip");

function periodPrefix() {
  if (!periodFilter) return "";
  return periodFilter.month ? `${periodFilter.year}-${String(periodFilter.month).padStart(2, "0")}` : periodFilter.year;
}

function periodLabel() {
  if (!periodFilter) return "";
  return periodFilter.month ? `${MONTHS[periodFilter.month - 1]} ${periodFilter.year}` : periodFilter.year;
}

function matchesPeriod(loc) {
  const prefix = periodPrefix();
  return !prefix || allDates(loc).some((d) => d.startsWith(prefix));
}

function setPeriodFilter(next, { reveal = false } = {}) {
  periodFilter = next;
  if (next && timelineBar.classList.contains("open")) closeTimeline();

  const matching = locations.filter((l) => matchesPeriod(l));
  if (next) {
    periodChipEl.hidden = false;
    periodChipEl.querySelector(".period-text").textContent = `${periodLabel()} · ${matching.length} place${matching.length === 1 ? "" : "s"}`;
  } else {
    periodChipEl.hidden = true;
  }
  document.querySelectorAll(".cal-cell.is-selected, .cal-year.is-selected").forEach((c) => c.classList.remove("is-selected"));
  if (next) {
    const sel = next.month
      ? document.querySelector(`.cal-cell[data-ym="${periodPrefix()}"]`)
      : document.querySelector(`.cal-year[data-year="${next.year}"]`);
    if (sel) sel.classList.add("is-selected");
  }

  renderList();
  applyFilter();

  if (next && matching.length) {
    if (reveal) {
      const toolbar = document.querySelector(".toolbar");
      window.scrollTo({ top: Math.max(0, toolbar.getBoundingClientRect().top + window.scrollY - 8), behavior: REDUCE_MOTION ? "auto" : "smooth" });
    }
    if (!listViewEl.hidden) return;
    map.closePopup();
    const pts = matching.map((l) => [l.lat, l.lng]);
    map.fitBounds(pts, { padding: [60, 60], maxZoom: 12, animate: !REDUCE_MOTION });
  } else if (!next) {
    fitHome(!REDUCE_MOTION);
  }
}

periodChipEl.addEventListener("click", () => setPeriodFilter(null));

function applyFilter() {
  const cutoff = timelineCutoffDate();
  locations.forEach((loc) => {
    const marker = markersByName[loc.name];
    const visible =
      activeTypes.has(loc.type) &&
      matchesPeriod(loc) &&
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
const tableBodyEl = document.getElementById("peak-table-body");
const listCountEl = document.getElementById("list-count");
const listEmptyEl = document.getElementById("list-empty");
const searchInput = document.getElementById("search-input");
let activeLocationName = null;

function setActiveLocation(name, { switchToMap = false } = {}) {
  if (activeLocationName && markersByName[activeLocationName]) {
    const prev = markersByName[activeLocationName].getElement();
    if (prev) prev.classList.remove("is-active");
  }
  activeLocationName = name;
  if (slugByName[name] && location.hash !== `#${slugByName[name]}`) {
    history.replaceState(null, "", `#${slugByName[name]}`);
  }
  if (switchToMap) setView("map");
  renderList();
  const marker = markersByName[name];
  if (marker) {
    if (!map.hasLayer(marker)) marker.addTo(map);
    const el = marker.getElement();
    if (el) el.classList.add("is-active");
    // Open the popup once the map has arrived: opened mid-flight, its auto-pan
    // is computed against the old view and it can end up clipped at the top.
    if (REDUCE_MOTION) {
      map.setView(marker.getLatLng(), 12);
      marker.openPopup();
    } else {
      map.closePopup();
      map.once("moveend", () => marker.openPopup());
      map.flyTo(marker.getLatLng(), 12, { duration: 0.8 });
    }
  }
}

function renderList() {
  const query = searchInput.value.trim().toLowerCase();

  tableBodyEl.innerHTML = "";

  const base = locations
    .filter((l) => activeTypes.has(l.type) && matchesPeriod(l))
    .filter((l) => l.name.toLowerCase().includes(query));

  listCountEl.innerHTML = `<strong>${base.length}</strong> of ${locations.length} places`;
  listEmptyEl.hidden = base.length > 0;

  let currentYear = null;

  function appendYearHeader(year, meta) {
    const header = document.createElement("tr");
    header.className = "year-row";
    header.innerHTML = `<td colspan="5">${year}<span class="year-meta">${meta}</span></td>`;
    tableBodyEl.appendChild(header);
  }

  function appendRow(loc, dateStr, extraHtml) {
    const row = document.createElement("tr");
    row.className = "peak-row" + (loc.name === activeLocationName ? " active" : "");
    const elevation = loc.elevation != null
      ? `<span class="elev-cell"><span class="elev-bar"><span style="width:${Math.round(
          (loc.elevation / maxElevationAll) * 100
        )}%"></span></span><span class="elev-value">${formatMeters(loc.elevation)} m</span></span>`
      : "—";
    row.innerHTML = `
      <td><div class="cell-name">${coloredTypeIcon(loc.type)}<div><span class="name-text">${loc.name}</span>${extraHtml || ""}<span class="row-sub">${loc.range}</span></div></div></td>
      <td class="col-type">${TYPE_LABELS_SINGULAR[loc.type]}</td>
      <td class="col-range">${loc.range}</td>
      <td class="col-elev">${elevation}</td>
      <td class="col-date">${dateStr ? formatDate(dateStr) : "—"}</td>
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
      allDates(loc).forEach((date, i) => {
        if (date.startsWith(periodPrefix())) visits.push({ loc, date, isRevisit: i > 0 });
      });
    });
    visits.sort((a, b) => b.date.localeCompare(a.date));

    const perYear = {};
    visits.forEach(({ date }) => {
      const y = date.slice(0, 4) || "Undated";
      perYear[y] = (perYear[y] || 0) + 1;
    });

    visits.forEach(({ loc, date, isRevisit }) => {
      const year = date.slice(0, 4) || "Undated";
      if (year !== currentYear) {
        currentYear = year;
        appendYearHeader(year, `${perYear[year]} visit${perYear[year] === 1 ? "" : "s"}`);
      }
      appendRow(loc, date, isRevisit ? `<span class="visit-count">revisit</span>` : "");
    });
  } else {
    // Elevation sort: one row per location — visit dates don't affect the
    // ranking, so collapse back to the first ascent date + a "+N" count.
    base
      .sort((a, b) => (b.elevation ?? -1) - (a.elevation ?? -1))
      .forEach((loc) => {
        const extraVisits = loc.dates && loc.dates.length > 1
          ? `<span class="visit-count" title="All visits: ${loc.dates.map(formatDate).join(", ")}">+${loc.dates.length - 1}</span>`
          : "";
        appendRow(loc, firstDate(loc), extraVisits);
      });
  }
}

searchInput.addEventListener("input", () => {
  renderList();
  // Searching from the map view jumps to the list, where results are visible.
  if (searchInput.value.trim() && listViewEl.hidden) setView("list");
});

// --- View toggle: Map / List ---
const viewToggle = document.getElementById("view-toggle");
const mapWrapEl = document.getElementById("map-wrap");
const listViewEl = document.getElementById("list-view");

function setView(view) {
  viewToggle.querySelectorAll(".view-btn").forEach((btn) => {
    const on = btn.dataset.view === view;
    btn.classList.toggle("active", on);
    btn.setAttribute("aria-selected", String(on));
  });
  mapWrapEl.hidden = view !== "map";
  listViewEl.hidden = view !== "list";
  if (view === "map") map.invalidateSize();
}

viewToggle.querySelectorAll(".view-btn").forEach((btn) => {
  btn.addEventListener("click", () => setView(btn.dataset.view));
});

renderList();

// --- Timeline scrubber: replay the hiking history chronologically ---
const timelineSlider = document.getElementById("timeline-slider");
const timelineLabel = document.getElementById("timeline-label");
const timelinePlay = document.getElementById("timeline-play");
const timelineTicks = document.getElementById("timeline-ticks");
const PLAY_ICON = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>`;
const PAUSE_ICON = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4.5" width="4" height="15" rx="1"/><rect x="14" y="4.5" width="4" height="15" rx="1"/></svg>`;

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
  tick.title = `End of ${year}`;
  tick.setAttribute("aria-label", `Jump to the end of ${year}`);
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
  timelineLabel.innerHTML = d
    ? `${MONTHS[Number(d.slice(5, 7)) - 1]} ${d.slice(0, 4)}<small>${timelineIndex + 1} / ${timelineDates.length} places</small>`
    : "";
}

function stopTimelinePlayback() {
  if (timelineTimer) {
    clearInterval(timelineTimer);
    timelineTimer = null;
    timelinePlay.innerHTML = PLAY_ICON;
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
  if (REDUCE_MOTION) {
    setTimelineIndex(timelineDates.length - 1);
    return;
  }

  setTimelineIndex(0);
  timelinePlay.innerHTML = PAUSE_ICON;
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
  if (timelineTimer) stopTimelinePlayback();
  else startTimelinePlayback();
});

updateTimelineLabel();
updateTimelineTicks();

// --- Timeline toggle: hidden until requested, so the map opens uncluttered ---
const timelineBar = document.getElementById("timeline-bar");
const timelineToggle = document.getElementById("timeline-toggle");

function closeTimeline() {
  timelineBar.classList.remove("open");
  timelineToggle.classList.remove("active");
  timelineToggle.setAttribute("aria-pressed", "false");
  stopTimelinePlayback();
  setTimelineIndex(timelineDates.length - 1);
}

timelineToggle.addEventListener("click", () => {
  if (timelineBar.classList.contains("open")) {
    closeTimeline();
    return;
  }
  // The replay covers the whole log, so it can't run inside a month/year filter.
  if (periodFilter) setPeriodFilter(null);
  timelineBar.classList.add("open");
  timelineToggle.classList.add("active");
  timelineToggle.setAttribute("aria-pressed", "true");
});

/* =====================================================================
   Charts — plain SVG/HTML, no charting library. Each one is drawn at the
   container's real pixel width (and redrawn on resize), so text stays the
   same size on a phone instead of shrinking with a scaled viewBox.
   ===================================================================== */
const SVG_NS = "http://www.w3.org/2000/svg";

function svgEl(tag, attrs = {}, parent) {
  const el = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  if (parent) parent.appendChild(el);
  return el;
}

// Rounds up to a "clean" step (1/2/5/10 x a power of ten).
function niceStep(value) {
  if (value <= 1) return 1;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const residual = value / magnitude;
  const niceResidual = residual <= 1 ? 1 : residual <= 2 ? 2 : residual <= 5 ? 5 : 10;
  return niceResidual * magnitude;
}

// --- Shared tooltip: hover with a mouse, tap on touch screens ---
const chartTooltip = document.createElement("div");
chartTooltip.className = "chart-tooltip";
chartTooltip.setAttribute("role", "tooltip");
document.body.appendChild(chartTooltip);
let tooltipOwner = null;

function showTooltip(x, y, html, owner) {
  chartTooltip.innerHTML = html;
  chartTooltip.classList.add("visible");
  tooltipOwner = owner || null;
  const pad = 12;
  const w = chartTooltip.offsetWidth;
  const h = chartTooltip.offsetHeight;
  let left = x + pad;
  let top = y - h - pad;
  if (left + w > window.innerWidth - 8) left = x - w - pad;
  if (left < 8) left = 8;
  if (top < 8) top = y + pad;
  chartTooltip.style.left = `${left}px`;
  chartTooltip.style.top = `${top}px`;
}

function hideTooltip() {
  chartTooltip.classList.remove("visible");
  if (tooltipOwner && tooltipOwner.classList) tooltipOwner.classList.remove("is-hover");
  tooltipOwner = null;
}

// onActivate (optional): a mouse click runs it straight away; on touch the
// first tap shows the tooltip and a second tap on the same mark runs it.
function attachTooltip(el, htmlFn, onActivate) {
  let lastPointer = "mouse";
  el.addEventListener("pointerdown", (e) => (lastPointer = e.pointerType));
  el.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "mouse") showTooltip(e.clientX, e.clientY, htmlFn(), el);
  });
  el.addEventListener("pointermove", (e) => {
    if (e.pointerType === "mouse") showTooltip(e.clientX, e.clientY, htmlFn(), el);
  });
  el.addEventListener("pointerleave", (e) => {
    if (e.pointerType === "mouse") hideTooltip();
  });
  el.addEventListener("click", (e) => {
    e.stopPropagation();
    if (onActivate && (lastPointer === "mouse" || tooltipOwner === el)) {
      hideTooltip();
      onActivate();
      return;
    }
    if (tooltipOwner && tooltipOwner !== el && tooltipOwner.classList) tooltipOwner.classList.remove("is-hover");
    el.classList.add("is-hover");
    const r = el.getBoundingClientRect();
    showTooltip(r.left + r.width / 2, r.top, htmlFn(), el);
  });
}

// Jump from a chart mark to that place on the map.
function showOnMap(name) {
  const header = document.querySelector(".toolbar");
  window.scrollTo({ top: Math.max(0, header.offsetTop - 8), behavior: REDUCE_MOTION ? "auto" : "smooth" });
  setActiveLocation(name, { switchToMap: true });
}

document.addEventListener("click", hideTooltip);
window.addEventListener("scroll", hideTooltip, { passive: true });

// Draw once now, again whenever the container width changes.
function responsiveChart(container, draw) {
  let lastWidth = 0;
  let first = true;
  const run = () => {
    const width = Math.round(container.clientWidth);
    if (!width || width === lastWidth) return;
    lastWidth = width;
    container.textContent = "";
    draw(width, first && !REDUCE_MOTION);
    first = false;
  };
  new ResizeObserver(() => requestAnimationFrame(run)).observe(container);
  run();
}

// Charts animate in the first time they scroll into view, not on page load
// (they start below the map, so a load-time animation would never be seen).
function whenVisible(el, fn) {
  if (!("IntersectionObserver" in window)) {
    fn();
    return;
  }
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      io.disconnect();
      fn();
    }
  }, { threshold: 0.25 });
  io.observe(el);
}

/* 1. Hikes by month — a year × month calendar of distinct days out.
   Counts days, not locations: a day that took in two summits is one hike, and a
   return climb counts in the year it happened. Deliberately NOT timelineDates,
   which holds one first-visit date per location. */
const daysByMonth = {};
const daysByYear = {};
locations.forEach((loc) => {
  allDates(loc).forEach((d) => {
    const y = d.slice(0, 4);
    const ym = d.slice(0, 7);
    (daysByYear[y] || (daysByYear[y] = new Set())).add(d);
    (daysByMonth[ym] || (daysByMonth[ym] = new Set())).add(d);
  });
});

// Sequential ramp in the accent hue: darker/duller = fewer, lighter = more.
const CAL_RAMP = ["#27365e", "#304c93", "#3f67cc", "#5b8cff", "#a7c1ff"];

function calendarColor(v, max) {
  if (!v) return null;
  const idx = Math.min(CAL_RAMP.length - 1, Math.floor(((v - 1) / Math.max(1, max - 1)) * CAL_RAMP.length));
  return CAL_RAMP[Math.max(0, idx)];
}

(function renderCalendar() {
  const el = document.getElementById("chart-calendar");
  const years = Object.keys(daysByYear).sort();
  if (!el || !years.length) return;

  const firstYear = Number(years[0]);
  const lastYear = Number(years[years.length - 1]);
  const today = new Date();
  const todayYm = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const firstYm = Object.keys(daysByMonth).sort()[0];
  const maxMonth = Math.max(...Object.values(daysByMonth).map((s) => s.size));
  const yearTotals = years.map((y) => ({ year: y, value: daysByYear[y].size }));
  const topYear = yearTotals.reduce((a, b) => (b.value > a.value ? b : a));

  const monthTotals = MONTHS.map((_, m) => {
    let total = 0;
    Object.entries(daysByMonth).forEach(([ym, set]) => {
      if (Number(ym.slice(5, 7)) === m + 1) total += set.size;
    });
    return total;
  });
  const topMonth = monthTotals.indexOf(Math.max(...monthTotals));
  const totalHikes = yearTotals.reduce((s, y) => s + y.value, 0);

  document.getElementById("chart-calendar-headline").innerHTML =
    `<strong>${totalHikes}</strong> hikes in all. Busiest year <strong>${topYear.year}</strong> with ${topYear.value}; ` +
    `<strong>${new Date(2000, topMonth, 1).toLocaleString("en-US", { month: "long" })}</strong> is the favourite month.`;

  el.innerHTML = "";
  el.appendChild(Object.assign(document.createElement("span"), { className: "cal-head" }));
  MONTHS.forEach((m) => {
    const h = document.createElement("span");
    h.className = "cal-head";
    h.textContent = window.innerWidth < 700 ? m[0] : m;
    el.appendChild(h);
  });
  el.appendChild(Object.assign(document.createElement("span"), { className: "cal-head", textContent: "Total" }));

  const cells = [];
  for (let y = firstYear; y <= lastYear; y++) {
    const yStr = String(y);
    const yearLabel = document.createElement("span");
    yearLabel.className = "cal-year";
    yearLabel.textContent = yStr;
    yearLabel.dataset.year = yStr;
    if (daysByYear[yStr]) {
      yearLabel.classList.add("is-link");
      attachTooltip(
        yearLabel,
        () => `<strong>${yStr}</strong>${daysByYear[yStr].size} hikes<br><em class="tip-hint">Click to show on map</em>`,
        () => setPeriodFilter({ year: yStr, month: null }, { reveal: true })
      );
    }
    el.appendChild(yearLabel);

    MONTHS.forEach((mName, m) => {
      const ym = `${yStr}-${String(m + 1).padStart(2, "0")}`;
      const v = daysByMonth[ym] ? daysByMonth[ym].size : 0;
      const cell = document.createElement("span");
      cell.className = "cal-cell";
      cell.dataset.ym = ym;
      if (ym > todayYm || ym < firstYm) {
        cell.classList.add("future");
      } else if (v) {
        cell.classList.add("has-value");
        cell.style.background = calendarColor(v, maxMonth);
        attachTooltip(
          cell,
          () => `<strong>${mName} ${yStr}</strong>${v} hike${v === 1 ? "" : "s"}<br><em class="tip-hint">Click to show on map</em>`,
          () => setPeriodFilter({ year: yStr, month: m + 1 }, { reveal: true })
        );
      } else {
        attachTooltip(cell, () => `<strong>${mName} ${yStr}</strong>No hikes`);
      }
      el.appendChild(cell);
      cells.push(cell);
    });

    const total = daysByYear[yStr] ? daysByYear[yStr].size : 0;
    const t = document.createElement("span");
    t.className = "cal-total" + (yStr === topYear.year ? " is-top" : "");
    t.textContent = total;
    el.appendChild(t);
  }

  const scale = document.getElementById("calendar-scale");
  scale.innerHTML =
    `<span class="scale-text">Fewer</span>` +
    CAL_RAMP.map((c) => `<span class="swatch" style="background:${c}"></span>`).join("") +
    `<span class="scale-text">More</span>`;

  if (!REDUCE_MOTION) {
    el.classList.add("enter-fade");
    whenVisible(el, () => {
      cells.forEach((c, i) => {
        c.style.transitionDelay = `${(i % 12) * 25 + Math.floor(i / 12) * 60}ms`;
        c.classList.add("is-in");
      });
      setTimeout(() => {
        el.classList.remove("enter-fade");
        cells.forEach((c) => {
          c.classList.remove("is-in");
          c.style.transitionDelay = "";
        });
      }, 1600);
    });
  }
})();

/* 2. Places reached over time — cumulative count by first-visit date, the
   same "discovery" rule as the timeline scrubber. */
const discoveries = locations
  .filter((l) => firstDate(l))
  .map((l) => ({ loc: l, date: firstDate(l) }))
  .sort((a, b) => a.date.localeCompare(b.date));

const toTime = (iso) => new Date(`${iso}T12:00:00`).getTime();

(function renderGrowth() {
  const el = document.getElementById("chart-growth");
  if (!el || !discoveries.length) return;

  const lastYearStr = discoveries[discoveries.length - 1].date.slice(0, 4);
  const newThisYear = discoveries.filter((d) => d.date.startsWith(lastYearStr)).length;
  document.getElementById("chart-growth-headline").innerHTML =
    `<strong>${discoveries.length}</strong> places so far &mdash; <strong>${newThisYear}</strong> of them new in ${lastYearStr}.`;

  whenVisible(el, () => responsiveChart(el, (width, animate) => {
    const height = width < 500 ? 220 : 250;
    const m = { top: 14, right: 16, bottom: 26, left: 34 };
    const plotW = width - m.left - m.right;
    const plotH = height - m.top - m.bottom;

    const t0 = toTime(`${discoveries[0].date.slice(0, 4)}-01-01`);
    const t1 = toTime(discoveries[discoveries.length - 1].date);
    const x = (iso) => m.left + ((toTime(iso) - t0) / (t1 - t0 || 1)) * plotW;
    const step = niceStep(discoveries.length / 4);
    const yMax = Math.ceil(discoveries.length / step) * step;
    const y = (n) => m.top + plotH * (1 - n / yMax);

    const svg = svgEl("svg", { width, height, viewBox: `0 0 ${width} ${height}` }, el);
    const defs = svgEl("defs", {}, svg);
    const grad = svgEl("linearGradient", { id: "growth-fill", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    svgEl("stop", { offset: "0%", "stop-color": ACCENT, "stop-opacity": 0.32 }, grad);
    svgEl("stop", { offset: "100%", "stop-color": ACCENT, "stop-opacity": 0 }, grad);

    for (let n = 0; n <= yMax; n += step) {
      svgEl("line", { x1: m.left, x2: width - m.right, y1: y(n), y2: y(n), class: "axis-grid" }, svg);
      svgEl("text", { x: m.left - 8, y: y(n) + 4, "text-anchor": "end", class: "axis-label" }, svg).textContent = n;
    }

    const firstYear = Number(discoveries[0].date.slice(0, 4));
    for (let yr = firstYear; yr <= Number(lastYearStr); yr++) {
      const xx = x(`${yr}-01-01`);
      if (xx > m.left + 1) {
        svgEl("line", { x1: xx, x2: xx, y1: m.top, y2: m.top + plotH, class: "axis-grid dashed" }, svg);
      }
      const nextX = yr < Number(lastYearStr) ? x(`${yr + 1}-01-01`) : x(discoveries[discoveries.length - 1].date);
      const label = width < 500 ? `’${String(yr).slice(2)}` : String(yr);
      if (nextX - xx > 22) {
        svgEl("text", { x: (xx + nextX) / 2, y: height - 6, "text-anchor": "middle", class: "axis-label" }, svg).textContent = label;
      }
    }

    // Step line: the count only changes on the day a new place is reached.
    let d = `M${m.left},${y(0)}`;
    discoveries.forEach((p, i) => {
      d += ` H${x(p.date).toFixed(1)} V${y(i + 1).toFixed(1)}`;
    });
    const endX = x(discoveries[discoveries.length - 1].date);
    svgEl("path", { d: `${d} H${endX} V${y(0)} Z`, fill: "url(#growth-fill)" }, svg);
    const line = svgEl("path", { d, class: "growth-line" }, svg);

    // Endpoint + direct label for the running total.
    svgEl("circle", { cx: endX, cy: y(discoveries.length), r: 4, class: "growth-dot" }, svg);
    svgEl("text", { x: endX - 8, y: y(discoveries.length) - 10, "text-anchor": "end", class: "direct-label" }, svg)
      .textContent = `${discoveries.length} places`;

    if (animate) {
      const len = line.getTotalLength();
      line.style.strokeDasharray = `${len}`;
      line.style.strokeDashoffset = `${len}`;
      line.getBoundingClientRect();
      line.style.transition = "stroke-dashoffset 1.6s cubic-bezier(0.33, 1, 0.68, 1)";
      line.style.strokeDashoffset = "0";
    }

    // Crosshair: snaps to the nearest discovery along x.
    const cross = svgEl("line", { y1: m.top, y2: m.top + plotH, class: "growth-crosshair", visibility: "hidden" }, svg);
    const dot = svgEl("circle", { r: 4.5, class: "growth-dot", visibility: "hidden" }, svg);
    const hit = svgEl("rect", { x: m.left, y: m.top, width: plotW, height: plotH, class: "growth-hit" }, svg);

    const xs = discoveries.map((p) => x(p.date));
    function nearest(clientX) {
      const rect = svg.getBoundingClientRect();
      const px = clientX - rect.left;
      let best = 0;
      xs.forEach((v, i) => {
        if (Math.abs(v - px) <= Math.abs(xs[best] - px)) best = i;
      });
      return best;
    }

    function show(e) {
      const i = nearest(e.clientX);
      const p = discoveries[i];
      cross.setAttribute("x1", xs[i]);
      cross.setAttribute("x2", xs[i]);
      dot.setAttribute("cx", xs[i]);
      dot.setAttribute("cy", y(i + 1));
      cross.setAttribute("visibility", "visible");
      dot.setAttribute("visibility", "visible");
      const rect = svg.getBoundingClientRect();
      showTooltip(rect.left + xs[i], rect.top + y(i + 1),
        `<strong>${p.loc.name}</strong>${formatLongDate(p.date)} &middot; place #${i + 1}` +
        (e.pointerType === "mouse" ? `<br><em class="tip-hint">Click to show on map</em>` : ""));
    }

    function hide() {
      cross.setAttribute("visibility", "hidden");
      dot.setAttribute("visibility", "hidden");
      hideTooltip();
    }

    let lastPointer = "mouse";
    hit.addEventListener("pointermove", show);
    hit.addEventListener("pointerdown", (e) => {
      lastPointer = e.pointerType;
      show(e);
    });
    hit.addEventListener("pointerleave", (e) => {
      if (e.pointerType === "mouse") hide();
    });
    hit.addEventListener("click", (e) => {
      e.stopPropagation();
      if (lastPointer === "mouse") showOnMap(discoveries[nearest(e.clientX)].loc.name);
    });
  }));
})();

/* 3. Every summit by height — a beeswarm: one dot per peak, placed by
   elevation and nudged vertically only as far as needed not to overlap. */
(function renderSwarm() {
  const el = document.getElementById("chart-swarm");
  const peakList = peaksWithElevation.slice().sort((a, b) => a.elevation - b.elevation);
  if (!el || !peakList.length) return;

  const sorted = peakList.map((p) => p.elevation);
  const median = sorted.length % 2
    ? sorted[(sorted.length - 1) / 2]
    : Math.round((sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2);
  const above2k = sorted.filter((e) => e >= 2000).length;

  document.getElementById("chart-swarm-headline").innerHTML =
    `Median summit <strong>${formatMeters(median)} m</strong>; ` +
    `<strong>${above2k}</strong> of the ${sorted.length} peaks with a known height top 2,000 m.`;

  whenVisible(el, () => responsiveChart(el, (width, animate) => {
    const r = width < 500 ? 3.8 : 4.6;
    const m = { top: 50, right: 14, bottom: 24, left: 14 };
    const plotW = width - m.left - m.right;
    const lo = Math.floor(minElevation / 500) * 500;
    const hi = Math.ceil(maxElevation / 500) * 500;
    const x = (e) => m.left + ((e - lo) / (hi - lo || 1)) * plotW;

    // Greedy beeswarm: each dot takes the smallest vertical offset (alternating
    // above/below the axis) that doesn't collide with dots already placed.
    const placed = [];
    const minDist = r * 2 + 1;
    peakList.forEach((p) => {
      const px = x(p.elevation);
      let offset = 0;
      for (let k = 0; k < 200; k++) {
        const cand = k === 0 ? 0 : Math.ceil(k / 2) * (minDist * 0.55) * (k % 2 ? -1 : 1);
        const clash = placed.some((q) => Math.abs(q.x - px) < minDist && Math.hypot(q.x - px, q.dy - cand) < minDist);
        if (!clash) {
          offset = cand;
          break;
        }
      }
      placed.push({ p, x: px, dy: offset });
    });

    const spread = Math.max(r * 2, ...placed.map((q) => Math.abs(q.dy))) + r + 4;
    const midY = m.top + spread;
    const height = midY + spread + m.bottom;

    const svg = svgEl("svg", { width, height, viewBox: `0 0 ${width} ${height}` }, el);

    for (let e = lo; e <= hi; e += 500) {
      svgEl("line", { x1: x(e), x2: x(e), y1: m.top - 6, y2: height - m.bottom, class: "axis-grid dashed" }, svg);
      svgEl("text", { x: x(e), y: height - 6, "text-anchor": "middle", class: "axis-label" }, svg)
        .textContent = `${formatMeters(e)}${e === hi ? " m" : ""}`;
    }

    // Median marker — labelled on the top row, the highest summit on the row
    // below it, so the two direct labels can never collide.
    svgEl("line", { x1: x(median), x2: x(median), y1: 8, y2: height - m.bottom, stroke: "#9aa0aa", "stroke-width": 1 }, svg);
    svgEl("text", { x: x(median) + 6, y: 12, class: "direct-label-sub" }, svg)
      .textContent = `median ${formatMeters(median)} m`;

    const dots = [];
    placed.forEach((q, i) => {
      const home = LOCAL_RANGES.includes(q.p.range);
      const c = svgEl("circle", {
        cx: q.x,
        cy: midY + q.dy,
        r,
        fill: home ? PEAK_COLOR : "#0f1115",
        stroke: home ? "#0f1115" : PEAK_COLOR,
        "stroke-width": home ? 1.5 : 1.6,
        class: "swarm-dot"
      }, svg);
      attachTooltip(
        c,
        () => `<strong>${q.p.name}</strong>${formatMeters(q.p.elevation)} m &middot; ${q.p.range}<br><em class="tip-hint">Click to show on map</em>`,
        () => showOnMap(q.p.name)
      );
      if (animate) {
        c.style.opacity = "0";
        c.style.transition = `opacity 0.35s ease ${i * 8}ms`;
      }
      dots.push(c);
    });

    // Direct label on the highest summit only, with a leader line to its dot.
    const top = placed[placed.length - 1];
    svgEl("line", { x1: top.x, x2: top.x, y1: 32, y2: midY + top.dy - r - 2, class: "swarm-callout" }, svg);
    svgEl("text", { x: top.x, y: 28, "text-anchor": "end", class: "direct-label" }, svg)
      .textContent = `${top.p.name} ${formatMeters(top.p.elevation)} m`;

    if (animate) {
      requestAnimationFrame(() => requestAnimationFrame(() => dots.forEach((c) => (c.style.opacity = "1"))));
    }
  }));

  // Tiny legend: filled = home ranges, ring = trips further afield.
  const legend = document.createElement("div");
  legend.className = "range-legend";
  legend.style.margin = "0.8rem 0 0";
  legend.innerHTML =
    `<span class="legend-item"><svg viewBox="0 0 12 12"><circle cx="6" cy="6" r="4.5" fill="${PEAK_COLOR}"/></svg>Home ranges</span>` +
    `<span class="legend-item"><svg viewBox="0 0 12 12"><circle cx="6" cy="6" r="4" fill="none" stroke="${PEAK_COLOR}" stroke-width="1.6"/></svg>Further afield</span>`;
  el.after(legend);
})();

/* 4. Where the log goes — places per range. Home ranges first, then the trips
   further afield, each group sorted by size. One colour: the type split lives
   in the tooltip, because 1–2-place slivers per type read as noise. */
(function renderRanges() {
  const el = document.getElementById("chart-range");
  if (!el) return;

  const TYPE_ORDER = ["peak", "lake", "rifugio", "passo"];
  const rows = ranges.map((range) => {
    const inRange = locations.filter((l) => l.range === range);
    const byType = {};
    TYPE_ORDER.forEach((t) => (byType[t] = inRange.filter((l) => l.type === t).length));
    return { range, total: inRange.length, byType, home: LOCAL_RANGES.includes(range) };
  });
  const home = rows.filter((r) => r.home).sort((a, b) => b.total - a.total);
  const far = rows.filter((r) => !r.home).sort((a, b) => b.total - a.total);
  const maxTotal = Math.max(...rows.map((r) => r.total));
  const homeShare = Math.round((home.reduce((s, r) => s + r.total, 0) / locations.length) * 100);

  document.getElementById("chart-range-headline").innerHTML =
    `<strong>${homeShare}%</strong> of the log is in the home ranges, <strong>${home.length ? home[0].range : ""}</strong> above all.`;

  const bars = [];
  function addRow(r) {
    const row = document.createElement("div");
    row.className = "range-row";
    row.innerHTML = `<span class="range-name${r.home ? "" : " is-far"}" title="${r.range}">${r.range}</span><div class="range-track"><span class="range-bar${r.home ? "" : " is-far"}"></span></div><span class="range-total">${r.total}</span>`;
    const bar = row.querySelector(".range-bar");
    bar.style.width = `${Math.max(1.5, (r.total / maxTotal) * 100)}%`;
    const breakdown = TYPE_ORDER.filter((t) => r.byType[t])
      .map((t) => `${r.byType[t]} ${r.byType[t] === 1 ? TYPE_LABELS_SINGULAR[t].toLowerCase() : TYPE_LABELS[t].toLowerCase()}`)
      .join(" &middot; ");
    attachTooltip(row, () => `<strong>${r.range}</strong>${breakdown}`);
    bars.push(bar);
    el.appendChild(row);
  }

  home.forEach(addRow);
  if (far.length) {
    const divider = document.createElement("div");
    divider.className = "range-divider";
    divider.textContent = "Trips further afield";
    el.appendChild(divider);
    far.forEach(addRow);
  }

  if (!REDUCE_MOTION) {
    el.classList.add("enter-grow");
    whenVisible(el, () => {
      bars.forEach((b, i) => (b.style.transitionDelay = `${i * 50}ms`));
      requestAnimationFrame(() => el.classList.remove("enter-grow"));
      setTimeout(() => bars.forEach((b) => (b.style.transitionDelay = "")), 1500);
    });
  }
})();

// --- Deep links: /mountains/#monte-coglians opens that place. ---
function openFromHash() {
  const name = nameBySlug[decodeURIComponent(location.hash.slice(1))];
  if (name && name !== activeLocationName) setActiveLocation(name, { switchToMap: true });
}
window.addEventListener("hashchange", openFromHash);
openFromHash();

document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".popup-link");
  if (!btn) return;
  const url = `${location.origin}${location.pathname}#${btn.dataset.slug}`;
  const label = btn.querySelector("span");
  try {
    await navigator.clipboard.writeText(url);
    label.textContent = "Link copied";
  } catch {
    history.replaceState(null, "", `#${btn.dataset.slug}`);
    label.textContent = "Link in address bar";
  }
  btn.classList.add("is-done");
  setTimeout(() => {
    label.textContent = "Copy link";
    btn.classList.remove("is-done");
  }, 1800);
});
