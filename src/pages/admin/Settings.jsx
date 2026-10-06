import { useEffect, useState } from "react";
import {
  Bell,
  Building2,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";

const defaultSettings = {
  profile: {
    name: "Admin",
    email: "admin@pareek.com",
    phone: "",
    designation: "Administrator",
  },
  company: {
    name: "Pareek",
    legalName: "Pareek",
    email: "",
    phone: "",
    gst: "",
    address: "",
  },
  notifications: {
    newOrder: true,
    orderStatus: true,
    dealerUpdates: true,
    salespersonUpdates: true,
    whatsapp: true,
  },
};

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100";

const sectionClass = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6";

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={`relative h-6 w-11 rounded-full transition ${
        checked ? "bg-slate-900" : "bg-slate-200"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition ${
          checked ? "left-5" : "left-0.5"
        }`}
      />
    </button>
  );
}

function Field({ label, icon: Icon, value, onChange, type = "text", placeholder }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="relative">
        {Icon && (
          <Icon size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${inputClass} ${Icon ? "pl-10" : ""}`}
        />
      </div>
    </label>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [showPasswords, setShowPasswords] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pareek_admin_settings");
      if (stored) {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      }
    } catch {
      // Ignore invalid local storage data.
    }
  }, []);

  const updateSection = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem("pareek_admin_settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      alert("Please fill all password fields.");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      alert("New password and confirm password do not match.");
      return;
    }
    setPasswords({ current: "", next: "", confirm: "" });
    alert("Password updated successfully in the frontend demo.");
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Administration</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Settings</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your admin profile, company information and preferences.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          {saved ? <Check size={17} /> : <Save size={17} />}
          {saved ? "Saved" : "Save Changes"}
        </button>
      </div>

      <section className={sectionClass}>
        <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
            <User size={19} className="text-slate-700" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Admin Profile</h2>
            <p className="text-xs text-slate-500">Basic administrator information.</p>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Full Name" value={settings.profile.name} onChange={(v) => updateSection("profile", "name", v)} />
          <Field label="Email Address" icon={Mail} type="email" value={settings.profile.email} onChange={(v) => updateSection("profile", "email", v)} />
          <Field label="Phone Number" icon={Phone} value={settings.profile.phone} onChange={(v) => updateSection("profile", "phone", v)} placeholder="Enter phone number" />
          <Field label="Designation" value={settings.profile.designation} onChange={(v) => updateSection("profile", "designation", v)} />
        </div>
      </section>

      <section className={sectionClass}>
        <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
            <Building2 size={19} className="text-slate-700" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Company Information</h2>
            <p className="text-xs text-slate-500">Information used across the Pareek system.</p>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Company Name" value={settings.company.name} onChange={(v) => updateSection("company", "name", v)} />
          <Field label="Legal Name" value={settings.company.legalName} onChange={(v) => updateSection("company", "legalName", v)} />
          <Field label="Company Email" icon={Mail} type="email" value={settings.company.email} onChange={(v) => updateSection("company", "email", v)} />
          <Field label="Company Phone" icon={Phone} value={settings.company.phone} onChange={(v) => updateSection("company", "phone", v)} />
          <Field label="GST Number" value={settings.company.gst} onChange={(v) => updateSection("company", "gst", v)} />
          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Address</span>
            <textarea
              rows={3}
              value={settings.company.address}
              onChange={(e) => updateSection("company", "address", e.target.value)}
              placeholder="Enter company address"
              className={inputClass}
            />
          </label>
        </div>
      </section>

      <section className={sectionClass}>
        <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
            <Bell size={19} className="text-slate-700" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Notifications</h2>
            <p className="text-xs text-slate-500">Choose which operational notifications are enabled.</p>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            ["newOrder", "New Order", "Receive a notification when a new order is placed."],
            ["orderStatus", "Order Status", "Notify when an order status changes."],
            ["dealerUpdates", "Dealer Updates", "Receive updates related to dealers."],
            ["salespersonUpdates", "Salesperson Updates", "Receive updates related to salespersons."],
            ["whatsapp", "WhatsApp Notifications", "Enable WhatsApp notification preferences for future API integration."],
          ].map(([key, title, description]) => (
            <div key={key} className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="text-sm font-semibold text-slate-800">{title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{description}</p>
              </div>
              <Toggle checked={settings.notifications[key]} onChange={(v) => updateSection("notifications", key, v)} />
            </div>
          ))}
        </div>
      </section>

      <section className={sectionClass}>
        <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
            <ShieldCheck size={19} className="text-slate-700" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Security</h2>
            <p className="text-xs text-slate-500">Change your administrator password.</p>
          </div>
        </div>
        <form onSubmit={handlePasswordChange} className="grid gap-5 md:grid-cols-3">
          {[
            ["current", "Current Password"],
            ["next", "New Password"],
            ["confirm", "Confirm Password"],
          ].map(([key, label]) => (
            <label key={key} className="block">
              <span className="text-sm font-medium text-slate-700">{label}</span>
              <div className="relative">
                <LockKeyhole size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPasswords ? "text" : "password"}
                  value={passwords[key]}
                  onChange={(e) => setPasswords((prev) => ({ ...prev, [key]: e.target.value }))}
                  className={`${inputClass} pl-10 pr-10`}
                />
                {key === "confirm" && (
                  <button
                    type="button"
                    onClick={() => setShowPasswords((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPasswords ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                )}
              </div>
            </label>
          ))}
          <div className="md:col-span-3">
            <button type="submit" className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Update Password
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
