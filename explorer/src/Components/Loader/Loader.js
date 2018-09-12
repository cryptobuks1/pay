import React from "react";
import styled, { keyframes } from "styled-components";

const animation = keyframes`
    0%{
        opacity:0.5;
    }
    50%{
        opacity:1;
    }
    100%{
        opacity:0.5;
    }
`;

const Text = styled.span`
  animation: ${animation} 1s linear infinite;
  text-align: center;
  margin-top: 50px;
  width: 100%;
  display: block;
`;

const Loader = ({ text }) => <Text>{text}</Text>;

export default Loader;
