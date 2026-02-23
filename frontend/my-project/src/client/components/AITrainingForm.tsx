import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Label } from "@/client/components/ui/label";
import { Textarea } from "@/client/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/client/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/client/components/ui/tabs";
import { Checkbox } from "@/client/components/ui/checkbox";
import { ScrollArea } from "@/client/components/ui/scroll-area";
import { Progress } from "@/client/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/client/components/ui/radio-group";
import { ZodError } from "zod";
import { 
  businessSchema, 
  hoursSchema, 
  servicesSchema, 
  equipmentSchema, 
  settingsSchema, 
  policiesSchema, 
  questionsSchema 
} from "@/lib/schemas";

import {
  Clock,
  MapPin,
  DollarSign,
  Wrench,
  MessageCircle,
  Settings,
  FileText,
  Trash2,
  Plus
} from "lucide-react";

interface PaymentSystem {
  system: string;
  notes: string;
}

interface Washer {
  size: string;
  price: string; 
  quantity: number;
  system: string;
  payments: PaymentSystem[]; 
}

interface Dryers {
  size: string;
  price: string; 
  quantity: number;
  system: string;
  payments: PaymentSystem[];
}

type OperatingHoursFlags = {
  monday247?: boolean;
  tuesday247?: boolean;
  wednesday247?: boolean;
  thursday247?: boolean;
  friday247?: boolean;
  saturday247?: boolean;
  sunday247?: boolean;
};

interface FormData {
  // Business Information
  businessName: string;
  locationName: string;
  address: string;
  phone: string;
  zipCode: string;
  email: string;
  website: string;
  googleMapsUrl: string;
  notableLandmarks: string;
  attendingHours: string;
  nonAttendingHours: string;
  timeZone: string;
  washers: Washer[];
  dryers: Dryers[];
  attendantType: string;
  attendingOpen: string;
  is24Hours: boolean;
  attendingClose: string;
  operatingHours?: OperatingHoursFlags;

  // Operating Hour
  openOnHolidays: boolean;
  holidayHours: Array<{
    name: string;
    open: string;
    close: string;
    is247?: boolean;
  }>;
  closedHolidays: { name: string }[];
  holidayNote: string;
  lastWashTime: string;
  hours?: {
    [day: string]: { open: string; close: string; is247?: boolean };
  };

  // Services Offered
  services: string[];

  // Pricing Info
  washerPrices: string;
  selectedWasherSize?: string;
  dryerPrices: string;
  washFoldRate: string;
  dryCleaningPrices: string;
  pickupDeliveryPricing: string;
  minimumCharges: string;
  paymentMethods: string[];

  // Machine Info
  totalWashers: string;
  totalDryers: string;
  machineOperationType: string;
  machinesModern: boolean;
  largeMachines: boolean;

  // Amenities
  amenities: string[];

  // Common Questions
  commonQuestions: string[];
  customQuestions: Array<{ question: string; answer: string }>;

  // Call Handling Preferences
  callHandlingStyle: string;
  forwardingEnabled: boolean;
  forwardingNumber: string;
  forwardingHours: string;

  // Language Support
  languages: string[];
  autoDetectLanguage: boolean;

  // Business Tone & Branding
  businessTone: string;
  customPhrases: string;
  businessIntro: string;

  // Special Policies
  lostFoundPolicy: string;
  refundPolicy: string;
  petPolicies: string;
  timeLimits: string;
  unattendedPolicy: string;
  additionalPolicies: string;

  // settings
  escalateForwardCall: boolean;
  escalationNumber: string;
  escalateSendMessage: boolean;
  escalationMessageNumber: string;
  escalateSendEmail: boolean;
  escalationEmail: string;
  hiringResponse: string;
}

const TAB_ORDER = [
  "business",
  "hours",
  "services",
  "equipment",
  "questions",
  "settings",
  "policies",
];

const DAY_KEYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] as const;
type DayName = typeof DAY_KEYS[number];

const isFullDay = (open?: string, close?: string) =>
  open === "00:00" && (close === "23:59" || close === "24:00");

