import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/api";

export default function ForgotPassword(){
 const [email,setEmail]=useState(""); const [message,setMessage]=useState(""); const [loading,setLoading]=useState(false);
 const submit=async(e)=>{e.preventDefault();setLoading(true);setMessage("");try{const d=await forgotPassword(email);setMessage(d.message)}catch(err){setMessage(err.message)}finally{setLoading(false)}};
 return <main className="min-h-[calc(100vh-72px)] bg-[#f8faf5] px-4 py-12"><div className="mx-auto max-w-md rounded-3xl border border-gray-100 bg-white p-7 shadow-xl sm:p-9"><p className="text-xs font-bold uppercase tracking-[.18em] text-green-700">Account Recovery</p><h1 className="mt-2 text-3xl font-semibold text-gray-950">Forgot password?</h1><p className="mt-2 text-sm leading-6 text-gray-500">Enter your email and, if an account exists, we’ll send a secure reset link.</p>{message&&<div className="mt-5 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-800">{message}</div>}<form onSubmit={submit} className="mt-6 space-y-4"><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"/><button disabled={loading} className="w-full rounded-xl bg-gray-950 px-5 py-3.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">{loading?'Sending…':'Send Reset Link'}</button></form><Link to="/login" className="mt-5 block text-center text-sm font-semibold text-green-700">Back to sign in</Link></div></main>;
}
