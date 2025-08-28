import { cookies } from "next/headers"
import DepartmentsTable from "./components/DepartmentsTable"


export default async function DepartmentsPage() {
  const cookieStore = await cookies()
  const access_token = cookieStore.get("access_token")?.value

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <DepartmentsTable token={access_token ?? ""} />
      </div>
    </div>
  )
}
