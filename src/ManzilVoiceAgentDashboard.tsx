


import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import { Slider } from "./components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import VoiceConversation from "./components/ui/voice";

import { Download, Filter, Search, Phone, Clock, AudioLines, MapPin, Languages, CircleDot, Star, CalendarClock, Share2, X, Link2, Building2, ShieldCheck, DollarSign } from "lucide-react";


// -----------------------
// Mock Meta Leads (replace later with your API data)
// ----------------------

const i18n = {
  en: {
    appTitle: "Manzil · Meta Leads + Voice Agent",
    tagline: "Owner leads (Meta) · Voice AI qualification · Investment viability",
    langSwitcher: "UI Language",
    leadsTab: "Leads (Meta)",
    convosTab: "Conversations",
    totalLeads: "Total Leads",
    withLicense: "% with license",
    avgScore: "Avg. Score",
    avgYield: "Avg. Monthly Yield",
    frShare: "FR Share",
    searchLeadPH: "Search (name, email, zone, notes...)",
    allZones: "All zones",
    minScore: "Min score",
    exportCSV: "Export CSV",
    time: "Time",
    contact: "Contact",
    property: "Property",
    license: "License",
    yes: "Yes",
    no: "No",
    targetOcc: "Target Occ.",
    nightlyRate: "Nightly Rate (AED)",
    monthlyYield: "Monthly Yield (AED)",
    score: "Score",
    campaign: "Campaign",
    actions: "Actions",
    viewConversation: "View conversation",
    noLeadsWithFilters: "No leads with these filters.",
    totalCalls: "Total Calls",
    qualifiedLeads: "Qualified Leads",
    highPriority: "High Priority",
    avgDuration: "Avg. Duration",
    searchConvosPH: "Search (name, summary, transcript, service...)",
    service: "Service",
    allServices: "All services",
    status: "Status",
    allStatuses: "All statuses",
    language: "Language",
    all: "All",
    minVip: "Min VIP",
    exportConvosCSV: "Export CSV",
    noConvosWithFilters: "No results with these filters.",
    conversation: "Conversation",
    lead: "Lead",
    caller: "Caller",
    propertyShort: "Property",
    viabilityYield: "Viability / Yield",
    languageStatus: "Language / Status",
    recording: "Recording",
    summary: "Summary",
    transcript: "Transcript",
    openLead: "Open original lead",
    scheduleInspection: "Schedule inspection",
    assignManager: "Assign to asset manager"
  }
} as const;


type Lang = keyof typeof i18n;


const META_LEADS = [
  {
    id: "L-240901-101",
    created_at: "2025-09-01T17:15:03Z",
    source: "Meta",
    fbclid: "fbclid-xyz",
    campaign: "LX-Owners-Palm-Q4",
    adset: "Palm 5-7BR lookalike",
    ad: "Creative A – ROI calculator",
    contact: { name: "R. Haddad", phone: "+971 50 222 44 88", email: "rh@example.com", language: "EN" },
    property: { city: "Dubai", area: "Palm Jumeirah", type: "Villa", bedrooms: 6, furnishing: "Furnished", has_tourism_license: true },
    ownership: { owner_status: "Owner", mortgage: true, hoa_ok: true },
    revenue_expectations: { nightly_rate_aed: 28000, target_occupancy_pct: 65, min_months_available: 10 },
    constraints: { blackout_dates: "Dec 20 – Jan 5", owner_usage_months: 1 },
    notes: "Recommended via broker. Preferred contact WhatsApp.",
  },
  {
    id: "L-240901-102",
    created_at: "2025-09-01T18:02:40Z",
    source: "Meta",
    fbclid: "fbclid-abc",
    campaign: "Monthly-Owners-Downtown",
    adset: "1-2BR investors",
    ad: "Creative B – Calculator",
    contact: { name: "M. Benali", phone: "+971 58 777 66 55", email: "mb@example.com", language: "EN" },
    property: { city: "Dubai", area: "Downtown", type: "Apartment", bedrooms: 2, furnishing: "Semi-furnished", has_tourism_license: false },
    ownership: { owner_status: "Owner", mortgage: false, hoa_ok: true },
    revenue_expectations: { nightly_rate_aed: 900, target_occupancy_pct: 75, min_months_available: 12 },
    constraints: { blackout_dates: "", owner_usage_months: 0 },
    notes: "Long-term option also available.",
  },
  {
    id: "L-240901-103",
    created_at: "2025-09-01T20:22:12Z",
    source: "Meta",
    fbclid: "fbclid-123",
    campaign: "LX-Owners-Palm-Q4",
    adset: "Palm 7-9BR UHNW",
    ad: "Creative C – LX Mansion",
    contact: { name: "Assistant for HNWI", phone: "+44 7700 900123", email: "pa@example.com", language: "EN" },
    property: { city: "Dubai", area: "Palm Jumeirah", type: "Mansion", bedrooms: 8, furnishing: "Furnished", has_tourism_license: true },
    ownership: { owner_status: "PA", mortgage: true, hoa_ok: true },
    revenue_expectations: { nightly_rate_aed: 52000, target_occupancy_pct: 58, min_months_available: 8 },
    constraints: { blackout_dates: "NYE reserved", owner_usage_months: 0 },
    notes: "Ultra-luxury request with full services.",
  },
];

