import { useEffect, useState } from "react";
import { getAdminSiteSettings, updateAdminSiteSettings } from "../services/api";

const initial = { storeName:"", tagline:"", logoUrl:"", supportEmail:"", supportPhone:"", announcement:"", currency:"INR", shippingFee:0, freeShippingThreshold:0, returnWindowDays:7, returnPolicy:"", privacyPolicy:"", terms:"", maintenanceMode:false, socialLinks:{} };

export default function AdminStoreSettings() {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const token = JSON.parse(localStorage.getItem("userInfo") || "null")?.token;
  useEffect(() => { getAdminSiteSettings(token).then(r=>setForm({...initial,...r.settings})).catch(e=>setMessage(e.message)).finally(()=>setLoading(false)); }, [token]);
  const change = e => setForm({...form,[e.target.name]:e.target.type==="checkbox"?e.target.checked:e.target.type==="number"?Number(e.target.value):e.target.value});
  const submit = async e => { e.preventDefault(); setSaving(true); setMessage(""); try { const r=await updateAdminSiteSettings(form,token); setForm({...initial,...r.settings}); setMessage("Store settings saved successfully."); } catch(e) { setMessage(e.message); } finally { setSaving(false); } };
  const field = (name,label,type="text") => <label key={name} className="block text-sm font-semibold text-slate-700">{label}<input name={name} type={type} value={form[name] ?? ""} onChange={change} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none focus:border-green-600"/></label>;
  if(loading) return <div className="p-10">Loading store settings…</div>;
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-5xl">
    <div className="mb-6"><p className="text-xs font-bold uppercase tracking-widest text-green-700">Admin control panel</p><h1 className="mt-2 text-3xl font-bold text-slate-950">Store settings</h1><p className="mt-2 text-slate-500">Manage store identity, support details, shipping defaults and customer-facing policies.</p></div>
    {message && <p role="status" className="mb-5 rounded-xl bg-white p-4 text-sm">{message}</p>}
    <form onSubmit={submit} className="space-y-6">
      <section className="grid gap-4 rounded-2xl border bg-white p-6 md:grid-cols-2"><h2 className="text-lg font-bold md:col-span-2">Store identity & contact</h2>{field("storeName","Store name")}{field("tagline","Tagline")}{field("logoUrl","Logo image URL")}{field("supportEmail","Support email","email")}{field("supportPhone","Support phone")}{field("announcement","Announcement bar text")}{field("currency","Currency code")}
      <label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" name="maintenanceMode" checked={!!form.maintenanceMode} onChange={change}/> Enable maintenance mode (flag only; storefront enforcement must be configured)</label></section>
      <section className="grid gap-4 rounded-2xl border bg-white p-6 md:grid-cols-2"><h2 className="text-lg font-bold md:col-span-2">Shipping & returns</h2>{field("shippingFee","Default shipping fee","number")}{field("freeShippingThreshold","Free shipping threshold (0 disables)","number")}{field("returnWindowDays","Return window in days","number")}<label className="text-sm font-semibold text-slate-700 md:col-span-2">Return policy<textarea name="returnPolicy" value={form.returnPolicy||""} onChange={change} rows="4" className="mt-1 w-full rounded-xl border p-3 font-normal"/></label></section>
      <section className="space-y-4 rounded-2xl border bg-white p-6"><h2 className="text-lg font-bold">Legal pages content</h2><label className="block text-sm font-semibold text-slate-700">Privacy policy<textarea name="privacyPolicy" value={form.privacyPolicy||""} onChange={change} rows="5" className="mt-1 w-full rounded-xl border p-3 font-normal"/></label><label className="block text-sm font-semibold text-slate-700">Terms & conditions<textarea name="terms" value={form.terms||""} onChange={change} rows="5" className="mt-1 w-full rounded-xl border p-3 font-normal"/></label></section>
      <button disabled={saving} className="rounded-xl bg-green-700 px-6 py-3 font-bold text-white disabled:opacity-50">{saving?"Saving…":"Save all store settings"}</button>
    </form>
  </div></main>;
}
