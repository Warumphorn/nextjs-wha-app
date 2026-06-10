import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { CategoriesClient } from "./categories-client"

export default async function CategoriesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session || session.user.role !== "admin") {
    redirect("/login")
  }

  return <CategoriesClient />
}
