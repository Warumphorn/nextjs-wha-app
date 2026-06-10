import { redirect } from "next/navigation"
import { connection } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { DashboardClient } from "./dashboard-client"

export default async function DashboardPage() {
  await connection()
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session || session.user.role !== "admin") {
    redirect("/login")
  }

  return <DashboardClient />
}
