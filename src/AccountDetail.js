import React from 'react';
import {
    useLocation,
} from "react-router-dom";
import intl from 'react-intl-universal';
import { Table, Pagination } from './components';
import services from './services';
import { atto2base } from './util/xfslibutil';
import { defaultIntNumberFormat, defaultNumberFormatFF9, defaultrNumberFormatFF4, defaultrNumberFormatFF6 } from './util/common';
import classNames from 'classnames';
import qs from 'qs';

function PaginationWapper(props) {
    let location = useLocation();
    const { total, pageSize, address } = props;
    const { search } = location;
    const sq = qs.parse(search.replace(/^\?/, ''));
    let pageNum = sq['p'];
    if (!pageNum) {
        pageNum = 1;
    }
    return (
        <Pagination current={pageNum}
            firstLableText={intl.get('PAGE_TABLE_PAGINATION_FIRST')}
            pageLableText={intl.get('PAGE_TABLE_PAGINATION_PAGE')}
            lastLableText={intl.get('PAGE_TABLE_PAGINATION_LAST')}
            pathname={`/accounts/${address}`}
            pageSize={pageSize} total={total} />
    );
}
const api = services.api;
class AccountDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            globalTdStyle: {
                fontSize:'1rem', 
                paddingTop: '1rem',
                paddingBottom: '1rem'  
            },
            page: {
                pageSize: 20,
                total: 0
            },
            account: {
                id: 0,
                address: "000000000000000000000000000000000",
                balance: "0",
                nonce: 0,
                extra: null,
                code: null,
                stateRoot: "0x0000000000000000000000000000000000000000000000000000000000000000",
                alias: null,
                type: 0,
                display: true,
                fromStateRoot: "0x0000000000000000000000000000000000000000000000000000000000000000",
                fromBlockHeight: 0,
                fromBlockHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
                createFromAddress: "000000000000000000000000000000000",
                createFromBlockHeight: 0,
                createFromBlockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
                createFromStateRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
                createFromTxHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
                createTime: "0000-00-00 00:00:00",
                updateTime: "0000-00-00 00:00:00"
            },
            transactions: [
                    
            ]
        }
    }
    async componentDidMount() {
        const { history, location, match } = this.props;
        const { params } = match;
        try {
            const data = await api.getAccountByAddress(params.address);
            this.setState({account: data});
        }catch(e){
            history.replace('/404');
            return;
        }
        try {
        }catch(e) {

        }
        const { search } = location;
        const sq = qs.parse(search.replace(/^\?/, ''));
        let pageNum = sq['p'];
        pageNum = parseInt(pageNum || 1);
        try {
            let pagedata = await api.getTransactionsByAddress(params.address,{
                params: {
                    p: pageNum,
                }
            });
            let { total, records } = pagedata;
            let pageSize = this.state.page.pageSize;
            let pn = parseInt(total / pageSize);
            let mod = total % pageSize;
            if (mod > 0) {
                pn += 1;
            }
            if (pageNum > pn) {
                throw new Error('pagenum overflow');
            }
            this.setState({
                page: {
                    total: total,
                    pageSize: pageSize
                },
                transactions: records
            });
        } catch (e) {
            console.warn(e);
        }
    }
    render() {
        // let time = parseInt(this.state.data.header.timestamp);
        // const timestr = timeformat(new Date(time * 1000));
        const balanceVal = atto2base(this.state.account.balance);
        let typeFormat = (item) => {
            if (item?.type === 1){
                let contractType = item?.contractType;
                let contractTypeName = '';
                let contractUrl = '';
                let contractName = '';
                if (contractType === 1){
                    contractTypeName = 'STD-TOKEN';
                    contractName = '';
                    contractUrl = `/std_tokens/${item?.address}`;
                }else if (contractType === 2){
                    contractTypeName = 'NFTs';
                    contractUrl = `/nfts/${item?.address}`;
                }
                const style = {
                    margin: '10px 10px', 
                };
                const contractTypeView = ()=>{
                    if (contractTypeName === ''){
                        return;
                    }else {
                        return (
                            <>
                                <span style={style}>&rarr;</span>
                                <a href={contractUrl}>
                                    [{contractTypeName}: {item?.address}]
                                </a>
                            </>
                        );
                    }
                };
                return (
                    <div>
                        {intl.get('ACCOUNT_DETAIL_TYPE_CONTRACT')}
                        {contractTypeView()}
                    </div>
                )
            }
            return (
                <div>
                    {intl.get('ACCOUNT_DETAIL_TYPE_EXTERNAL')}
                </div>
            )
        }
        let contractCreatorClasses = ()=>{
            return classNames({
                [`d-none`]: this.state.account.type === 0
            },
                'list-group-item','py-3'
            );
        }
        let contractStateRootClasses = ()=>{
            return classNames({
                [`d-none`]: this.state.account.type === 0
            },
                'list-group-item','py-3'
            );
        }
        let contractCodeClasses = () => {
            return classNames({
                [`d-none`]: this.state.account.type === 0
            },
                'card','mb-4'
            );
        }
        let contractCreateTimeClasses = () => {
            return classNames({
                [`d-none`]: this.state.account.type === 0
            },
            'list-group-item','py-3'
            );
        }
        return (
            <div>
                <h1 className="mb-4">
                {intl.get('PAGE_TITLE_ACCOUNT_DETAIL')}
                </h1>
                <div className="card mb-4">
                    <ul className="list-group list-group-flush">
                    <li className="list-group-item py-3">
                        <div className="row">
                            <div className="col-md-2">
                            {intl.get('ACCOUNT_DETAIL_ADDRESS')}:
                            </div>
                            <div className="col-md-10">
                                <div className="d-flex">
                                    {this.state.account.address}
                                </div>
                            </div>
                        </div>
                    </li>
                    <li className="list-group-item py-3">
                        <div className="row">
                            <div className="col-md-2">
                                {intl.get('ACCOUNT_DETAIL_BALANCE')}:
                            </div>
                            <div className="col-md-10">
                                {defaultNumberFormatFF9(balanceVal)}
                            </div>
                        </div>
                    </li>
                    <li className="list-group-item py-3">
                        <div className="row">
                            <div className="col-md-2">
                                {intl.get('ACCOUNT_DETAIL_TYPE')}:
                            </div>
                            <div className="col-md-10">
                                {typeFormat(this.state.account)}
                            </div>
                        </div>
                    </li>
                    <li className="list-group-item py-3">
                        <div className="row">
                            <div className="col-md-2">
                                {intl.get('ACCOUNT_DETAIL_NONCE')}:
                            </div>
                            <div className="col-md-10">
                            {defaultIntNumberFormat(this.state.account.nonce)}
                            </div>
                        </div>
                    </li>
                    <li className="list-group-item py-3">
                        <div className="row">
                            <div className="col-md-2">
                                {intl.get('ACCOUNT_DETAIL_UPDATE_TIME')}:
                            </div>
                            <div className="col-md-10">
                                {this.state.account.updateTime}
                            </div>
                        </div>
                    </li>
                    <li className={contractCreatorClasses()}>
                        <div className="row">
                            <div className="col-md-2">
                            {intl.get('ACCOUNT_DETAIL_CREATER')}:
                            </div>
                            <div className="col-md-10">
                                <a href={`/accounts/${this.state.account.createFromAddress}`}>
                                    {this.state.account.createFromAddress}
                                </a>
                            </div>
                        </div>
                    </li>
                    <li className={contractStateRootClasses()}>
                        <div className="row">
                            <div className="col-md-2">
                            {intl.get('ACCOUNT_DETAIL_STATE_ROOT')}:
                            </div>
                            <div className="col-md-10">
                                <div className="d-flex">
                                    {this.state.account.stateRoot??'None'}
                                </div>
                            </div>
                        </div>
                    </li>
                    <li className={contractCreateTimeClasses()}>
                        <div className="row">
                            <div className="col-md-2">
                            {intl.get('ACCOUNT_DETAIL_CREATE_TIME')}:
                            </div>
                            <div className="col-md-10">
                                <div className="d-flex">
                                    {this.state.account.createTime}
                                </div>
                            </div>
                        </div>
                    </li>
                    </ul>
                </div>
                <div className={contractCodeClasses()}>
                        <div className="card-body">
                         <h5 className="card-title">
                            {intl.get('ACCOUNT_DETAIL_CONTRACT_CODE')}
                         </h5>
                        <div>
                            <textarea
                                className="form-control"
                                rows="3"
                                readOnly
                                value={this.state.account.code??''}></textarea>
                        </div>
                        </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        {intl.get('ACCOUNT_DETAIL_TRANSACTIONS')}
                    </div>
                    <div className="card-table table-responsive">
                        <Table columns={[
                            {
                                name: intl.get('ACCOUNT_DETAIL_TRANSACTIONS_TIME'),
                                render: (item) => {
                                    return (
                                        <span className="fs-6">
                                            {item.createTime}
                                        </span>
                                    );
                                }
                            },
                            {
                                field: 'hash', name: intl.get('ACCOUNT_DETAIL_TRANSACTIONS_HASH'),
                                tdStyle: { maxWidth: '160px' },
                                render: (item) => {
                                    return (
                                        <div className="text-truncate">
                                            <a href={`/txs/${item.hash}`}>
                                                {item.hash}
                                            </a>
                                        </div>
                                    );
                                }
                            },
                            {
                                field: 'from', name: intl.get('ACCOUNT_DETAIL_TRANSACTIONS_FROM'),
                                tdStyle: { maxWidth: '160px' },
                                render: (item) => {
                                    return (
                                        <div className="text-truncate">
                                            <a href={`/accounts/${item.from}`}>
                                                {item.from}
                                            </a>
                                        </div>
                                    );
                                }
                            },
                            {
                                field: 'to', name: intl.get('ACCOUNT_DETAIL_TRANSACTIONS_TO'),
                                tdStyle: { maxWidth: '160px' },
                                render: (item) => {
                                    let toAddress = '';
                                    if (item.type === 0){
                                        toAddress = item.to;
                                    }else if (item.type === 1){
                                        const contractAddress = item.contractAddress;
                                        toAddress = contractAddress;
                                    }
                                    const addrPrefixStyle = {
                                        fontSize: '.6rem',
                                        marginRight: item.type === 1 ? '.2rem':'0',
                                    };
                                    return (
                                        <div className="text-truncate">
                                            <span style={addrPrefixStyle}>
                                                {`${item.type === 1 ? '[CREATE]': ''}`}
                                            </span>
                                            <a href={`/accounts/${toAddress}`}>
                                                {toAddress}
                                            </a>
                                        </div>
                                    );
                                }
                            },
                            {
                                field: 'value', name: intl.get('ACCOUNT_DETAIL_TRANSACTIONS_VALUE'),
                                thStyle: { textAlign: 'right' },
                                tdStyle: { textAlign: 'right' },
                                render: (item) => {
                                    let val = atto2base(item.value);
                                    return (
                                        <span>
                                            {defaultrNumberFormatFF4(val)}
                                            <span style={{
                                                fontSize: '.8rem',
                                            }}> XFSC</span>
                                        </span>
                                    );
                                }
                            },
                            {
                                field: 'gasFee', name: intl.get('ACCOUNT_DETAIL_TRANSACTIONS_GAS_FEE'),
                                thStyle: { textAlign: 'right' },
                                tdStyle: {textAlign: 'right' },
                                render: (item) => {
                                    let val = atto2base(item.gasFee);
                                    return (
                                        <span>
                                            {defaultrNumberFormatFF6(val)}
                                            <span style={{
                                                fontSize: '.8rem',
                                            }}> XFSC</span>
                                        </span>
                                    );
                                }
                            },
                        ]} data={this.state.transactions} click={() => { }} >
                        </Table>
                    </div>
                    <div className="card-footer">
                        <PaginationWapper
                            address={this.state.account.address}
                            pageSize={this.state.page.pageSize}
                            total={this.state.page.total} />
                    </div>
                </div>
            </div>
        );
    }
}

export default AccountDetail;
