"use client"
import React, { useState } from "react"


const url = process.env.NEXT_PUBLIC_API_URL

interface DeleteEmployeeModalProps {
  employee: Employee
  token: string
  onClose: () => void
  onSuccess: () => void
}

export default function DeleteEmployeeModal({
  employee, token, onClose, onSuccess
}: DeleteEmployeeModalProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleDelete = async () => {
    setLoading(true)
    setMessage("")
    try {
      const res = await fetch(`${url}/employees/${employee.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || "Failed to delete employee")
      }
      setMessage("✅ Employee deleted")
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 800)
    } catch (err: any) {
      setMessage(`❌ ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
        <p className="mb-4">
          Are you sure you want to delete{" "}
          <strong>{employee.firstName} {employee.lastName}</strong>?
        </p>
        {message && <p className="mb-4">{message}</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50">
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}
