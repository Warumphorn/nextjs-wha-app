import { NextRequest } from "next/server"
import { Resend } from "resend"
import { contactSchema } from "@/lib/validations/contact"
import type { ApiResponse } from "@/types/api"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = contactSchema.safeParse(body)

    if (!result.success) {
      return Response.json(
        { success: false, error: result.error.issues[0].message } satisfies ApiResponse<never>,
        { status: 400 }
      )
    }

    const { name, email, message } = result.data

    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: `Contact Form <${process.env.CONTACT_SENDER_EMAIL ?? email}>`,
      to: process.env.CONTACT_RECEIVER_EMAIL!,
      subject: `ข้อความติดต่อจาก ${name}`,
      replyTo: email,
      html: `
        <h2>ข้อความติดต่อจาก Contact Form</h2>
        <p><strong>ชื่อ:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>ข้อความ:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    })

    return Response.json(
      { success: true, data: null } satisfies ApiResponse<null>,
      { status: 200 }
    )
  } catch {
    return Response.json(
      { success: false, error: "ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง" } satisfies ApiResponse<never>,
      { status: 500 }
    )
  }
}
