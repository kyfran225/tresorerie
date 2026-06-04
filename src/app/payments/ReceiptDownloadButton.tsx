"use client"

import { generateReceiptPDF } from "@/lib/pdf"
import { FileDown } from "lucide-react"

interface ReceiptDownloadButtonProps {
  payment: any
}

export default function ReceiptDownloadButton({ payment }: ReceiptDownloadButtonProps) {
  const handleDownload = () => {
    generateReceiptPDF({
      receiptNumber: payment.receiptNumber,
      date: payment.date,
      memberFullName: payment.member.fullName,
      memberPhone: payment.member.phone,
      contributionTitle: payment.contribution.title,
      amount: payment.amount,
      method: payment.method,
      recordedBy: payment.recordedBy.name
    })
  }

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
      title="Télécharger le reçu"
    >
      <FileDown className="h-4 w-4" />
      <span className="hidden sm:inline">Reçu</span>
    </button>
  )
}
