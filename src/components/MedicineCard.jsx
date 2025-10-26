export default function MedicineCard({ m, onReview }){
return (
<div className="card-glass p-4">
{m.imageUrl && (
<img src={m.imageUrl} alt={m.title} className="h-36 w-full object-cover rounded-xl" />
)}
<h3 className="mt-2 text-lg font-semibold">{m.title}</h3>
<p className="text-sm mt-1"><span className="font-medium">Usage:</span> {m.usage}</p>
<p className="text-sm mt-1 text-red-600"><span className="font-medium text-gray-800">Side Effects:</span> {m.sideEffects}</p>
<div className="mt-3 flex items-center justify-between">
<span className="text-xs text-primary bg-primary/5 px-2 py-1 rounded-full">{m.category}</span>
{onReview && <button className="btn-outline" onClick={()=>onReview(m)}>Review</button>}
</div>
</div>
);
}