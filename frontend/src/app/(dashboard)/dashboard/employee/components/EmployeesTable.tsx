"use client"
import React, { useEffect, useState, useCallback } from "react"
import EditEmployeeModal from "./EditEmployeeModal";
import AddEmployeeModal from './AddEmployee';
import DeleteEmployeeModal from "./DeleteEmployeeModal";

const url = process.env.NEXT_PUBLIC_API_URL

// Mock data for demonstration
const mockEmployees = [
  { id: 1, firstName: "Ahmed", lastName: "Mohamed", email: "ahmed.mohamed@company.com", hireDate: "2024-01-15", department: { name: "Engineering" } },
  { id: 2, firstName: "Sara", lastName: "Ali", email: "sara.ali@company.com", hireDate: "2024-02-20", department: { name: "Marketing" } },
  { id: 3, firstName: "Omar", lastName: "Hassan", email: "omar.hassan@company.com", hireDate: "2024-03-10", department: { name: "Sales" } },
  { id: 4, firstName: "Layla", lastName: "Mahmoud", email: "layla.mahmoud@company.com", hireDate: "2024-04-05", department: { name: "HR" } },
  { id: 5, firstName: "Khaled", lastName: "Ibrahim", email: "khaled.ibrahim@company.com", hireDate: "2024-05-12", department: { name: "Finance" } }
];

const mockMeta = { total: 5, lastPage: 1, currentPage: 1, perPage: 5 };

