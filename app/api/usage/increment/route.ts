import { auth, clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

function monthKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  return `${y}-${m}`
}

export async function POST() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await clerkClient.users.getUser(userId)
    const md = (user.publicMetadata ?? {}) as Record<string, any>

    const keyNow = monthKey()
    const keyStored = (md.usageMonthKey as string) ?? keyNow

    let usage = Number(md.usageThisMonth ?? 0) || 0

    // Ay değiştiyse sıfırla
    if (keyStored !== keyNow) {
      usage = 0
      md.usageMonthKey = keyNow
    }

    const nextUsage = usage + 1

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...md,
        usageThisMonth: nextUsage,
        usageMonthKey: md.usageMonthKey ?? keyNow,
      },
    })

    return NextResponse.json({
      success: true,
      usageThisMonth: nextUsage,
      usageMonthKey: md.usageMonthKey ?? keyNow,
    })
  } catch (error) {
    console.error("usage increment error:", error)
    return NextResponse.json({ error: "Failed to update usage" }, { status: 500 })
  }
}