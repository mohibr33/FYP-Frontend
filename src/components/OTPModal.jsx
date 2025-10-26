import { useEffect, useState } from "react";


export default function OTPModal({ open, onClose, onVerify, email, title="Enter OTP" }){
const [otp, setOtp] = useState("");


useEffect(()=>{ if(open) setOtp(""); }, [open]);
if(!open) return null;


return (
<div className="fixed inset-0 z-50 grid place-items-center bg-black/30">
<div className="card-glass w-full max-w-md p-6">
<div className="flex items-center justify-between">
<h3 className="text-lg font-semibold">{title}</h3>
<button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
</div>
<p className="text-sm text-gray-600 mt-2">We sent a one-time code to <span className="font-medium">{email}</span>.</p>
<input value={otp} onChange={(e)=>setOtp(e.target.value)} placeholder="6-digit code" className="input mt-4 tracking-widest text-center" />
<div className="mt-4 flex gap-3">
<button onClick={()=>onVerify(otp)} className="btn-primary flex-1">Verify</button>
<button onClick={onClose} className="btn-outline">Cancel</button>
</div>
</div>
</div>
);
}