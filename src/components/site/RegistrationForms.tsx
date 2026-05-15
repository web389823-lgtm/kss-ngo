import { useState, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, HandHeart, Building2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu and Kashmir","Ladakh","Puducherry","Chandigarh","Andaman and Nicobar","Lakshadweep","Dadra and Nagar Haveli","Daman and Diu",
];

const INTEREST_OPTIONS = ["Education and Teaching","Healthcare Support","Food Distribution","Women Empowerment","Cultural Programs","Community Outreach","Event Management","Administration","Social Media and Communications","Other"];

type Errors = Record<string, string>;

const inputCls = (err?: string) =>
  cn(
    "w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-primary/40",
    err ? "border-destructive focus:ring-destructive/30" : "border-input",
  );
const labelCls = "block text-sm font-semibold text-foreground mb-1.5";
const errCls = "text-xs text-destructive mt-1";
const sectionHeading = "text-lg font-bold text-foreground border-b-2 border-muted pb-2 mb-5 mt-2";

function Field({ label, name, error, required, children }: { label: string; name: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div data-field={name}>
      <label className={labelCls} htmlFor={name}>{label}{required && " *"}</label>
      {children}
      {error && <p className={errCls}>{error}</p>}
    </div>
  );
}

function SuccessCard({ title, body, onTop, onPrograms }: { title: string; body: React.ReactNode; onTop: () => void; onPrograms: () => void }) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl bg-card shadow-elegant p-12 text-center animate-fade-in">
      <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" strokeWidth={2.2} />
      <h3 className="mt-4 font-serif text-2xl font-bold">{title}</h3>
      <p className="mt-2 text-muted-foreground">{body}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button onClick={onTop} className="rounded-lg border-2 border-primary px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/10 transition">↑ Back to Top</button>
        <button onClick={onPrograms} className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition">View Our Programs →</button>
      </div>
    </div>
  );
}

