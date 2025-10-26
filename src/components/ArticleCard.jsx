import { Link } from "react-router-dom";


export default function ArticleCard({ a }){
return (
<div className="card-glass p-4 flex flex-col">
{a.imageUrl && (
<img src={a.imageUrl} alt={a.title} className="h-40 w-full object-cover rounded-xl"/>
)}
<div className="mt-3">
<span className="text-xs text-primary font-semibold bg-primary/5 px-2 py-1 rounded-full">{a.category}</span>
<h3 className="mt-2 text-lg font-semibold">{a.title}</h3>
<p className="text-sm text-gray-600 line-clamp-3 mt-1">{a.shortDescription}</p>
</div>
<Link to={`/articles/${a._id}`} className="btn-outline mt-4">Read More</Link>
</div>
);
}