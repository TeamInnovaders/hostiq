import { useState, useCallback } from "react";

// 2026 Turo Protection Plans
const PLANS = [
  { id: "90", label: "90%", hostPct: 0.90, turoPct: 0.10, deductible: "$5,000", desc: "Highest earnings, highest risk" },
  { id: "85", label: "85%", hostPct: 0.85, turoPct: 0.15, deductible: "$3,750", desc: "High earnings, high deductible" },
  { id: "80", label: "80%", hostPct: 0.80, turoPct: 0.20, deductible: "$2,500", desc: "Balanced earnings & coverage" },
  { id: "75", label: "75%", hostPct: 0.75, turoPct: 0.25, deductible: "$1,250", desc: "Standard — most popular" },
  { id: "60", label: "60%", hostPct: 0.60, turoPct: 0.40, deductible: "$250", desc: "Max protection, lowest earnings" },
];

const f$ = (n) => (n < 0 ? `-$${Math.abs(n).toFixed(2)}` : `$${n.toFixed(2)}`);
const fK = (n) => (n < 0 ? `-$${Math.abs(n/1000).toFixed(1)}K` : n >= 1000 ? `$${(n/1000).toFixed(1)}K` : f$(n));
const fp = (n) => `${(n * 100).toFixed(1)}%`;

