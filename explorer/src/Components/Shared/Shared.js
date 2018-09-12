import styled, { keyframes } from "styled-components";

export const Card = styled.div`
  background-color: #ffffff;
  box-shadow: 0 1px 2px #c0c0c0, 0 1px 2px #c0c0c0;
  width: 100%;
  padding: 12px 20px;
  box-sizing: border-box;
  border-radius: 10px;
  margin-bottom: 10px;
`;

export const Title = styled.div`
  font-size: 20px;   
  color: #656b84;
`;

export const Key = styled.h3`
  color: ${props => props.theme.titleColor};
  margin-bottom: 20px !important;
  &:last-child {
    margin-bottom: 0;
  }
`;

export const KeyName = styled.span`
  color: #999;
`;

export const Button = styled.button`
  background-color: white;
  border: 0;
  width: 100px;
  padding: 10px 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.titleColor};
  border-radius: 5px;
  box-shadow: ${props => props.theme.boxShadow};
  transition: all 0.1s linear;
  cursor: pointer;
  &:focus,
  &:active {
    outline: none;
  }
  &:hover {
    box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }
  &:active {
    box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
    background-color: #f6f9fc;
    transform: translateY(1px);
  }
  &:disabled {
    box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
    background-color: #f6f9fc;
    transform: none;
    cursor: progress;
    &:focus,
    &:active,
    &:hover {
      transform: none;
    }
  }
`;

export const ButtonGray = styled.button`
  background-color: #a9abad;
  border: 0;
  width: 100px;
  padding: 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #282a36;
  border-radius: 5px;
  box-shadow: 0 4px 6px #21222c, 0 1px 3px #21222c;
  transition: all 0.1s linear;
  cursor: pointer;
  &:focus,
  &:active {
    outline: none;
  }
  &:hover {
    box-shadow: 0 7px 14px #191a21, 0 3px 6px #191a21;
    transform: translateY(-1px);
  }
  &:active {
    box-shadow: 0 4px 6px #191a21, 0 1px 3px #191a21;
    background-color: #21222c;
    transform: translateY(1px);
  }
  &:disabled {
    box-shadow: 0 4px 6px #191a21, 0 1px 3px #191a21;
    background-color: #21222c;
    transform: none;
    cursor: progress;
    &:focus,
    &:active,
    &:hover {
      transform: none;
    }
  }
`;

export const ButtonBlue = styled.button`
  background-color: #2196f3;
  border: 0;
  width: 100px;
  padding: 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  border-radius: 5px;
  box-shadow: 0 4px 6px #21222c, 0 1px 3px #21222c;
  transition: all 0.1s linear;
  cursor: pointer;
  &:focus,
  &:active {
    outline: none;
  }
  &:hover {
    box-shadow: 0 7px 14px #191a21, 0 3px 6px #191a21;
    transform: translateY(-1px);
  }
  &:active {
    box-shadow: 0 4px 6px #191a21, 0 1px 3px #191a21;
    background-color: #21222c;
    transform: translateY(1px);
  }
  &:disabled {
    box-shadow: 0 4px 6px #191a21, 0 1px 3px #191a21;
    background-color: #21222c;
    transform: none;
    cursor: progress;
    &:focus,
    &:active,
    &:hover {
      transform: none;
    }
  }
`;


const notifAnim = keyframes`
  0%{
    opacity:0;
    transform:translateX(-10px);
  }
  10%{
    opacity:1;
    transform:none;
  }
  90%{
      opacity:1
  }
  100%{
      opacity:0;
  }
`;

export const Notification = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  background-color: ${props => (props.success ? "#2ecc71" : "#e74c3c")};
  color: white;
  font-weight: 600;
  padding: 10px;
  border-radius: 5px;
  animation: ${notifAnim} 2s linear forwards;
  box-shadow: ${props => props.theme.boxShadow};
`;

export const Section = styled.div`
  font-size: 20px;   
  color: #656b84;
  margin-bottom: 14px;
`;
export const SectionFlex = styled.div`
  font-size: 20px;   
  color: #656b84;
  display: flex;
  margin-top: 10px;
  margin-bottom: 10px;
`;
export const SectionName = styled.div`
  color: #999;
  font-size: 1.25rem;
`;
export const SectionValue = styled.div`
  padding-left: 10px; 
  font-size: 1.25rem;
  font-weight: 600;
  color: #284a76;
`;
export const SectionYellow = styled.div`
  padding-left: 10px;  
  color: #ffca28;
`;
export const SectionSky = styled.div`
  padding-left: 10px;  
  color: #8be9fd;
`;