// ----------------------
// Mock Conversations linked to leads
// ----------------------
const CONVERSATIONS = [
  {
    id: "C-240901-001",
    lead_id: "L-240901-101",
    started_at: "2025-09-01T18:42:03Z",
    caller_name: "R. Haddad",
    caller_phone: "+971 50 222 44 88",
    language: "EN",
    service_type: "Owner Acquisition – Palm Villa",
    budget_label: "N/A (owner) – expected nightly 28k AED",
    checkin: null,
    checkout: null,
    guests: null,
    location: "Palm Jumeirah",
    vip_score: 92,
    sentiment: "positive",
    outcome: "High-Priority",
    duration_sec: 486,
    agent_name: "Nerolia Voice",
    audio_url: "https://www2.cs.uic.edu/~i101/SoundFiles/ImperialMarch60.wav",
    transcript: "Owner submitted Meta form (ROI calculator): 6BR Palm, furnished, license ok, target occ 65%, rate 28k. Mortgage active. Agent confirms license, HOA approvals, blackout dates, owner usage. Pitch LX concierge add-ons.",
    summary: "Owner Palm 6BR, license ok, 65% occ at 28k AED/night. Strong LX potential. Priority: interior audit and calendar.",
    tags: ["owner", "palm", "license", "lx"],
  },
  {
    id: "C-240901-002",
    lead_id: "L-240901-102",
    started_at: "2025-09-01T19:07:54Z",
    caller_name: "M. Benali",
    caller_phone: "+971 58 777 66 55",
    language: "FR",
    service_type: "Owner – Downtown Apartment",
    budget_label: "N/A (owner) – expected nightly 900 AED",
    checkin: null,
    checkout: null,
    guests: null,
    location: "Downtown",
    vip_score: 68,
    sentiment: "neutral",
    outcome: "Qualified",
    duration_sec: 296,
    agent_name: "Nerolia Voice",
    audio_url: "https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand60.wav",
    transcript: "Owner 2BR Downtown, semi-furnished, no tourism license. Interested in monthly rental as fallback. Agent explains permit path, furnishing checklist, expected occupancy 75%.",
    summary: "2BR Downtown, no license. Viable in monthly/serviced after compliance. Next: checklist and inspection appointment.",
    tags: ["monthly", "permit", "checklist"],
  },
  {
    id: "C-240901-003",
    lead_id: "L-240901-103",
    started_at: "2025-09-01T21:15:10Z",
    caller_name: "PA for HNWI",
    caller_phone: "+44 7700 900123",
    language: "EN",
    service_type: "Owner – LX Mansion",
    budget_label: "N/A (owner) – expected nightly 52k AED",
    checkin: null,
    checkout: null,
    guests: null,
    location: "Palm Jumeirah",
    vip_score: 95,
    sentiment: "positive",
    outcome: "High-Priority",
    duration_sec: 512,
    agent_name: "Nerolia Voice",
    audio_url: "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav",
    transcript: "PA submitted LX mansion: 8BR, furnished, license ok, occ 58% at 52k, NYE blocked. Agent offers LX package (chef and butler), onboarding timeline, yield modeling.",
    summary: "8BR Palm LX, license ok, 58% at 52k. Exceptional potential. Next: contract, shooting schedule, listing plan.",
    tags: ["ultra luxe", "license", "onboarding"],
  },
];

