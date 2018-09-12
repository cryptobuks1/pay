import React, { Component } from "react";
import styled from "styled-components";
import { makeMoneyForm } from "../../utils";
import ReactEcharts from 'echarts-for-react';

const InfoContainer = styled.div`
  width: 100%;
  margin-top: 30px;
  display: flex;
  height: 154px;
`;
const InfoData = styled.div`
  background-color: #276caf;
  box-shadow: 0 1px 2px #c0c0c0, 0 1px 2px #c0c0c0;
  width: 50%;
  padding: 10px;
  &:last-child {
    margin-bottom: 0;
  }
`;
const InfoChart = styled.div`
  background-color: #ffffff;
  box-shadow: 0 1px 2px #c0c0c0, 0 1px 2px #c0c0c0;
  width: 50%;
  padding-top: 5px;
  padding-left: 20px;
  margin-left: 30px;
  &:last-child {
    margin-bottom: 0;
  }
`;
const InfoTitle = styled.div`
    width: 100%;
    font-size: 1.5rem;   
    padding-bottom: 10px;
    color: #ffffff;
    text-align: center;
`;
const PartLine = styled.div`
  width: 100%;
  border-top: 1px solid #ace;
  padding-bottom: 10px;
`;

const SectionFlex = styled.div`
  display: flex;
  padding: 2px;
`;

const KeyNameLeft = styled.div`
  padding-left: 10px;
  width: 70%;
  color: #ddddff;
  font-size: 1rem;
  text-align: left;
`;
const KeyNameRight = styled.div`
  padding-right: 10px;
  width: 30%;
  color: #ddddff;
  font-size: 1rem;
  text-align: right;
`;
const KeyValueLeft = styled.div`
  width: 70%;
  padding-left: 10px; 
  font-size: 1.25rem;
  color: #ffffff;
  text-align: left;
`;
const KeyValueRight = styled.div`
  width: 30%;
  padding-right: 10px; 
  font-size: 1.25rem;
  color: #ffffff;
  text-align: right;
`;
class InfoExplorer extends Component {

  getOption = () => {
      const datas = this.props.blocks.slice(0, 10);
      const indexs = datas.map(data => data.index).reverse();
      const amounts = datas.map(data => {
        if(data.tx.length === 0) return 0;
        return data.tx.map(tx => tx.amount)
        .reduce((a,b) => a+b);
      }).reverse();
    const option = {
        title: {
            text: 'Volume per block',
            subtext: '최근 10 블록 정보',
            left: 'center',
            textStyle: {
                color: '#276caf'
            },
            subtextStyle: {
                color: '#aaa'
            },
        },
        xAxis: {
            type: 'category',
            data: indexs,
            axisLabel: {
              fontSize: 8
          }
      },
        yAxis: {
            type: 'value',
            name: 'TOKEN',
            axisLabel: {
                fontSize: 8
            }
        },
        series: [{
            data: amounts,
            type: 'line'
        }]
    };

    return option;
  }

  render() {
    const {blockCount, txCount, txSum, cbSum} = this.props;
    return (
      <InfoContainer>
        <InfoData>
          <InfoTitle>Gentrion Blockchain Status</InfoTitle>
          <PartLine />
          <SectionFlex>
            <KeyNameLeft>발행량</KeyNameLeft>
            <KeyNameRight>블록수</KeyNameRight>
          </SectionFlex>
          <SectionFlex>
            <KeyValueLeft>{makeMoneyForm(cbSum)}{' GENT'}</KeyValueLeft>
            <KeyValueRight>{blockCount}</KeyValueRight>
          </SectionFlex>
          <InfoTitle />
          <SectionFlex>
            <KeyNameLeft>거래량</KeyNameLeft>
            <KeyNameRight>거래수</KeyNameRight>
          </SectionFlex>
          <SectionFlex>
            <KeyValueLeft>{makeMoneyForm(txSum)}</KeyValueLeft>
            <KeyValueRight>{txCount}</KeyValueRight>
          </SectionFlex>
        </InfoData>
        <InfoChart>
          <ReactEcharts 
            option={this.getOption()} 
            style={{margin: '0', padding: '0', height: '180px'}}
          />
        </InfoChart>
      </InfoContainer>
    );
  }
}

export default InfoExplorer;
