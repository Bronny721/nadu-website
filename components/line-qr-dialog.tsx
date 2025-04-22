"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface LineQRDialogProps {
  title: string
  description?: string
  imageSrc: string
  password?: string
  lineUrl?: string
}

export function LineQRDialog({ title, description, imageSrc, password, lineUrl }: LineQRDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenLine = () => {
    if (lineUrl) {
      window.open(lineUrl, "_blank")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="p-0 h-auto font-normal text-foreground hover:text-primary">
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4">
          <img
            src={imageSrc || "/placeholder.svg"}
            alt={`${title} QR Code`}
            className="w-48 h-48 mx-auto cursor-pointer"
            onClick={handleOpenLine}
          />
          {password && (
            <p className="mt-4 text-center">
              密碼: <span className="font-bold">{password}</span>
            </p>
          )}
          {lineUrl && (
            <Button className="mt-4" onClick={handleOpenLine}>
              以 LINE 開啟
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
