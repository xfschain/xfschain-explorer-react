import React from 'react';
import {
    useLocation,
} from "react-router-dom";
import intl from 'react-intl-universal';
import { Table, Pagination } from './components';
import { timeformat } from './util';
import services from './services';
import { atto2base } from './util/xfslibutil';
import { defaultIntNumberFormat, defaultrNumberFormatFF4,defaultrNumberFormatFF6 } from './util/common';
import qs from 'qs';
const api = services.api;

function PaginationWapper(props) {
    let location = useLocation();
    const { total, pageSize, hash } = props;
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
            pathname={`/blocks/${hash}`}
            pageSize={pageSize} total={total} />
    );
}
class BlockDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            globalTdStyle: {
                fontSize: '1rem',
                paddingTop: '1rem',
                paddingBottom: '1rem'
            },
            page: {
                pageSize: 20,
                total: 0
            },
            header: {
                id: 0,
                hash: "0x0000000000000000000000000000000000000000000000000000000000000000",
                height: 0,
                version: 0,
                hashPrevBlock: "0x0000000000000000000000000000000000000000000000000000000000000000",
                timestamp: 0,
                coinbase: "000000000000000000000000000000000",
                stateRoot: "0x0000000000000000000000000000000000000000000000000000000000000000",
                transactionsRoot: "0x0000000000000000000000000000000000000000000000000000000000000000",
                receiptsRoot: "0x0000000000000000000000000000000000000000000000000000000000000000",
                gasLimit: 0,
                gasUsed: 0,
                bits: 0,
                nonce: 0,
                extraNonce: "0",
                txCount: 0,
                rewards: "0"
            },
            transactions: [
                // {
                //     id: 33001,
                //     blockHash: "0x000000066bd59cb78e12e76d43706c38218a297d1ebf4717c7618f6efacb284c",
                //     blockHeight: 23325,
                //     blockTime: 1640863204,
                //     version: 0,
                //     from: "YTYQ9j75fcvCB7at2UB6ot2rXPCPPKhx2",
                //     to: "fyjs3YU8AVakCua2etn1uqfkY8dcBUWne",
                //     gasPrice: "10000000000",
                //     gasLimit: "25000",
                //     gasUsed: "25000",
                //     gasFee: "250000000000000",
                //     data: null,
                //     nonce: 198,
                //     value: "420000000000000000",
                //     signature: null,
                //     hash: "0x96884b53f5a0540453e9e2fc92aa963bd46b6deb8fbbb2b8ce3ad8a32c9fa20b",
                //     status: 1,
                //     type: 0
                // },
            ]
        }
    }
    async componentDidMount() {
        const { history, match, location } = this.props;
        const { params } = match;
        try {
            const data = await api.getBlockByHash(params.hash);
            this.setState({ header: data?.header });
        } catch (e) {
            history.replace('/404');
            return;
        }
        const { search } = location;
        const sq = qs.parse(search.replace(/^\?/, ''));
        let pageNum = sq['p'];
        pageNum = parseInt(pageNum || 1);
        try {
            let pagedata = await api.getTransactionsByBlockHash(params?.hash,{
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
        let time = parseInt(this.state.header.timestamp);
        const timestr = timeformat(new Date(time * 1000));
        const blockRewards = atto2base(this.state.header.rewards);
        return (
            <div>
                <h1 className="mb-4">
                    {intl.get('PAGE_TITLE_BLOCK_DETAIL')}&nbsp;#&nbsp;{this.state.header.height}
                </h1>
                <div className="card mb-4">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('BLOCK_DETAIL_BLOCK_HEIGHT')}:
                                </div>
                                <div className="col-md-10">
                                    <div className="d-flex">
                                        {this.state.header.height}
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('BLOCK_DETAIL_VERSION')}:
                                </div>
                                <div className="col-md-10">
                                    {this.state.header.version}
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('BLOCK_DETAIL_PREV_BLOCK_HASH')}:
                                </div>
                                <div className="col-md-10">
                                    <a href={`/blocks/${this.state.header.hashPrevBlock}`}>
                                        {this.state.header.hashPrevBlock}
                                    </a>
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('BLOCK_DETAIL_HASH')}:
                                </div>
                                <div className="col-md-10">
                                    {this.state.header.hash}
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('BLOCK_DETAIL_TIME')}:
                                </div>
                                <div className="col-md-10">
                                    {timestr}
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('BLOCK_DETAIL_COINBASE')}:
                                </div>
                                <div className="col-md-10">
                                    <a href={`/accounts/${this.state.header.coinbase}`}>
                                        {this.state.header.coinbase}
                                    </a>
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('BLOCK_DETAIL_REWARDS')}:
                                </div>
                                <div className="col-md-10">
                                    {defaultrNumberFormatFF4(blockRewards)}
                                    <span style={{}}> XFSC</span>
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('BLOCK_DETAIL_STATE_ROOT_HASH')}:
                                </div>
                                <div className="col-md-10">
                                    {this.state.header.stateRoot}
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('BLOCK_DETAIL_TRANSACTIONS_ROOT_HASH')}:
                                </div>
                                <div className="col-md-10">
                                    {this.state.header.transactionsRoot}
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('BLOCK_DETAIL_RECEIPTS_ROOT_HASH')}:
                                </div>
                                <div className="col-md-10">
                                    {this.state.header.receiptsRoot}
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('BLOCK_DETAIL_GAS_LIMIT')}:
                                </div>
                                <div className="col-md-10">
                                    {defaultIntNumberFormat(this.state.header.gasLimit)}
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('BLOCK_DETAIL_GAS_USED')}:
                                </div>
                                <div className="col-md-10">
                                    {defaultIntNumberFormat(this.state.header.gasUsed)}
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('BLOCK_DETAIL_BITS')}:
                                </div>
                                <div className="col-md-10">
                                    {this.state.header.bits}
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('BLOCK_DETAIL_NONCE')}:
                                </div>
                                <div className="col-md-10">
                                    {this.state.header.nonce}
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('BLOCK_DETAIL_EXTRA_NONCE')}:
                                </div>
                                <div className="col-md-10">
                                    {this.state.header.extraNonce}
                                </div>
                            </div>
                        </li>
                        
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('BLOCK_DETAIL_TXCOUNT')}:
                                </div>
                                <div className="col-md-10">
                                    {defaultIntNumberFormat(this.state.header.txCount)}
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="card">
                    <div className="card-header">
                        {intl.get('BLOCK_DETAIL_TRANSACTIONS')}
                    </div>
                    <div className="card-table table-responsive">
                        <Table columns={[
                            {
                                field: 'hash', name: intl.get('BLOCK_DETAIL_TRANSACTIONS_HASH'),
                                tdStyle: {maxWidth: '180px' },
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
                                field: 'from', name: intl.get('BLOCK_DETAIL_TRANSACTIONS_FROM'),
                                tdStyle: { maxWidth: '180px' },
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
                                field: 'to', name: intl.get('BLOCK_DETAIL_TRANSACTIONS_TO'),
                                tdStyle: { maxWidth: '180px' },
                                render: (item) => {
                                    let toAddress = '';
                                    if (item.type === 0){
                                        toAddress = item.to;
                                    }else if (item.type === 1){
                                        const contractAddress = item.contractAddress;
                                        toAddress = contractAddress;
                                    }
                                    const prefixStyle = {
                                        fontSize: '.6rem',
                                        marginRight: item.type === 1 ? '.2rem':'0',
                                    };
                                    return (
                                        <div className="text-truncate">
                                            <span style={prefixStyle}>
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
                                field: 'value', name: intl.get('BLOCK_DETAIL_TRANSACTIONS_VALUE'),
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
                                field: 'gasFee', name: intl.get('BLOCK_DETAIL_TRANSACTIONS_GAS_FEE'),
                                thStyle: { textAlign: 'right' },
                                tdStyle: { textAlign: 'right' },
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
                            hash={this.state.header.hash}
                            pageSize={this.state.page.pageSize}
                            total={this.state.page.total} />
                    </div>
                </div>
            </div>
        );
    }
}

export default BlockDetail;
