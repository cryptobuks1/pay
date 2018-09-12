import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { makeSexyDate } from "../../utils";
import { Link } from "react-router-dom";
import { Card, KeyName, Title, Key,
  SectionFlex, SectionName, SectionValue
 } from "Components/Shared";

const TxContainer = styled.div`
  margin-top: 20px;
`;

const SLink = styled(Link)`
  color: #2196f3;
`;

const SLink2 = styled(Link)`
  color: #fff;
`;

const ButtonHArea = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ButtonConfirm = styled.div`
  margin-top: 20px;  
  padding: 12px 50px;
  text-align: center;
  background-color: #2196f3;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  border-radius: 5px;
  box-shadow: 0 4px 6px #c0c0c0, 0 1px 3px #c0c0c0;
  transition: all 0.1s linear;
  cursor: pointer;
`;

const TransactionPresenter = ({ tx, isLoading, blockIndex }) => (
  <TxContainer>
  <Card>
    {isLoading ? (
      <Title>Getting Transaction</Title>
    ) : (
      <Fragment>
        <SectionFlex>
          <SectionName>{' '}</SectionName>
        </SectionFlex>
        <SectionFlex>
          <SectionName>Transaction id:</SectionName>
          <SectionValue>{tx.id}</SectionValue> 
        </SectionFlex>
        <SectionFlex>
          <SectionName>Amount: </SectionName>
          <SectionValue>{tx.amount + ' ' + tx.sym}</SectionValue>  
        </SectionFlex>
        <SectionFlex>
          <SectionName>Memo: </SectionName>
          <SectionValue>{tx.memo}</SectionValue>  
        </SectionFlex>
        <SectionFlex>
          <SectionName>Timestamp: </SectionName>
          <SectionValue>{makeSexyDate(tx.timestamp)}</SectionValue>
        </SectionFlex>
        <SectionFlex>
          <SectionName>{' '}</SectionName>
        </SectionFlex>
        <Key>
          <KeyName>From: </KeyName>
          <SLink to={`/addresses/${tx.from}`}>{tx.from}</SLink>
        </Key>
        <Key>
          <KeyName>To: </KeyName>
          <SLink to={`/addresses/${tx.to}`}>{tx.to}</SLink>
        </Key>
        <SectionFlex>
          <SectionName>{' '}</SectionName>
        </SectionFlex>
        <ButtonHArea>
          <ButtonConfirm>
            <SLink2 to={`/blocks/${blockIndex}`}>{'  확 인  '}</SLink2>
          </ButtonConfirm>
        </ButtonHArea>      
        <SectionFlex>
          <SectionName>{' '}</SectionName>
        </SectionFlex>
      </Fragment>
    )}
    </Card>
  </TxContainer>
);

TransactionPresenter.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  tx: PropTypes.object
};

export default TransactionPresenter;
