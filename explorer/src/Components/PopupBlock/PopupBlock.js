import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { makeSexyDate } from "../../utils";
import Transaction from "Components/Transaction";
import { Key, SectionFlex } from "Components/Shared";

const PopupTitle = styled.div`
  width: 100%;
  font-size: 1.2rem;   
  padding: 6px;
  background-color: #276caf;
  color: #ffffff;
  font-weight: 600;
  text-align: center;
`;
const KeyName = styled.div`
  padding-left: 10px;
  width: 12%;
  color: #276caf;
  font-size: 1rem;
  text-align: right;
`;
const KeyValue = styled.div`
  width: 88%;
  padding-left: 10px; 
  font-size: 1rem;
  font-weight: 600;
  color: #276caf;
`;

const Transactions = styled.div`
  width: 100%;
  border-radius: 10px;
  padding: 20px;
  margin-top: 25px;
  background-color: #ffffff;
  box-shadow: 0 1px 2px #c0c0c0, 0 1px 2px #c0c0c0;
`;

const Headers = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  padding-top: 20px;
  padding-bottom: 10px;
  width: 100%;
  display: flex;
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

const Header = styled.span`
  font-weight: 600;
  text-align: center;
  color: ${props => props.theme.titleColor}!important;
`;

const PopupBlock = ({ block }) => (
    <Fragment>
    <PopupTitle>블록 정보</PopupTitle>
    <SectionFlex>
      <KeyName>Index :</KeyName>
      <KeyValue>{block.index}</KeyValue>
    </SectionFlex>
    <SectionFlex>
      <KeyName>Hash :</KeyName>
      <KeyValue>{block.hash}</KeyValue>
    </SectionFlex>
    <SectionFlex>
      <KeyName>Timestamp :</KeyName>
      <KeyValue>{makeSexyDate(block.timestamp)}</KeyValue>
    </SectionFlex>
    <Transactions>
      <Key>Transactions</Key>

      <Headers>
        <Header>From</Header>
        <Header>Amount</Header>
        <Header>To</Header>
        <Header>Timestamp</Header>
        <Header>Detail</Header>
      </Headers>

      {block.tx.map((tx, index) => (
        <Transaction
          from={tx.from}
          to={tx.to}
          amount={tx.amount}
          timestamp={tx.timestamp}
          key={index}
          id={tx.id}
        />
      ))}
    </Transactions>
  </Fragment>
);

PopupBlock.propTypes = {
  block: PropTypes.object
};

export default PopupBlock;
