import jsPDF from "jspdf"
import "jspdf-autotable"

interface ReceiptData {
  receiptNumber: string
  date: string
  memberName: string
  contributionTitle: string
  amount: number
  method: string
  recordedBy: string
}

export function generateReceiptPDF(data: ReceiptData) {
  const doc = new jsPDF()

  // Header
  doc.setFontSize(22)
  doc.setTextColor(37, 99, 235) // Blue-600
  doc.text("ASSOCIATION GESTION", 105, 20, { align: "center" })

  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text("Reçu Officiel de Paiement", 105, 28, { align: "center" })

  // Receipt Info Box
  doc.setDrawColor(200)
  doc.rect(140, 40, 60, 20)
  doc.setFontSize(9)
  doc.text(`N°: ${data.receiptNumber}`, 145, 48)
  doc.text(`Date: ${data.date}`, 145, 54)

  // Content
  doc.setFontSize(12)
  doc.setTextColor(0)
  doc.text("Détails du Membre", 20, 70)
  doc.line(20, 72, 60, 72)

  doc.setFontSize(10)
  doc.text(`Nom: ${data.memberName}`, 20, 80)

  doc.setFontSize(12)
  doc.text("Détails du Paiement", 20, 100)
  doc.line(20, 102, 65, 102)

  const tableData = [
    ["Désignation", data.contributionTitle],
    ["Montant", `${data.amount.toLocaleString('fr-FR')} CFA`],
    ["Mode de paiement", data.method],
    ["Enregistré par", data.recordedBy],
  ]

  // @ts-ignore
  doc.autoTable({
    startY: 110,
    head: [['Champ', 'Valeur']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235] },
  })

  // Footer / Signature Area
  const finalY = (doc as any).lastAutoTable.finalY + 30
  doc.text("Le Trésorier (Signature & Cachet)", 140, finalY)

  doc.setFontSize(8)
  doc.setTextColor(150)
  doc.text("Merci pour votre contribution.", 105, 280, { align: "center" })

  // Save/Download
  doc.save(`${data.receiptNumber}.pdf`)
}
