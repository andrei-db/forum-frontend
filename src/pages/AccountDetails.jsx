import { useAuth } from "../context/AuthContext"
export default function AccountDetails() {
    const {user}=useAuth();
    return (
        
        <div className="text-neutral-300 gap-5">
            
            <div className="grid grid-cols-3 gap-10 py-4">
                <div className="flex justify-end items-start">
                    <label className="text-neutral-400">Username:</label>
                </div>
                <div className="col-span-2 rounded-md bg-neutral-900">
                    <p className="font-semibold">{user?.username}</p>
                    <p className="text-sm italic text-neutral-500">You cant change username</p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-10 py-4">
                <div className="flex justify-end items-start">
                     <label className="text-neutral-400">Email:</label>
                </div>
                <div className="col-span-2 rounded-md bg-neutral-900">
                    <p className="font-semibold">{user?.email}</p>
                    
                </div>
            </div>
            
            <div className="grid grid-cols-3 gap-10 py-4">
                <div className="flex justify-end items-start">
                     <label className="text-neutral-400">Profile picture:</label>
                </div>
                <div className="col-span-2 rounded-md bg-neutral-900">
                    <div className="w-50 h-50 bg-neutral-800 rounded">

                    </div>
                </div>
            </div>
           
        </div>
    )
}