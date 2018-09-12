import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import ImgSOC from 'images/main_icon_128.png';

const TitleLink = styled(Link)`
  color: #90A0B0;
  text-decoration: none;
  user-select: none;
`;

const Title = styled.h1`
  margin: 0;
  color: ${props => props.theme.titleColor};
`;
const HeaderContainer = styled.header`
  background: linear-gradient(to bottom, #30a1c1, #276caf);
  box-shadow: 0 4px 6px #205080, 0 1px 3px #205080;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 20px;
`;

const HeaderWrapper = styled.div`
  max-width: 1000px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const Nav = styled.nav`
  width: 70%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  @media screen and (max-width: 600px) {
    width: 100%;
    justify-content: flex-start;
    margin-top: 35px;
  }
`;

const List = styled.ul`
  display: flex;
  margin: 0;
  align-items: center;
  flex-wrap: wrap;
`;

const ListItem = styled.li`
  margin-bottom: 0;
  margin-left: 50px;
  &:first-child {
    margin: 0;
  }
`;

const SLink = styled.span`
  text-decoration: none;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => (props.isActive ? "#cceeff" : "#205080")};
`;
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
const LogoIcon = styled.img`
  margin-top: 6px;
  width: 46px;
  height: 46px;
  margin-bottom: 0;
`;
const LogoName = styled.div`
  color: #cef;
  font-size: 0.7rem;
  padding: 1px;
`;
const Logo = () => (
  <LogoContainer>
    <LogoIcon src={ImgSOC} />
    <LogoName>GENTRION</LogoName>
  </LogoContainer>
);
const Header = props => {
  return (
    <HeaderContainer>
      <HeaderWrapper>
        <Title>
          <TitleLink to={`/`}><Logo /></TitleLink>
        </Title>
        <Nav>
          <List>
            <ListItem>
              <Link to={`/`}>
                <SLink isActive={window.location.hash === `#/`}>Home</SLink>
              </Link>
            </ListItem>
            <ListItem>
              <Link to={`/blocks`}>
                <SLink isActive={window.location.hash.indexOf(`#/blocks`) >= 0}>
                  Blocks
                </SLink>
              </Link>
            </ListItem>
            <ListItem>
              <Link to={`/transactions`}>
                <SLink
                  isActive={window.location.hash.indexOf(`#/transactions`) >= 0}
                >
                  Transactions
                </SLink>
              </Link>
            </ListItem>
            <ListItem>
              <Link to={`/download`}>
                <SLink
                  isActive={window.location.hash.indexOf(`#/download`) >= 0}
                >
                  Wallet
                </SLink>
              </Link>
            </ListItem>
            <ListItem>
              <Link to={`/contact`}>
                <SLink
                  isActive={window.location.hash.indexOf(`#/contact`) >= 0}
                >
                  API
                </SLink>
              </Link>
            </ListItem>
          </List>
        </Nav>
      </HeaderWrapper>
    </HeaderContainer>
  );
};

export default Header;
