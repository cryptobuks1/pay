import React, { Fragment } from "react";
import Modal from 'react-modal';

import PropTypes from "prop-types";
import styled from "styled-components";
import { Button } from "Components/Shared";
import Table from "Components/Table";
import PopupBlock from "Components/PopupBlock";
import PopupTx from "Components/PopupTx";
import InfoExplorer from "Components/InfoExplorer";

import FaSearch from 'react-icons/lib/io/ios-search-strong';

Modal.setAppElement('#root');

const HomeContainer = styled.div`
  margin-top: 30px;
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Submit = styled.div`
  width: 50px;
  color: white;
  background-color: transparent;  
  color: #34557d;
  cursor: pointer;
  padding-left: 5px;
  align-items: center;
`;
const Error = styled.div`
  color: red;
  text-align: center;
  align-items: center;
  justify-content: center;
`;

const Input = Button.withComponent("input").extend`
  box-shadow: none;
  color: #42a5f5;  
  width: 500px;
  background-color: white;  
  padding: 10px 20px;
  border: 1px solid #42a5f5;
  &:hover {
    box-shadow: none;
  }
  &:active {
    box-shadow: none;
  }
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

const customStyles = {
  content : {
    top                   : '40%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    boxShadow: '0 1px 2px #c0c0c0, 0 1px 2px #c0c0c0',
    width: '850px',
    backgroundColor: '#f8f8f8'
  }
};

const HomePresenter = ({ 
  isLoading, 
  blocks = [], 
  txs = [], 
  errorMsg,
  searchBlock,
  searchTx,
  showModal,
  blockCount,
  txCount,
  txSum,
  cbSum,
  closeModal,
  onKeyDown,
  handleKey,
  handleSubmit,
  searchKey }) => (
    <HomeContainer>
        <Modal
          isOpen={showModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel={searchBlock ? '블록 정보':'거래 정보'}
          >
          {searchBlock && <PopupBlock block={searchBlock} />}
          {searchTx && <PopupTx tx={searchTx} />}
          <ButtonHArea>
            <ButtonConfirm onClick={closeModal}>확인</ButtonConfirm>
          </ButtonHArea>
        </Modal>

    <SearchForm>
      <Input
        placeholder={"검색 index, hash, transaction id"}
        required
        name="searchKey"
        value={searchKey}
        type={"text"}
        onKeyDown={onKeyDown}
        onChange={handleKey}
      />
      <Submit onClick={handleSubmit}>
        <FaSearch size={32} />
      </Submit>
    </SearchForm>
    {errorMsg && <Error>{errorMsg}</Error>}
    <InfoExplorer 
      blockCount={blockCount}
      txCount={txCount}
      txSum={txSum}
      cbSum={cbSum}
      blocks={blocks}
    />
  <Fragment>
    <Table
      isLoading={isLoading}
      title={"최근 블록 (Blocks)"}
      loaderText={"Getting blocks"}
      data={blocks.slice(0, 10)}
      headers={"Index, Hash, Timestamp"}
      selected={["index", "hash", "timestamp"]}
      linkPages={["blocks", "blocks"]}
      linkParams={["index", "index"]}
    />
  </Fragment>
  </HomeContainer>
);

HomePresenter.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  blocks: PropTypes.array,
  txs: PropTypes.array
};

export default HomePresenter;
