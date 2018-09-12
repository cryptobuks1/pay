import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { makeSexyDate } from "../../utils";
import { Link } from "react-router-dom";
import { SectionFlex } from "Components/Shared";

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

const SLink = styled(Link)`
  width: 88%;
  padding-left: 10px;
  color: #2196f3;
  font-size: 1rem;
  font-weight: 600;
`;


const PopupTx = ({ tx }) => (
  <Fragment>
    <PopupTitle>거래 정보</PopupTitle>
      <SectionFlex>
        <KeyName>Transaction:</KeyName>
        <KeyValue>{tx.id}</KeyValue> 
      </SectionFlex>
      <SectionFlex>
        <KeyName>Amount: </KeyName>
        <KeyValue>{tx.amount} SOC</KeyValue>  
      </SectionFlex>
      <SectionFlex>
        <KeyName>Timestamp: </KeyName>
        <KeyValue>{makeSexyDate(tx.timestamp)}</KeyValue>
      </SectionFlex>
      <SectionFlex>
        <KeyName>From: </KeyName>
        <SLink to={`/addresses/${tx.from}`}>{tx.from}</SLink>
      </SectionFlex>
      <SectionFlex>
        <KeyName>To: </KeyName>
        <SLink to={`/addresses/${tx.to}`}>{tx.to}</SLink>
      </SectionFlex>
  </Fragment>
);

PopupTx.propTypes = {
  tx: PropTypes.object
};

export default PopupTx;
