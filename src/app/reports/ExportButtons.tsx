"use client"

import * as XLSX from "xlsx"
import { Download, FileSpreadsheet, FileText } from "lucide-react"

interface ExportButtonsProps {
  data: any[]
}

export default function ExportButtons({ data }: ExportButtonsProps) {

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Paiements")
    XLSX.writeFile(workbook, `Rapport_Tresorerie_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const exportToCSV = () => {
    if (data.length === 0) return
    const headers = Object.keys(data[0]).join(",")
    const rows = data.map(obj => Object.values(obj).join(",")).join("\n")
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `Export_Tresorerie_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={exportToExcel}
        disabled={data.length === 0}
        className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Excel
      </button>
      <button
        onClick={exportToCSV}
        disabled={data.length === 0}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
      >
        <FileText className="h-4 w-4" />
        CSV
      </button>
    </div>
  )
}
