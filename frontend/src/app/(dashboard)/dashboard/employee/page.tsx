import { cookies } from 'next/headers';
import React from 'react'
import EmployeesTable from './components/EmployeesTable';
import AddEmployeeModal from './components/AddEmployee';

const url = process.env.NEXT_PUBLIC_API_URL
export default async function page() {
  const cookiesStore = await cookies();
  const access_token = cookiesStore.get("access_token")?.value;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          {/* <AddEmployeeModal
            token={access_token ?? ""} 
          /> */}
        </div>
        <EmployeesTable token={access_token ?? ""} />
      </div>
    </div>
  )
}