const S = {
  page: { minHeight: "100vh", background: "#0a0c10", color: "#eceff4", fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif" },
  wrap: { maxWidth: 540, margin: "0 auto", padding: "20px 16px 40px" },
  card: { background: "#11131a", borderRadius: 16, border: "1px solid #1c1f2b", padding: 22, marginBottom: 16 },
  label: { display: "block", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#636b82", marginBottom: 6 },
  inputWrap: (f) => ({ display: "flex", alignItems: "center", background: "#0a0c10", border: `1.5px solid ${f ? "#6c5ce7" : "#1c1f2b"}`, borderRadius: 10, padding: "0 14px", transition: "border-color 0.15s" }),
  input: { flex: 1, background: "transparent", border: "none", outline: "none", color: "#eceff4", fontSize: 20, fontWeight: 700, padding: "13px 0", fontFamily: "'JetBrains Mono', 'SF Mono', monospace", width: "100%" },
  prefix: { color: "#a29bfe", fontWeight: 800, fontSize: 20, marginRight: 4 },
  suffix: { color: "#636b82", fontSize: 12, fontWeight: 500, marginLeft: 8 },
  hint: { fontSize: 10, color: "#3a3f50", marginTop: 3, marginBottom: 0, lineHeight: 1.3 },
  divider: { height: 1, background: "#1c1f2b", margin: "14px 0" },
  accent: "#a29bfe", green: "#00e6a7", red: "#ff6074", amber: "#ffc145", muted: "#636b82", dimmed: "#3a3f50",
};

function Input({ label, value, onChange, prefix, suffix, hint, step, min }) {
  const [f, setF] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={S.label}>{label}</label>
      <div style={S.inputWrap(f)} onFocus={() => setF(true)} onBlur={() => setF(false)}>
        {prefix && <span style={S.prefix}>{prefix}</span>}
        <input type="number" value={value} onChange={(e) => onChange(e.target.value)} step={step || "any"} min={min || "0"} style={S.input} />
        {suffix && <span style={S.suffix}>{suffix}</span>}
      </div>
      {hint && <p style={S.hint}>{hint}</p>}
    </div>
  );
}

function PlanPicker({ selected, onSelect }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={S.label}>Protection Plan (Host Take Rate)</label>
      <div style={{ display: "flex", gap: 6 }}>
        {PLANS.map((p) => {
          const a = selected === p.id;
          return (<button key={p.id} onClick={() => onSelect(p.id)} style={{ flex: 1, background: a ? "rgba(162,155,254,0.1)" : "#0a0c10", border: a ? "1.5px solid #a29bfe" : "1.5px solid #1c1f2b", borderRadius: 8, padding: "10px 0", cursor: "pointer", transition: "all 0.15s", textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: a ? "#a29bfe" : "#eceff4", fontFamily: "'JetBrains Mono', monospace" }}>{p.label}</div>
            <div style={{ fontSize: 8, color: S.muted, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>{p.deductible} ded.</div>
          </button>);
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
        <p style={{ ...S.hint, margin: 0 }}>{PLANS.find((p) => p.id === selected)?.desc}</p>
        <span style={{ fontSize: 9, color: S.dimmed, whiteSpace: "nowrap" }}>DED. = Deductible</span>
      </div>
    </div>
  );
}

function Row({ label, value, color, sub, barPct }) {
  return (<div style={{ marginBottom: 12 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <span style={{ fontSize: 11, color: S.muted, fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 18, fontWeight: 700, color: color || "#eceff4", fontFamily: "'JetBrains Mono', monospace" }}>{value}</span>
    </div>
    {sub && <div style={{ fontSize: 9, color: S.dimmed, textAlign: "right", marginTop: 1 }}>{sub}</div>}
    {barPct !== undefined && (<div style={{ height: 2, background: "#1c1f2b", borderRadius: 1, marginTop: 4 }}><div style={{ height: "100%", borderRadius: 1, background: color || S.accent, width: `${Math.min(Math.max(barPct, 0), 100)}%`, transition: "width 0.4s ease" }} /></div>)}
  </div>);
}

function CompareTable({ base, miles, clean, mileRate }) {
  return (<div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
    <div style={{ padding: "12px 18px", background: "#0d0f15", borderBottom: "1px solid #1c1f2b" }}><span style={{ fontSize: 12, fontWeight: 700 }}>All Plans — Same Trip</span></div>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
      <thead><tr>{["Plan", "You Keep", "Turo Gets", "Net Profit"].map((h) => (<th key={h} style={{ padding: "8px 14px", textAlign: h === "Plan" ? "left" : "right", color: S.muted, fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #1c1f2b" }}>{h}</th>))}</tr></thead>
      <tbody>{PLANS.map((p, i) => { const earn = base * p.hostPct, turo = base * p.turoPct, net = earn - clean - miles * mileRate; return (<tr key={p.id} style={{ borderBottom: i < PLANS.length - 1 ? "1px solid #13151c" : "none" }}>
        <td style={{ padding: "9px 14px", fontWeight: 700, color: "#eceff4" }}>{p.label}</td>
        <td style={{ padding: "9px 14px", textAlign: "right", color: S.green, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{f$(earn)}</td>
        <td style={{ padding: "9px 14px", textAlign: "right", color: S.red, fontFamily: "'JetBrains Mono', monospace" }}>{f$(turo)}</td>
        <td style={{ padding: "9px 14px", textAlign: "right", color: net >= 0 ? S.green : S.red, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{f$(net)}</td>
      </tr>); })}</tbody>
    </table>
  </div>);
}

function History({ trips, onClear }) {
  if (!trips.length) return null;
  const tR = trips.reduce((s, t) => s + t.hostEarn, 0), tT = trips.reduce((s, t) => s + t.turoEarn, 0), tN = trips.reduce((s, t) => s + t.net, 0);
  return (<div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
    <div style={{ padding: "12px 18px", background: "#0d0f15", borderBottom: "1px solid #1c1f2b", display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 12, fontWeight: 700 }}>Trip History ({trips.length})</span><button onClick={onClear} style={{ background: "none", border: "1px solid #1c1f2b", borderRadius: 5, color: S.muted, fontSize: 10, padding: "3px 8px", cursor: "pointer" }}>Clear</button></div>
    <div style={{ maxHeight: 160, overflowY: "auto" }}>{trips.map((t, i) => (<div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 18px", borderBottom: "1px solid #13151c", fontSize: 11 }}><span><strong style={{ color: "#eceff4" }}>{t.days}d</strong> <span style={{ color: S.muted }}>{t.plan}</span></span><span style={{ fontFamily: "'JetBrains Mono', monospace" }}><span style={{ color: S.muted }}>Gross {f$(t.total)}</span><strong style={{ color: S.green, marginLeft: 10 }}>Net {f$(t.net)}</strong></span></div>))}</div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: "1px solid #1c1f2b", background: "#0d0f15" }}>{[["Earned", tR, "#eceff4"], ["To Turo", tT, S.red], ["Net Profit", tN, S.green]].map(([l, v, c]) => (<div key={l} style={{ padding: "10px 14px", textAlign: "center" }}><div style={{ fontSize: 8, color: S.dimmed, textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</div><div style={{ fontSize: 15, fontWeight: 800, color: c, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>{f$(v)}</div></div>))}</div>
  </div>);
}

function AdSlot() {
  return (<div style={{ background: "#0d0f15", border: "1px dashed #1c1f2b", borderRadius: 12, padding: "24px 18px", textAlign: "center", marginBottom: 16, minHeight: 90, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
    {/* REPLACE THIS DIV WITH YOUR GOOGLE ADSENSE CODE: */}
    {/* <ins className="adsbygoogle" style={{display:"block"}} data-ad-client="ca-pub-XXXXXXX" data-ad-slot="XXXXXXX" data-ad-format="auto" data-full-width-responsive="true"></ins> */}
    <div style={{ fontSize: 10, color: S.dimmed, textTransform: "uppercase", letterSpacing: "0.08em" }}>Sponsored</div>
    <div style={{ fontSize: 9, color: "#2a2d3a", marginTop: 4 }}>Ad unit placeholder — replace with AdSense code</div>
  </div>);
}

function Logo({ size = 28 }) {
  return (<svg width={size} height={size} viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="url(#hiqG)" /><text x="16" y="22" textAnchor="middle" fill="#0a0c10" fontSize="16" fontWeight="900" fontFamily="Arial">IQ</text><defs><linearGradient id="hiqG" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stopColor="#a29bfe" /><stop offset="100%" stopColor="#6c5ce7" /></linearGradient></defs></svg>);
}

// ═══════════════════════════════════════════
// TRIP CALCULATOR TAB
// ═══════════════════════════════════════════
function TripCalcTab() {
  const [tripTotal, setTripTotal] = useState("211.57");
  const [tripDays, setTripDays] = useState("3");
  const [plan, setPlan] = useState("75");
  const [miles, setMiles] = useState("150");
  const [clean, setClean] = useState("25");
  const [taxRate, setTaxRate] = useState("6");
  const [mileRate, setMileRate] = useState("0.12");
  const [showCompare, setShowCompare] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [trips, setTrips] = useState([]);
  const [saved, setSaved] = useState(false);

  const tt = parseFloat(tripTotal) || 0, td = parseInt(tripDays) || 1, mi = parseFloat(miles) || 0;
  const cc = parseFloat(clean) || 0, tr = (parseFloat(taxRate) || 0) / 100, mr = parseFloat(mileRate) || 0.12;
  const sp = PLANS.find((p) => p.id === plan);
  const base = tt / (1 + tr), estTax = tt - base;
  const hostEarn = base * sp.hostPct, turoEarn = base * sp.turoPct, mileCost = mi * mr;
  const net = hostEarn - cc - mileCost, perDay = td > 0 ? net / td : 0, effRate = tt > 0 ? (net / tt) * 100 : 0;

  const save = useCallback(() => { setTrips((p) => [{ total: tt, days: td, plan: sp.label, hostEarn, turoEarn, net }, ...p]); setSaved(true); setTimeout(() => setSaved(false), 1200); }, [tt, td, sp, hostEarn, turoEarn, net]);

  return (<>
    <div style={S.card}>
      <Input label="Guest Trip Total" value={tripTotal} onChange={setTripTotal} prefix="$" hint="Total amount charged to the guest" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Input label="Trip Length" value={tripDays} onChange={setTripDays} suffix="days" min="1" />
        <Input label="Est. Miles Driven" value={miles} onChange={setMiles} suffix="mi" />
      </div>
      <Input label="Cleaning Cost" value={clean} onChange={setClean} prefix="$" hint="Your cost to clean between rentals" />
      <PlanPicker selected={plan} onSelect={setPlan} />
      <button onClick={() => setShowAdvanced(!showAdvanced)} style={{ background: "none", border: "none", color: S.muted, fontSize: 10, cursor: "pointer", padding: 0, textDecoration: "underline", fontWeight: 600 }}>{showAdvanced ? "Hide" : "Show"} advanced settings</button>
      {showAdvanced && (<div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Input label="Sales Tax Rate" value={taxRate} onChange={setTaxRate} suffix="%" hint="Varies by state (MD ~6%)" />
        <Input label="Depreciation/Mile" value={mileRate} onChange={setMileRate} prefix="$" hint="Avg wear cost per mile" />
      </div>)}
    </div>

    <div style={S.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: S.muted }}>Your Trip Breakdown</span>
        <span style={{ fontSize: 10, color: S.dimmed, background: "#0a0c10", padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>{sp.label} plan</span>
      </div>
      <Row label="Your Earnings (Host Payout)" value={f$(hostEarn)} color={S.green} barPct={sp.hostPct * 100} sub={`${fp(sp.hostPct)} of trip price`} />
      <Row label="Turo Commission" value={f$(turoEarn)} color={S.red} barPct={sp.turoPct * 100} sub={`${fp(sp.turoPct)} of trip price`} />
      <Row label="Est. Sales Tax (remitted to state)" value={f$(estTax)} color={S.dimmed} sub="Not host or Turo income" />
      <div style={S.divider} />
      <Row label="Cleaning Cost" value={`-${f$(cc)}`} color={S.amber} />
      <Row label={`Depreciation (${mi} mi × $${mr})`} value={`-${f$(mileCost)}`} color={S.amber} />
      <div style={S.divider} />
      <div style={{ background: net >= 0 ? "rgba(0,230,167,0.04)" : "rgba(255,96,116,0.04)", border: `1.5px solid ${net >= 0 ? "rgba(0,230,167,0.18)" : "rgba(255,96,116,0.18)"}`, borderRadius: 14, padding: "20px 16px", textAlign: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 9, color: S.muted, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 6 }}>Your True Net Profit</div>
        <div style={{ fontSize: 42, fontWeight: 800, color: net >= 0 ? S.green : S.red, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{f$(net)}</div>
        <div style={{ fontSize: 11, color: S.muted, marginTop: 8, fontWeight: 500 }}>{f$(perDay)}/day · {effRate.toFixed(1)}% effective take rate</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {[["Per Day Net", f$(perDay), "#eceff4"], ["Lost to Turo", f$(turoEarn), S.red]].map(([l, v, c]) => (<div key={l} style={{ background: "#0a0c10", borderRadius: 8, padding: "9px 6px", textAlign: "center" }}><div style={{ fontSize: 8, color: S.dimmed, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{l}</div><div style={{ fontSize: 14, fontWeight: 800, color: c, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>{v}</div></div>))}
      </div>
    </div>

    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
      <button onClick={save} style={{ flex: 1, background: saved ? S.green : "linear-gradient(135deg, #a29bfe, #6c5ce7)", color: saved ? "#0a0c10" : "#fff", border: "none", borderRadius: 10, padding: "13px 0", fontWeight: 800, fontSize: 13, cursor: "pointer", transition: "all 0.2s", fontFamily: "'Outfit', sans-serif" }}>{saved ? "✓ Saved!" : "Save Trip"}</button>
      <button onClick={() => setShowCompare(!showCompare)} style={{ flex: 1, background: "#11131a", color: "#eceff4", border: "1.5px solid #1c1f2b", borderRadius: 10, padding: "13px 0", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>{showCompare ? "Hide Plans" : "Compare All Plans"}</button>
    </div>
    {showCompare && <CompareTable base={base} miles={mi} clean={cc} mileRate={mr} />}
    <History trips={trips} onClear={() => setTrips([])} />
    <AdSlot />
  </>);
}

// ═══════════════════════════════════════════
// ROI CALCULATOR TAB
// ═══════════════════════════════════════════
function ROICalcTab() {
  const [purchasePrice, setPurchasePrice] = useState("13965");
  const [downPayment, setDownPayment] = useState("0");
  const [apr, setApr] = useState("6.5");
  const [loanTerm, setLoanTerm] = useState("60");
  const [dailyRate, setDailyRate] = useState("50");
  const [utilization, setUtilization] = useState("50");
  const [plan, setPlan] = useState("75");
  const [insurance, setInsurance] = useState("89");
  const [maintenance, setMaintenance] = useState("75");
  const [cleaning, setCleaning] = useState("100");
  const [marketing, setMarketing] = useState("25");

  const pp = parseFloat(purchasePrice) || 0, dp = parseFloat(downPayment) || 0;
  const r = (parseFloat(apr) || 0) / 100 / 12, n = parseInt(loanTerm) || 60;
  const dr = parseFloat(dailyRate) || 0, ut = (parseFloat(utilization) || 0) / 100;
  const sp = PLANS.find((p) => p.id === plan);
  const ins = parseFloat(insurance) || 0, mnt = parseFloat(maintenance) || 0;
  const cln = parseFloat(cleaning) || 0, mkt = parseFloat(marketing) || 0;

  const financed = pp - dp;
  const mp = financed > 0 && r > 0 ? (financed * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : financed > 0 ? financed / n : 0;
  const totalLoan = mp * n, totalInt = totalLoan - financed;
  const rentalDays = 30 * ut, grossMo = rentalDays * dr, hostMo = grossMo * sp.hostPct;
  const totalExp = mp + ins + mnt + cln + mkt;
  const moNet = hostMo - totalExp, annNet = moNet * 12;
  const roi = pp > 0 ? (annNet / pp) * 100 : 0;
  const payback = moNet > 0 ? pp / moNet : Infinity;

  const Stat = ({ label, value, color, big }) => (<div style={{ background: "#0a0c10", borderRadius: 10, padding: big ? "16px 10px" : "10px 8px", textAlign: "center" }}>
    <div style={{ fontSize: 8, color: S.dimmed, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>{label}</div>
    <div style={{ fontSize: big ? 26 : 16, fontWeight: 800, color: color || "#eceff4", fontFamily: "'JetBrains Mono', monospace", marginTop: 3 }}>{value}</div>
  </div>);

  return (<>
    <div style={S.card}>
      <label style={{ ...S.label, fontSize: 11, color: S.accent, marginBottom: 12 }}>Vehicle & Loan</label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Input label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} prefix="$" />
        <Input label="Down Payment" value={downPayment} onChange={setDownPayment} prefix="$" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Input label="Loan APR" value={apr} onChange={setApr} suffix="%" />
        <Input label="Loan Term" value={loanTerm} onChange={setLoanTerm} suffix="months" />
      </div>
      <div style={S.divider} />
      <label style={{ ...S.label, fontSize: 11, color: S.accent, marginBottom: 12 }}>Rental Income</label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Input label="Daily Rental Rate" value={dailyRate} onChange={setDailyRate} prefix="$" hint="Your listing price on Turo" />
        <Input label="Utilization" value={utilization} onChange={setUtilization} suffix="%" hint="% of month car is rented" />
      </div>
      <PlanPicker selected={plan} onSelect={setPlan} />
      <div style={S.divider} />
      <label style={{ ...S.label, fontSize: 11, color: S.accent, marginBottom: 12 }}>Monthly Expenses</label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Input label="Insurance (off-rental)" value={insurance} onChange={setInsurance} prefix="$" hint="Roamly / commercial policy" />
        <Input label="Maintenance Reserve" value={maintenance} onChange={setMaintenance} prefix="$" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Input label="Cleaning (monthly total)" value={cleaning} onChange={setCleaning} prefix="$" />
        <Input label="Marketing / Tools" value={marketing} onChange={setMarketing} prefix="$" hint="Ads, software, subs" />
      </div>
    </div>

    <div style={S.card}>
      <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: S.muted }}>ROI Analysis</span>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 14, marginBottom: 16 }}>
        <Stat label="Monthly Profit" value={f$(moNet)} color={moNet >= 0 ? S.green : S.red} big />
        <Stat label="Annual ROI" value={`${roi.toFixed(1)}%`} color={roi >= 0 ? S.green : S.red} big />
        <Stat label="Payback" value={payback === Infinity || payback < 0 ? "N/A" : `${payback.toFixed(0)} mo`} color={payback <= 24 && payback > 0 ? S.green : S.amber} big />
      </div>
      <Row label="Rental Days / Month" value={`${rentalDays.toFixed(0)} days`} color="#eceff4" />
      <Row label="Gross Monthly Revenue" value={f$(grossMo)} color="#eceff4" />
      <Row label={`Host Revenue (${sp.label} plan)`} value={f$(hostMo)} color={S.green} barPct={sp.hostPct * 100} />
      <div style={S.divider} />
      <Row label="Car Payment" value={`-${f$(mp)}`} color={S.red} sub={dp > 0 ? `$${dp.toLocaleString()} down, $${financed.toLocaleString()} financed` : `$${financed.toLocaleString()} financed`} />
      <Row label="Insurance" value={`-${f$(ins)}`} color={S.amber} />
      <Row label="Maintenance" value={`-${f$(mnt)}`} color={S.amber} />
      <Row label="Cleaning" value={`-${f$(cln)}`} color={S.amber} />
      <Row label="Marketing / Tools" value={`-${f$(mkt)}`} color={S.amber} />
      <Row label="Total Monthly Expenses" value={`-${f$(totalExp)}`} color={S.red} />
      <div style={S.divider} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6 }}>
        {[["Monthly Net", f$(moNet), moNet >= 0 ? S.green : S.red], ["Annual Net", fK(annNet), annNet >= 0 ? S.green : S.red], ["Total Interest", f$(totalInt), S.amber], ["Total Loan", fK(totalLoan), "#eceff4"]].map(([l, v, c]) => (
          <div key={l} style={{ background: "#0a0c10", borderRadius: 8, padding: "9px 4px", textAlign: "center" }}>
            <div style={{ fontSize: 7, color: S.dimmed, textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 700 }}>{l}</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: c, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>{v}</div>
          </div>))}
      </div>
    </div>
    <AdSlot />
  </>);
}

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════
export default function HostIQ() {
  const [tab, setTab] = useState("trip");
  const [email, setEmail] = useState("");
  const [subbed, setSubbed] = useState(false);

  return (
    <div style={S.page}>
      <style>{`html, body, #root { margin: 0; padding: 0; background: #0a0c10; min-height: 100vh; }`}</style>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={S.wrap}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <Logo />
            <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em" }}>Host<span style={{ color: S.accent }}>IQ</span></span>
          </div>
          <p style={{ color: S.muted, fontSize: 12, margin: 0, fontWeight: 500 }}>Know your numbers. Grow your fleet.</p>
        </div>

        <div style={{ display: "flex", gap: 0, marginBottom: 16, borderBottom: "2px solid #1c1f2b" }}>
          {[{ id: "trip", label: "Trip Calculator" }, { id: "roi", label: "ROI Calculator" }].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, background: tab === t.id ? S.accent : "transparent", color: tab === t.id ? "#0a0c10" : S.muted, border: "none", borderRadius: "8px 8px 0 0", padding: "10px 0", fontSize: 12, fontWeight: 800, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'Outfit', sans-serif", transition: "all 0.15s" }}>{t.label}</button>
          ))}
        </div>

        {tab === "trip" ? <TripCalcTab /> : <ROICalcTab />}

        {!subbed ? (
          <div style={{ ...S.card, textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#eceff4", marginBottom: 4 }}>Level up your hosting game</div>
            <p style={{ fontSize: 11, color: S.muted, margin: "0 0 12px", lineHeight: 1.5 }}>Weekly insights on pricing, protection plans, fleet growth, and maximizing your take-home. Free forever.</p>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1, ...S.inputWrap(false), padding: "0 12px" }}><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" style={{ ...S.input, fontSize: 13, fontWeight: 500, fontFamily: "'Outfit', sans-serif" }} /></div>
              <button onClick={() => { if (email.includes("@")) const handleSub = async () => {
  if (!email.includes('@')) return;
  try {
    await fetch('https://api.convertkit.com/v3/forms/9249876/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: '7iDFgcAB40pa7k9l7_hCGg',
        email: email,
        tags: ['hostiq', 'turo-host']
      })
    });
    setSubbed(true);
  } catch (err) {
    setSubbed(true); // Still show success to user
  }
};
; }} style={{ background: "linear-gradient(135deg, #a29bfe, #6c5ce7)", color: "#fff", border: "none", borderRadius: 10, padding: "0 20px", fontWeight: 800, fontSize: 12, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>Join</button>
            </div>
          </div>
        ) : (
          <div style={{ ...S.card, textAlign: "center" }}><div style={{ fontSize: 18, marginBottom: 4 }}>✓</div><div style={{ fontSize: 13, fontWeight: 700, color: S.green }}>You're in! First issue drops this week.</div></div>
        )}

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <Logo size={16} />
            <span style={{ fontSize: 13, fontWeight: 700, color: S.muted }}>Host<span style={{ color: S.accent }}>IQ</span></span>
            <span style={{ fontSize: 10, color: S.dimmed, marginLeft: 4 }}>hostiq.tools</span>
          </div>
          <p style={{ fontSize: 9, color: S.dimmed, lineHeight: 1.6, maxWidth: 400, margin: "0 auto" }}>HostIQ is not affiliated with Turo, Inc. Calculations are estimates based on publicly available fee structures as of March 2026. Actual earnings vary by plan, location, booking lead time, and Turo's current policies.</p>
        </div>
      </div>
    </div>
  );
}
