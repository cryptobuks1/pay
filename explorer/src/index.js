import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import App from "./App";

const theme = {
  titleColor: "#305371",
  boxShadow: "0 7px 14px rgba(50,50,93,.1), 0 3px 6px rgba(0,0,0,.08)"
};

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById("root")
);
