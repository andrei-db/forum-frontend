import { useState } from "react";
import { api } from "../api/client";
export default function Security() {
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setError("");
        setSuccess("");
        if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
            return setError("All fields are required.");
        }
        if (form.newPassword !== form.confirmPassword) {
            return setError("New password and confirmation do not match.");
        }
        try {
            await api("/auth/change-password", {
                method: "POST",
                body: JSON.stringify({
                    currentPassword: form.currentPassword,
                    newPassword: form.newPassword,
                }),
            });

            setSuccess("Password updated successfully ✅");
            setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            setError(err.message || "Something went wrong.");
        }
    };
    return (

        <div className="text-neutral-300 gap-5">
            <form
                onSubmit={handleSubmit}
            >
                <div className="grid grid-cols-3 gap-10 my-4 items-center">
                    <div className="flex justify-end items-start">
                        <label className="text-neutral-400">Your existing password:</label>
                    </div>
                    <div className="col-span-2 rounded-md bg-neutral-900">
                        <input type="password"
                            name="currentPassword"
                            value={form.currentPassword}
                            onChange={handleChange}
                            className="font-semibold bg-neutral-800 w-full rounded p-2"
                            placeholder="" />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-10 py-4 items-center">
                    <div className="flex justify-end items-start">
                        <label className="text-neutral-400">New password:</label>
                    </div>
                    <div className="col-span-2 rounded-md bg-neutral-900">
                        <input type="password"
                            name="newPassword"
                            value={form.newPassword}
                            onChange={handleChange}
                            className="font-semibold bg-neutral-800 w-full rounded p-2" placeholder="" />

                    </div>
                </div>
                <div className="grid grid-cols-3 gap-10 my-4 items-center">
                    <div className="flex justify-end items-start">
                        <label className="text-neutral-400">Confirm new password:</label>
                    </div>
                    <div className="col-span-2 rounded-md bg-neutral-900">
                        <input type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className="font-semibold bg-neutral-800 w-full rounded p-2" placeholder="" />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-10 my-4 items-center">
                    <div className="flex justify-end items-start">

                    </div>
                    <div className="col-span-2 rounded-md bg-neutral-900 flex justify-end">
                        <button className="bg-blue-500 py-2 px-4 rounded hover:bg-blue-600" type="submit">Save</button>
                    </div>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">{success}</p>}
            </form>
        </div>
    )
}