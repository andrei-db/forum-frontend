import { useAuth } from "../context/AuthContext"
import { useState } from "react";
import { api } from "../api/client";
export default function AccountDetails() {
    const { user, refreshUser } = useAuth();

    const [file, setFile] = useState(null);

    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("image", file);

            await api("/me/profile-picture", {
                method: "POST",
                body: formData,
            });

            await refreshUser();
        } catch (err) {
            console.error("Upload failed", err);
        } finally {
            setUploading(false);
        }
    };


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
                    <div className="w-50 flex flex-col">
                        <img className="h-50 rounded opacity-90"
                            src={user?.profilePicture || "/default-avatar.png"} />
                        <form className="flex mt-3 justify-start" onSubmit={handleSubmit}>
                            <label for="selectImage" className="py-1 px-2 bg-neutral-500 me-3 rounded-sm text-sm">Choose</label>
                            <input hidden id="selectImage" type="file" onChange={(e) => setFile(e.target.files[0])} />
                            <button className="py-1 px-2 bg-blue-500 rounded-sm text-sm"
                             type="submit" disabled={uploading}>{uploading ? "Uploading..." : "Upload"}</button>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    )
}