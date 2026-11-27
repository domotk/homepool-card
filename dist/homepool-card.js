/**
 * HomePool Card (version: VERSION below)
 *
 * Companion card for the `homepool` integration.
 *
 *   type: custom:homepool-card
 *   entity: sensor.pool_daily_filtration_target
 *   display_mode: pool_and_pump   # pool | pump | pool_and_pump
 *   card_size: medium             # small | medium | full
 *   show_name: true
 *   name: "Garden pool"           # instead of the device's own name
 *
 * The pool is drawn from its own shape and size, as the integration stores
 * them: a kidney pool looks like a kidney, a 10 × 4 m pool is long and thin.
 * The water moves only while the pump runs, so a still pool on the card means
 * a still pool in the garden.
 *
 * Everything the card shows comes from the target sensor's attributes: the
 * pool's geometry, the ids of HomePool's own entities, and the ids of the
 * sensors you connected. Nothing is guessed from entity names.
 *
 * No dependencies, no build step: served as a plain ES module.
 */

const VERSION = "0.1.3";

const STRINGS = {
  en: {
    name: "Pool",
    description: "The pool drawn from its own shape, today's filtration and who is running the pump",
    entity: "Daily filtration target sensor",
    name_label: "Name on the card",
    show_name: "Show the name",
    display_mode: "Drawing",
    card_size: "Size",
    dm_pool: "Pool",
    dm_pump: "Equipment room",
    dm_pool_and_pump: "Pool and equipment room",
    cs_small: "Small",
    cs_medium: "Medium",
    cs_full: "Full",
    no_entity: "Pick the 'Daily filtration target' sensor of a HomePool pool",
    not_target: "This is not a HomePool target sensor",
    today: "Today",
    of: "of",
    left: "{m} left",
    done: "Target reached",
    min: "min",
    ph: "pH",
    water: "Water",
    salt: "Salt",
    chlorine: "Chlorine",
    production: "Production",
    recommended: "{p} % recommended",
    next_task: "Next task",
    mode: "Mode",
    running: "Running",
    stopped: "Stopped",
    unavailable: "Unavailable",
    modes: { off: "Off", timer: "Timer", smart: "Smart", solar: "Solar", smart_solar: "Smart + solar" },
    sources: {
      hands_off: "Hands off",
      maintenance_lock: "Maintenance lock",
      winter_passive: "Passive wintering",
      safety: "Safety shutoff",
      freeze_protection: "Freeze protection",
      ph_correction: "pH correction",
      treatment: "Water treatment",
      manual_cycle: "Manual cycle",
      manual_override: "Switched by hand",
      manual_override_automation: "Switched by an automation",
      manual_override_script: "Switched by a script",
      manual_override_external: "Switched outside HomePool",
      mode: "Mode",
      unavailable: "Pump unavailable",
    },
    tasks: {
      none: "Nothing due",
      backwash: "Backwash",
      filter_cleaning: "Clean the filter",
      ph_calibration: "Calibrate the pH probe",
    },
    status: { ok: "All good", attention: "Needs attention", action_required: "Action required" },
    open_pump: "Pump of {name}",
    open_target: "Filtration of {name}",
  },
  es: {
    name: "Piscina",
    description: "La piscina dibujada con su propia forma, la filtración de hoy y quién manda en la bomba",
    entity: "Sensor de objetivo de filtración diario",
    name_label: "Nombre en la tarjeta",
    show_name: "Mostrar el nombre",
    display_mode: "Dibujo",
    card_size: "Tamaño",
    dm_pool: "Piscina",
    dm_pump: "Caseta de depuración",
    dm_pool_and_pump: "Piscina y caseta",
    cs_small: "Pequeña",
    cs_medium: "Mediana",
    cs_full: "Completa",
    no_entity: "Elige el sensor 'Objetivo de filtración diario' de una piscina de HomePool",
    not_target: "Este no es un sensor de objetivo de HomePool",
    today: "Hoy",
    of: "de",
    left: "faltan {m}",
    done: "Objetivo cumplido",
    min: "min",
    ph: "pH",
    water: "Agua",
    salt: "Sal",
    chlorine: "Cloro",
    production: "Producción",
    recommended: "{p} % recomendado",
    next_task: "Próxima tarea",
    mode: "Modo",
    running: "En marcha",
    stopped: "Parada",
    unavailable: "No disponible",
    modes: { off: "Apagado", timer: "Temporizador", smart: "Inteligente", solar: "Solar", smart_solar: "Inteligente + solar" },
    sources: {
      hands_off: "Manos fuera",
      maintenance_lock: "Bloqueo de mantenimiento",
      winter_passive: "Invernaje pasivo",
      safety: "Parada de seguridad",
      freeze_protection: "Protección antiheladas",
      ph_correction: "Corrección de pH",
      treatment: "Tratamiento del agua",
      manual_cycle: "Ciclo manual",
      manual_override: "Accionada a mano",
      manual_override_automation: "Accionada por una automatización",
      manual_override_script: "Accionada por un script",
      manual_override_external: "Accionada fuera de HomePool",
      mode: "Modo",
      unavailable: "Bomba no disponible",
    },
    tasks: {
      none: "Nada pendiente",
      backwash: "Contralavado",
      filter_cleaning: "Limpiar el filtro",
      ph_calibration: "Calibrar la sonda de pH",
    },
    status: { ok: "Todo bien", attention: "Requiere atención", action_required: "Acción necesaria" },
    open_pump: "Bomba de {name}",
    open_target: "Filtración de {name}",
  },
};

