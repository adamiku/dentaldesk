import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TreatmentsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function TreatmentsPagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}: TreatmentsPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const isPrevDisabled = disabled || currentPage === 1;
  const isNextDisabled = disabled || currentPage === totalPages;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={
              isPrevDisabled ? undefined : () => onPageChange(currentPage - 1)
            }
            aria-disabled={isPrevDisabled}
            className={isPrevDisabled ? "opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>

        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={disabled ? undefined : () => onPageChange(page)}
              isActive={page === currentPage}
              aria-disabled={disabled}
              className={disabled ? "opacity-50" : "cursor-pointer"}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={
              isNextDisabled ? undefined : () => onPageChange(currentPage + 1)
            }
            aria-disabled={isNextDisabled}
            className={isNextDisabled ? "opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
