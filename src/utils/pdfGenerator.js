// PDF Generation Utility using jsPDF
import jsPDF from 'jspdf'
import 'jspdf-autotable'

/**
 * Generate a comprehensive financial report PDF
 * @param {Object} options - Report generation options
 * @param {Array} options.transactions - Transaction data
 * @param {Object} options.summary - Summary statistics
 * @param {String} options.period - Time period for the report
 * @param {Object} options.dateRange - Date range object {start, end}
 * @param {Object} options.user - User information
 */
export function generateTransactionReportPDF(options) {
  const {
    transactions = [],
    summary = {},
    period = 'All Time',
    dateRange = null,
    user = null
  } = options

  // Create new PDF document
  const doc = new jsPDF()

  // Set document properties
  doc.setProperties({
    title: 'Financial Transaction Report',
    subject: 'Transaction Report',
    author: user?.email || 'FinanceTracker',
    keywords: 'finance, transactions, report',
    creator: 'FinanceTracker'
  })

  // Page dimensions
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15

  // Colors
  const primaryColor = [16, 185, 129] // Emerald-500
  const darkGray = [71, 85, 105] // Slate-600
  const lightGray = [226, 232, 240] // Slate-200

  let currentY = margin

  // ===== HEADER =====
  // Logo/Title
  doc.setFillColor(...primaryColor)
  doc.rect(margin, currentY, 8, 8, 'F')
  doc.setFontSize(24)
  doc.setTextColor(...darkGray)
  doc.setFont('helvetica', 'bold')
  doc.text('FinanceTracker', margin + 12, currentY + 6)

  // Report Title
  currentY += 15
  doc.setFontSize(18)
  doc.text('Transaction Report', margin, currentY)

  // Date Range
  currentY += 8
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)

  if (dateRange && dateRange.start && dateRange.end) {
    doc.text(`Period: ${dateRange.start} to ${dateRange.end}`, margin, currentY)
  } else {
    doc.text(`Period: ${period}`, margin, currentY)
  }

  // Generation Date
  const now = new Date()
  const generatedDate = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  doc.text(`Generated: ${generatedDate}`, pageWidth - margin - 60, currentY)

  // Divider Line
  currentY += 5
  doc.setDrawColor(...lightGray)
  doc.line(margin, currentY, pageWidth - margin, currentY)
  currentY += 10

  // ===== SUMMARY SECTION =====
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...darkGray)
  doc.text('Summary', margin, currentY)
  currentY += 8

  // Summary boxes
  const boxWidth = (pageWidth - 2 * margin - 20) / 3
  const boxHeight = 25
  const boxY = currentY

  // Income Box
  doc.setFillColor(220, 252, 231) // Green-100
  doc.roundedRect(margin, boxY, boxWidth, boxHeight, 3, 3, 'F')
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text('Total Income', margin + 5, boxY + 8)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(34, 197, 94) // Green-500
  doc.text(`$${formatNumber(summary.totalIncome || 0)}`, margin + 5, boxY + 18)

  // Expense Box
  doc.setFillColor(254, 226, 226) // Red-100
  doc.roundedRect(margin + boxWidth + 10, boxY, boxWidth, boxHeight, 3, 3, 'F')
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text('Total Expenses', margin + boxWidth + 15, boxY + 8)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(239, 68, 68) // Red-500
  doc.text(`$${formatNumber(summary.totalExpense || 0)}`, margin + boxWidth + 15, boxY + 18)

  // Net Box
  const netAmount = (summary.totalIncome || 0) - (summary.totalExpense || 0)
  const netColor = netAmount >= 0 ? [34, 197, 94] : [239, 68, 68]
  const netBgColor = netAmount >= 0 ? [220, 252, 231] : [254, 226, 226]

  doc.setFillColor(...netBgColor)
  doc.roundedRect(margin + 2 * boxWidth + 20, boxY, boxWidth, boxHeight, 3, 3, 'F')
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text('Net Amount', margin + 2 * boxWidth + 25, boxY + 8)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...netColor)
  doc.text(`$${formatNumber(Math.abs(netAmount))}`, margin + 2 * boxWidth + 25, boxY + 18)

  currentY = boxY + boxHeight + 15

  // ===== TRANSACTIONS TABLE =====
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...darkGray)
  doc.text('Transaction Details', margin, currentY)
  currentY += 5

  // Prepare table data
  const tableData = transactions.map(t => [
    formatDate(t.date),
    t.description || '-',
    t.category?.name || t.category || 'Uncategorized',
    capitalizeFirst(t.type),
    `$${formatNumber(t.amount)}`
  ])

  // Generate table
  doc.autoTable({
    startY: currentY,
    head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 9,
      textColor: darkGray
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251] // Gray-50
    },
    columnStyles: {
      0: { cellWidth: 25 },  // Date
      1: { cellWidth: 'auto' }, // Description
      2: { cellWidth: 35 },  // Category
      3: { cellWidth: 25 },  // Type
      4: { cellWidth: 30, halign: 'right' }  // Amount
    },
    margin: { left: margin, right: margin },
    didDrawPage: function(data) {
      // Add page footer
      addFooter(doc, pageWidth, pageHeight, margin)
    }
  })

  // ===== CATEGORY BREAKDOWN (if space available) =====
  const finalY = doc.lastAutoTable.finalY

  if (finalY < pageHeight - 80) {
    currentY = finalY + 15

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...darkGray)
    doc.text('Top Categories', margin, currentY)
    currentY += 8

    // Calculate category totals
    const categoryTotals = {}
    transactions.forEach(t => {
      const cat = t.category?.name || t.category || 'Uncategorized'
      if (!categoryTotals[cat]) {
        categoryTotals[cat] = { income: 0, expense: 0 }
      }
      if (t.type === 'income') {
        categoryTotals[cat].income += t.amount
      } else {
        categoryTotals[cat].expense += t.amount
      }
    })

    // Sort by total amount
    const sortedCategories = Object.entries(categoryTotals)
      .map(([name, amounts]) => ({
        name,
        total: amounts.income + amounts.expense,
        income: amounts.income,
        expense: amounts.expense
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5) // Top 5

    const categoryTableData = sortedCategories.map(cat => [
      cat.name,
      `$${formatNumber(cat.income)}`,
      `$${formatNumber(cat.expense)}`,
      `$${formatNumber(cat.total)}`
    ])

    doc.autoTable({
      startY: currentY,
      head: [['Category', 'Income', 'Expenses', 'Total']],
      body: categoryTableData,
      theme: 'striped',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10
      },
      bodyStyles: {
        fontSize: 9,
        textColor: darkGray
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 40, halign: 'right' },
        2: { cellWidth: 40, halign: 'right' },
        3: { cellWidth: 40, halign: 'right', fontStyle: 'bold' }
      },
      margin: { left: margin, right: margin },
      didDrawPage: function(data) {
        addFooter(doc, pageWidth, pageHeight, margin)
      }
    })
  }

  // Save the PDF
  const filename = `FinanceTracker_Report_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(filename)

  return { success: true, filename }
}

/**
 * Add footer to each page
 */
function addFooter(doc, pageWidth, pageHeight, margin) {
  const pageNum = doc.internal.getNumberOfPages()
  const currentPage = doc.internal.getCurrentPageInfo().pageNumber

  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.setFont('helvetica', 'normal')

  // Page number
  doc.text(
    `Page ${currentPage} of ${pageNum}`,
    pageWidth / 2,
    pageHeight - margin / 2,
    { align: 'center' }
  )

  // App name
  doc.text(
    'Generated by FinanceTracker',
    pageWidth - margin,
    pageHeight - margin / 2,
    { align: 'right' }
  )
}

/**
 * Format number with commas
 */
function formatNumber(num) {
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

/**
 * Format date to readable string
 */
function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Capitalize first letter
 */
function capitalizeFirst(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}
