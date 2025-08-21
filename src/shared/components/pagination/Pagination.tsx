import React from 'react';
import Button from '../button/Button';
import type { PaginationProps } from './paginationTypes';

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
  TwClassName = '',
  ...rest
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = (): number[] => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(0, currentPage - half);
    let end = Math.min(totalPages - 1, start + maxVisiblePages - 1);

    if (end - start < maxVisiblePages - 1) {
      start = Math.max(0, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();
  const canGoPrevious = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  const buttonBaseClass = "relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md";
  const activeButtonClass = "z-10 bg-amber-500 border-primary text-gray-50";
  const inactiveButtonClass = "bg-gray-50 border-gray-300 text-gray-500 hover:bg-gray-50";
  const disabledButtonClass = "cursor-not-allowed opacity-50";

  return (
    <nav 
      className={`flex items-center justify-center mt-6 space-x-2 ${TwClassName}`} 
      aria-label="Pagination"
    >
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
        {...rest}
        TwClassName={`
          relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-gray-50 text-sm font-medium text-gray-500 hover:bg-gray-50
          ${!canGoPrevious ? disabledButtonClass : ''}
        `}
        aria-label="Previous page"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" fill="none">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </Button>

      {visiblePages.map((pageIndex) => (
        <button
          key={pageIndex}
          onClick={() => onPageChange(pageIndex)}
          aria-current={currentPage === pageIndex ? 'page' : undefined}
          className={`
            ${buttonBaseClass}
            ${currentPage === pageIndex ? activeButtonClass : inactiveButtonClass}
          `}
        >
          {pageIndex + 1}
        </button>
      ))}

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        TwClassName={`
          relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-gray-50 text-sm font-medium text-gray-500 hover:bg-gray-50
          ${!canGoNext ? disabledButtonClass : ''}
        `}
        aria-label="Next page"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" fill="none">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Button>
    </nav>
  );
};

export default Pagination;