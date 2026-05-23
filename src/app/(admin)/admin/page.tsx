import React from "react"
import { DashboardStats } from "@/components/DashboardStats"

const Dashboard = () => {
  return (
    <main className="mx-10 w-full gap-2 my-10">
      <h2 className="text-3xl font-bold tracking-tight text-primary mb-6">
        Dashboard
      </h2>
      <DashboardStats />
    </main>
  )
}

export default Dashboard
