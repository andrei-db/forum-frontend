import { Wrench } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
export default function Maintenance() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    return (
        <section className="min-h-screen bg-neutral-950 flex items-center justify-center px-6">
            <div className="max-w-xl w-full text-center">
                <div className="w-24 h-24 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto mb-8">
                    <Wrench size={40} className="text-blue-400" />
                </div>

                <h1 className="text-5xl font-black text-neutral-100 mb-5">
                    Under Maintenance
                </h1>

                <p className="text-lg text-neutral-500 leading-relaxed">
                    Our community is currently undergoing scheduled maintenance.
                    Please check back again shortly.
                </p>

                <div className="mt-10 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 font-bold">
                    Estimated downtime: Unknown
                </div>


               
            </div>
        </section>
    );
}