// The finish of the pool decides the colour of its water more than anything.
const WATER = {
  white: ["#7fdcf0", "#45c2e3"],
  light_blue: ["#5ccbed", "#2aa6d6"],
  blue: ["#3fb0e6", "#1a86c4"],
  dark_blue: ["#2a8fc9", "#145f99"],
  green: ["#4fc9b8", "#22978a"],
  sand: ["#8ad8d6", "#4fb3b4"],
  grey: ["#6cbcd6", "#3d8aa8"],
  black: ["#2f6f8f", "#183f57"],
};

function lang(hass) {
  const l = ((hass && (hass.locale && hass.locale.language)) || (hass && hass.language) || "en").split("-")[0];
  return STRINGS[l] ? l : "en";
}

function t(hass, key, vars) {
  const table = STRINGS[lang(hass)];
  let value = key.split(".").reduce((o, k) => (o ? o[k] : undefined), table);
  if (value === undefined) value = key.split(".").reduce((o, k) => (o ? o[k] : undefined), STRINGS.en);
  if (typeof value !== "string") return key;
  return value.replace(/\{(\w+)\}/g, (_, k) => (vars && vars[k] !== undefined ? vars[k] : ""));
}

function fire(node, type, detail) {
  node.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
}

function esc(text) {
  return String(text ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function num(state) {
  if (!state) return null;
  const v = parseFloat(state.state);
  return Number.isFinite(v) ? v : null;
}

function hm(minutes) {
  if (minutes === null || minutes === undefined || !Number.isFinite(minutes)) return "–";
  const m = Math.max(0, Math.round(minutes));
  const h = Math.floor(m / 60);
  return h ? `${h} h ${String(m % 60).padStart(2, "0")}` : `${m} min`;
}

function targetSensors(hass) {
  if (!hass) return [];
  return Object.keys(hass.states)
    .filter((id) => id.startsWith("sensor.") && hass.states[id].attributes.pool_entities !== undefined)
    .map((id) => ({ value: id, label: hass.states[id].attributes.friendly_name || id }));
}

// ---------- the drawing ----------

/** The pool's outline in an SVG box of width 300, height derived from its shape. */
function outline(shape, dims) {
  const d = dims || {};
  let w;
  let h;
  switch (shape) {
    case "square":
      w = h = d.side || 5;
      break;
    case "round":
      w = h = d.diameter || 5;
      break;
    case "l_shape":
      w = Math.max(d.length_1 || 6, d.length_2 || 3);
      h = (d.width_1 || 3) + (d.width_2 || 2);
      break;
    default:
      w = d.length || 8;
      h = d.width || 4;
  }
  // Long side across. Very long pools are squashed a little so the card does
  // not turn into a ribbon; the proportions still read.
  if (h > w) [w, h] = [h, w];
  const ratio = Math.min(Math.max(h / w, 0.28), 1);
  const W = 300;
  const H = Math.round(W * ratio);
  const pad = 10;
  const x0 = pad;
  const y0 = pad;
  const x1 = W - pad;
  const y1 = H - pad;
  let path;
  switch (shape) {
    case "round":
    case "oval": {
      const cx = W / 2;
      const cy = H / 2;
      const rx = (x1 - x0) / 2;
      const ry = (y1 - y0) / 2;
      path = `M ${cx - rx} ${cy} a ${rx} ${ry} 0 1 0 ${2 * rx} 0 a ${rx} ${ry} 0 1 0 ${-2 * rx} 0 Z`;
      break;
    }
    case "kidney": {
      const mx = (x0 + x1) / 2;
      const dip = (y1 - y0) * 0.22;
      path =
        `M ${x0 + 30} ${y0} C ${mx - 30} ${y0} ${mx - 10} ${y0 + dip} ${mx} ${y0 + dip} ` +
        `C ${mx + 10} ${y0 + dip} ${mx + 30} ${y0} ${x1 - 40} ${y0} ` +
        `C ${x1 + 5} ${y0} ${x1 + 5} ${y1} ${x1 - 40} ${y1} ` +
        `L ${x0 + 30} ${y1} C ${x0 - 12} ${y1} ${x0 - 12} ${y0} ${x0 + 30} ${y0} Z`;
      break;
    }
    case "l_shape": {
      const split = x0 + (x1 - x0) * (Math.min(d.length_2 || 3, d.length_1 || 6) / Math.max(d.length_1 || 6, d.length_2 || 3));
      const mid = y0 + (y1 - y0) * ((d.width_1 || 3) / ((d.width_1 || 3) + (d.width_2 || 2)));
      path = `M ${x0} ${y0} H ${x1} V ${mid} H ${split} V ${y1} H ${x0} Z`;
      break;
    }
    default: {
      const r = 10;
      path =
        `M ${x0 + r} ${y0} H ${x1 - r} Q ${x1} ${y0} ${x1} ${y0 + r} V ${y1 - r} ` +
        `Q ${x1} ${y1} ${x1 - r} ${y1} H ${x0 + r} Q ${x0} ${y1} ${x0} ${y1 - r} V ${y0 + r} Q ${x0} ${y0} ${x0 + r} ${y0} Z`;
    }
  }
  return { W, H, path, x0, y0, x1, y1 };
}

function steps(geo, variant, orientation) {
  if (!variant || variant === "plain") return "";
  const { x0, y0, x1, y1 } = geo;
  const s = 34;
  const shapes = [];
  const corner = (cx, cy, sx, sy) => {
    for (let i = 0; i < 3; i++) {
      const r = s - i * 10;
      shapes.push(
        `<path d="M ${cx} ${cy + sy * r} A ${r} ${r} 0 0 ${sx * sy > 0 ? 0 : 1} ${cx + sx * r} ${cy}" class="step"/>`
      );
    }
  };
  if (variant.includes("corner") || variant.includes("roman")) {
    const o = orientation || "top_left";
    corner(o.includes("right") ? x1 : x0, o.includes("bottom") ? y1 : y0, o.includes("right") ? -1 : 1, o.includes("bottom") ? -1 : 1);
  } else if (variant.includes("side") || variant.includes("beach") || variant.includes("bench") || variant.includes("island")) {
    const o = orientation || "left";
    for (let i = 1; i <= 3; i++) {
      const off = i * 9;
      if (o === "left") shapes.push(`<line x1="${x0 + off}" y1="${y0 + 6}" x2="${x0 + off}" y2="${y1 - 6}" class="step"/>`);
      else if (o === "right") shapes.push(`<line x1="${x1 - off}" y1="${y0 + 6}" x2="${x1 - off}" y2="${y1 - 6}" class="step"/>`);
      else if (o === "bottom") shapes.push(`<line x1="${x0 + 6}" y1="${y1 - off}" x2="${x1 - 6}" y2="${y1 - off}" class="step"/>`);
      else shapes.push(`<line x1="${x0 + 6}" y1="${y0 + off}" x2="${x1 - 6}" y2="${y0 + off}" class="step"/>`);
    }
  }
  return shapes.join("");
}

function poolSvg(attrs, running, lightsOn) {
  const geo = outline(attrs.shape, attrs.dimensions);
  const [light, deep] = Object.hasOwn(WATER, attrs.liner_color) ? WATER[attrs.liner_color] : WATER.light_blue;
  const returns = Math.min(Number(attrs.returns) || 2, 8);
  const skimmers = Math.min(Number(attrs.skimmers) || 1, 6);
  const { W, H, x0, y0, x1, y1 } = geo;
  const across = (n, i) => x0 + ((x1 - x0) * (i + 1)) / (n + 1);
  const ret = Array.from({ length: returns }, (_, i) => {
    const x = across(returns, i);
    return `<g class="return" style="--d:${(i * 0.37) % 1.4}s">
      <circle cx="${x}" cy="${y1 - 4}" r="3" class="nozzle"/>
      <circle cx="${x - 3}" cy="${y1 - 12}" r="2" class="bubble"/>
      <circle cx="${x + 2}" cy="${y1 - 18}" r="1.5" class="bubble b2"/>
      <circle cx="${x}" cy="${y1 - 24}" r="1.2" class="bubble b3"/>
    </g>`;
  }).join("");
  const skim = Array.from({ length: skimmers }, (_, i) => {
    const x = across(skimmers, i);
    return `<rect x="${x - 7}" y="${y0 - 6}" width="14" height="8" rx="2" class="skimmer"/>`;
  }).join("");
  return `
  <svg viewBox="0 0 ${W} ${H}" class="pool ${running ? "running" : ""} ${lightsOn ? "lit" : ""}" role="img">
    <defs>
      <linearGradient id="hp-water" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${light}"/>
        <stop offset="1" stop-color="${deep}"/>
      </linearGradient>
      <pattern id="hp-ripple" width="60" height="22" patternUnits="userSpaceOnUse">
        <path d="M0 11 Q 15 4 30 11 T 60 11" class="ripple"/>
      </pattern>
      <clipPath id="hp-clip"><path d="${geo.path}"/></clipPath>
      <radialGradient id="hp-glow"><stop offset="0" stop-color="#fff8c4" stop-opacity=".85"/><stop offset="1" stop-color="#fff8c4" stop-opacity="0"/></radialGradient>
    </defs>
    <path d="${geo.path}" class="coping"/>
    <path d="${geo.path}" fill="url(#hp-water)"/>
    <g clip-path="url(#hp-clip)">
      <rect class="ripples" x="-60" y="0" width="${W + 120}" height="${H}" fill="url(#hp-ripple)"/>
      ${lightsOn ? `<circle cx="${(x0 + x1) / 2}" cy="${(y0 + y1) / 2}" r="${Math.min(W, H) / 2}" fill="url(#hp-glow)" class="glow"/>` : ""}
      ${steps(geo, attrs.layout_variant, attrs.layout_orientation)}
      ${ret}
    </g>
    ${skim}
  </svg>`;
}

function pumpSvg(running, chlorinatorOn, hasChlorinator) {
  return `
  <svg viewBox="0 0 300 96" class="room ${running ? "running" : ""}" role="img">
    <path d="M 20 70 H 92" class="pipe"/>
    <path d="M 20 70 H 92" class="flow"/>
    <path d="M 148 70 H 190 V 40 H 214" class="pipe"/>
    <path d="M 148 70 H 190 V 40 H 214" class="flow"/>
    <path d="M 254 40 H 288" class="pipe"/>
    <path d="M 254 40 H 288" class="flow"/>
    <g class="pump" transform="translate(120 66)">
      <rect x="-30" y="-20" width="60" height="34" rx="8" class="body"/>
      <circle r="13" class="housing"/>
      <g class="impeller"><path d="M0 -10 L3 0 L0 10 L-3 0 Z"/><path d="M-10 0 L0 3 L10 0 L0 -3 Z"/></g>
    </g>
    <g class="filter" transform="translate(234 48)">
      <rect x="-20" y="-40" width="40" height="76" rx="18" class="body"/>
      <rect x="-8" y="-46" width="16" height="8" rx="2" class="cap"/>
    </g>
    ${hasChlorinator ? `<g transform="translate(272 40)"><rect x="-10" y="-10" width="20" height="20" rx="4" class="cell ${chlorinatorOn ? "on" : ""}"/></g>` : ""}
  </svg>`;
}

// ---------- the card ----------

class HomePoolCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement("homepool-card-editor");
  }

  static getStubConfig(hass) {
    const first = targetSensors(hass)[0];
    return { type: "custom:homepool-card", entity: first ? first.value : "" };
  }

  setConfig(config) {
    if (!config || !config.entity) throw new Error(t(this._hass, "no_entity"));
    this._config = { show_name: true, display_mode: "pool_and_pump", card_size: "medium", ...config };
    this._key = null;
    this._render();
  }

  getCardSize() {
    return { small: 2, medium: 5, full: 8 }[this._config?.card_size] || 5;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _state(id) {
    return id && this._hass ? this._hass.states[id] : undefined;
  }

  _watchedKey() {
    const target = this._state(this._config.entity);
    if (!target) return "missing";
    const a = target.attributes;
    const ids = [
      ...Object.values(a.pool_entities || {}),
      ...Object.values(a.entities || {}),
      ...(a.lights || []),
    ];
    return [target.last_updated, lang(this._hass), ...ids.map((id) => this._state(id)?.last_updated)].join("|");
  }

  _render() {
    if (!this._config || !this._hass) return;
    const key = this._watchedKey();
    if (key === this._key) return;
    this._key = key;
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });

    const target = this._state(this._config.entity);
    if (!target || target.attributes.pool_entities === undefined) {
      this.shadowRoot.innerHTML = `<ha-card><div class="msg">${esc(t(this._hass, target ? "not_target" : "no_entity"))}</div></ha-card>`;
      return;
    }
    const a = target.attributes;
    const own = a.pool_entities || {};
    const ext = a.entities || {};
    const st = (k) => this._state(own[k]);

    const name =
      this._config.name ||
      (target.attributes.friendly_name || "").replace(/\s*(Daily filtration target|Objetivo de filtración diario)\s*$/i, "") ||
      t(this._hass, "name");
    const targetMin = num(target);
    const elapsed = num(st("filtration_elapsed_today"));
    const pumpState = st("pump") || this._state(ext.pump_switch);
    const available = pumpState && pumpState.state !== "unavailable";
    const running = pumpState?.state === "on";
    const lightsOn = (a.lights || []).some((id) => this._state(id)?.state === "on");
    const chlorOn = this._state(ext.chlorinator_switch)?.state === "on";
    const mode = st("operation_mode")?.state;
    const control = st("pump_control");
    const status = st("overall_status")?.state;
    const task = st("next_manual_task")?.state;
    const pct = targetMin ? Math.min(100, Math.round(((elapsed || 0) / targetMin) * 100)) : 0;
    const left = targetMin !== null && elapsed !== null ? targetMin - elapsed : null;

    const ph = num(this._state(ext.ph_sensor));
    const water = num(this._state(ext.water_temperature_sensor));
    const salt = num(st("salinity"));
    const rec = num(st("recommended_chlorinator_production"));
    const size = this._config.card_size;
    const dm = this._config.display_mode;
    const showPool = size !== "small" && dm !== "pump";
    const showPumpRoom = size !== "small" && (dm === "pump" || (dm === "pool_and_pump" && size === "full"));

    const chip = (label, value, cls = "") =>
      value === null || value === undefined ? "" : `<div class="chip ${cls}"><span>${esc(label)}</span><b>${esc(value)}</b></div>`;
    const reason = control?.attributes?.reason || "";
    const source = control?.state;
    // Who switched it, from HomePool 0.1.2 on: by hand unless it says otherwise.
    const by = control?.attributes?.manual_override_by;
    const sourceKey =
      source === "manual_override" && ["automation", "script", "external"].includes(by)
        ? `manual_override_${by}`
        : source;
    // A source this card does not know yet (a newer HomePool) reads as words, not as a key.
    const sourceLabel = (key) => {
      const label = t(this._hass, `sources.${key}`);
      return label === `sources.${key}` ? String(key).replace(/_/g, " ") : label;
    };

    this.shadowRoot.innerHTML = `
      <style>${STYLE}</style>
      <ha-card>
        ${
          this._config.show_name
            ? `<div class="head">
                <div class="title">${esc(name)}</div>
                ${status ? `<div class="status ${esc(status)}" title="${esc(t(this._hass, `status.${status}`))}"></div>` : ""}
              </div>`
            : ""
        }
        ${
          showPool
            ? `<button class="drawing" data-open="${esc(this._config.entity)}" aria-label="${esc(t(this._hass, "open_target", { name }))}">
                ${poolSvg(a, running, lightsOn)}
              </button>`
            : ""
        }
        ${
          showPumpRoom
            ? `<button class="drawing" data-open="${esc(own.pump || ext.pump_switch || "")}" aria-label="${esc(t(this._hass, "open_pump", { name }))}">
                ${pumpSvg(running, chlorOn, !!ext.chlorinator_switch)}
              </button>`
            : ""
        }
        <div class="progress">
          <div class="row">
            <span class="state ${running ? "on" : ""}">${esc(t(this._hass, !available ? "unavailable" : running ? "running" : "stopped"))}</span>
            <span class="figures">${esc(t(this._hass, "today"))} <b>${hm(elapsed)}</b> ${esc(t(this._hass, "of"))} ${hm(targetMin)}</span>
          </div>
          <div class="bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><div style="width:${pct}%"></div></div>
          <div class="row sub">
            <span>${left !== null && left > 0 ? esc(t(this._hass, "left", { m: hm(left) })) : esc(t(this._hass, "done"))}</span>
            ${
              source
                ? `<button class="mode" data-open="${esc(own.operation_mode || "")}" title="${esc(reason)}">
                    ${esc(source === "mode" && mode ? t(this._hass, `modes.${mode}`) : sourceLabel(sourceKey))}
                  </button>`
                : ""
            }
          </div>
        </div>
        ${
          size !== "small"
            ? `<div class="chips">
                ${chip(t(this._hass, "ph"), ph !== null ? ph.toFixed(2) : null, ph !== null && st("ph_out_of_range")?.state === "on" ? "warn" : "")}
                ${chip(t(this._hass, "water"), water !== null ? `${water.toFixed(1)} °C` : null)}
                ${chip(t(this._hass, "salt"), salt !== null ? `${salt.toFixed(1)} g/L` : null)}
                ${chip(t(this._hass, "production"), rec !== null ? t(this._hass, "recommended", { p: Math.round(rec) }) : null)}
                ${task && task !== "none" ? chip(t(this._hass, "next_task"), t(this._hass, `tasks.${task}`), st("manual_action_pending")?.state === "on" ? "warn" : "") : ""}
              </div>`
            : ""
        }
        ${
          // HomePool 0.1.1 writes the reason in Home Assistant's language and
          // adds reason_key; 0.1.0 wrote it in English only, so without the key
          // it is shown only to English users.
          size === "full" && reason && (control?.attributes?.reason_key || lang(this._hass) === "en")
            ? `<div class="reason">${esc(reason)}</div>`
            : ""
        }
      </ha-card>`;

    this.shadowRoot.querySelectorAll("[data-open]").forEach((el) =>
      el.addEventListener("click", () => {
        const id = el.getAttribute("data-open");
        if (id) fire(this, "hass-more-info", { entityId: id });
      })
    );
  }
}

