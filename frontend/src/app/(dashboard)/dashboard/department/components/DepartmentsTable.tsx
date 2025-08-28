"use client"
import React, { useEffect, useState } from "react"

import AddDepartmentModal from "./AddDepartmentModal"
import EditDepartmentModal from "./EditDepartmentModal"
import DeleteDepartmentModal from "./DeleteDepartmentModal"

const url = process.env.NEXT_PUBLIC_API_URL

export default function DepartmentsTable({ token }: { token: string }) {
  const [departments, setDepartments] = useState<Department[]>([])
  const [meta, setMeta] = useState<PaginationMetadata | null>(null)

  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<Department | null>(null)
  const [deleting, setDeleting] = useState<Department | null>(null)

  const [page, setPage] = useState(1)
  const [limit] = useState(5)

  // New states
  const [search, setSearch] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const fetchDepartments = async () => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search, 
      sortBy: "name", 
      order: sortOrder,
    })

    const res = await fetch(`${url}/departments?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data: PaginationResponse<Department> = await res.json()
    console.log(data);
    
    setDepartments(data.data)
    setMeta(data.meta)
  }

  useEffect(() => {
    fetchDepartments()
  }, [page, token, search, sortOrder])

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Departments</h2>
          <p className="text-sm text-gray-600 mt-1">Manage your organization's departments</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Department
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search departments..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1) // reset to page 1 when searching
            }}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-500"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("")
                setPage(1)
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors duration-200 select-none"
                onClick={() =>
                  setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                }
              >
                <div className="flex items-center space-x-2">
                  <span>Department Name</span>
                  <div className="flex flex-col">
                    <svg 
                      className={`w-3 h-3 ${sortOrder === "asc" ? "text-blue-600" : "text-gray-300"}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    <svg 
                      className={`w-3 h-3 -mt-1 ${sortOrder === "desc" ? "text-blue-600" : "text-gray-300"}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {departments.length > 0 ? (
              departments.map((dept, index) => (
                <tr key={dept.id} className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {dept.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditing(dept)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleting(dept)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
                    <p className="text-sm text-gray-500">
                      {search ? `No departments match "${search}"` : "Get started by adding your first department"}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.lastPage > 1 && (
        <div className="flex items-center justify-between mt-6 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center text-sm text-gray-700">
            <span>
              Showing <span className="font-medium">{((meta.page - 1) * limit) + 1}</span> to{" "}
              <span className="font-medium">{Math.min(meta.page * limit, meta.total)}</span> of{" "}
              <span className="font-medium">{meta.total}</span> results
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, meta.lastPage) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(meta.lastPage - 4, page - 2)) + i;
                if (pageNum > meta.lastPage) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md transition-colors duration-200 ${
                      page === pageNum
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              disabled={page === meta.lastPage}
              onClick={() => setPage((p) => p + 1)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Next
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {adding && (
        <AddDepartmentModal
          token={token}
          onClose={() => setAdding(false)}
          onSuccess={fetchDepartments}
        />
      )}
      {editing && (
        <EditDepartmentModal
          department={editing}
          token={token}
          onClose={() => setEditing(null)}
          onSuccess={fetchDepartments}
        />
      )}
      {deleting && (
        <DeleteDepartmentModal
          department={deleting}
          token={token}
          onClose={() => setDeleting(null)}
          onSuccess={fetchDepartments}
        />
      )}
    </div>
  )
}