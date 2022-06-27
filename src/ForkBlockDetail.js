import React from 'react';

import intl from 'react-intl-universal';
import { timeformat } from './util';
import services from './services';
import { atto2base } from './util/xfslibutil';
import { defaultIntNumberFormat, defaultrNumberFormatFF4,defaultrNumberFormatFF6 } from './util/common';
import qs from 'qs';
const api = services.api;

class ForkBlockDetail extends React.Component {
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
            data: {},
            transactions: []
        }
    }
    async componentDidMount() {
        const { history, match, location } = this.props;
        const { params } = match;
        try {
            const data = await api.getForkBlockDetailByPage(params.hash);
            this.setState({ data: data });
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
        let time = parseInt(this.state.data.timestamp);
        const timestr = timeformat(new Date(time * 1000));
        const blockRewards = atto2base(this.state.data.rewards);
        return (
            <div>
                <h1 className="mb-4">
                    {intl.get('PAGE_TITLE_FORK_BLOCK_DETAIL')}&nbsp;#&nbsp;{this.state.data.height}
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
                                        {this.state.data.height}
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
                                    {this.state.data.version}
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('BLOCK_DETAIL_PREV_BLOCK_HASH')}:
                                </div>
                                <div className="col-md-10">
                                    <a href={`/fork_blocks/${this.state.data.hashPrevBlock}`}>
                                        {this.state.data.hashPrevBlock}
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
                                    {this.state.data.hash}
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
                                    <a href={`/accounts/${this.state.data.coinbase}`}>
                                        {this.state.data.coinbase}
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
                                    {this.state.data.stateRoot}
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('BLOCK_DETAIL_TRANSACTIONS_ROOT_HASH')}:
                                </div>
                                <div className="col-md-10">
                                    {this.state.data.transactionsRoot}
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('BLOCK_DETAIL_RECEIPTS_ROOT_HASH')}:
                                </div>
                                <div className="col-md-10">
                                    {this.state.data.receiptsRoot}
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('BLOCK_DETAIL_GAS_LIMIT')}:
                                </div>
                                <div className="col-md-10">
                                    {defaultIntNumberFormat(this.state.data.gasLimit)}
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('BLOCK_DETAIL_GAS_USED')}:
                                </div>
                                <div className="col-md-10">
                                    {defaultIntNumberFormat(this.state.data.gasUsed)}
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('BLOCK_DETAIL_BITS')}:
                                </div>
                                <div className="col-md-10">
                                    {this.state.data.bits}
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('BLOCK_DETAIL_NONCE')}:
                                </div>
                                <div className="col-md-10">
                                    {this.state.data.nonce}
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('BLOCK_DETAIL_EXTRA_NONCE')}:
                                </div>
                                <div className="col-md-10">
                                    {this.state.data.extraNonce}
                                </div>
                            </div>
                        </li>
                        
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('BLOCK_DETAIL_TXCOUNT')}:
                                </div>
                                <div className="col-md-10">
                                    {defaultIntNumberFormat(this.state.data.txCount)}
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>

            </div>
        );
    }
}

export default ForkBlockDetail;