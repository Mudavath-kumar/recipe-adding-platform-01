import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams?: Record<string, string | undefined>
}

export function Pagination({ currentPage, totalPages, baseUrl, searchParams = {} }: PaginationProps) {
  // Create URL with current search params plus page
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams()

    // Add all current search params
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== "page") {
        params.set(key, value)
      }
    })

    // Add the page parameter
    params.set("page", page.toString())

    return `${baseUrl}?${params.toString()}`
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = []

    // Always show first page
    pageNumbers.push(1)

    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - 1)
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1)

    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      pageNumbers.push("ellipsis1")
    }

    // Add pages in range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pageNumbers.push(i)
    }

    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pageNumbers.push("ellipsis2")
    }

    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex justify-center items-center gap-1">
      {/* Previous button */}
      {currentPage > 1 && (
        <Button asChild variant="outline" size="icon" className="h-9 w-9 border-gray-200">
          <Link href={createPageUrl(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Link>
        </Button>
      )}

      {/* Page numbers */}
      {pageNumbers.map((page, index) => {
        if (page === "ellipsis1" || page === "ellipsis2") {
          return (
            <span key={page} className="px-3 py-2">
              &hellip;
            </span>
          )
        }

        const pageNum = page as number
        return (
          <Button
            key={index}
            asChild={currentPage !== pageNum}
            variant={currentPage === pageNum ? "default" : "outline"}
            className={`h-9 w-9 ${currentPage === pageNum ? "bg-orange-500 hover:bg-orange-600" : "border-gray-200"}`}
          >
            {currentPage === pageNum ? <span>{pageNum}</span> : <Link href={createPageUrl(pageNum)}>{pageNum}</Link>}
          </Button>
        )
      })}

      {/* Next button */}
      {currentPage < totalPages && (
        <Button asChild variant="outline" size="icon" className="h-9 w-9 border-gray-200">
          <Link href={createPageUrl(currentPage + 1)}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Link>
        </Button>
      )}
    </div>
  )
}
