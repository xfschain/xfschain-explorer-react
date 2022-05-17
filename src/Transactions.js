import qs from 'qs';
import React from 'react';
import {
    useLocation,
} from "react-router-dom";
import intl from 'react-intl-universal';
import { Table, Pagination } from './components';
import services from './services';
import { atto2base } from './util/xfslibutil';
import { defaultrNumberFormatFF4, defaultrNumberFormatFF6 } from './util/common';
const api = services.api;
function PaginationWapper(props) {
    let location = useLocation();
    const { total, pageSize, } = props;
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
            pathname='/txs'
            pageSize={pageSize} total={total} />
    );
}
class Transactions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            globalTdStyle: {
                fontSize: '1rem',
                paddingTop: '1rem',
                paddingBottom: '1rem'
            },
            data: [
                // {
                //     id: 2811,
                //     blockHash: "0x0000007c79ce45c41933ba345276925af085e6dbc5d07d97e96fac20cfb10629",
                //     blockHeight: 12049,
                //     blockTime: 1639534920,
                //     version: 0,
                //     from: "eSmZ8AVRpTjeMjRnXUZfe1S8bnxnr5svY",
                //     to: "Ydx82FC7gh4PUzFACsn8f6TvGEQJJKghT",
                //     gasPrice: "10000000000",
                //     gasLimit: "25000",
                //     gasUsed: "25000",
                //     gasFee: "250000000000000",
                //     data: null,
                //     nonce: 2105,
                //     value: "880000000000000000",
                //     signature: null,
                //     hash: "0x6f4a48933ecbf224f5cc582a126ac886556803743701bec810ef585e517f427b",
                //     status: 1,
                //     type: 0,
                //     createTime: "2022-01-05 14:25:46",
                //     updateTime: "2022-01-05 14:25:46"
                // },
            ],
            page: {
                pageSize: 20,
                total: 0
            }
        }
    }
    async componentDidMount() {
        const { history, location } = this.props;
        const { search } = location;
        const sq = qs.parse(search.replace(/^\?/, ''));
        let pageNum = sq['p'];
        pageNum = parseInt(pageNum || 1);
        try {
            let pagedata = await api.getTransactionsByPage({
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
                data: records
            });
        } catch (e) {
            console.log(e);
            // history.replace('/404');
        }
    }
    render() {
        return (
            <div>
                <h1 className="mb-4">
                    {intl.get('PAGE_TITLE_TXS')}
                </h1>
                <div className="card">
                    <div className="card-table table-responsive">
                        <Table columns={[
                            {
                                name: intl.get('TXS_TIME'),
                                render: (item) => {
                                    return (
                                        <span className="fs-6">
                                            {item.createTime}
                                        </span>
                                    );
                                }
                            },
                            {
                                field: 'hash', name: intl.get('TXS_HASH'),
                                tdStyle: { maxWidth: '180px' },
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
                                field: 'blockHeight', name: intl.get('TXS_BLOCK'),
                                render: (item) => {
                                    return (
                                        <a href={`/blocks/${item.blockHash}`}>
                                            {item.blockHeight}
                                        </a>
                                    );
                                }
                            },
                            
                            {
                                field: 'from', name: intl.get('TXS_FROM'),
                                tdStyle: { maxWidth: '120px' },
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
                                field: 'to', name: intl.get('TXS_TO'),
                                tdStyle: {maxWidth: '120px' },
                                render: (item) => {
                                    return (
                                        <div className="text-truncate">
                                            <a href={`/accounts/${item.to}`}>
                                                {item.to}
                                            </a>
                                        </div>
                                    );
                                }
                            },
                            {
                                field: 'value', name: intl.get('TXS_VALUE'),
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
                                field: 'gasFee', name: intl.get('TXS_GAS_FEE'),
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
                        ]} data={this.state.data} click={() => { }} >
                        </Table>
                    </div>
                    <div className="card-footer">
                        <PaginationWapper
                            pageSize={this.state.page.pageSize}
                            total={this.state.page.total} />
                    </div>
                </div>
            </div>
        );
    }
}
export default Transactions;