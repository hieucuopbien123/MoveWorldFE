import {
  Pagination,
  PaginationContainer,
  PaginationNext,
  PaginationPage,
  PaginationPageGroup,
  PaginationPrevious,
  PaginationSeparator,
} from "@ajna/pagination";
import { Box } from "@chakra-ui/react";
import React from "react";

// Dùng thư viện / @ajna/pagination
const CustomPagination = ({ pagesCount, currentPage, onPageChange, pages }: any) => {
  return (
    <>
      <Box
        sx={{
          "& .pagination-container": {
            justifyContent: "center",
          },
        }}
      >
        <Pagination pagesCount={pagesCount} currentPage={currentPage} onPageChange={onPageChange}>
          <PaginationContainer>
            <PaginationPrevious
              backgroundColor="transparent"
              margin={"5px"}
              style={{ minWidth: "35px", height: "35px" }}
            >
              {"<"}
            </PaginationPrevious>
            <PaginationPageGroup
              isInline
              align="center"
              separator={<PaginationSeparator bg="pagination" fontSize="sm" w={10} jumpSize={2} />}
            >
              {pages.map((page: number) => (
                <PaginationPage
                  _current={{
                    bgColor: "primary",
                  }}
                  key={`pagination_page_${page}`}
                  page={page}
                  style={{ minWidth: "30px", height: "35px" }}
                  backgroundColor="transparent"
                />
              ))}
            </PaginationPageGroup>
            <PaginationNext
              backgroundColor="transparent"
              margin={"5px"}
              style={{ minWidth: "35px", height: "35px" }}
            >
              {">"}
            </PaginationNext>
          </PaginationContainer>
        </Pagination>
      </Box>
    </>
  );
};

export default CustomPagination;
