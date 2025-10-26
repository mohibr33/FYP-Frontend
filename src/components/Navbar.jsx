// import { Link, NavLink, useNavigate } from "react-router-dom";
// import { useAuth } from "../state/AuthContext.jsx";

// const NavItem = ({ to, children }) => (
//   <NavLink
//     to={to}
//     className={({ isActive }) =>
//       `inline-flex items-center gap-2 px-3 py-2 rounded-lg transition ${
//         isActive ? "text-primary bg-primary/5" : "text-slate-600 hover:text-primary"
//       }`
//     }
//   >
//     {children}
//   </NavLink>
// );

// export default function Navbar() {
//   const { user, setUser, setToken } = useAuth();
//   const navigate = useNavigate();

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     navigate("/");
//   };

//   return (
//     <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100">
//       <div className="container-page flex items-center justify-between py-3">
//         {/* Logo + Brand */}
//         <Link to="/" className="flex items-center gap-2">
//           <span className="inline-grid place-items-center h-9 w-9 rounded-xl bg-primary text-white shadow-[0_6px_16px_rgba(30,64,175,0.35)]">
//             {/* simple stethoscope-ish icon */}
//             <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
//               <path d="M6 5a1 1 0 0 1 2 0v5a4 4 0 1 0 8 0V5a1 1 0 1 1 2 0v5a6 6 0 0 1-5 5.917V18a3 3 0 1 1-2 0v-2.083A6 6 0 0 1 6 10V5z"/>
//             </svg>
//           </span>
//           <span className="text-xl font-semibold text-primary">
//             Digital Healthcare Assistant
//           </span>
//         </Link>

//         {/* Nav */}
//         <nav className="hidden md:flex items-center gap-1">
//           <NavItem to="/"> 
//             <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M12 3 3 10h2v10h6v-6h2v6h6V10h2z"/></svg>
//             Home
//           </NavItem>
//           <NavItem to="/articles">
//             <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M5 3h14a1 1 0 0 1 1 1v14l-4-3-4 3-4-3-4 3V4a1 1 0 0 1 1-1z"/></svg>
//             Articles
//           </NavItem>
//           <NavItem to="/medicine">
//             <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M7 3h10a2 2 0 0 1 2 2v6H5V5a2 2 0 0 1 2-2zm-2 10h14v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-4z"/></svg>
//             Common Medicine
//           </NavItem>

//           {user ? (
//             <>
//               <NavItem to={user.role === "admin" ? "/admin" : "/dashboard"}>
//                 <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z"/></svg>
//                 {user.role === "admin" ? "Admin" : "Dashboard"}
//               </NavItem>
//               <button onClick={logout} className="ml-2 px-3 py-2 rounded-lg border border-primary text-primary hover:bg-primary/5">
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <NavLink to="/login" className="px-3 py-2 rounded-lg text-slate-600 hover:text-primary">
//                 Sign In
//               </NavLink>
//               <NavLink
//                 to="/signup"
//                 className="ml-2 inline-flex items-center gap-2 rounded-xl bg-primary text-white px-4 py-2 font-medium shadow-[0_8px_22px_rgba(30,64,175,0.28)] hover:bg-primary/90"
//               >
//                 Get Started
//               </NavLink>
//             </>
//           )}
//         </nav>
//       </div>
//     </header>
//   );
// }
