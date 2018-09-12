import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Loader from "Components/Loader";
import { makeSexyDate } from "../../utils";

const PageTableCard = styled.div`
  background-color: #ffffff;
  box-shadow: 0 1px 2px #c0c0c0, 0 1px 2px #c0c0c0;
  width: 100%;
  height: 590px;
  margin-top: 30px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const PageTableTitle = styled.h2`
  padding: 20px;
  color: ${props => props.theme.titleColor};
`;

const PageTableContent = styled.div`
  width: 100%;
  height: 580px;
`;

const PageTableHeader = styled.header`
  height: 35px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const HeaderItem = styled.span`
  font-weight: 600;
  color: #333333;
  color: ${props => props.theme.titleColor};
`;

const PageTableData = styled.div`
  width: 100%;
  margin-top: 15px;
`;

const PageTableRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-top: 15px;
  text-align: center;
  & * {
    text-align: center;
    width: 15%;
  }
  & *:nth-child(2) {
    width: 50%;
  }
  & *:nth-child(3) {
    width: 30%;
  }
`;

const PageTableCell = styled.div`
  line-height: 1;
  &:not(:last-child) {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

const PageTableLink = styled(Link)`
  color: #2196f3;
`;

const PageTable = ({
  title,
  isLoading,
  loaderText,
  data,
  headers,
  selected,
  linkPages,
  linkParams
}) => (
  <PageTableCard>
    <PageTableTitle>{title}</PageTableTitle>
    <PageTableContent>
      {isLoading && <Loader text={loaderText} />}
      {!isLoading && (
        <Fragment>
          <PageTableHeader>
            <PageTableRow>
              {headers
                .split(",")
                .map((header, index) => (
                  <HeaderItem key={index}>{header}</HeaderItem>
                ))}
            </PageTableRow>
          </PageTableHeader>
          <PageTableData>
            {data.map((item, index) => (
              <PageTableRow key={index}>
                {selected.map((key, index) => {
                  if (index > linkPages.length - 1) {
                    if (key === "timestamp") {
                      return (
                        <PageTableCell key={index}>
                          {makeSexyDate(item[key])}
                        </PageTableCell>
                      );
                    } else {
                      return <PageTableCell key={index}>{item[key]}</PageTableCell>;
                    }
                  } else {
                    return (
                      <PageTableCell key={index}>
                        <PageTableLink
                          to={`/${linkPages[index]}/${item[linkParams[index]]}`}
                        >
                          {item[key]}
                        </PageTableLink>
                      </PageTableCell>
                    );
                  }
                })}
              </PageTableRow>
            ))}
          </PageTableData>
        </Fragment>
      )}
    </PageTableContent>
  </PageTableCard>
);

PageTable.propTypes = {
  title: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  loaderText: PropTypes.string.isRequired,
  headers: PropTypes.string.isRequired,
  data: PropTypes.array,
  selected: PropTypes.array.isRequired,
  linkPages: PropTypes.array.isRequired,
  linkParams: PropTypes.array.isRequired
};

export default PageTable;
