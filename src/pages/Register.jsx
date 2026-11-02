import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  const [form, setForm] = useState({ name:"", email:"", phone:"", password:"", confirmPassword:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (key, value) => setForm((p)=>({...p,[key]:value}));
  const submit = async (e) => {
    e.preventDefault(); setError("");
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      const data = await registerUser({ name:form.name, email:form.email, phone:form.phone, password:form.password });
      if (!data?.token || !data?.user) throw new Error(data?.message || "Registration failed");
      const userInfo = { ...data.user, token:data.token };
      login(userInfo);
      navigate("/");
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };
  return <main className="min-h-[calc(100vh-72px)] bg-[#f8faf5] px-4 py-10 sm:py-16"><div className="mx-auto max-w-md"><div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl sm:p-9"><p className="text-xs font-bold uppercase tracking-[.18em] text-green-700">WebXShop</p><h1 className="mt-2 text-3xl font-semibold text-gray-950">Create your account</h1><p className="mt-2 text-sm text-gray-500">Join WebXShop and manage your shopping from one account.</p>{error&&<div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}<form onSubmit={submit} className="mt-7 space-y-4">{[['name','Full name','text'],['email','Email address','email'],['phone','Phone number','tel']].map(([k,l,t])=><label key={k} className="block"><span className="mb-2 block text-sm font-semibold text-gray-700">{l}</span><input type={t} value={form[k]} onChange={e=>set(k,e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600" required={k!=='phone'} /></label>)}{[['password','Password'],['confirmPassword','Confirm password']].map(([k,l])=><label key={k} className="block"><span className="mb-2 block text-sm font-semibold text-gray-700">{l}</span><input type="password" minLength={6} value={form[k]} onChange={e=>set(k,e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600" required /></label>)}<button disabled={loading} className="w-full rounded-xl bg-gray-950 px-5 py-3.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">{loading?'Creating account…':'Create Account'}</button></form><p className="mt-6 text-center text-sm text-gray-500">Already have an account? <Link to="/login" className="font-semibold text-green-700">Sign in</Link></p></div></div></main>;
}
