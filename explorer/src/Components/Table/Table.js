import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Loader from "Components/Loader";
import { makeSexyDate } from "../../utils";

const TableCard = styled.div`
  background-color: #ffffff;
  box-shadow: 0 1px 2px #c0c0c0, 0 1px 2px #c0c0c0;
  width: 100%;
  margin-top: 30px;
  &:last-child {
    margin-bottom: 0;
  }
  padding-bottom: 30px;
`;

const TableTitle = styled.div`
  padding: 15px;
  color: #276caf;
  font-size: 1.25rem;
  font-weight: 600;
`;

const TableContent = styled.div`
  width: 100%;
`;

const TableHeader = styled.header`
  height: 35px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const HeaderItem = styled.span`
  font-weight: 600;
  color: #333333;
  color: ${props => props.theme.titleColor};
`;

const TableData = styled.div`
  width: 100%;
  margin-top: 12px;
`;

const TableRow = styled.div`
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

const TableCell = styled.div`
  line-height: 1;
  &:not(:last-child) {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

const TableLink = styled(Link)`
  color: #2196f3;
`;

const Table = ({
  title,
  isLoading,
  loaderText,
  data,
  headers,
  selected,
  linkPages,
  linkParams
}) => (
  <TableCard>
    <TableTitle>{title}</TableTitle>
    <TableContent>
      {isLoading && <Loader text={loaderText} />}
      {!isLoading && (
        <Fragment>
          <TableHeader>
            <TableRow>
              {headers
                .split(",")
                .map((header, index) => (
                  <HeaderItem key={index}>{header}</HeaderItem>
                ))}
            </TableRow>
          </TableHeader>
          <TableData>
            {data.map((item, index) => (
              <TableRow key={index}>
                {selected.map((key, index) => {
                  if (index > linkPages.length - 1) {
                    if (key === "timestamp") {
                      return (
                        <TableCell key={index}>
                          {makeSexyDate(item[key])}
                        </TableCell>
                      );
                    } else {
                      return <TableCell key={index}>{item[key]}</TableCell>;
                    }
                  } else {
                    return (
                      <TableCell key={index}>
                        <TableLink
                          to={`/${linkPages[index]}/${item[linkParams[index]]}`}
                        >
                          {item[key]}
                        </TableLink>
                      </TableCell>
                    );
                  }
                })}
              </TableRow>
            ))}
          </TableData>
        </Fragment>
      )}
    </TableContent>
  </TableCard>
);

Table.propTypes = {
  title: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  loaderText: PropTypes.string.isRequired,
  headers: PropTypes.string.isRequired,
  data: PropTypes.array,
  selected: PropTypes.array.isRequired,
  linkPages: PropTypes.array.isRequired,
  linkParams: PropTypes.array.isRequired
};

export default Table;