// ----------------------
// Utilities
// ----------------------
const formatDateTime = (iso: string) => new Date(iso).toLocaleString();
const secondsToMin = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  const secStr = sec < 10 ? "0" + String(sec) : String(sec);
  return m + "m" + secStr + "s";
};

function estYieldMensuelAED(nightly_rate_aed: number, occ_pct: number) {
  const nights = Math.round((30 * occ_pct) / 100);
  return nightly_rate_aed * nights;
}

function viabilityScore(lead: any) {
  let s = 0;
  const r = lead.revenue_expectations;
  const p = lead.property;
  if (!r || !p) return 0;
  // zone & type
  if (p && ["Palm Jumeirah", "Downtown", "Marina"].includes(p.area)) {
    s += 25;
  } else {
    s += 10;
  }
  if (p && ["Villa", "Mansion"].includes(p.type)) {
    s += 20;
  } else {
    s += 10;
  }
  // licence & ameublement
  if (p && p.has_tourism_license) {
    s += 20;
  } else {
    s += 5;
  }
  if (p && p.furnishing === "Furnished") {
    s += 10;
  } else if (p && p.furnishing === "Semi-furnished") {
    s += 5;
  }
  // revenu attendu
  const monthly = estYieldMensuelAED(r.nightly_rate_aed, r.target_occupancy_pct);
  if (monthly >= 300000) {
    s += 25;
  } else if (monthly >= 100000) {
    s += 15;
  } else {
    s += 5;
  }
  return Math.min(100, s);
}

