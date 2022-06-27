import qs from 'qs';
import React from 'react';
import {
    useLocation,
} from "react-router-dom";
import intl from 'react-intl-universal';
import { Table, Pagination } from './components';
import services from './services';
import { atto2base } from './util/xfslibutil';
import { defaultrNumberFormatFF4 } from './util/common';
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
class PendingTxs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            globalTdStyle: {
                fontSize: '1rem',
                paddingTop: '1rem',
                paddingBottom: '1rem'
            },
            data: [],
            page: {
                pageSize: 20,
                total: 0
            }
        }
    }
    async componentDidMount() {
        const { location } = this.props;
        const { search } = location;
        const sq = qs.parse(search.replace(/^\?/, ''));
        let pageNum = sq['p'];
        pageNum = parseInt(pageNum || 1);
        try {
            let pagedata = await api.getPendingTxsByPage({
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
            console.warn(e);
            // history.replace('/404');
        }
    }
    render() {
        return (
            <div>
                <h1 className="mb-4">
                    {intl.get('PAGE_TITLE_PENDING_TXS')}
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
                                            <a href={`/pendingtxs/${item.hash}`}>
                                                {item.hash}
                                            </a>
                                        </div>
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
                                    const prefixStyle = {
                                        fontSize: '.6rem',
                                        marginRight: item.type === 1 ? '.2rem':'0',
                                    };
                                    let toAddress = '';
                                    if (item.type === 0){
                                        toAddress = item.to;
                                    }else if (item.type === 1){
                                        const contractAddress = item.contractAddress;
                                        toAddress = contractAddress;
                                    }
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
export default PendingTxs;
