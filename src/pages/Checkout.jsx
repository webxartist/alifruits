import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, clearCart } from "../utils/cart";
import { createOrder, createPaymentOrder, verifyPayment } from "../services/api";
import { generateInvoice } from "../utils/genrateInvoice";

const emptyAddress = { fullName:"", phone:"", addressLine1:"", addressLine2:"", city:"", state:"", postalCode:"", country:"India" };

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState(emptyAddress);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const items = getCart(); setCart(items);
    if (!items.length) navigate("/cart");
    const saved = localStorage.getItem("checkoutAddress");
    if (saved) { try { setAddress(JSON.parse(saved)); } catch (parseError) { console.warn("Invalid saved checkout address", parseError); } }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js"; script.async = true; script.id = "razorpay-checkout-script";
    document.body.appendChild(script);
    return () => document.getElementById("razorpay-checkout-script")?.remove();
  }, [navigate]);

  const subtotal = useMemo(()=>cart.reduce((sum,item)=>sum+Number(item.price||0)*Number(item.qty||1),0),[cart]);
  const total = Math.max(subtotal-discount,0);
  const set = (key,value)=>setAddress(p=>({...p,[key]:value}));

  const applyCoupon=()=>{
    const code=coupon.trim().toUpperCase();
    if(code==='SAVE10') setDiscount(Math.round(subtotal*0.10));
    else if(code==='WELCOME50') setDiscount(Math.min(50,subtotal));
    else if(code==='FESTIVE20') setDiscount(Math.round(subtotal*0.20));
    else { setDiscount(0); setError('Invalid coupon code.'); return; }
    setError('');
  };

  const checkout = async (e)=>{
    e.preventDefault(); setError("");
    const user=JSON.parse(localStorage.getItem("userInfo")||"null");
    if(!user?.token){navigate('/login');return;}
    if(!cart.length){setError('Your cart is empty.');return;}
    if(!Number.isFinite(total)||total<=0){setError('Invalid order total.');return;}
    setLoading(true);
    try{
      localStorage.setItem('checkoutAddress',JSON.stringify(address));
      const paymentOrder=await createPaymentOrder(total,user.token);
      if(!paymentOrder?.id) throw new Error('Unable to create payment order');
      if(!window.Razorpay) throw new Error('Payment system is still loading. Please try again.');
      const options={
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SbP0XTCNx8TuS7', amount:paymentOrder.amount, currency:paymentOrder.currency||'INR', name:'WebXShop', description:'WebXShop Order', order_id:paymentOrder.id,
        prefill:{name:address.fullName,email:user.email,contact:address.phone}, theme:{color:'#15803d'},
        handler:async(response)=>{
          try{
            const verify=await verifyPayment(response,user.token);
            if(!verify?.success) throw new Error('Payment verification failed');
            const orderResponse=await createOrder({
              orderItems:cart.map(item=>({product:item._id,qty:Number(item.qty)||1})),
              shippingAddress:address,
              couponCode:coupon.trim().toUpperCase(),
              paymentMethod:'razorpay',
              paymentResult:{razorpayOrderId:response.razorpay_order_id,razorpayPaymentId:response.razorpay_payment_id,razorpaySignature:response.razorpay_signature},
            },user.token);
            const order=orderResponse?.order;
            if(!order?._id) throw new Error('Payment succeeded but order creation failed');
            try{generateInvoice(order);}catch(invoiceError){console.error(invoiceError)}
            clearCart(); setCart([]); navigate('/my-orders');
          }catch(err){setError(err.message);setLoading(false);}
        },
        modal:{ondismiss:()=>setLoading(false)},
      };
      const razor=new window.Razorpay(options); razor.on('payment.failed',(r)=>{setError(r?.error?.description||'Payment failed');setLoading(false)}); razor.open();
    }catch(err){setError(err.message);setLoading(false)}
  };

  return <main className="min-h-screen bg-[#f8faf5] px-4 py-8 sm:px-6 lg:px-8"><div className="mx-auto max-w-6xl"><div className="mb-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-green-700">Secure Checkout</p><h1 className="mt-2 text-3xl font-semibold text-gray-950">Complete your order</h1><p className="mt-2 text-sm text-gray-500">Your payment is processed securely through Razorpay.</p></div>{error&&<div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}<form onSubmit={checkout} className="grid gap-6 lg:grid-cols-[1fr_380px]"><section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"><h2 className="text-lg font-semibold text-gray-950">Delivery address</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{[['fullName','Full name'],['phone','Phone'],['addressLine1','Address line 1'],['addressLine2','Address line 2'],['city','City'],['state','State'],['postalCode','PIN code'],['country','Country']].map(([k,l])=><label key={k} className="block sm:col-span-1"><span className="mb-2 block text-sm font-semibold text-gray-700">{l}</span><input value={address[k]} onChange={e=>set(k,e.target.value)} required={k!=='addressLine2'} className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600" /></label>)}</div><div className="mt-7 rounded-2xl border border-green-100 bg-green-50 p-4 text-sm text-green-800"><strong>Payment:</strong> Razorpay online payment</div></section><aside className="h-fit rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"><h2 className="text-lg font-semibold text-gray-950">Order summary</h2><div className="mt-5 space-y-3">{cart.map(item=><div key={item._id} className="flex gap-3 text-sm"><img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover"/><div className="min-w-0 flex-1"><p className="truncate font-medium text-gray-800">{item.name}</p><p className="text-xs text-gray-400">Qty {item.qty}</p></div><span>₹{(Number(item.price)*Number(item.qty)).toLocaleString('en-IN')}</span></div>)}</div><div className="mt-6 flex gap-2"><input value={coupon} onChange={e=>setCoupon(e.target.value)} placeholder="Coupon code" className="min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm"/><button type="button" onClick={applyCoupon} className="rounded-xl border border-gray-200 px-3 py-2.5 text-xs font-semibold">Apply</button></div>{discount>0&&<p className="mt-2 text-xs font-semibold text-green-700">Discount applied: -₹{discount.toLocaleString('en-IN')}</p>}<div className="mt-5 space-y-2 border-t border-gray-100 pt-5 text-sm"><div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div><div className="flex justify-between"><span className="text-gray-500">Discount</span><span>-₹{discount.toLocaleString('en-IN')}</span></div><div className="flex justify-between pt-2 text-lg font-bold"><span>Total</span><span className="text-green-700">₹{total.toLocaleString('en-IN')}</span></div></div><button disabled={loading} className="mt-6 w-full rounded-xl bg-gray-950 px-5 py-3.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">{loading?'Processing…':`Pay ₹${total.toLocaleString('en-IN')}`}</button><Link to="/cart" className="mt-3 block text-center text-xs font-semibold text-gray-500">← Back to cart</Link></aside></form></div></main>;
}