const sentimentColor = (s: string) => (s === "positive" ? "bg-emerald-100 text-emerald-700" : s === "negative" ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-700");
const outcomeTone = (o: string) => (o === "High-Priority" ? "bg-purple-100 text-purple-700" : o === "Qualified" ? "bg-emerald-100 text-emerald-700" : o === "Follow-up" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700");

// ----------------------
// Simulated API
// ----------------------
async function getLeads() { return META_LEADS; }
async function getConversations() { return CONVERSATIONS; }

// ----------------------
// Component
// ----------------------
export default function ManzilVoiceAgentDashboard(): JSX.Element {
  const [tab, setTab] = useState("leads");

  const [uiLang, setUiLang] = useState<Lang>("en");
  const t = (key: keyof typeof i18n.en) => i18n[uiLang][key];


  // Leads state
  const [leads, setLeads] = useState<any[]>([]);
  const [qLead, setQLead] = useState("");
  const [area, setArea] = useState("all");
  const [minScore, setMinScore] = useState(60);

  // Conversations state
  const [convos, setConvos] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [service, setService] = useState("all");
  const [outcome, setOutcome] = useState("all");
  const [lang, setLang] = useState("all");
  const [minVip, setMinVip] = useState(60);
  const [active, setActive] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [showVoiceInterface, setShowVoiceInterface] = useState(false);

  useEffect(() => {
    getLeads().then(setLeads);
    getConversations().then(setConvos);
  }, []);

  const leadsEnriched = useMemo(() =>
    leads.map((l) => ({
      ...l,
      viability: viabilityScore(l),
      monthly_est_aed: estYieldMensuelAED(
        l.revenue_expectations.nightly_rate_aed,
        l.revenue_expectations.target_occupancy_pct
      ),
    })),
    [leads]
  );

  const leadsFiltered = useMemo(() => {
    return leadsEnriched.filter((l) => {
      const text = (
        l.id + " " +
        l.contact.name + " " +
        l.contact.phone + " " +
        l.contact.email + " " +
        l.property.area + " " +
        l.property.type + " " +
        l.notes
      ).toLowerCase();
      const matchQ = text.includes(qLead.toLowerCase());
      const matchArea = area === "all" || l.property.area.toLowerCase().includes(area);
      const matchScore = (l.viability || 0) >= minScore;
      return matchQ && matchArea && matchScore;
    });
  }, [leadsEnriched, qLead, area, minScore]);

  const leadKpis = useMemo(() => {
    const total = leadsFiltered.length;
    const avgScore = Math.round(
      (leadsFiltered.reduce((a, b) => a + (b.viability || 0), 0) / (total || 1)) || 0
    );
    const licensed = Math.round(
      100 * (leadsFiltered.filter((l) => l.property.has_tourism_license).length / (total || 1))
    );
    const furnished = Math.round(
      100 * (leadsFiltered.filter((l) => l.property.furnishing === "Furnished").length / (total || 1))
    );
    const avgYield = Math.round(
      (leadsFiltered.reduce((a, b) => a + (b.monthly_est_aed || 0), 0) / (total || 1)) || 0
    );
    return { total, avgScore, licensed, furnished, avgYield };
  }, [leadsFiltered]);

  const convosFiltered = useMemo(() => {
    return convos.filter((it) => {
      const text = (
        it.id + " " +
        it.caller_name + " " +
        it.caller_phone + " " +
        it.service_type + " " +
        it.summary + " " +
        it.transcript
      ).toLowerCase();
      const matchQ = text.includes(q.toLowerCase());
      const matchService = service === "all" || it.service_type.toLowerCase().includes(service);
      const matchOutcome = outcome === "all" || it.outcome === outcome;
      const matchLang = lang === "all" || it.language === lang;
      const matchVip = (it.vip_score || 0) >= minVip;
      return matchQ && matchService && matchOutcome && matchLang && matchVip;
    });
  }, [convos, q, service, outcome, lang, minVip]);

  const convKpis = useMemo(() => {
    const total = convosFiltered.length;
    const qualified = convosFiltered.filter((i) => i.outcome === "Qualified").length;
    const high = convosFiltered.filter((i) => i.outcome === "High-Priority").length;
    const avgDurSec = convosFiltered.reduce((a, b) => a + (b.duration_sec || 0), 0) / (total || 1);
    const avgDur = secondsToMin(Math.round(avgDurSec));
    const frShare = Math.round((100 * convosFiltered.filter((i) => i.language === "FR").length) / (total || 1));
    return { total, qualified, high, avgDur, frShare };
  }, [convosFiltered]);

  const onOpen = (it: any) => { setActive(it); setOpen(true); };

  const handleConversationEnd = (newConversation: any) => {
    // Add the new conversation to the conversations list
    setConvos(prev => [newConversation, ...prev]);
    setShowVoiceInterface(false);
  };

  const exportLeadsCSV = () => {
    const header = [
      "id","created_at","source","campaign","adset","ad","fbclid","name","phone","email","language","city","area","type","bedrooms","furnishing","has_tourism_license","owner_status","mortgage","hoa_ok","nightly_rate_aed","target_occupancy_pct","min_months_available","blackout_dates","owner_usage_months","viability","monthly_est_aed"
    ];
    const rows = leadsFiltered.map((l) => [
      l.id,
      l.created_at,
      l.source,
      l.campaign,
      l.adset,
      l.ad,
      l.fbclid,
      l.contact.name,
      l.contact.phone,
      l.contact.email,
      l.contact.language,
      l.property.city,
      l.property.area,
      l.property.type,
      String(l.property.bedrooms),
      l.property.furnishing,
      String(l.property.has_tourism_license),
      l.ownership.owner_status,
      String(l.ownership.mortgage),
      String(l.ownership.hoa_ok),
      String(l.revenue_expectations.nightly_rate_aed),
      String(l.revenue_expectations.target_occupancy_pct),
      String(l.revenue_expectations.min_months_available),
      l.constraints.blackout_dates,
      String(l.constraints.owner_usage_months),
      String(l.viability),
      String(l.monthly_est_aed)
    ]);
    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "manzil_meta_leads.csv";
    a.click();
  };

  const exportConvosCSV = () => {
    const header = ["id","lead_id","started_at","caller_name","caller_phone","language","service_type","budget_label","location","vip_score","sentiment","outcome","duration_sec","summary","audio_url"];
    const rows = convosFiltered.map((i) => header.map((h) => {
      const v = (i as any)[h];
      if (v === null || v === undefined) return "";
      const s = String(v);
      return s.replace(/\n/g, " ");
    }));
    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "manzil_voice_conversations.csv";
    a.click();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("appTitle")}</h1>
          <p className="text-sm text-slate-500">{t("tagline")}</p>
        </div>
  
        {/* Sélecteur de langue en haut à droite */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">{t("langSwitcher")}:</span>
          <Select value={uiLang} onValueChange={(v) => setUiLang(v as Lang)}>
            <SelectTrigger className="min-w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="leads">{t("leadsTab")}</TabsTrigger>
          <TabsTrigger value="convos">Conversations</TabsTrigger>
        </TabsList>

        {/* Leads Tab */}
        <TabsContent value="leads" className="space-y-4">
          <div className="grid md:grid-cols-5 gap-4">
            <Card className="rounded-2xl shadow-sm"><CardContent className="p-4"><div className="flex items-center gap-2 text-slate-600"><Building2 className="w-4 h-4"/> Total leads</div><div className="text-2xl font-semibold">{leadKpis.total}</div></CardContent></Card>
            <Card className="rounded-2xl shadow-sm"><CardContent className="p-4"><div className="flex items-center gap-2 text-slate-600"><ShieldCheck className="w-4 h-4"/> % avec licence</div><div className="text-2xl font-semibold">{leadKpis.licensed}%</div></CardContent></Card>
            <Card className="rounded-2xl shadow-sm"><CardContent className="p-4"><div className="flex items-center gap-2 text-slate-600"><Star className="w-4 h-4"/> Score moyen</div><div className="text-2xl font-semibold">{leadKpis.avgScore}</div></CardContent></Card>
            <Card className="rounded-2xl shadow-sm"><CardContent className="p-4"><div className="flex items-center gap-2 text-slate-600"><DollarSign className="w-4 h-4"/> Yield mensuel moyen</div><div className="text-2xl font-semibold">{leadKpis.avgYield.toLocaleString()} AED</div></CardContent></Card>
            <Card className="rounded-2xl shadow-sm"><CardContent className="p-4"><div className="flex items-center gap-2 text-slate-600"><Languages className="w-4 h-4"/> FR share</div><div className="text-2xl font-semibold">{Math.round(100 * (leadsFiltered.filter((l) => l.contact.language === "FR").length / (leadKpis.total || 1)))}%</div></CardContent></Card>
          </div>

          <div className="grid md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-5">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <Input placeholder="Rechercher (nom, email, zone, notes...)" className="pl-9" value={qLead} onChange={(e) => setQLead(e.target.value)} />
              </div>
            </div>
            <div className="md:col-span-3">
              <Select value={area} onValueChange={setArea}>
                <SelectTrigger><SelectValue placeholder="Zone" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes zones</SelectItem>
                  <SelectItem value="palm">Palm Jumeirah</SelectItem>
                  <SelectItem value="downtown">Downtown</SelectItem>
                  <SelectItem value="marina">Marina</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <div className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Filter className="w-3 h-3" /> Min score</div>
              <Slider value={[minScore]} min={0} max={100} step={1} onValueChange={(v) => setMinScore(v[0])} />
              <div className="text-xs text-slate-500 mt-1">{minScore}+</div>
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button variant="outline" onClick={exportLeadsCSV}><Download className="w-4 h-4 mr-2" />Exporter CSV</Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left p-3">Heure</th>
                  <th className="text-left p-3">Contact</th>
                  <th className="text-left p-3">Bien</th>
                  <th className="text-left p-3">Licence</th>
                  <th className="text-left p-3">Occ. cible</th>
                  <th className="text-left p-3">Rate (AED)</th>
                  <th className="text-left p-3">Yield mensuel (AED)</th>
                  <th className="text-left p-3">Score</th>
                  <th className="text-left p-3">Campagne</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leadsFiltered.map((l) => (
                  <tr key={l.id} className="border-t">
                    <td className="p-3 whitespace-nowrap">{formatDateTime(l.created_at)}</td>
                    <td className="p-3">
                      <div className="font-medium">{l.contact.name}</div>
                      <div className="text-xs text-slate-500">{l.contact.phone} · {l.contact.email}</div>
                    </td>
                    <td className="p-3">{l.property.type} {String(l.property.bedrooms)}BR · {l.property.area}</td>
                    <td className="p-3">{l.property.has_tourism_license ? <Badge className="rounded-xl">Oui</Badge> : <Badge variant="secondary" className="rounded-xl">Non</Badge>}</td>
                    <td className="p-3">{String(l.revenue_expectations.target_occupancy_pct)}%</td>
                    <td className="p-3">{l.revenue_expectations.nightly_rate_aed.toLocaleString()}</td>
                    <td className="p-3">{l.monthly_est_aed.toLocaleString()}</td>
                    <td className="p-3"><Badge className="rounded-xl">{l.viability}</Badge></td>
                    <td className="p-3 text-xs">{l.campaign}</td>
                    <td className="p-3 text-right">
                      <Button size="sm" onClick={() => { const linked = convos.find((c) => c.lead_id === l.id); if (linked) { onOpen(linked); } }}>
                        Voir conversation
                      </Button>
                    </td>
                  </tr>
                ))}
                {leadsFiltered.length === 0 && (
                  <tr>
                    <td className="p-6 text-center text-slate-500" colSpan={10}>Aucun lead avec ces filtres.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Conversations Tab */}
        <TabsContent value="convos" className="space-y-4">
          <div className="grid md:grid-cols-5 gap-4">
            <Card className="rounded-2xl shadow-sm"><CardContent className="p-4"><div className="flex items-center gap-2 text-slate-600"><Phone className="w-4 h-4"/> Total appels</div><div className="text-2xl font-semibold">{convKpis.total}</div></CardContent></Card>
            <Card className="rounded-2xl shadow-sm"><CardContent className="p-4"><div className="flex items-center gap-2 text-slate-600"><Star className="w-4 h-4"/> Leads qualifies</div><div className="text-2xl font-semibold">{convKpis.qualified}</div></CardContent></Card>
            <Card className="rounded-2xl shadow-sm"><CardContent className="p-4"><div className="flex items-center gap-2 text-slate-600"><CircleDot className="w-4 h-4"/> Ultra‑prioritaires</div><div className="text-2xl font-semibold">{convKpis.high}</div></CardContent></Card>
            <Card className="rounded-2xl shadow-sm"><CardContent className="p-4"><div className="flex items-center gap-2 text-slate-600"><Clock className="w-4 h-4"/> Duree moyenne</div><div className="text-2xl font-semibold">{convKpis.avgDur}</div></CardContent></Card>
            <Card className="rounded-2xl shadow-sm"><CardContent className="p-4"><div className="flex items-center gap-2 text-slate-600"><Languages className="w-4 h-4"/> FR share</div><div className="text-2xl font-semibold">{convKpis.frShare}%</div></CardContent></Card>
          </div>

          <div className="grid md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <Input placeholder="Rechercher (nom, resume, transcript, service...)" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
            </div>
            <div className="md:col-span-3">
              <Select value={service} onValueChange={setService}>
                <SelectTrigger><SelectValue placeholder="Service" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous services</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="palm">Palm Jumeirah</SelectItem>
                  <SelectItem value="downtown">Downtown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Select value={outcome} onValueChange={setOutcome}>
                <SelectTrigger><SelectValue placeholder="Statut" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  <SelectItem value="High-Priority">High‑Priority</SelectItem>
                  <SelectItem value="Qualified">Qualified</SelectItem>
                  <SelectItem value="Follow-up">Follow‑up</SelectItem>
                </SelectContent>
                              </Select>
                            </div>
                            <div className="md:col-span-1">
                              <Select value={lang} onValueChange={setLang}>
                                <SelectTrigger><SelectValue placeholder="Language" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All</SelectItem>
                                  <SelectItem value="FR">FR</SelectItem>
                                  <SelectItem value="EN">EN</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="md:col-span-2">
                              <div className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Filter className="w-3 h-3" /> Min VIP</div>
                              <Slider value={[minVip]} min={0} max={100} step={1} onValueChange={(v) => setMinVip(v[0])} />
                              <div className="text-xs text-slate-500 mt-1">{minVip}+</div>
                            </div>
                                        <div className="md:col-span-2 flex justify-end">
              <Button variant="outline" onClick={exportConvosCSV}><Download className="w-4 h-4 mr-2" />Export CSV</Button>
            </div>
                          </div>

                          <div className="overflow-hidden rounded-2xl border border-slate-200">
                            <table className="w-full text-sm">
                              <thead className="bg-slate-50 text-slate-600">
                                <tr>
                                  <th className="text-left p-3">Time</th>
                                  <th className="text-left p-3">Caller</th>
                                  <th className="text-left p-3">Service</th>
                                  <th className="text-left p-3">Area</th>
                                  <th className="text-left p-3">Language</th>
                                  <th className="text-left p-3">VIP</th>
                                  <th className="text-left p-3">Duration</th>
                                  <th className="text-left p-3">Status</th>
                                  <th className="text-left p-3">Lead</th>
                                  <th className="text-right p-3">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {convosFiltered.map((it) => (
                                  <tr key={it.id} className="border-t">
                                    <td className="p-3 whitespace-nowrap">{formatDateTime(it.started_at)}</td>
                                    <td className="p-3">
                                      <div className="font-medium">{it.caller_name}</div>
                                      <div className="text-xs text-slate-500">{it.caller_phone}</div>
                                    </td>
                                    <td className="p-3">{it.service_type}</td>
                                    <td className="p-3 flex items-center gap-1"><MapPin className="w-3 h-3" />{it.location}</td>
                                    <td className="p-3">{it.language}</td>
                                    <td className="p-3"><Badge className="rounded-xl">{it.vip_score}</Badge></td>
                                    <td className="p-3">{secondsToMin(it.duration_sec)}</td>
                                    <td className="p-3"><span className={"px-2 py-1 rounded-xl text-xs " + outcomeTone(it.outcome)}>{it.outcome}</span></td>
                                    <td className="p-3 text-xs">{it.lead_id}</td>
                                    <td className="p-3 text-right"><Button size="sm" onClick={() => onOpen(it)}>View</Button></td>
                                  </tr>
                                ))}
                                {convosFiltered.length === 0 && (
                                  <tr>
                                    <td className="p-6 text-center text-slate-500" colSpan={10}>No results with these filters.</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                                </TabsContent>
      </Tabs>

                      {/* Details Modal (Conversation + Lead snapshot) */}
                      <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center justify-between">
                              <span>Conversation · {active ? active.id : ""}</span>
                              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}><X className="w-4 h-4" /></Button>
                            </DialogTitle>
                          </DialogHeader>

                          {active && (
                            <div className="grid gap-4">
                              {(() => {
                                const lead = leadsEnriched.find((l) => l.id === active.lead_id);
                                if (!lead) return null;
                                return (
                                  <div className="grid md:grid-cols-3 gap-3">
                                    <Card className="rounded-2xl"><CardContent className="p-3 text-sm"><div className="text-slate-500">Lead</div><div className="font-medium">{lead.contact.name}</div><div className="text-xs text-slate-500">{lead.contact.phone} · {lead.contact.email}</div></CardContent></Card>
                                    <Card className="rounded-2xl"><CardContent className="p-3 text-sm"><div className="text-slate-500">Property</div><div className="font-medium">{lead.property.type} {String(lead.property.bedrooms)}BR · {lead.property.area}</div></CardContent></Card>
                                    <Card className="rounded-2xl"><CardContent className="p-3 text-sm"><div className="text-slate-500">Viability / Yield</div><div className="font-medium flex items-center gap-2"><Badge>Score {lead.viability}</Badge><span className="ml-auto">{lead.monthly_est_aed.toLocaleString()} AED/mo</span></div></CardContent></Card>
                                  </div>
                                );
                              })()}

                              <div className="grid md:grid-cols-3 gap-3">
                                <Card className="rounded-2xl"><CardContent className="p-3 text-sm"><div className="text-slate-500">Caller</div><div className="font-medium">{active.caller_name}</div><div className="text-xs text-slate-500">{active.caller_phone}</div></CardContent></Card>
                                <Card className="rounded-2xl"><CardContent className="p-3 text-sm"><div className="text-slate-500">Service</div><div className="font-medium">{active.service_type}</div></CardContent></Card>
                                <Card className="rounded-2xl"><CardContent className="p-3 text-sm"><div className="text-slate-500">Language / Status</div><div className="flex items-center gap-2"><Badge>{active.language}</Badge><span className={"px-2 py-1 rounded-xl text-xs " + sentimentColor(active.sentiment)}>{active.sentiment}</span><span className={"px-2 py-1 rounded-xl text-xs " + outcomeTone(active.outcome)}>{active.outcome}</span></div></CardContent></Card>
                              </div>

                              <div className="rounded-2xl border p-3">
                                <div className="flex items-center gap-2 text-slate-600 mb-2"><AudioLines className="w-4 h-4" /> Recording</div>
                                <audio controls className="w-full"><source src={active.audio_url} type="audio/wav" />Your browser does not support HTML5 audio.</audio>
                              </div>

                              <div className="grid md:grid-cols-2 gap-3">
                                <div className="rounded-2xl border p-3">
                                  <div className="text-slate-600 mb-2 font-medium">Summary</div>
                                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{active.summary}</p>
                                  <div className="mt-3 flex gap-2 flex-wrap">
                                    {active.tags && active.tags.map((t: string) => (<Badge key={t} variant="secondary" className="rounded-xl">{t}</Badge>))}
                                  </div>
                                </div>
                                <div className="rounded-2xl border p-3">
                                  <div className="text-slate-600 mb-2 font-medium">Transcript</div>
                                  <div className="text-xs max-h-56 overflow-auto whitespace-pre-wrap text-slate-700 bg-slate-50 p-2 rounded-xl border">{active.transcript}</div>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2 justify-end">
                                <Button variant="outline"><Link2 className="w-4 h-4 mr-2" /> Open original lead</Button>
                                <Button variant="outline"><CalendarClock className="w-4 h-4 mr-2" /> Schedule inspection</Button>
                                <Button><Share2 className="w-4 h-4 mr-2" /> Assign to an asset manager</Button>
                              </div>
                            </div>
                                    )}
        </DialogContent>
      </Dialog>

      {/* Floating Voice Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={() => setShowVoiceInterface(true)}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200"
          size="icon"
        >
          <Phone className="w-6 h-6" />
        </Button>
      </div>

      {/* Voice Interface Modal */}
      <Dialog open={showVoiceInterface} onOpenChange={setShowVoiceInterface}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Voice Conversation</span>
              <Button variant="ghost" size="icon" onClick={() => setShowVoiceInterface(false)}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <VoiceConversation onConversationEnd={handleConversationEnd} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

                // ----------------------
                // Lightweight runtime tests (do not change unless wrong)
                // ----------------------
                (function runSelfTests() {
                  // estYieldMensuelAED tests
                  console.assert(estYieldMensuelAED(1000, 50) === 15000, "estYieldMensuelAED(1000,50) should be 15000");
                  console.assert(estYieldMensuelAED(28000, 65) === 28000 * Math.round(30 * 0.65), "Yield calc should use rounded nights");

                  // viabilityScore basic tests
                  const leadPalmVilla = {
                    property: { area: "Palm Jumeirah", type: "Villa", furnishing: "Furnished", has_tourism_license: true },
                    revenue_expectations: { nightly_rate_aed: 30000, target_occupancy_pct: 70 }
                  };
                  const leadOtherApt = {
                    property: { area: "JVC", type: "Apartment", furnishing: "Semi-furnished", has_tourism_license: false },
                    revenue_expectations: { nightly_rate_aed: 500, target_occupancy_pct: 50 }
                  };
                  const s1 = viabilityScore(leadPalmVilla);
                  const s2 = viabilityScore(leadOtherApt);
                  console.assert(s1 > s2, "Palm Villa with license should score higher than non-licensed apartment");

                  // Added tests (non-flaky)
                  console.assert(secondsToMin(0) === "0m00s", "secondsToMin 0");
                  console.assert(secondsToMin(9) === "0m09s", "secondsToMin pads seconds");
                  console.assert(secondsToMin(125) === "2m05s", "secondsToMin formats mm:ss");
                  const withinBounds = viabilityScore(leadPalmVilla);
                  console.assert(withinBounds >= 0 && withinBounds <= 100, "viabilityScore should be within [0,100]");
                })();
