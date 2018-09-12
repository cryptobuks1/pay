import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const PaginationContainer = styled.div`
  margin-top: 10px;  
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PaginationWrapper = styled.div`
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  *::selection {
    background-color: transparent;
  }
`;

const Button = styled.span`
  font-size: 40px;
  color: #216693;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const PageInfo = styled.span`
  font-weight: 600;
  font-size: 14px;
`;

const Pagination = ({
  currentPage = 0,
  totalPages = 0,
  goToNextPage,
  goToPreviousPage
}) => (
  <PaginationContainer>
    <PaginationWrapper>
      <Button role="img" aria-label={"Previos"} onClick={goToPreviousPage}>
        {
          //eslint-disable-next-line
        }
        ◄
      </Button>
      <PageInfo>{`${currentPage}/${totalPages}`}</PageInfo>
      <Button role="img" aria-label={"Next"} onClick={goToNextPage}>
        {
          //eslint-disable-next-line
        }
        ►
      </Button>
    </PaginationWrapper>
  </PaginationContainer>
);

Pagination.propTypes = {
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  goToNextPage: PropTypes.func.isRequired,
  goToPreviousPage: PropTypes.func.isRequired
};

export default Pagination;
