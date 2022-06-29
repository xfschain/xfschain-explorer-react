import qs from 'qs';
import React from 'react';
import {
    useLocation,
} from "react-router-dom";
import { Table, Pagination } from './components';
import intl from 'react-intl-universal';
import services from './services';
import { atto2base } from './util/xfslibutil';
import { defaultIntNumberFormat, defaultrNumberFormatFF6 } from './util/common';
const api = services.api;
function PaginationWapper(props) {
    let location = useLocation();
    const { total, pageSize } = props;
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
            pathname='/accounts'
            pageSize={pageSize} total={total} />
    );
}

class Accounts extends React.Component {
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
            data: [
                // {
                //     id: 65,
                //     address: "RAvv3vb8USNbZXFfrxZGm4EpjDrUGYjAB",
                //     balance: "2427000000000000000000",
                //     nonce: 0,
                //     extra: null,
                //     code: null,
                //     stateRoot: null,
                //     alias: null,
                //     type: 0,
                //     display: true,
                //     fromStateRoot: "0x2766f150cf6f04cea92ef70a5486bafce51c8dd89e027a229778307e7a58ec0d",
                //     fromBlockHeight: 16116,
                //     fromBlockHash: "0x0000003eb9acf836798f443c0f3eecad2c951acad7fbb26272a582b221654ee8",
                //     createTime: "2022-01-05 08:43:43",
                //     updateTime: "2022-01-05 08:43:43"
                // },

            ],
        }
    }
    async componentDidMount() {
        const { history, location } = this.props;
        const { search } = location;
        const sq = qs.parse(search.replace(/^\?/, ''));
        let pageNum = sq['p'];
        pageNum = parseInt(pageNum || 1);
        try {
            let pagedata = await api.getAccountsByPage({
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
                    {intl.get('PAGE_TITLE_ACCOUNTS')}
                </h1>
                <div className="card">
                    <div className="card-table table-responsive">
                        <Table columns={[
                            {
                                name: intl.get('ACCOUNTS_ADDRESS'),
                                render: (item) => {
                                    return (
                                        <a href={`/accounts/${item.address}`}>
                                            {item.address}
                                        </a>
                                    );
                                }
                            },
                            {
                                name: intl.get('ACCOUNTS_BALANCE'),
                                thStyle: { textAlign: 'right' },
                                tdStyle: {textAlign: 'right' },
                                render: (item) => {
                                    let val = atto2base(item.balance);
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
                            {
                                name: intl.get('ACCOUNTS_NONCE'),
                                thStyle: { textAlign: 'right' },
                                tdStyle: { textAlign: 'right',},
                                render: (item) => {
                                    return (
                                        <span>
                                            {/* {item.balance} */}
                                            {defaultIntNumberFormat(item.nonce)}
                                        </span>
                                    );
                                }
                            },
                            {
                                name: intl.get('ACCOUNTS_UPDATE_TIME'),

                                thStyle: { textAlign: 'right' },
                                tdStyle: { textAlign: 'right' },
                                render: (item) => {
                                    return (
                                        <span className="fs-6">
                                            {item.updateTime}
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
export default Accounts;