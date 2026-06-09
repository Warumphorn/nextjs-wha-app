"use client"

import { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { contactSchema, type ContactFormValues } from "@/lib/validations/contact"

export default function ContactForm() {
  const [isPending, startTransition] = useTransition()
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  function onSubmit(data: ContactFormValues) {
    startTransition(async () => {
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })

        const json = await res.json()

        if (!res.ok || !json.success) {
          toast.error(json.error ?? "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง")
          return
        }

        form.reset()
        setIsSuccess(true)
      } catch {
        toast.error("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง")
      }
    })
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold">ส่งข้อความสำเร็จ</h3>
        <p className="text-muted-foreground max-w-sm">
          ขอบคุณสำหรับข้อความของคุณ เราจะติดต่อกลับโดยเร็วที่สุด
        </p>
        <Button
          variant="outline"
          onClick={() => setIsSuccess(false)}
          className="mt-2"
        >
          ส่งข้อความอีกครั้ง
        </Button>
      </div>
    )
  }

  return (
    <form id="form-contact" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-contact-name">ชื่อ</FieldLabel>
              <Input
                {...field}
                id="form-contact-name"
                aria-invalid={fieldState.invalid}
                placeholder="กรอกชื่อของคุณ"
                disabled={isPending}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-contact-email">Email</FieldLabel>
              <Input
                {...field}
                id="form-contact-email"
                type="email"
                aria-invalid={fieldState.invalid}
                placeholder="example@email.com"
                disabled={isPending}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller
          name="message"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-contact-message">ข้อความ</FieldLabel>
              <Textarea
                {...field}
                id="form-contact-message"
                rows={5}
                aria-invalid={fieldState.invalid}
                placeholder="พิมพ์ข้อความที่ต้องการ..."
                disabled={isPending}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      </FieldGroup>
      <Button
        type="submit"
        form="form-contact"
        className="mt-6 w-full"
        disabled={isPending}
      >
        {isPending ? "กำลังส่ง..." : "ส่งข้อความ"}
      </Button>
    </form>
  )
}
