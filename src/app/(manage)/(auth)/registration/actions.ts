"use server"

import { randomBytes, scryptSync } from "node:crypto"

import { db } from "@/server/db"
import { registrationSchema } from "./schema"

type RegistrationState = {
  success: boolean
  message: string
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex")
  const hash = scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${hash}`
}

export async function registerUser(
  values: unknown
): Promise<RegistrationState> {
  const parsed = registrationSchema.safeParse(values)

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the form errors and try again.",
    }
  }

  const email = parsed.data.email.toLowerCase().trim()
  const existingUser = await db.user.findUnique({
    where: { email },
    select: { id: true },
  })

  if (existingUser) {
    return {
      success: false,
      message: "Email is already registered.",
    }
  }

  const passwordHash = hashPassword(parsed.data.password)

  await db.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: parsed.data.name.trim(),
        email,
        password: passwordHash,
      },
      select: { id: true },
    })

    await tx.account.create({
      data: {
        userId: user.id,
        type: "credentials",
        provider: "credentials",
        providerAccountId: user.id,
      },
    })
  })

  return {
    success: true,
    message: "Registration successful. You can now sign in.",
  }
}