const backendFlagForDay = (operatingHours: OperatingHoursFlags | undefined, day: DayName) => {
  if (!operatingHours) return false;
  const key = (day.toLowerCase() + "247") as keyof OperatingHoursFlags;
  return Boolean(operatingHours[key]);
};

export function AITrainingForm({
  initialData,
  onComplete,
}: {
  initialData?: Partial<FormData>;
  onComplete: (data: FormData) => void;
}) {
  const navigate = useNavigate();
  useSearchParams();
  const [activeTab, setActiveTab] = useState<string>("business");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [hasRestored, setHasRestored] = useState(false);
  const [, setCompletedTabs] = useState<string[]>([]);

  const DEFAULT_HOURS = {
    Monday: { open: "08:00", close: "20:00", is247: false },
    Tuesday: { open: "08:00", close: "20:00", is247: false },
    Wednesday: { open: "08:00", close: "20:00", is247: false },
    Thursday: { open: "08:00", close: "20:00", is247: false },
    Friday: { open: "08:00", close: "20:00", is247: false },
    Saturday: { open: "08:00", close: "20:00", is247: false },
    Sunday: { open: "08:00", close: "20:00", is247: false },
  };

  const DEFAULT_HOLIDAYS = [
    { name: "Christmas", open: "Closed", close: "Closed" },
    { name: "Good Friday", open: "8:00 AM", close: "5:00 PM" },
    { name: "Easter Sunday", open: "Closed", close: "Closed" },
  ];

  const [formData, setFormData] = useState<FormData>({
    businessName: initialData?.businessName ?? "",
    address: initialData?.address ?? "",
    phone: initialData?.phone ?? "",
    zipCode: initialData?.zipCode ?? "",
    email: initialData?.email ?? "",
    website: initialData?.website ?? "",
    googleMapsUrl: initialData?.googleMapsUrl ?? "",
    notableLandmarks: initialData?.notableLandmarks ?? "",
    attendingHours: initialData?.attendingHours ?? "",
    nonAttendingHours: initialData?.nonAttendingHours ?? "",
    locationName: initialData?.locationName ?? "",
    timeZone: initialData?.timeZone ?? "EST (Standard Time)",
    attendantType: initialData?.attendantType ?? "",
    attendingOpen: initialData?.attendingOpen ?? "",
    attendingClose: initialData?.attendingClose ?? "",
    is24Hours: initialData?.is24Hours ?? false,
    washers: initialData?.washers ?? [
      { size: "", price: "", quantity: 1, system: "", payments: [] }
    ],
    dryers: initialData?.dryers ?? [
      { size: "", price: "", quantity: 1, system: "", payments: [] }
    ],
    holidayHours: initialData?.holidayHours ?? DEFAULT_HOLIDAYS,
    closedHolidays: initialData?.closedHolidays ?? [],
    openOnHolidays: initialData?.openOnHolidays ?? false,
    holidayNote: initialData?.holidayNote ?? "",
    lastWashTime: initialData?.lastWashTime ?? "1 Hour Before Closing",
    hours: initialData?.hours ?? DEFAULT_HOURS,
    services: Array.isArray(initialData?.services) ? initialData.services : [],
    washerPrices: initialData?.washerPrices ?? "",
    selectedWasherSize: initialData?.selectedWasherSize ?? "",
    dryerPrices: initialData?.dryerPrices ?? "",
    washFoldRate: initialData?.washFoldRate ?? "",
    dryCleaningPrices: initialData?.dryCleaningPrices ?? "",
    pickupDeliveryPricing: initialData?.pickupDeliveryPricing ?? "",
    minimumCharges: initialData?.minimumCharges ?? "",
    paymentMethods: Array.isArray(initialData?.paymentMethods)
      ? initialData.paymentMethods
      : [],
    totalWashers: initialData?.totalWashers ?? "",
    totalDryers: initialData?.totalDryers ?? "",
    machineOperationType: initialData?.machineOperationType ?? "",
    machinesModern: initialData?.machinesModern ?? false,
    largeMachines: initialData?.largeMachines ?? false,
    amenities: Array.isArray(initialData?.amenities) ? initialData.amenities : [],
    commonQuestions: Array.isArray(initialData?.commonQuestions) ? initialData.commonQuestions : [],
    customQuestions: Array.isArray(initialData?.customQuestions)
      ? initialData.customQuestions
      : [{ question: "", answer: "" }],
    callHandlingStyle: initialData?.callHandlingStyle ?? "standard",
    forwardingEnabled: initialData?.forwardingEnabled ?? false,
    forwardingNumber: initialData?.forwardingNumber ?? "",
    forwardingHours: initialData?.forwardingHours ?? "",
    languages: Array.isArray(initialData?.languages) ? initialData.languages : ["English"],
    autoDetectLanguage: initialData?.autoDetectLanguage ?? false,
    businessTone: initialData?.businessTone ?? "friendly",
    customPhrases: initialData?.customPhrases ?? "",
    businessIntro: initialData?.businessIntro ?? "",
    lostFoundPolicy: initialData?.lostFoundPolicy ?? "",
    refundPolicy: initialData?.refundPolicy ?? "",
    petPolicies: initialData?.petPolicies ?? "",
    timeLimits: initialData?.timeLimits ?? "",
    unattendedPolicy: initialData?.unattendedPolicy ?? "",
    additionalPolicies: initialData?.additionalPolicies ?? "",
    hiringResponse: initialData?.hiringResponse ?? "",
    escalationEmail: initialData?.escalationEmail ?? "",
    escalateSendEmail: initialData?.escalateSendEmail ?? false,
    escalateSendMessage: initialData?.escalateSendMessage ?? false,
    escalationMessageNumber: initialData?.escalationMessageNumber ?? "",
    escalateForwardCall: initialData?.escalateForwardCall ?? false,
    escalationNumber: initialData?.escalationNumber ?? "",
  });

  const hasHydrated247 = useRef(false);

  useEffect(() => {
    if (hasHydrated247.current) return;
    if (!formData?.hours) return;

    let changed = false;
    const nextHours: Record<string, { open: string; close: string; is247?: boolean }> = { ...formData.hours };

    DAY_KEYS.forEach((day) => {
      const current = nextHours[day] ?? { open: "08:00", close: "20:00", is247: false };
      const desired =
        backendFlagForDay(formData?.operatingHours, day) ||
        isFullDay(current.open, current.close);
      if (current.is247 !== desired) {
        nextHours[day] = { ...current, is247: desired };
        changed = true;
      }
    });

    if (changed) {
      setFormData((prev: FormData) => ({ ...prev, hours: nextHours }));
    }

    hasHydrated247.current = true;
  }, [formData?.operatingHours, formData?.hours]);

  const FORM_STORAGE_KEY = "laundromat_form_draft_v1";

  useEffect(() => {
    const savedForm = localStorage.getItem(FORM_STORAGE_KEY);
    if (savedForm) {
      try {
        const parsed = JSON.parse(savedForm);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch (err) {
        console.error("Failed to parse saved form:", err);
      }
    }
    setHasRestored(true);
  }, []);

  useEffect(() => {
    if (!hasRestored) return;
    if (!formData) return;
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
  }, [formData, hasRestored]);

  const calculateProgress = () => {
    const stringFields = [
      formData.businessName,
      formData.locationName,
      formData.address,
      formData.phone,
      formData.zipCode,
      formData.businessIntro,
    ];
    const completedStrings = stringFields.filter(f => f.trim() !== "").length;
    const progress = (completedStrings / stringFields.length) * 100;
    return Math.round(progress);
  };

  const progress = calculateProgress();

  const validateCurrentTab = () => {
    try {
      switch (activeTab) {
        case "business": businessSchema.parse(formData); break;
        case "hours": hoursSchema.parse(formData); break;
        case "services": servicesSchema.parse(formData); break;
        case "equipment": equipmentSchema.parse(formData); break;
        case "settings": settingsSchema.parse(formData); break;
        case "policies": policiesSchema.parse(formData); break;
        case "questions": questionsSchema.parse(formData); break;
      }
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string> = {};
        error.issues.forEach(issue => {
          const field = issue.path[0] as string;
          const fullPath = issue.path.join('.');
          errors[field] = `${fullPath}: ${issue.message}`;
        });
        setFormErrors(errors);
      }
      return false;
    }
  };

  const currentTabIndex = TAB_ORDER.indexOf(activeTab);

  const handleNext = () => {
    if (validateCurrentTab()) {
      setCompletedTabs(prev => Array.from(new Set([...prev, activeTab])));
      setActiveTab(TAB_ORDER[currentTabIndex + 1]);
    }
  };

  const handleBack = () => {
    setActiveTab(TAB_ORDER[currentTabIndex - 1]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentTab()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        onComplete(formData);
        localStorage.removeItem(FORM_STORAGE_KEY);
        navigate("/payment");
      } else {
        alert("Failed to save training data.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleArrayItem = (array: string[], item: string, setter: (items: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  const TIME_OPTIONS = Array.from({ length: 24 }).map((_, i) => ({
    value: `${i.toString().padStart(2, "0")}:00`,
    label: `${i % 12 || 12}:00 ${i < 12 ? "AM" : "PM"}`
  }));

  const serviceOptions = ["Self-Service Washers & Dryers", "Wash & Fold", "Dry Cleaning", "Pickup & Delivery"];
  const paymentOptions = ["Cash", "Coin", "Credit/Debit", "App-based"];
  const languageOptions = ["English", "Spanish", "French", "Chinese"];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-black uppercase tracking-tight font-space">
          Train Your AI Assistant
        </h1>
        <p className="text-muted-foreground font-medium">
          Provide your laundromat's details to calibrate your voice-based AI assistant.
        </p>
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-black uppercase tracking-widest text-muted">
            <span>Progress</span>
            <span>{progress}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7 h-auto p-2 bg-dark/50 backdrop-blur-xl border border-white/10 rounded-2xl">
          {TAB_ORDER.map((tab) => (
            <TabsTrigger 
              key={tab} 
              value={tab} 
              className="py-3 capitalize font-bold data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-8">
          {/* Business Tab */}
          <TabsContent value="business">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-secondary" />
                  Business Information
                </CardTitle>
                <CardDescription>Basic details about your laundromat.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Business Name *</Label>
                    <Input 
                      value={formData.businessName} 
                      onChange={e => setFormData(p => ({...p, businessName: e.target.value}))} 
                    />
                    {formErrors.businessName && <p className="text-red-500 text-xs">{formErrors.businessName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Location Name *</Label>
                    <Input 
                      value={formData.locationName} 
                      onChange={e => setFormData(p => ({...p, locationName: e.target.value}))} 
                    />
                    {formErrors.locationName && <p className="text-red-500 text-xs">{formErrors.locationName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number *</Label>
                    <Input 
                      value={formData.phone} 
                      onChange={e => setFormData(p => ({...p, phone: e.target.value}))} 
                    />
                    {formErrors.phone && <p className="text-red-500 text-xs">{formErrors.phone}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Zip Code *</Label>
                    <Input 
                      value={formData.zipCode} 
                      onChange={e => setFormData(p => ({...p, zipCode: e.target.value}))} 
                    />
                    {formErrors.zipCode && <p className="text-red-500 text-xs">{formErrors.zipCode}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Full Address *</Label>
                  <Input 
                    value={formData.address} 
                    onChange={e => setFormData(p => ({...p, address: e.target.value}))} 
                  />
                  {formErrors.address && <p className="text-red-500 text-xs">{formErrors.address}</p>}
                </div>
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <Label>Attendant Status</Label>
                  <RadioGroup 
                    value={formData.attendantType} 
                    onValueChange={v => setFormData(p => ({...p, attendantType: v}))}
                    className="flex gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="attendant" id="att" />
                      <Label htmlFor="att">Attended</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="nonAttendant" id="non" />
                      <Label htmlFor="non">Unattended</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="partial" id="par" />
                      <Label htmlFor="par">Partial</Label>
                    </div>
                  </RadioGroup>
                  {formErrors.attendantType && <p className="text-red-500 text-xs">{formErrors.attendantType}</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hours Tab */}
          <TabsContent value="hours">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  Operating Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4 pr-4">
                    {DAY_KEYS.map(day => (
                      <div key={day} className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
                        <span className="w-24 font-bold">{day}</span>
                        <div className="flex-1 flex items-center gap-2">
                          <select 
                            className="bg-dark/50 border border-white/10 rounded-md p-1 text-sm flex-1"
                            value={formData.hours?.[day]?.open}
                            disabled={formData.hours?.[day]?.is247}
                            onChange={e => setFormData(p => ({
                              ...p, 
                              hours: {...p.hours, [day]: {...p.hours![day], open: e.target.value}}
                            }))}
                          >
                            {TIME_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                          </select>
                          <span>to</span>
                          <select 
                            className="bg-dark/50 border border-white/10 rounded-md p-1 text-sm flex-1"
                            value={formData.hours?.[day]?.close}
                            disabled={formData.hours?.[day]?.is247}
                            onChange={e => setFormData(p => ({
                              ...p, 
                              hours: {...p.hours, [day]: {...p.hours![day], close: e.target.value}}
                            }))}
                          >
                            {TIME_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            checked={formData.hours?.[day]?.is247}
                            onCheckedChange={checked => setFormData(p => ({
                              ...p,
                              hours: {...p.hours, [day]: {...p.hours![day], is247: !!checked}}
                            }))}
                          />
                          <Label className="text-xs uppercase font-black">24/7</Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Time Zone</Label>
                    <Input value={formData.timeZone} onChange={e => setFormData(p => ({...p, timeZone: e.target.value}))} />
                    {formErrors.timeZone && <p className="text-red-500 text-xs">{formErrors.timeZone}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Last Wash Time</Label>
                    <Input value={formData.lastWashTime} onChange={e => setFormData(p => ({...p, lastWashTime: e.target.value}))} />
                    {formErrors.lastWashTime && <p className="text-red-500 text-xs">{formErrors.lastWashTime}</p>}
                  </div>
                </div>
                {formErrors.hours && <p className="text-red-500 text-xs mt-4">Required: {formErrors.hours}</p>}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  Services & Payments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <Label className="text-lg font-bold">Services Offered</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {serviceOptions.map(opt => (
                      <div key={opt} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                        <Checkbox 
                          id={opt} 
                          checked={formData.services.includes(opt)}
                          onCheckedChange={() => toggleArrayItem(formData.services, opt, (v) => setFormData(p => ({...p, services: v})))}
                        />
                        <Label htmlFor={opt}>{opt}</Label>
                      </div>
                    ))}
                  </div>
                  {formErrors.services && <p className="text-red-500 text-xs mt-2">{formErrors.services}</p>}
                </div>
                <div className="space-y-4">
                  <Label className="text-lg font-bold">Payment Methods</Label>
                  <div className="flex flex-wrap gap-4">
                    {paymentOptions.map(opt => (
                      <div key={opt} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                        <Checkbox 
                          id={`pay-${opt}`}
                          checked={formData.paymentMethods.includes(opt)}
                          onCheckedChange={() => toggleArrayItem(formData.paymentMethods, opt, (v) => setFormData(p => ({...p, paymentMethods: v})))}
                        />
                        <Label htmlFor={`pay-${opt}`}>{opt}</Label>
                      </div>
                    ))}
                  </div>
                  {formErrors.paymentMethods && <p className="text-red-500 text-xs mt-2">{formErrors.paymentMethods}</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Equipment Tab */}
          <TabsContent value="equipment">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-orange-400" />
                  Equipment & Machines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Total Washers</Label>
                    <Input value={formData.totalWashers} onChange={e => setFormData(p => ({...p, totalWashers: e.target.value}))} />
                    {formErrors.totalWashers && <p className="text-red-500 text-xs">{formErrors.totalWashers}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Total Dryers</Label>
                    <Input value={formData.totalDryers} onChange={e => setFormData(p => ({...p, totalDryers: e.target.value}))} />
                    {formErrors.totalDryers && <p className="text-red-500 text-xs">{formErrors.totalDryers}</p>}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg font-bold">Washer Configurations</Label>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setFormData(p => ({...p, washers: [...p.washers, {size: "", price: "", quantity: 1, system: "", payments: []}]}))}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Washer
                    </Button>
                  </div>
                  {formData.washers.map((w, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4 relative">
                      <Button 
                        variant="ghost" size="icon" className="absolute top-2 right-2 text-red-500"
                        onClick={() => setFormData(p => ({...p, washers: p.washers.filter((_, i) => i !== idx)}))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="grid grid-cols-3 gap-4">
                        <Input placeholder="Size (lbs)" value={w.size} onChange={e => {
                          const newWashers = [...formData.washers];
                          newWashers[idx].size = e.target.value;
                          setFormData(p => ({...p, washers: newWashers}));
                        }} />
                        <Input placeholder="Price ($)" value={w.price} onChange={e => {
                          const newWashers = [...formData.washers];
                          newWashers[idx].price = e.target.value;
                          setFormData(p => ({...p, washers: newWashers}));
                        }} />
                        <Input type="number" placeholder="Quantity" value={w.quantity} onChange={e => {
                          const newWashers = [...formData.washers];
                          newWashers[idx].quantity = parseInt(e.target.value);
                          setFormData(p => ({...p, washers: newWashers}));
                        }} />
                      </div>
                    </div>
                  ))}
                  {formErrors.washers && <p className="text-red-500 text-xs mt-2">{formErrors.washers}</p>}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg font-bold">Dryer Configurations</Label>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setFormData(p => ({...p, dryers: [...p.dryers, {size: "", price: "", quantity: 1, system: "", payments: []}]}))}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Dryer
                    </Button>
                  </div>
                  {formData.dryers.map((d, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4 relative">
                      <Button 
                        variant="ghost" size="icon" className="absolute top-2 right-2 text-red-500"
                        onClick={() => setFormData(p => ({...p, dryers: p.dryers.filter((_, i) => i !== idx)}))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="grid grid-cols-3 gap-4">
                        <Input placeholder="Size (lbs)" value={d.size} onChange={e => {
                          const newDryers = [...formData.dryers];
                          newDryers[idx].size = e.target.value;
                          setFormData(p => ({...p, dryers: newDryers}));
                        }} />
                        <Input placeholder="Price ($)" value={d.price} onChange={e => {
                          const newDryers = [...formData.dryers];
                          newDryers[idx].price = e.target.value;
                          setFormData(p => ({...p, dryers: newDryers}));
                        }} />
                        <Input type="number" placeholder="Quantity" value={d.quantity} onChange={e => {
                          const newDryers = [...formData.dryers];
                          newDryers[idx].quantity = parseInt(e.target.value);
                          setFormData(p => ({...p, dryers: newDryers}));
                        }} />
                      </div>
                    </div>
                  ))}
                  {formErrors.dryers && <p className="text-red-500 text-xs mt-2">{formErrors.dryers}</p>}
                </div>
                {formErrors.equipment && <p className="text-red-500 text-xs mt-4">Error in Equipment: {formErrors.equipment}</p>}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-purple-400" />
                  Custom Q&A
                </CardTitle>
                <CardDescription>Add specific questions your AI should know how to answer.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-6 pr-4">
                    {formData.customQuestions.map((q, idx) => (
                      <div key={idx} className="space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10 relative group">
                        <Button 
                          variant="ghost" size="icon" className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setFormData(p => ({...p, customQuestions: p.customQuestions.filter((_, i) => i !== idx)}))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="space-y-2">
                          <Label>Question</Label>
                          <Input 
                            value={q.question} 
                            placeholder="e.g., Do you have a TV?"
                            onChange={e => {
                              const newQs = [...formData.customQuestions];
                              newQs[idx].question = e.target.value;
                              setFormData(p => ({...p, customQuestions: newQs}));
                            }} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Answer</Label>
                          <Textarea 
                            value={q.answer} 
                            placeholder="e.g., Yes, we have two large TVs showing sports and news."
                            onChange={e => {
                              const newQs = [...formData.customQuestions];
                              newQs[idx].answer = e.target.value;
                              setFormData(p => ({...p, customQuestions: newQs}));
                            }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                {formErrors.customQuestions && <p className="text-red-500 text-xs mt-2">{formErrors.customQuestions}</p>}
                <Button 
                  onClick={() => setFormData(p => ({...p, customQuestions: [...p.customQuestions, {question: "", answer: ""}]}))}
                  className="w-full variant-outline"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Another Question
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-400" />
                  AI Behavior & Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <Label className="text-lg font-bold">Call Handling</Label>
                  <RadioGroup 
                    value={formData.callHandlingStyle} 
                    onValueChange={v => setFormData(p => ({...p, callHandlingStyle: v}))}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                      <RadioGroupItem value="standard" id="s1" />
                      <Label htmlFor="s1">Standard Professional</Label>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                      <RadioGroupItem value="casual" id="s2" />
                      <Label htmlFor="s2">Friendly & Casual</Label>
                    </div>
                  </RadioGroup>
                  {formErrors.callHandlingStyle && <p className="text-red-500 text-xs">{formErrors.callHandlingStyle}</p>}
                </div>

                <div className="space-y-4 pt-4">
                  <Label className="text-lg font-bold">Languages</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {languageOptions.map(l => (
                      <div key={l} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                        <Checkbox 
                          id={`lang-${l}`}
                          checked={formData.languages.includes(l)}
                          onCheckedChange={() => toggleArrayItem(formData.languages, l, (v) => setFormData(p => ({...p, languages: v})))}
                        />
                        <Label htmlFor={`lang-${l}`}>{l}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <Label>Business Introduction Phrase</Label>
                  <Textarea 
                    value={formData.businessIntro} 
                    className="min-h-[160px]"
                    placeholder="e.g., Thank you for calling E8 Laundromat, how can I help you today? We offer premium self-service and wash & fold options..."
                    onChange={e => setFormData(p => ({...p, businessIntro: e.target.value}))} 
                  />
                  {formErrors.businessIntro && <p className="text-red-500 text-xs">{formErrors.businessIntro}</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Policies Tab */}
          <TabsContent value="policies">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-pink-400" />
                  Business Policies
                </CardTitle>
                <CardDescription>Tell the AI about your rules and policies.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Lost & Found Policy</Label>
                    <Textarea 
                      value={formData.lostFoundPolicy} 
                      onChange={e => setFormData(p => ({...p, lostFoundPolicy: e.target.value}))} 
                    />
                    {formErrors.lostFoundPolicy && <p className="text-red-500 text-xs">{formErrors.lostFoundPolicy}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Refund Policy</Label>
                    <Textarea 
                      value={formData.refundPolicy} 
                      onChange={e => setFormData(p => ({...p, refundPolicy: e.target.value}))} 
                    />
                    {formErrors.refundPolicy && <p className="text-red-500 text-xs">{formErrors.refundPolicy}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Pet Policy</Label>
                    <Textarea 
                      value={formData.petPolicies} 
                      className="min-h-[160px]"
                      placeholder="e.g., Service animals only. No pets allowed inside the facility to ensure cleanliness for all customers."
                      onChange={e => setFormData(p => ({...p, petPolicies: e.target.value}))} 
                    />
                    {formErrors.petPolicies && <p className="text-red-500 text-xs">{formErrors.petPolicies}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Time Limit Policy</Label>
                    <Textarea 
                      value={formData.timeLimits} 
                      className="min-h-[160px]"
                      placeholder="e.g., Please remove clothes within 10 minutes of cycle completion. Unattended items may be moved to designated baskets."
                      onChange={e => setFormData(p => ({...p, timeLimits: e.target.value}))} 
                    />
                    {formErrors.timeLimits && <p className="text-red-500 text-xs">{formErrors.timeLimits}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>

        <div className="flex justify-between mt-12 p-6 glass-card border-white/10 rounded-4xl">
          <Button 
            variant="outline" 
            onClick={handleBack} 
            disabled={activeTab === "business"}
            className="px-8 py-6 rounded-2xl font-bold uppercase tracking-widest text-[10px]"
          >
            Previous Step
          </Button>
          {currentTabIndex === TAB_ORDER.length - 1 ? (
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="px-12 py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] btn-premium"
            >
              {isSubmitting ? "Saving..." : "Finalize Training"}
            </Button>
          ) : (
            <Button 
              onClick={handleNext}
              className="px-12 py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] btn-premium"
            >
              Next Step
            </Button>
          )}
        </div>
      </Tabs>
    </div>
  );
}