function scrollToFirstError(errors: Errors) {
  const firstKey = Object.keys(errors)[0];
  if (!firstKey) return;
  const el = document.querySelector(`[data-field="${firstKey}"]`);
  if (el) (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
}

/* ---------------- VOLUNTEER FORM ---------------- */
function VolunteerForm({ onSuccess }: { onSuccess: (d: any) => void }) {
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => (fd.get(k) as string | null)?.trim() ?? "";
    const data = {
      full_name: get("full_name"), age: get("age"), gender: get("gender"),
      email: get("email"), phone: get("phone"), state: get("state"), city: get("city"), address: get("address"),
      education: get("education"), occupation: get("occupation"), organization: get("organization"),
      aadhaar: get("aadhaar"), pan: get("pan").toUpperCase(),
      primary_interest: get("primary_interest"), secondary_interest: get("secondary_interest"),
      availability: get("availability"), hours_per_week: get("hours_per_week"), mode: get("mode"),
      languages: get("languages"), special_skills: get("special_skills"),
      reason: get("reason"), heard_from: get("heard_from"),
      declaration: fd.get("declaration") === "on",
    };

    const e2: Errors = {};
    if (!data.full_name) e2.full_name = "Required";
    const ageN = Number(data.age);
    if (!data.age || Number.isNaN(ageN) || ageN < 18 || ageN > 80) e2.age = "Age must be 18–80";
    if (!data.gender) e2.gender = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e2.email = "Invalid email";
    if (!/^\d{10}$/.test(data.phone)) e2.phone = "Must be 10 digits";
    if (!data.state) e2.state = "Required";
    if (!data.education) e2.education = "Required";
    if (!/^\d{12}$/.test(data.aadhaar)) e2.aadhaar = "Must be 12 digits";
    if (!data.primary_interest) e2.primary_interest = "Required";
    if (!data.availability) e2.availability = "Required";
    if (!data.hours_per_week) e2.hours_per_week = "Required";
    if (!data.mode) e2.mode = "Required";
    if (!data.reason || data.reason.length < 20) e2.reason = "At least 20 characters";
    if (!data.declaration) e2.declaration = "Please accept the declaration to proceed";
    setErrors(e2);
    if (Object.keys(e2).length) { scrollToFirstError(e2); return; }

    setSubmitting(true);
    const { error } = await supabase.from("volunteer_applications" as any).insert({
      ...data, age: ageN, type: "volunteer", status: "pending", submitted_at: new Date().toISOString(),
    });
    setSubmitting(false);
    if (error) { setServerError("Something went wrong. Please try again or contact kss.seva@gmail.com"); return; }
    onSuccess(data);
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-6">
      <div>
        <h3 className="font-serif text-2xl font-bold">Volunteer Registration Form</h3>
        <p className="text-sm text-muted-foreground">Fields marked * are required</p>
      </div>

      <div>
        <h4 className={sectionHeading}>Personal Details</h4>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Full Name" name="full_name" error={errors.full_name} required>
            <input id="full_name" name="full_name" placeholder="Enter your full name" className={inputCls(errors.full_name)} />
          </Field>
          <Field label="Age" name="age" error={errors.age} required>
            <input id="age" name="age" type="number" min={18} max={80} placeholder="Your age" className={inputCls(errors.age)} />
          </Field>
          <Field label="Gender" name="gender" error={errors.gender} required>
            <select id="gender" name="gender" defaultValue="" className={inputCls(errors.gender)}>
              <option value="" disabled>Select Gender</option>
              <option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option>
            </select>
          </Field>
          <Field label="Email ID" name="email" error={errors.email} required>
            <input id="email" name="email" type="email" placeholder="your@email.com" className={inputCls(errors.email)} />
          </Field>
          <Field label="Phone Number" name="phone" error={errors.phone} required>
            <input id="phone" name="phone" inputMode="numeric" maxLength={10} placeholder="10-digit mobile number" className={inputCls(errors.phone)} />
          </Field>
          <Field label="State" name="state" error={errors.state} required>
            <select id="state" name="state" defaultValue="" className={inputCls(errors.state)}>
              <option value="" disabled>Select State</option>
              {STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="City or Area" name="city">
            <input id="city" name="city" placeholder="Your city or area" className={inputCls()} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Full Address" name="address">
              <textarea id="address" name="address" rows={2} placeholder="Your full address (optional)" className={inputCls()} />
            </Field>
          </div>
        </div>
      </div>

      <div>
        <h4 className={sectionHeading}>Education and Identity</h4>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Highest Education" name="education" error={errors.education} required>
            <select id="education" name="education" defaultValue="" className={inputCls(errors.education)}>
              <option value="" disabled>Select Education</option>
              {["Below 10th","10th Pass","12th Pass","Graduate","Post Graduate","PhD","Professional Degree","Other"].map(o => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Aadhaar Number" name="aadhaar" error={errors.aadhaar} required>
            <input id="aadhaar" name="aadhaar" inputMode="numeric" maxLength={12} placeholder="12-digit Aadhaar number" className={inputCls(errors.aadhaar)} />
            <p className="text-xs text-muted-foreground mt-1">We keep your Aadhaar information secure</p>
          </Field>
          <Field label="PAN Number" name="pan">
            <input id="pan" name="pan" maxLength={10} placeholder="10-character PAN (optional)" className={cn(inputCls(), "uppercase")} />
          </Field>
          <Field label="Occupation" name="occupation">
            <input id="occupation" name="occupation" placeholder="e.g. Student, Teacher, Doctor, Homemaker" className={inputCls()} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Organization or Institute" name="organization">
              <input id="organization" name="organization" placeholder="Current employer or college name" className={inputCls()} />
            </Field>
          </div>
        </div>
      </div>

      <div>
        <h4 className={sectionHeading}>Volunteering Preferences</h4>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Primary Area of Interest" name="primary_interest" error={errors.primary_interest} required>
            <select id="primary_interest" name="primary_interest" defaultValue="" className={inputCls(errors.primary_interest)}>
              <option value="" disabled>Select Area</option>
              {INTEREST_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Secondary Area of Interest" name="secondary_interest">
            <select id="secondary_interest" name="secondary_interest" defaultValue="" className={inputCls()}>
              <option value="" disabled>Select Area</option>
              <option>None</option>
              {INTEREST_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Availability" name="availability" error={errors.availability} required>
            <select id="availability" name="availability" defaultValue="" className={inputCls(errors.availability)}>
              <option value="" disabled>Select Availability</option>
              <option>Weekdays</option><option>Weekends</option><option>Both Weekdays and Weekends</option><option>Flexible</option>
            </select>
          </Field>
          <Field label="Hours Available per Week" name="hours_per_week" error={errors.hours_per_week} required>
            <select id="hours_per_week" name="hours_per_week" defaultValue="" className={inputCls(errors.hours_per_week)}>
              <option value="" disabled>Select Hours</option>
              <option>Less than 4 hours</option><option>4 to 8 hours</option><option>8 to 16 hours</option><option>More than 16 hours</option>
            </select>
          </Field>
          <Field label="Mode of Volunteering" name="mode" error={errors.mode} required>
            <select id="mode" name="mode" defaultValue="" className={inputCls(errors.mode)}>
              <option value="" disabled>Select Mode</option>
              <option>On-ground only</option><option>Remote only</option><option>Both on-ground and remote</option>
            </select>
          </Field>
          <Field label="Languages Known" name="languages">
            <input id="languages" name="languages" placeholder="e.g. Kannada, Hindi, English, Tamil" className={inputCls()} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Special Skills" name="special_skills">
              <textarea id="special_skills" name="special_skills" rows={2} placeholder="Any skills relevant to volunteering e.g. teaching, medical, coding, design" className={inputCls()} />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Why do you want to volunteer with KSS?" name="reason" error={errors.reason} required>
              <textarea id="reason" name="reason" rows={3} placeholder="Tell us why you want to join KSS as a volunteer..." className={inputCls(errors.reason)} />
            </Field>
          </div>
          <Field label="How did you hear about KSS?" name="heard_from">
            <select id="heard_from" name="heard_from" defaultValue="" className={inputCls()}>
              <option value="" disabled>Select</option>
              <option>Social Media</option><option>Friend or Family</option><option>Event</option><option>Website</option><option>Google Search</option><option>Other</option>
            </select>
          </Field>
        </div>
      </div>

      <div data-field="declaration" className="space-y-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" name="declaration" className="mt-1 h-4 w-4 accent-primary" />
          <span className="text-sm">I confirm that all information provided above is accurate and I agree to abide by the KSS volunteer code of conduct.</span>
        </label>
        {errors.declaration && <p className={errCls}>{errors.declaration}</p>}
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 dark:bg-blue-950/40 dark:text-blue-100 dark:border-blue-900">
        <Info className="h-5 w-5 shrink-0 mt-0.5" />
        <span>Your information is kept secure and used only for processing your volunteer application. We will contact you within 5 business days.</span>
      </div>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <button type="submit" disabled={submitting}
        className={cn("w-full rounded-lg py-3.5 text-base font-bold text-white transition", submitting ? "bg-muted-foreground" : "bg-primary hover:bg-primary/90")}>
        {submitting ? "Submitting..." : "Submit Volunteer Application"}
      </button>
    </form>
  );
}

/* ---------------- CSR FORM ---------------- */
function CsrForm({ onSuccess }: { onSuccess: (d: any) => void }) {
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => (fd.get(k) as string | null)?.trim() ?? "";
    const data = {
      company_name: get("company_name"), company_type: get("company_type"),
      company_pan: get("company_pan").toUpperCase(), company_tan: get("company_tan"),
      company_website: get("company_website"), company_address: get("company_address"),
      state: get("state"), city: get("city"), pin_code: get("pin_code"), num_employees: get("num_employees"),
      contact_name: get("contact_name"), designation: get("designation"),
      official_email: get("official_email"), phone: get("phone"), alternate_phone: get("alternate_phone"),
      linkedin: get("linkedin"),
      csr_budget: get("csr_budget"), primary_focus: get("primary_focus"), secondary_focus: get("secondary_focus"),
      preferred_program: get("preferred_program"), previous_experience: get("previous_experience"),
      message: get("message"), heard_from: get("heard_from"),
      declaration: fd.get("declaration") === "on",
    };

    const e2: Errors = {};
    if (!data.company_name) e2.company_name = "Required";
    if (!data.company_type) e2.company_type = "Required";
    if (!/^[A-Z0-9]{10}$/.test(data.company_pan)) e2.company_pan = "10 alphanumeric characters";
    if (!data.company_address) e2.company_address = "Required";
    if (!data.state) e2.state = "Required";
    if (data.pin_code && !/^\d{6}$/.test(data.pin_code)) e2.pin_code = "6 digits";
    if (!data.contact_name) e2.contact_name = "Required";
    if (!data.designation) e2.designation = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.official_email)) e2.official_email = "Invalid email";
    if (!/^\d{10}$/.test(data.phone)) e2.phone = "Must be 10 digits";
    if (!data.csr_budget) e2.csr_budget = "Required";
    if (!data.primary_focus) e2.primary_focus = "Required";
    if (!data.message || data.message.length < 30) e2.message = "At least 30 characters";
    if (!data.declaration) e2.declaration = "Please accept the declaration to proceed";
    setErrors(e2);
    if (Object.keys(e2).length) { scrollToFirstError(e2); return; }

    setSubmitting(true);
    // Map to existing csr_applications schema (existing columns + extended)
    const payload = {
      type: "csr",
      full_name: data.contact_name, // legacy NOT NULL relaxed but keep for compatibility
      email: data.official_email,
      phone: data.phone,
      company: data.company_name,
      company_name: data.company_name,
      company_type: data.company_type,
      company_pan: data.company_pan,
      company_tan: data.company_tan,
      company_website: data.company_website,
      company_address: data.company_address,
      address: data.company_address,
      state: data.state,
      city: data.city,
      pin_code: data.pin_code,
      num_employees: data.num_employees,
      contact_name: data.contact_name,
      designation: data.designation,
      official_email: data.official_email,
      alternate_phone: data.alternate_phone,
      linkedin: data.linkedin,
      csr_budget: data.csr_budget,
      budget_range: data.csr_budget,
      primary_focus: data.primary_focus,
      secondary_focus: data.secondary_focus,
      focus_areas: [data.primary_focus, data.secondary_focus].filter(Boolean).join(", "),
      preferred_program: data.preferred_program,
      previous_experience: data.previous_experience,
      message: data.message,
      heard_from: data.heard_from,
      declaration: true,
      status: "pending" as const,
      submitted_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("csr_applications").insert(payload as any);
    setSubmitting(false);
    if (error) { setServerError("Something went wrong. Please try again or contact kss.seva@gmail.com"); return; }
    onSuccess(data);
  }

  const FOCUS = ["Education","Health","Women Empowerment","Food Security","Environment","Cultural Preservation","General","Multiple Areas"];

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div>
        <h3 className="font-serif text-2xl font-bold">CSR Partnership Registration</h3>
        <p className="text-sm text-muted-foreground">Fields marked * are required</p>
      </div>

      <div>
        <h4 className={sectionHeading}>Company Information</h4>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Company Name" name="company_name" error={errors.company_name} required>
            <input id="company_name" name="company_name" placeholder="Your company's full registered name" className={inputCls(errors.company_name)} />
          </Field>
          <Field label="Company Type" name="company_type" error={errors.company_type} required>
            <select id="company_type" name="company_type" defaultValue="" className={inputCls(errors.company_type)}>
              <option value="" disabled>Select Type</option>
              {["Private Limited","Public Limited","LLP","Partnership Firm","Proprietorship","Government or PSU","Trust or NGO","Other"].map(o => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Company PAN" name="company_pan" error={errors.company_pan} required>
            <input id="company_pan" name="company_pan" maxLength={10} placeholder="10-character PAN" className={cn(inputCls(errors.company_pan), "uppercase")} />
          </Field>
          <Field label="Company TAN" name="company_tan">
            <input id="company_tan" name="company_tan" placeholder="TAN if available" className={inputCls()} />
          </Field>
          <Field label="Company Website" name="company_website">
            <input id="company_website" name="company_website" type="url" placeholder="https://www.yourcompany.com" className={inputCls()} />
          </Field>
          <div />
          <div className="md:col-span-2">
            <Field label="Company Address" name="company_address" error={errors.company_address} required>
              <textarea id="company_address" name="company_address" rows={2} placeholder="Registered company address" className={inputCls(errors.company_address)} />
            </Field>
          </div>
          <Field label="State" name="state" error={errors.state} required>
            <select id="state" name="state" defaultValue="" className={inputCls(errors.state)}>
              <option value="" disabled>Select State</option>
              {STATES.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="City" name="city">
            <input id="city" name="city" placeholder="City name" className={inputCls()} />
          </Field>
          <Field label="PIN Code" name="pin_code" error={errors.pin_code}>
            <input id="pin_code" name="pin_code" maxLength={6} inputMode="numeric" placeholder="6-digit PIN" className={inputCls(errors.pin_code)} />
          </Field>
          <Field label="Number of Employees" name="num_employees">
            <select id="num_employees" name="num_employees" defaultValue="" className={inputCls()}>
              <option value="" disabled>Select</option>
              <option>Less than 50</option><option>50 to 200</option><option>200 to 500</option><option>500 to 1000</option><option>More than 1000</option>
            </select>
          </Field>
        </div>
      </div>

      <div>
        <h4 className={sectionHeading}>Contact Person Details</h4>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Contact Person Name" name="contact_name" error={errors.contact_name} required>
            <input id="contact_name" name="contact_name" placeholder="Full name of CSR contact" className={inputCls(errors.contact_name)} />
          </Field>
          <Field label="Designation" name="designation" error={errors.designation} required>
            <input id="designation" name="designation" placeholder="e.g. CSR Manager, Director, CEO, Trustee" className={inputCls(errors.designation)} />
          </Field>
          <Field label="Official Email ID" name="official_email" error={errors.official_email} required>
            <input id="official_email" name="official_email" type="email" placeholder="official@company.com" className={inputCls(errors.official_email)} />
          </Field>
          <Field label="Phone Number" name="phone" error={errors.phone} required>
            <input id="phone" name="phone" inputMode="numeric" maxLength={10} placeholder="10-digit mobile number" className={inputCls(errors.phone)} />
          </Field>
          <Field label="Alternate Phone" name="alternate_phone">
            <input id="alternate_phone" name="alternate_phone" placeholder="Alternate number (optional)" className={inputCls()} />
          </Field>
          <Field label="LinkedIn Profile" name="linkedin">
            <input id="linkedin" name="linkedin" type="url" placeholder="https://linkedin.com/in/yourprofile" className={inputCls()} />
          </Field>
        </div>
      </div>

      <div>
        <h4 className={sectionHeading}>CSR Intent and Proposal</h4>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="CSR Budget Range" name="csr_budget" error={errors.csr_budget} required>
            <select id="csr_budget" name="csr_budget" defaultValue="" className={inputCls(errors.csr_budget)}>
              <option value="" disabled>Select Budget</option>
              <option>Below ₹5 Lakh</option><option>₹5 to 25 Lakh</option><option>₹25 to 50 Lakh</option><option>₹50 Lakh to 1 Crore</option><option>Above ₹1 Crore</option><option>Prefer not to disclose</option>
            </select>
          </Field>
          <Field label="Primary CSR Focus Area" name="primary_focus" error={errors.primary_focus} required>
            <select id="primary_focus" name="primary_focus" defaultValue="" className={inputCls(errors.primary_focus)}>
              <option value="" disabled>Select Focus</option>
              {FOCUS.map(o => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Secondary CSR Focus Area" name="secondary_focus">
            <select id="secondary_focus" name="secondary_focus" defaultValue="" className={inputCls()}>
              <option value="" disabled>Select Focus</option>
              <option>None</option>
              {FOCUS.map(o => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Preferred Program to Support" name="preferred_program">
            <select id="preferred_program" name="preferred_program" defaultValue="" className={inputCls()}>
              <option value="" disabled>Select Program</option>
              {["Vidya Bhagya Free Tuition Centers","Vidya Vahini Scholarships","Arogya Bhagya Health Camps","Nari Uttejan Women Empowerment","Bala Sangama Annual Sports Event","Smart Classroom Setup","Emergency Relief Ration Program","Vessel Bank Zero-Waste Initiative","Medical Equipment Support Center","Open to Suggestions from KSS Team"].map(o => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Previous CSR Experience" name="previous_experience">
            <select id="previous_experience" name="previous_experience" defaultValue="" className={inputCls()}>
              <option value="" disabled>Select</option>
              <option>First time</option><option>1 to 2 years</option><option>3 to 5 years</option><option>More than 5 years</option>
            </select>
          </Field>
          <div />
          <div className="md:col-span-2">
            <Field label="Message or Proposal" name="message" error={errors.message} required>
              <textarea id="message" name="message" rows={4} placeholder="Describe your CSR interests, how KSS aligns with your organization's mandate, and the impact you'd like to create..." className={inputCls(errors.message)} />
            </Field>
          </div>
          <Field label="How did you hear about KSS?" name="heard_from">
            <select id="heard_from" name="heard_from" defaultValue="" className={inputCls()}>
              <option value="" disabled>Select</option>
              <option>Social Media</option><option>Corporate Event</option><option>Partner Organization</option><option>Google Search</option><option>Referral</option><option>Other</option>
            </select>
          </Field>
        </div>
      </div>

      <div data-field="declaration" className="space-y-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" name="declaration" className="mt-1 h-4 w-4 accent-primary" />
          <span className="text-sm">I confirm that the information provided is accurate and I am authorized to submit this CSR partnership inquiry on behalf of my organization.</span>
        </label>
        {errors.declaration && <p className={errCls}>{errors.declaration}</p>}
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 dark:bg-blue-950/40 dark:text-blue-100 dark:border-blue-900">
        <Info className="h-5 w-5 shrink-0 mt-0.5" />
        <span>Your information is confidential. Our team will contact you within 5 business days. All donations are eligible for tax exemption under Section 80G. KSS is 12A registered and 80G certified.</span>
      </div>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <button type="submit" disabled={submitting}
        className={cn("w-full rounded-lg py-3.5 text-base font-bold text-white transition", submitting ? "bg-muted-foreground" : "bg-primary hover:bg-primary/90")}>
        {submitting ? "Submitting..." : "Submit CSR Partnership Proposal"}
      </button>
    </form>
  );
}

/* ---------------- WRAPPER WITH TOGGLE ---------------- */
export function RegistrationForms() {
  const [tab, setTab] = useState<"volunteer" | "csr">("volunteer");
  const [success, setSuccess] = useState<null | { kind: "volunteer" | "csr"; data: any }>(null);
  const navigate = useNavigate();

  const pillBase = "rounded-full px-7 py-3 text-sm font-semibold transition-all duration-200";
  const onTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const onPrograms = () => navigate({ to: "/programs" });

  return (
    <section id="register" className="container-page py-16">
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl md:text-4xl font-bold">Register with KSS</h2>
        <p className="text-muted-foreground mt-2">Select your registration type and fill in the form below</p>
      </div>

      {!success && (
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-muted rounded-full p-1">
            <button
              type="button"
              onClick={() => setTab("volunteer")}
              className={cn(pillBase, tab === "volunteer" ? "bg-primary text-primary-foreground shadow" : "text-primary")}
            >
              <HandHeart className="inline h-4 w-4 mr-1.5 -mt-0.5" />Volunteer Registration
            </button>
            <button
              type="button"
              onClick={() => setTab("csr")}
              className={cn(pillBase, tab === "csr" ? "bg-primary text-primary-foreground shadow" : "text-primary")}
            >
              <Building2 className="inline h-4 w-4 mr-1.5 -mt-0.5" />CSR Partnership
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-4xl rounded-2xl bg-card shadow-elegant p-6 md:p-10">
        {success ? (
          success.kind === "volunteer" ? (
            <SuccessCard
              title="Application Submitted Successfully!"
              body={<>Thank you <strong>{success.data.full_name}</strong>! Your volunteer application has been received. Our team will review it and reach out to you at <strong>{success.data.email}</strong> or <strong>{success.data.phone}</strong> within 5 business days.</>}
              onTop={onTop} onPrograms={onPrograms}
            />
          ) : (
            <SuccessCard
              title="Proposal Submitted Successfully!"
              body={<>Thank you <strong>{success.data.company_name}</strong>! Your CSR partnership proposal has been received. Our team will contact <strong>{success.data.contact_name}</strong> at <strong>{success.data.official_email}</strong> or <strong>{success.data.phone}</strong> within 5 business days.</>}
              onTop={onTop} onPrograms={onPrograms}
            />
          )
        ) : (
          <div key={tab} className="animate-fade-in">
            {tab === "volunteer" ? (
              <VolunteerForm onSuccess={(d) => setSuccess({ kind: "volunteer", data: d })} />
            ) : (
              <CsrForm onSuccess={(d) => setSuccess({ kind: "csr", data: d })} />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
