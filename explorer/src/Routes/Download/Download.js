import React, { Fragment } from "react";

import styled from "styled-components";
import { Card, Section, SectionValue
} from "Components/Shared";
import ImgDownload from 'images/download_1.png';
import ImgAndroid from 'images/download_2.png';

const DownloadContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 10px;
  padding: 20px;
`;

const ButtonWrapper = styled.div`
  margin: 30px 10px;
`;
const BtnIcon = styled.img`
  margin-top: 10px;
  margin-bottom: 5px;
`;

const TitleInfo = styled.div`
  font-size: 24px;   
  font-weight: 400;
  color: #656b84;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  padding-bottom: 5px;
  margin-bottom: 20px;
`;
const MobileInfo = styled.div`
  font-size: 24px;   
  font-weight: 400;
  color: #656b84;
  margin-top: 30px;
  padding-bottom: 5px;
`;
const MobileLink = styled.img`
  cursor: pointer;
`;

const Download = () => (
  <DownloadContainer>
    <Card>
    <TitleInfo>Gentrion Wallet</TitleInfo>
    <Fragment>
      <MobileInfo>* 모바일 지갑 *</MobileInfo>
      <MobileLink src={ImgAndroid} onClick={() => {
        window.open("https://play.google.com/store/apps/details?id=com.gentrion.mwallet");
      }} />
    </Fragment>
    </Card>
  </DownloadContainer>
);

export default Download;