const STYLE = `
  :host { --hp-ink: var(--primary-text-color); }
  ha-card { padding: 14px 16px 12px; overflow: hidden; }
  .msg { padding: 8px 0; color: var(--secondary-text-color); }
  .head { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .title { font-size: 1.15em; font-weight: 600; flex: 1; }
  .status { width: 10px; height: 10px; border-radius: 50%; background: var(--success-color, #4caf50); }
  .status.attention { background: var(--warning-color, #ffa600); }
  .status.action_required { background: var(--error-color, #db4437); }
  button { font: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer; }
  .drawing { display: block; width: 100%; margin: 2px 0 10px; border-radius: 12px; }
  .drawing:focus-visible, .mode:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
  svg { display: block; width: 100%; height: auto; max-height: 190px; margin: 0 auto; }
  .coping { fill: #eceff1; stroke: #b0bec5; stroke-width: 12; stroke-linejoin: round; }
  .ripple { fill: none; stroke: rgba(255,255,255,.35); stroke-width: 2; }
  .ripples { opacity: .55; }
  .pool.running .ripples { animation: hp-drift 6s linear infinite; opacity: .9; }
  .step { fill: none; stroke: rgba(255,255,255,.6); stroke-width: 3; }
  .nozzle { fill: #cfd8dc; stroke: #78909c; stroke-width: 1; }
  .skimmer { fill: #cfd8dc; stroke: #78909c; stroke-width: 1; }
  .bubble { fill: rgba(255,255,255,.9); opacity: 0; }
  .pool.running .bubble { animation: hp-bubble 1.4s ease-out infinite; animation-delay: var(--d); }
  .pool.running .b2 { animation-delay: calc(var(--d) + .45s); }
  .pool.running .b3 { animation-delay: calc(var(--d) + .9s); }
  .pool.lit .glow { animation: hp-pulse 3s ease-in-out infinite; }
  .room .pipe { fill: none; stroke: #b0bec5; stroke-width: 8; stroke-linecap: round; stroke-linejoin: round; }
  .room .flow { fill: none; stroke: #4fc3f7; stroke-width: 3; stroke-dasharray: 6 10; opacity: 0; stroke-linecap: round; }
  .room.running .flow { opacity: 1; animation: hp-flow 0.8s linear infinite; }
  .room .body { fill: #546e7a; stroke: #37474f; stroke-width: 2; }
  .room .housing { fill: #78909c; stroke: #37474f; stroke-width: 2; }
  .room .impeller path { fill: #eceff1; }
  .room.running .impeller { animation: hp-spin 0.6s linear infinite; }
  .room .cap { fill: #37474f; }
  .room .cell { fill: #90a4ae; stroke: #37474f; stroke-width: 2; }
  .room .cell.on { fill: #66bb6a; }
  .progress .row { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
  .progress .sub { margin-top: 6px; color: var(--secondary-text-color); font-size: .9em; }
  .state { font-weight: 600; color: var(--secondary-text-color); }
  .state.on { color: var(--info-color, #039be5); }
  .figures b { font-weight: 600; }
  .bar { height: 8px; border-radius: 4px; background: var(--divider-color, rgba(0,0,0,.12)); overflow: hidden; margin-top: 6px; }
  .bar div { height: 100%; background: var(--info-color, #039be5); border-radius: 4px; transition: width .6s ease; }
  .mode { padding: 2px 10px; border-radius: 12px; background: var(--secondary-background-color, rgba(0,0,0,.05)); font-size: .9em; }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
  .chip { display: flex; gap: 6px; align-items: baseline; padding: 4px 10px; border-radius: 12px; background: var(--secondary-background-color, rgba(0,0,0,.05)); font-size: .9em; }
  .chip span { color: var(--secondary-text-color); }
  .chip.warn { background: rgba(255,166,0,.18); }
  .reason { margin-top: 8px; font-size: .85em; color: var(--secondary-text-color); }
  @keyframes hp-drift { from { transform: translateX(0); } to { transform: translateX(60px); } }
  @keyframes hp-bubble { 0% { opacity: 0; transform: translateY(6px); } 30% { opacity: 1; } 100% { opacity: 0; transform: translateY(-14px); } }
  @keyframes hp-pulse { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
  @keyframes hp-flow { to { stroke-dashoffset: -16; } }
  @keyframes hp-spin { to { transform: rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) {
    .pool.running .ripples, .pool.running .bubble, .room.running .flow, .room.running .impeller, .pool.lit .glow { animation: none; }
    .pool.running .bubble { opacity: .7; }
  }
`;

