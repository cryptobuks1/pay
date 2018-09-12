import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { makeMoneyForm } from "../../utils";
import { Card, Title,
  Section, SectionFlex, SectionName, SectionValue
 } from "Components/Shared";

const AddressContainer = styled.div`
  margin-top: 20px;
`;
const SLink = styled(Link)`
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

const AddressPresenter = ({ isLoading, address, balance, blockIndex }) => (
  <AddressContainer>
  <Card>
    {isLoading ? (
      <Title>Getting Balance</Title>
    ) : (
      <Fragment>
        <SectionFlex>
          <SectionName>{' '}</SectionName>
        </SectionFlex>
        <Section>
          <SectionName>Address:</SectionName>
          <SectionValue>{address}</SectionValue>
        </Section>
        <Section>
          <SectionName>Balance:</SectionName>
          {balance.map((token, index) => (
            <SectionValue key={token.sym}>
            {makeMoneyForm(token.amount)+' '+token.sym}
            </SectionValue>
          ))}
        </Section>
        <Section>
          <SectionName>{' '}</SectionName>
        </Section>
        <ButtonHArea>
          <ButtonConfirm>
            <SLink to={`/blocks/${blockIndex}`}>{'  확 인  '}</SLink>
          </ButtonConfirm>
        </ButtonHArea>      
        <Section>
          <SectionName>{' '}</SectionName>
        </Section>
      </Fragment>
    )}
    </Card>
  </AddressContainer>
);

AddressPresenter.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  address: PropTypes.string.isRequired
};

export default AddressPresenter;
