import { auth, clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await clerkClient.users.getUser(userId)

    const currentUsage =
      (user.publicMetadata?.usageThisMonth as number) || 0

    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        usageThisMonth: currentUsage + 1,
      },
    })

    return NextResponse.json({
      success: true,
      usageThisMonth: currentUsage + 1,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to update usage" },
      { status: 500 }
    )
  }
}