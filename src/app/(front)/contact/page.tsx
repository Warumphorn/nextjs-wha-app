import type { Metadata } from "next"
import ContactForm from "./contact-form"

export const metadata: Metadata = {
  title: "ติดต่อเรา",
  description: "ส่งข้อความติดต่อสอบถามกับทีมงานของเรา",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 md:py-20">
      <div className="mb-10 space-y-2 text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          ติดต่อเรา
        </h1>
        <p className="text-muted-foreground">
          กรุณากรอกข้อมูลด้านล่างเพื่อส่งข้อความติดต่อเรา
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_1.6fr] md:gap-12">
        <ContactInfo />
        <ContactForm />
      </div>
    </div>
  )
}

function ContactInfo() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <div>
            <p className="font-medium">Email</p>
            <p className="text-sm text-muted-foreground">support@nextgent.com</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
          <div>
            <p className="font-medium">โทรศัพท์</p>
            <p className="text-sm text-muted-foreground">02-123-4567</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <p className="font-medium">เวลาทำการ</p>
            <p className="text-sm text-muted-foreground">
              จันทร์ - ศุกร์: 09:00 - 18:00 น.
            </p>
          </div>
        </div>
      </div>

      <Separator />

      <p className="text-sm leading-relaxed text-muted-foreground">
        ทีมงานของเราพร้อมให้บริการและตอบทุกข้อสงสัยของคุณ
        เราจะตอบกลับภายใน 24 ชั่วโมงในวันและเวลาทำการ
      </p>
    </div>
  )
}

function Separator() {
  return <div className="h-px w-full bg-border" />
}
