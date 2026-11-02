import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { changeMyPassword, getMyProfile, updateMyProfile } from "../services/api";

export default function Account() {
  const { user, login, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getMyProfile(user?.token);
        if (mounted) {
          setForm({ name: data?.user?.name || user?.name || "", phone: data?.user?.phone || user?.phone || "" });
        }
      } catch (error) {
        if (mounted) setMessage(error.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [user?.token, user?.name, user?.phone]);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true); setMessage("");
    try {
      const data = await updateMyProfile(form, user.token);
      const next = { ...user, ...data.user };
      login(next);
      setMessage("Profile updated successfully.");
    } catch (error) { setMessage(error.message); }
    finally { setSaving(false); }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) { setMessage("New passwords do not match."); return; }
    setSaving(true); setMessage("");
    try {
      await changeMyPassword(passwords, user.token);
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage("Password changed successfully.");
    } catch (error) { setMessage(error.message); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="min-h-screen bg-[#f8faf5] p-10 text-center text-gray-500">Loading account…</div>;

  return (
    <main className="min-h-screen bg-[#f8faf5] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">My Account</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950">Account settings</h1>
          <p className="mt-2 text-sm text-gray-500">Manage your profile and password securely.</p>
        </div>
        {message && <div className="mb-5 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-800">{message}</div>}
        <div className="mb-6 flex flex-wrap gap-3">
          <Link to="/my-orders" className="rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:border-green-600">My orders & tracking →</Link>
          <Link to="/account/addresses" className="rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:border-green-600">Manage delivery addresses →</Link>
          <Link to="/wishlist" className="rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:border-green-600">My wishlist →</Link>
          <Link to="/notifications" className="rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:border-green-600">Notifications →</Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <form onSubmit={saveProfile} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-950">Profile</h2>
            <div className="mt-5 space-y-4">
              <label className="block"><span className="mb-2 block text-sm font-semibold text-gray-700">Name</span><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600" required /></label>
              <label className="block"><span className="mb-2 block text-sm font-semibold text-gray-700">Email</span><input value={user?.email || ""} disabled className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-gray-500" /></label>
              <label className="block"><span className="mb-2 block text-sm font-semibold text-gray-700">Phone</span><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600" /></label>
              <button disabled={saving} className="w-full rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">{saving ? "Saving…" : "Save Profile"}</button>
            </div>
          </form>
          <form onSubmit={savePassword} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-950">Change Password</h2>
            <div className="mt-5 space-y-4">
              {[["currentPassword","Current password"],["newPassword","New password"],["confirmPassword","Confirm new password"]].map(([key,label])=><label key={key} className="block"><span className="mb-2 block text-sm font-semibold text-gray-700">{label}</span><input type="password" minLength={6} value={passwords[key]} onChange={e=>setPasswords({...passwords,[key]:e.target.value})} className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600" required /></label>)}
              <button disabled={saving} className="w-full rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50">{saving ? "Updating…" : "Change Password"}</button>
              <button type="button" onClick={()=>{logout();navigate("/login");}} className="w-full rounded-xl border border-red-100 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50">Sign Out</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
