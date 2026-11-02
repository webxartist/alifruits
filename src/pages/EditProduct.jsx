import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAdminProduct, updateAdminProduct } from "../services/api";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:"", price:"", oldPrice:"", category:"", stock:"", image:"", description:"", featured:false, isTopDeal:false, isNewArrival:false, isPopular:false, isActive:true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getAdminProduct(id, JSON.parse(localStorage.getItem("userInfo") || "null")?.token);
        const product = data?.product;
        if (!product?._id) throw new Error("Product not found");
        setForm({
          name: product.name || "", price: product.price ?? "", oldPrice: product.oldPrice ?? "",
          category: product.category || "", stock: product.stock ?? 0, image: product.image || "",
          description: product.description || "", featured: !!product.featured, isTopDeal: !!product.isTopDeal,
          isNewArrival: !!product.isNewArrival, isPopular: !!product.isPopular, isActive: product.isActive !== false,
        });
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const submit = async (e) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      const result = await updateAdminProduct(id, { ...form, price:Number(form.price), oldPrice:form.oldPrice === "" ? null : Number(form.oldPrice), stock:Number(form.stock) }, user?.token);
      if (!result?.product) throw new Error(result?.message || "Product update failed");
      navigate("/admin");
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="min-h-screen bg-[#f8faf5] p-10 text-center text-gray-500">Loading product…</div>;
  if (error && !form.name) return <div className="min-h-screen bg-[#f8faf5] p-10 text-center text-red-600">{error}</div>;

  return <main className="min-h-screen bg-[#f8faf5] px-4 py-10 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-green-700">Admin Inventory</p><h1 className="mt-2 text-3xl font-semibold text-gray-950">Edit Product</h1></div><Link to="/admin" className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700">Back</Link></div>
      {error && <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <form onSubmit={submit} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          {[['name','Product Name','text'],['price','Selling Price','number'],['oldPrice','Old Price','number'],['category','Category','text'],['stock','Stock','number'],['image','Image URL','url']].map(([key,label,type])=><label key={key} className="block"><span className="mb-2 block text-sm font-semibold text-gray-700">{label}</span><input type={type} min={type==='number'?'0':undefined} value={form[key]} onChange={e=>set(key,e.target.value)} required={['name','price','category','image'].includes(key)} className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600" /></label>)}
        </div>
        <label className="mt-5 block"><span className="mb-2 block text-sm font-semibold text-gray-700">Description</span><textarea rows={5} value={form.description} onChange={e=>set('description',e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600" /></label>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">{[['isActive','Store Active'],['featured','Featured'],['isTopDeal','Top Deal'],['isNewArrival','New Arrival'],['isPopular','Popular']].map(([key,label])=><label key={key} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4"><input type="checkbox" checked={!!form[key]} onChange={e=>set(key,e.target.checked)} className="h-4 w-4 accent-green-700" /><span className="text-sm font-semibold text-gray-800">{label}</span></label>)}</div>
        <button disabled={saving} className="mt-7 w-full rounded-xl bg-gray-950 px-5 py-3.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">{saving ? 'Saving…' : 'Save Product'}</button>
      </form>
    </div>
  </main>;
}
