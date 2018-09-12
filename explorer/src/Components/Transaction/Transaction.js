import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { makeSexyDate } from "../../utils";
import FaDetail from 'react-icons/lib/md/find-in-page';

const Tx = styled.div`
  margin: 20px 0;
  display: flex;
  width: 100%;
  justify-content: space-between;
  > * {
    width: 40%;
  }
  > *:nth-child(2) {
    width: 10%;
    color: inherit;
  }
  > *:last-child {
    width: 5%;
  }
`;

const Column = styled.div`
  text-align: center;
  line-height: 2;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const SLink = styled(Link)`
  color: #2196f3;
`;

const Transaction = ({ from, to, amount, timestamp, id }) => (
  <Tx>
    <Column>
      <SLink to={`/addresses/${from}`}>{from}</SLink>
    </Column>
    <Column>{amount}</Column>
    <Column>
      <SLink to={`/addresses/${to}`}>{to}</SLink>
    </Column>
    <Column>{makeSexyDate(timestamp)}</Column>
    <Column>
      <Link to={`/transactions/${id}`}>
        <FaDetail size={24} />
      </Link>
    </Column>
  </Tx>
);

Transaction.propTypes = {
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  timestamp: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired
};

export default Transaction;