// ---------- the editor ----------

function schemaFor(hass) {
  const opts = (prefix, values) => values.map((v) => ({ value: v, label: t(hass, `${prefix}${v}`) }));
  return [
    { name: "entity", required: true, selector: { entity: { integration: "homepool", domain: "sensor" } } },
    { name: "name", selector: { text: {} } },
    { name: "show_name", selector: { boolean: {} } },
    {
      name: "display_mode",
      selector: { select: { mode: "dropdown", options: opts("dm_", ["pool", "pump", "pool_and_pump"]) } },
    },
    {
      name: "card_size",
      selector: { select: { mode: "dropdown", options: opts("cs_", ["small", "medium", "full"]) } },
    },
  ];
}

class HomePoolCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config;
    this._render();
  }
  // A new hass arrives on every state change in the house. Re-rendering the
  // form's data on each one would overwrite what the user just picked before
  // the config round-trips, so only the form's hass is refreshed.
  set hass(hass) {
    this._hass = hass;
    if (this._form) this._form.hass = hass;
    else this._render();
  }
  _render() {
    if (!this._config || !this._hass) return;
    if (!this._form) {
      if (!this.shadowRoot) this.attachShadow({ mode: "open" });
      this._form = document.createElement("ha-form");
      this._form.addEventListener("value-changed", (ev) =>
        fire(this, "config-changed", { config: { type: this._config.type, ...ev.detail.value } })
      );
      this.shadowRoot.append(this._form);
    }
    this._form.hass = this._hass;
    this._form.schema = schemaFor(this._hass);
    this._form.data = { show_name: true, display_mode: "pool_and_pump", card_size: "medium", ...this._config };
    this._form.computeLabel = (s) => t(this._hass, s.name === "name" ? "name_label" : s.name);
  }
}

customElements.define("homepool-card", HomePoolCard);
customElements.define("homepool-card-editor", HomePoolCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "homepool-card",
  name: "HomePool",
  description: STRINGS.en.description,
  preview: true,
});

console.info(
  `%c HOMEPOOL-CARD %c v${VERSION} `,
  "color: white; background: #1a86c4; font-weight: 700;",
  "color: #1a86c4; background: white; font-weight: 700;"
);
