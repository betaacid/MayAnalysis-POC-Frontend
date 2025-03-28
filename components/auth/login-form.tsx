"use client";

import { useState } from "react";

export function LoginForm() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedPassword = password.trim();

        console.log(`Attempting login with password: ${trimmedPassword}`);

        if (trimmedPassword === "maypass") {
            console.log("Password correct, authenticating...");
            // Set auth in localStorage
            localStorage.setItem("isAuthenticated", "true");
            // Force a hard navigation to the home page
            window.location.href = "/";
        } else {
            console.log("Password incorrect");
            setError("Incorrect password");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">Login Required</h2>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="password" className="sr-only">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter password"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 