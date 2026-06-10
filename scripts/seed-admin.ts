import "dotenv/config"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { PrismaClient } from "../generated/prisma/client"
import { hashPassword } from "@better-auth/utils/password"

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!)
const prisma = new PrismaClient({ adapter })

const TARGET_EMAIL = "moofah.warumphorn@gmail.com"
const PASSWORD = "admin123456"

async function main() {
  // Hash with better-auth's scrypt
  const hashed = await hashPassword(PASSWORD)
  console.log("Hash:", hashed.substring(0, 20), "...")

  // Delete existing account + user for this email
  const existingUser = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
    `SELECT id FROM \`user\` WHERE email = ?`,
    TARGET_EMAIL
  )

  if (existingUser.length > 0) {
    const uid = existingUser[0].id
    await prisma.$executeRawUnsafe(`DELETE FROM \`account\` WHERE userId = ?`, uid)
    await prisma.$executeRawUnsafe(`DELETE FROM \`session\` WHERE userId = ?`, uid)
    await prisma.$executeRawUnsafe(`DELETE FROM \`user\` WHERE id = ?`, uid)
    console.log("✓ Removed existing user")
  }

  // Create fresh user
  const { randomUUID } = await import("node:crypto")
  const userId = randomUUID()

  await prisma.$executeRawUnsafe(
    `INSERT INTO \`user\` (id, name, email, emailVerified, image, role, createdAt, updatedAt)
     VALUES (?, ?, ?, true, NULL, 'admin', NOW(), NOW())`,
    userId, "Admin", TARGET_EMAIL
  )

  // Create account with scrypt hash
  await prisma.$executeRawUnsafe(
    `INSERT INTO \`account\` (id, accountId, providerId, userId, password, createdAt, updatedAt)
     VALUES (?, ?, 'credential', ?, ?, NOW(), NOW())`,
    randomUUID(), userId, userId, hashed
  )

  console.log(`✓ Created admin user: ${TARGET_EMAIL} / ${PASSWORD}`)

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error("Error:", e)
  process.exit(1)
})
