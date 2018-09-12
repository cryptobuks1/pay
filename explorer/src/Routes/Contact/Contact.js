import React from "react";
import styled from "styled-components";

const ContactContainer = styled.div`
  margin-top: 30px;
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0 1px 2px #c0c0c0, 0 1px 2px #c0c0c0;
`;
const HeaderTitle = styled.div`
  background-color: #f0f0f0;
  color: #222;
  font-size: 1.25rem;
  padding: 10px;
  font-weight: 600;
`;
const KeyName = styled.div`
  color: #456;
  font-weight: 600;
  font-size: 1rem;
  padding: 10px;
  padding-left: 20px; 
  margin-top: 15px;
`;
const KeyValue = styled.div`
  font-size: 1rem;
  color: #000;
  padding: 10px;
  padding-left: 40px; 
`;
const KeyValue2 = styled.div`
  font-size: 1rem;
  color: #276caf;
  padding: 10px;
  padding-left: 60px; 
  font-weight: 600;
`;
const KeyValue3 = styled.div`
  font-size: 1rem;
  color: #5080f0;
  padding: 10px;
  padding-left: 80px; 
`;
const KeyValue4 = styled.div`
  font-size: 1rem;
  color: #5080f0;
  padding: 3px;
  padding-left: 100px; 
`;
const KeyValue5 = styled.div`
  font-size: 1rem;
  color: #5080f0;
  padding: 3px;
  padding-left: 120px; 
`;
const PartLine = styled.div`
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const Contact = () => (
  <ContactContainer>
    <HeaderTitle>How to use</HeaderTitle>
    <KeyName>- API Endpoint</KeyName>
    <KeyValue>https://api.gentrion.io/</KeyValue>
    <PartLine />
    <KeyName>- URI Request Format</KeyName>
    <KeyValue>{'https://api.gentrion.io/{method}/{param}'}</KeyValue>
    <PartLine />
    <HeaderTitle>Request Info</HeaderTitle>
    <KeyName>- search information (GET)</KeyName>
    <KeyValue>{'https://api.gentrion.io/search/{key}'}</KeyValue>
    <KeyValue2>{'key : index or hash or transaction ID'}</KeyValue2>
    <KeyValue2>{'JSON Response : '}</KeyValue2>
    <KeyValue3>{`{`}</KeyValue3>
    <KeyValue4>{`  block: {`}</KeyValue4>
    <KeyValue5>{`    index: 1,`}</KeyValue5>
    <KeyValue5>{`    hash: "c0b4a4c812679018fda4ec69b181f4fc5ddc3dd2820bdaaef1b14494962d9924",`}</KeyValue5>
    <KeyValue5>{`    previousHash: "5ba217260186ac7733c242304c6e5482938ccb498539e8ed445dfbbbcf666487",`}</KeyValue5>
    <KeyValue5>{`    timestamp: 1530443861,`}</KeyValue5>
    <KeyValue5>{`    tx: [`}</KeyValue5>
    <KeyValue5>{`      { ...`}</KeyValue5>
    <KeyValue5>{`        ...`}</KeyValue5>
    <KeyValue5>{`        ...`}</KeyValue5>
    <KeyValue4>{`  }`}</KeyValue4>
    <KeyValue3>{`}`}</KeyValue3>
    <PartLine />
    <KeyName>- The amount of token generated (GET)</KeyName>
    <KeyValue>{'https://api.gentrion.io/production-volume/{sym}'}</KeyValue>
    <KeyValue2>{'sym : symbol of token'}</KeyValue2>
    <KeyValue2>{'JSON Response : '}</KeyValue2>
    <KeyValue3>{`{`}</KeyValue3>
    <KeyValue4>{`  sym: "GENT",`}</KeyValue4>
    <KeyValue4>{`  amount: 7700000000`}</KeyValue4>
    <KeyValue3>{`}`}</KeyValue3>
    <PartLine />
    <KeyName>- The amount of token transaction (GET)</KeyName>
    <KeyValue>{'https://api.gentrion.io/transactions-volume/{sym}'}</KeyValue>
    <KeyValue2>{'sym : symbol of token'}</KeyValue2>
    <KeyValue2>{'JSON Response : '}</KeyValue2>
    <KeyValue3>{`{`}</KeyValue3>
    <KeyValue4>{`  sym: "GENT",`}</KeyValue4>
    <KeyValue4>{`  amount: 15400000000`}</KeyValue4>
    <KeyValue3>{`}`}</KeyValue3>
    <PartLine />
    <KeyName>- The last 10 blocks created (GET)</KeyName>
    <KeyValue>{'https://api.gentrion.io/blocks/latest'}</KeyValue>
    <KeyValue2>{'JSON Response : '}</KeyValue2>
    <KeyValue3>{`{`}</KeyValue3>
    <KeyValue4>{`  {block...}`}</KeyValue4>
    <KeyValue4>{`  {block...}`}</KeyValue4>
    <KeyValue4>{`  ...`}</KeyValue4>
    <KeyValue4>{`  ...`}</KeyValue4>
    <KeyValue4>{`  ...`}</KeyValue4>
    <KeyValue3>{`}`}</KeyValue3>
    <PartLine />
    <KeyName>- Block information at index or hash (GET)</KeyName>
    <KeyValue>{'https://api.gentrion.io/blocks/{key}'}</KeyValue>
    <KeyValue2>{'key : index or hash'}</KeyValue2>
    <KeyValue2>{'JSON Response : '}</KeyValue2>
    <KeyValue3>{`{`}</KeyValue3>
    <KeyValue4>{`  block: {`}</KeyValue4>
    <KeyValue5>{`    index: 1,`}</KeyValue5>
    <KeyValue5>{`    hash: "c0b4a4c812679018fda4ec69b181f4fc5ddc3dd2820bdaaef1b14494962d9924",`}</KeyValue5>
    <KeyValue5>{`    previousHash: "5ba217260186ac7733c242304c6e5482938ccb498539e8ed445dfbbbcf666487",`}</KeyValue5>
    <KeyValue5>{`    timestamp: 1530443861,`}</KeyValue5>
    <KeyValue5>{`    tx: [`}</KeyValue5>
    <KeyValue5>{`      { ...`}</KeyValue5>
    <KeyValue5>{`        ...`}</KeyValue5>
    <KeyValue5>{`        ...`}</KeyValue5>
    <KeyValue4>{`  }`}</KeyValue4>
    <KeyValue3>{`}`}</KeyValue3>
    <PartLine />
    <KeyName>- Transaction information at id (GET)</KeyName>
    <KeyValue>{'https://api.gentrion.io/transactions/{id}'}</KeyValue>
    <KeyValue2>{'id : id of the transaction'}</KeyValue2>
    <KeyValue2>{'JSON Response : '}</KeyValue2>
    <KeyValue3>{`{`}</KeyValue3>
    <KeyValue4>{`  id: "0caa04d7fd2ef4f06df8e8701e46dca7f3c47d96f5b44c2322fa032e1963c3a4",`}</KeyValue4>
    <KeyValue4>{`  sym: "GENT",`}</KeyValue4>
    <KeyValue4>{`  amount: 7700000000,`}</KeyValue4>
    <KeyValue4>{`  timestamp: 1530443861,`}</KeyValue4>
    <KeyValue4>{`  txIns: {`}</KeyValue4>
    <KeyValue4>{`  ...`}</KeyValue4>
    <KeyValue4>{`  txOuts: {`}</KeyValue4>
    <KeyValue4>{`  ...`}</KeyValue4>
    <KeyValue4>{`  ...`}</KeyValue4>
    <KeyValue3>{`}`}</KeyValue3>
    <PartLine />
    <KeyName>- get balance (POST)</KeyName>
    <KeyValue>{'https://api.gentrion.io/balance'}</KeyValue>
    <KeyValue2>{'{email: "email..." or address: "Wallet address"}'}</KeyValue2>
    <KeyValue2>{'JSON Response : '}</KeyValue2>
    <KeyValue3>{`{`}</KeyValue3>
    <KeyValue4>{`  email: "user@email.com"`}</KeyValue4>
    <KeyValue4>{`  balance: [`}</KeyValue4>
    <KeyValue5>{`  {sym , amount}`}</KeyValue5>
    <KeyValue4>{`  ...`}</KeyValue4>
    <KeyValue4>{`  ...`}</KeyValue4>
    <KeyValue3>{`}`}</KeyValue3>
    <PartLine />
    <KeyName>- Sent history information (POST)</KeyName>
    <KeyValue>{'https://api.gentrion.io/sent-history'}</KeyValue>
    <KeyValue2>{'{address: "Wallet address", index: The last block index returned or 0}'}</KeyValue2>
    <KeyValue2>{'JSON Response : '}</KeyValue2>
    <KeyValue3>{`{`}</KeyValue3>
    <KeyValue4>{`  txs: [{...}, {...}, ...]`}</KeyValue4>
    <KeyValue4>{`  lastIndex: 10`}</KeyValue4>
    <KeyValue3>{`}`}</KeyValue3>
    <PartLine />
    <KeyName>- History information received (POST)</KeyName>
    <KeyValue>{'https://api.gentrion.io/recv-history'}</KeyValue>
    <KeyValue2>{'{address: "Wallet address", index: The last block index returned or 0}'}</KeyValue2>
    <KeyValue2>{'JSON Response : '}</KeyValue2>
    <KeyValue3>{`{`}</KeyValue3>
    <KeyValue4>{`  txs: [{...}, {...}, ...]`}</KeyValue4>
    <KeyValue4>{`  lastIndex: 10`}</KeyValue4>
    <KeyValue3>{`}`}</KeyValue3>
    <PartLine />
    <KeyName>- Sign Up (POST)</KeyName>
    <KeyValue>{'https://api.gentrion.io/signup'}</KeyValue>
    <KeyValue2>{'{email: "email...", pw: "password", nick: "nick name"}'}</KeyValue2>
    <KeyValue2>{'JSON Response : '}</KeyValue2>
    <KeyValue3>{`{`}</KeyValue3>
    <KeyValue4>{`  ...`}</KeyValue4>
    <KeyValue4>{`  ...`}</KeyValue4>
    <KeyValue3>{`}`}</KeyValue3>
    <PartLine />
    <KeyName>- Log in (POST)</KeyName>
    <KeyValue>{'https://api.gentrion.io/login'}</KeyValue>
    <KeyValue2>{'{email: "email...", pw: "password"}'}</KeyValue2>
    <KeyValue2>{'JSON Response : '}</KeyValue2>
    <KeyValue3>{`{`}</KeyValue3>
    <KeyValue4>{`  account: {...}`}</KeyValue4>
    <KeyValue4>{`  key: "..."`}</KeyValue4>
    <KeyValue3>{`}`}</KeyValue3>
    <PartLine />
    <KeyName>- Create Transaction (POST)</KeyName>
    <KeyValue>{'https://api.gentrion.io/create-transaction'}</KeyValue>
    <KeyValue2>{'{sender: "email or address", recv: "eamil or address",'}</KeyValue2>
    <KeyValue2>{' sym: "symbol of token", amount, memo, key: "Login return key"}'}</KeyValue2>
    <KeyValue2>{'JSON Response : '}</KeyValue2>
    <KeyValue3>{`{`}</KeyValue3>
    <KeyValue4>{`  ...`}</KeyValue4>
    <KeyValue4>{`  ...`}</KeyValue4>
    <KeyValue3>{`}`}</KeyValue3>
    <PartLine />
    <KeyName>- Create Token (POST)</KeyName>
    <KeyValue>{'https://api.gentrion.io/create-token'}</KeyValue>
    <KeyValue2>{'{email: "email...",'}</KeyValue2>
    <KeyValue2>{' sym: "symbol of token", amount, memo, key: "Login return key"}'}</KeyValue2>
    <KeyValue2>{'JSON Response : '}</KeyValue2>
    <KeyValue3>{`{`}</KeyValue3>
    <KeyValue4>{`  ...`}</KeyValue4>
    <KeyValue4>{`  ...`}</KeyValue4>
    <KeyValue3>{`}`}</KeyValue3>
    <PartLine />
  </ContactContainer>
);

export default Contact;