export default function EmployeesTable({ token }) {
  const [employees, setEmployees] = useState(mockEmployees)
  const [departments, setDepartments] = useState([])
  const [meta, setMeta] = useState(mockMeta)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Modal states
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [deletingEmployee, setDeletingEmployee] = useState(null)
  const [adding, setAdding] = useState(false)

  // Pagination and filtering states
  const [page, setPage] = useState(1)
  const [limit] = useState(5)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [sortBy, setSortBy] = useState("firstName")
  const [sortOrder, setSortOrder] = useState("ASC")

  const fetchEmployees = useCallback(async () => {
    if (!token) return
    
    setLoading(true)
    setError(null)
    
    try {
      const queryParams = new URLSearchParams({
        search: search.trim(),
        sortBy: sortBy,
        sortOrder,
        page: page.toString(),
        limit: limit.toString(),
      })
      
      const res = await fetch(`${url}/employees?${queryParams}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })
      
      if (!res.ok) {
        throw new Error(`Failed to fetch employees: ${res.status} ${res.statusText}`)
      }
      
      const data = await res.json()
      setEmployees(data.data || [])
      setMeta(data.meta)
    } catch (err) {
      console.error('Error fetching employees:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch employees')
      setEmployees([])
      setMeta(null)
    } finally {
      setLoading(false)
    }
  }, [search, sortBy, sortOrder, page, limit, token])

  const fetchDepartments = useCallback(async () => {
    if (!token) return
    
    try {
      const res = await fetch(`${url}/departments?limit=10000`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })
      
      if (!res.ok) {
        throw new Error(`Failed to fetch departments: ${res.status}`)
      }
      
      const data = await res.json()
      setDepartments(data.data || [])
    } catch (err) {
      console.error('Error fetching departments:', err)
    }
  }, [token])

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchInput])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  useEffect(() => {
    fetchDepartments()
  }, [fetchDepartments])

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC")
    } else {
      setSortBy(column)
      setSortOrder("ASC")
    }
    setPage(1)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && meta && newPage <= meta.lastPage) {
      setPage(newPage)
    }
  }

  const handleRefresh = () => {
    fetchEmployees()
    setPage(1)
  }

  const getSortIcon = (column) => {
    if (sortBy !== column) return (
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    )
    return sortOrder === "ASC" ? (
      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    )
  }

  const renderPagination = () => {
    if (!meta || meta.lastPage <= 1) return null

    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(meta.lastPage, startPage + maxVisiblePages - 1)
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 font-medium transition-colors"
      >
        Previous
      </button>
    )

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-4 py-2 bg-white border-t border-b border-gray-200 hover:bg-gray-50 text-gray-700 font-medium transition-colors"
        >
          1
        </button>
      )
      if (startPage > 2) {
        pages.push(<span key="ellipsis1" className="px-3 py-2 bg-white border-t border-b border-gray-200 text-gray-500">...</span>)
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 border-t border-b border-gray-200 font-medium transition-colors ${
            i === page 
              ? 'bg-blue-500 text-white border-blue-500' 
              : 'bg-white hover:bg-gray-50 text-gray-700'
          }`}
        >
          {i}
        </button>
      )
    }

    if (endPage < meta.lastPage) {
      if (endPage < meta.lastPage - 1) {
        pages.push(<span key="ellipsis2" className="px-3 py-2 bg-white border-t border-b border-gray-200 text-gray-500">...</span>)
      }
      pages.push(
        <button
          key={meta.lastPage}
          onClick={() => handlePageChange(meta.lastPage)}
          className="px-4 py-2 bg-white border-t border-b border-gray-200 hover:bg-gray-50 text-gray-700 font-medium transition-colors"
        >
          {meta.lastPage}
        </button>
      )
    }

    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(page + 1)}
        disabled={page === meta.lastPage}
        className="px-4 py-2 bg-white border border-gray-200 rounded-r-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 font-medium transition-colors"
      >
        Next
      </button>
    )

    return (
      <div className="flex items-center justify-between mt-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-sm text-gray-600 font-medium">
          Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, meta.total)} of {meta.total} employees
        </div>
        <div className="flex">
          {pages}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="">
              <h2 className="text-2xl font-bold text-gray-800 ">Employee Management</h2>
              <p className="text-gray-600">Manage your team members</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            {/* <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-500 text-white rounded-2xl hover:bg-gray-600 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{loading ? "Refreshing..." : "Refresh"}</span>
            </button> */}
            <button
              onClick={() => setAdding(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Employee</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search employees by name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/60 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              />
            </div>
            {search && (
              <button
                onClick={() => {
                  setSearchInput("")
                  setSearch("")
                }}
                className="px-4 py-3 text-gray-500 hover:text-gray-700 bg-white/60 rounded-2xl border border-gray-200 hover:bg-white/80 transition-all duration-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50/80 backdrop-blur border border-red-200 text-red-700 px-6 py-4 rounded-2xl shadow-lg animate-pulse">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.958-.833-2.728 0L5.186 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading employees...</p>
          </div>
        )}

        {/* Table */}
        {!loading && (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th 
                      className="px-6 py-4 text-left cursor-pointer hover:bg-gray-200 transition-colors group"
                      onClick={() => handleSort("firstName")}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-700 group-hover:text-gray-900">Name</span>
                        {getSortIcon("firstName")}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left cursor-pointer hover:bg-gray-200 transition-colors group"
                      onClick={() => handleSort("email")}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-700 group-hover:text-gray-900">Email</span>
                        {getSortIcon("email")}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <span className="font-semibold text-gray-700">Department</span>
                    </th>
                    <th 
                      className="px-6 py-4 text-left cursor-pointer hover:bg-gray-200 transition-colors group"
                      onClick={() => handleSort("hireDate")}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-700 group-hover:text-gray-900">Hire Date</span>
                        {getSortIcon("hireDate")}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <span className="font-semibold text-gray-700">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {employees.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center space-y-3">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <p className="text-gray-500 font-medium">
                            {search ? "No employees found matching your search." : "No employees found."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    employees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-white/60 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                            </div>
                            <div className="font-semibold text-gray-800">
                              {emp.firstName} {emp.lastName}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{emp.email}</td>
                        <td className="px-6 py-4">
                          {emp.department?.name ? (
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                              {emp.department.name}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">No department</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {emp.hireDate 
                            ? new Date(emp.hireDate).toLocaleDateString()
                            : <span className="text-gray-400 italic">N/A</span>
                          }
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingEmployee(emp)}
                              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setDeletingEmployee(emp)}
                              className="px-4 py-2 bg-red-500 text-white text-sm rounded-xl hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && renderPagination()}

        {/* Mock Modals (since we don't have the actual modal components) */}
        {adding && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <AddEmployeeModal 
              onClose={() => setAdding(false)}
              onSuccess={() => {
                handleRefresh();setAdding(false)
              }}
              token={token}

            />
          </div>
        )}
        
        {editingEmployee && (
          <EditEmployeeModal 
            departments={departments}
            employee={editingEmployee}
            token={token}
            onClose={() => setEditingEmployee(null)}
            onSuccess={() => {
              handleRefresh();setEditingEmployee(null)
            }}
          
          />
        )}
        
        {deletingEmployee && (
          <DeleteEmployeeModal 
            employee={deletingEmployee}
            token={token}
            onClose={() => setDeletingEmployee(null)}
            onSuccess={() => {
              handleRefresh();setDeletingEmployee(null)
            }}
          />
        )}
      </div>
    </div>
  )
}