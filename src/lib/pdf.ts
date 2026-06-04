import jsPDF from "jspdf"
import "jspdf-autotable"
import { formatCurrency } from "./utils"

interface ReceiptData {
  receiptNumber: string
  date: string
  memberFullName: string
  memberPhone: string
  contributionTitle: string
  amount: number
  method: string
  recordedBy: string
}

export function generateReceiptPDF(data: ReceiptData) {
  const doc = new jsPDF()

  // Colors
  const primaryColor = [37, 99, 235] // blue-600

  // Header
  doc.setFontSize(22)
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.text("REÇU DE PAIEMENT", 105, 20, { align: "center" })

  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text("ASSOCIATION DES MEMBRES", 105, 30, { align: "center" })

  // Divider
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.setLineWidth(0.5)
  doc.line(20, 35, 190, 35)

  // Receipt Info
  doc.setFontSize(12)
  doc.setTextColor(0)
  doc.text(`Reçu N°: ${data.receiptNumber}`, 20, 50)
  doc.text(`Date: ${new Date(data.date).toLocaleDateString('fr-FR')}`, 190, 50, { align: "right" })

  // Member Info Section
  doc.setFillColor(243, 244, 246)
  doc.rect(20, 60, 170, 30, "F")
  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text("BÉNÉFICIAIRE", 25, 67)
  doc.setFontSize(12)
  doc.setTextColor(0)
  doc.text(data.memberFullName, 25, 75)
  doc.setFontSize(10)
  doc.text(`Tél: ${data.memberPhone}`, 25, 82)

  // Payment Details Table
  ;(doc as any).autoTable({
    startY: 100,
    head: [["Description", "Méthode", "Montant"]],
    body: [
      [data.contributionTitle, data.method, formatCurrency(data.amount)]
    ],
    headStyles: { fillColor: primaryColor },
    styles: { fontSize: 11, cellPadding: 5 },
    columnStyles: {
      2: { halign: 'right' }
    }
  })

  const finalY = (doc as any).lastAutoTable.finalY + 20

  // Total Section
  doc.setFontSize(14)
  doc.text("TOTAL PAYÉ:", 130, finalY)
  doc.setFontSize(16)
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.text(formatCurrency(data.amount), 190, finalY, { align: "right" })

  // Signature Section
  doc.setTextColor(0)
  doc.setFontSize(10)
  doc.text("Le Trésorier,", 20, finalY + 30)
  doc.text(data.recordedBy, 20, finalY + 40)

  doc.text("Signature du Membre,", 140, finalY + 30)

  // Footer
  doc.setFontSize(8)
  doc.setTextColor(150)
  doc.text("Ceci est un document officiel généré par le système de gestion de la trésorerie.", 105, 285, { align: "center" })

  doc.save(`Reçu_${data.receiptNumber}.pdf`)
}
