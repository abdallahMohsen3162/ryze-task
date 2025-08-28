"use client"
import React, { useState } from "react"

const url = process.env.NEXT_PUBLIC_API_URL

export default function AddDepartmentModal({
  token, onClose, onSuccess
}: { token: string; onClose: () => void; onSuccess: () => void }) {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    try {
      const res = await fetch(`${url}/departments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) throw new Error("Failed to add department")
      setMessage("✅ Department added")
      setTimeout(() => { onSuccess(); onClose() }, 800)
    } catch (err: any) {
      setMessage(`❌ ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Add Department</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="border p-2 rounded w-full" placeholder="Name"
            value={name} onChange={(e) => setName(e.target.value)} required />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
