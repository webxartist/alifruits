import { useEffect, useState } from "react";
import { getAllOrders, updateAdminOrderStatus, updateAdminShipment, updateAdminReturn } from "../services/api";

const statuses = ["Pending","Confirmed","Shipped","Out for Delivery","Delivered","Cancelled"];
const returnStatuses = ["Under Review","Approved","Rejected","Pickup Scheduled","Received","Refund Initiated","Completed"];

export default function AdminFulfillment() {
  const token = JSON.parse(localStorage.getItem("userInfo") || "null")?.token;
  const [orders,setOrders] = useState([]);
  const [loading,setLoading] = useState(true);
  const [message,setMessage] = useState("");
  const [busy,setBusy] = useState("");
  const load = async()=>{const r=await getAllOrders(token);setOrders(Array.isArray(r)?r:r.orders||[]);};
  useEffect(()=>{load().catch(e=>setMessage(e.message)).finally(()=>setLoading(false));},[token]);
  const statusChange = async (o,status)=>{setBusy(o._id);try{await updateAdminOrderStatus(o._id,status,token);await load();setMessage(`Order ${o._id.slice(-6)} updated.`);}catch(e){setMessage(e.message);}finally{setBusy("");}};
  const saveShipment = async (o,form)=>{setBusy(o._id);try{await updateAdminShipment(o._id,form,token);await load();setMessage("Shipment details saved.");}catch(e){setMessage(e.message);}finally{setBusy("");}};
  const saveReturn = async (o,r,status)=>{const note=window.prompt("Internal note for this return (optional):",r.adminNote||"");if(note===null)return;setBusy(String(r._id));try{await updateAdminReturn(o._id,r._id,{status,adminNote:note},token);await load();setMessage("Return request updated.");}catch(e){setMessage(e.message);}finally{setBusy("");}};
  if(loading)return <main className="p-10">Loading orders…</main>;
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-6xl"><h1 className="text-3xl font-bold">Fulfilment & returns</h1><p className="mt-2 text-slate-500">Manage order status, courier details, tracking links and customer return requests.</p>{message&&<p role="status" className="my-4 rounded-xl bg-white p-3 text-sm">{message}</p>}
  <div className="mt-6 space-y-5">{orders.map(o=><article key={o._id} className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-bold">Order #{String(o._id).slice(-8).toUpperCase()}</h2><p className="text-sm text-slate-500">{o.user?.name||"Customer"} · {o.user?.email||""}</p><p className="mt-1 text-sm">₹{Number(o.totalPrice||0).toLocaleString("en-IN")} · Payment: {o.paymentStatus||"Pending"}</p></div><select aria-label="Order status" value={o.status} disabled={busy===o._id} onChange={e=>statusChange(o,e.target.value)} className="rounded-lg border p-2">{statuses.map(x=><option key={x}>{x}</option>)}</select></div>
  <div className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-4 md:grid-cols-2"><h3 className="font-bold md:col-span-2">Shipment details</h3>{["courier","trackingNumber","trackingUrl","estimatedDelivery","notes"].map(k=><label key={k} className="text-xs font-semibold capitalize text-slate-600">{k.replace(/([A-Z])/g," $1")}<input id={`${o._id}-${k}`} defaultValue={k==="estimatedDelivery"?(o.shipment?.[k]?new Date(o.shipment[k]).toISOString().slice(0,10):""):(o.shipment?.[k]||"")} type={k==="estimatedDelivery"?"date":"text"} className="mt-1 w-full rounded-lg border bg-white p-2 text-sm"/></label>)}<button disabled={busy===o._id} onClick={()=>{const f={};["courier","trackingNumber","trackingUrl","estimatedDelivery","notes"].forEach(k=>f[k]=document.getElementById(`${o._id}-${k}`).value);saveShipment(o,f);}} className="justify-self-start rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white md:col-span-2">Save tracking details</button></div>
  {o.returnRequests?.length>0&&<div className="mt-4 space-y-3"><h3 className="font-bold">Return requests</h3>{o.returnRequests.map(r=><div key={r._id} className="rounded-xl border border-amber-200 bg-amber-50 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="font-semibold">{r.reason}</p><p className="text-sm text-slate-600">{r.details||"No additional details"} · Current status: {r.status}</p></div><select value={r.status} onChange={e=>saveReturn(o,r,e.target.value)} className="rounded-lg border bg-white p-2 text-sm">{returnStatuses.map(x=><option key={x}>{x}</option>)}</select></div>{r.adminNote&&<p className="mt-2 text-xs text-slate-500">Admin note: {r.adminNote}</p>}</div>)}</div>}
  </article>)}</div>{orders.length===0&&<p className="mt-6 rounded-xl bg-white p-6">No orders yet.</p>}</div></main>;
}
