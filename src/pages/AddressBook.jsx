import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addMyAddress, deleteMyAddress, getMyAddresses, updateMyAddress } from "../services/api";

const empty = { label: "Home", fullName: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "", country: "India", isDefault: false };

export default function AddressBook() {
  const session = JSON.parse(localStorage.getItem("userInfo") || "null");
  const token = session?.token;
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const refresh = async () => {
    const result = await getMyAddresses(token);
    setAddresses(result.addresses || []);
  };
  useEffect(() => { refresh().catch(e => setMessage(e.message)).finally(() => setLoading(false)); }, [token]);
  const change = e => setForm({ ...form, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  const submit = async e => {
    e.preventDefault(); setBusy(true); setMessage("");
    try {
      const result = editing ? await updateMyAddress(editing, form, token) : await addMyAddress(form, token);
      setAddresses(result.addresses || []); setForm(empty); setEditing(""); setMessage("Address saved successfully.");
    } catch (e) { setMessage(e.message); } finally { setBusy(false); }
  };
  const edit = a => { setEditing(a._id); setForm({ ...empty, ...a }); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const remove = async id => {
    if (!window.confirm("Delete this saved address?")) return;
    try { const result = await deleteMyAddress(id, token); setAddresses(result.addresses || []); setMessage("Address deleted."); }
    catch (e) { setMessage(e.message); }
  };
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-5xl">
    <Link to="/account" className="text-sm font-semibold text-green-700">← Back to account</Link>
    <h1 className="mt-4 text-3xl font-bold text-slate-900">My addresses</h1><p className="mt-2 text-slate-500">Save and manage delivery addresses for faster checkout.</p>
    {message && <p role="status" className="my-4 rounded-xl bg-white p-3 text-sm">{message}</p>}
    <form onSubmit={submit} className="my-6 grid gap-4 rounded-2xl border bg-white p-5 sm:grid-cols-2">
      <h2 className="sm:col-span-2 text-lg font-bold">{editing ? "Edit address" : "Add a new address"}</h2>
      {[["label","Label (Home / Work)"],["fullName","Full name"],["phone","Phone"],["addressLine1","House / street"],["addressLine2","Apartment / landmark"],["city","City"],["state","State"],["postalCode","PIN code"],["country","Country"]].map(([name,label])=><label key={name} className="text-sm font-medium text-slate-700">{label}<input name={name} value={form[name] || ""} onChange={change} required={["fullName","phone","addressLine1","city","state","postalCode"].includes(name)} className="mt-1 w-full rounded-lg border p-3" /></label>)}
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isDefault" checked={!!form.isDefault} onChange={change}/> Set as default address</label>
      <div className="flex gap-3 sm:col-span-2"><button disabled={busy} className="rounded-xl bg-green-700 px-5 py-3 font-semibold text-white">{busy ? "Saving…" : "Save address"}</button>{editing && <button type="button" onClick={()=>{setEditing("");setForm(empty);}} className="rounded-xl border px-5 py-3">Cancel edit</button>}</div>
    </form>
    {loading ? <p>Loading addresses…</p> : <div className="grid gap-4 md:grid-cols-2">{addresses.map(a=><article key={a._id} className="rounded-2xl border bg-white p-5"><div className="flex items-start justify-between gap-3"><div><span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-800">{a.label || "Address"}</span>{a.isDefault && <span className="ml-2 text-xs font-bold text-blue-700">Default</span>}<h3 className="mt-3 font-bold">{a.fullName}</h3><p className="text-sm text-slate-600">{a.phone}</p></div></div><p className="mt-2 text-sm leading-6 text-slate-600">{a.addressLine1} {a.addressLine2}<br/>{a.city}, {a.state} {a.postalCode}<br/>{a.country}</p><div className="mt-4 flex gap-4 text-sm font-semibold"><button onClick={()=>edit(a)} className="text-green-700">Edit</button><button onClick={()=>remove(a._id)} className="text-red-600">Delete</button>{!a.isDefault && <button onClick={async()=>{try{const r=await updateMyAddress(a._id,{isDefault:true},token);setAddresses(r.addresses||[]);}catch(e){setMessage(e.message);}}} className="text-slate-600">Make default</button>}</div></article>)}</div>}
    {!loading && addresses.length === 0 && <p className="rounded-xl bg-white p-6 text-slate-500">No saved addresses yet. Add one above.</p>}
  </div></main>;
}
