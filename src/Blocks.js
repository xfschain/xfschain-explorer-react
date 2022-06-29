import qs from 'qs';
import React from 'react';
import {
    useLocation,
  } from "react-router-dom";
import { Table,Pagination } from './components';
import { timeformat } from './util';
import intl from 'react-intl-universal';
import services from './services';
import { atto2base } from './util/xfslibutil';
import { defaultIntNumberFormat,defaultrNumberFormatFF4 } from './util/common';
const api = services.api;
function PaginationWapper(props) {
    let location = useLocation();
    const {total, pageSize} = props;
    const {search} = location;
    const sq = qs.parse(search.replace(/^\?/,''));
    let pageNum = sq['p'];
    if (!pageNum) {
        pageNum = 1;
    }
    return (
        <Pagination current={pageNum}
        firstLableText={intl.get('PAGE_TABLE_PAGINATION_FIRST')}
        pageLableText={intl.get('PAGE_TABLE_PAGINATION_PAGE')}
        lastLableText={intl.get('PAGE_TABLE_PAGINATION_LAST')}
        pathname='/blocks'
        pageSize={pageSize} total={total}/>
    );
  }
  
class Blocks extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            page: {
                pageSize: 20,
                total: 0
            },
            globalTdStyle: {
                fontSize:'1rem', 
                paddingTop: '1rem',
                paddingBottom: '1rem'  
            },
            data: [
                // {
                //     id: 12112,
                //     hash: "0x00000062be70b7bf0319404c8ddfb0abd0c741a29b4bb98a2f92796e48580966",
                //     height: 12111,
                //     version: 0,
                //     hashPrevBlock: "0x000000dca98d022526682c1165f001c12f71a335240ffe28a147dbc21c5e984a",
                //     timestamp: 1639535358,
                //     coinbase: "ig3Zb1paNi1iTob5k3853cDPVSBaCuLZU",
                //     stateRoot: "0x8da47c1f919bc94af56a9421c2681dfeb902edd6841180a7040f4ffce83fa475",
                //     transactionsRoot: "0x3cb1db3623d0a999e92f82b930ff1520406d17de11621818fe728fb5f7e9d8ad",
                //     receiptsRoot: "0x89642220dc068df76533ed40678dba141fbdf1ca1626bf87eef43bf5c54b9a35",
                //     gasLimit: 2500000,
                //     gasUsed: 250000,
                //     bits: 4278190109,
                //     nonce: 46300,
                //     extraNonce: "12603133301523114000",
                //     txCount: 10,
                //     rewards: "0"
                // },
            ],
        }
    }
    async componentDidMount(){
        const { history, location } = this.props;
        const {search} = location;
        const sq = qs.parse(search.replace(/^\?/,''));
        let pageNum = sq['p'];
        pageNum = parseInt(pageNum||1);
        try{
            let pagedata = await api.getBlocksByPage({params: {
                p: pageNum,
            }});
            let {total,records} = pagedata;
            let pageSize = this.state.page.pageSize;
            let pn = parseInt(total / pageSize);
            let mod = total % pageSize;
            if (mod > 0) {
                pn += 1;
            }
            if (pageNum > pn){
                throw new Error('pagenum overflow');
            }
            this.setState({page: {total: total, 
                pageSize: pageSize}, 
                data: records});
        }catch(e) {
            console.warn(e);
        }
    }
    render() {
        return (
            <div>
                <h1 className="mb-4">
                    {intl.get('PAGE_TITLE_BLOCKS')}
                </h1>
                <div className="card">
                    <div className="card-table table-responsive">
                        <Table columns={[
                            {
                                field: 'height', name: intl.get('BLOCKS_HEIGHT'), 
                                render: (item) => {
                                    return (
                                        <a href={`/blocks/${item.hash}`}>
                                            {item.height}
                                        </a>
                                    );
                                }
                            },
                            {
                                field: 'hash', name: intl.get('BLOCKS_HASH'), 
                                tdStyle:{ maxWidth: '180px', },
                                render: (item) => {
                                    return (
                                        <div className="text-truncate">
                                            <a href={`/blocks/${item.hash}`}>
                                                {item.hash}
                                            </a>
                                        </div>
                                    );
                                }
                            },
                            {
                                field: 'timestamp', name: intl.get('BLOCKS_TIME'),
                                render: (item) => {
                                    let time = parseInt(item.timestamp);
                                    const timestr = timeformat(new Date(time * 1000));
                                    return (
                                        <span className="fs-6">
                                            {timestr}
                                        </span>
                                    );
                                }
                            },
                            {
                                field: 'coinbase', name: intl.get('BLOCKS_MINER'),
                                tdStyle:{ maxWidth: '180px',},
                                 render: (item) => {
                                    return (
                                        <div className="text-truncate">
                                            <a href={`/accounts/${item.coinbase}`}>
                                                {item.coinbase}
                                            </a>
                                        </div>
                                    );
                                }
                            },
                            { field: 'txCount', name: intl.get('BLOCKS_TXS'), 
                            thStyle: {textAlign: 'right'},
                            tdStyle: {textAlign: 'right' },
                            render: (item)=>{
                                return (
                                    <span>
                                        {defaultIntNumberFormat(item.txCount)}
                                    </span>
                                );
                            },
                         },
                            { field: 'gasUsed', name: intl.get('BLOCKS_GAS_USED'),
                            thStyle: {textAlign: 'right'},
                            tdStyle: {textAlign: 'right' },
                              render: (item)=>{
                                  return (
                                      <span>
                                          {defaultIntNumberFormat(item.gasUsed)}
                                      </span>
                                  );
                              }},
                            { field: 'gasLimit', name: intl.get('BLOCKS_GAS_LIMIT'),
                            thStyle: {textAlign: 'right'},
                            tdStyle: {textAlign: 'right'  },
                            render: (item)=>{
                                return (
                                    <span>
                                        {defaultIntNumberFormat(item.gasLimit)}
                                    </span>
                                );
                            }},
                            { field: 'rewards', name: intl.get('BLOCKS_REWARD'), 
                                    thStyle: {textAlign: 'right'},
                                    tdStyle: { textAlign: 'right', },
                                    render: (item) => {
                                        
                                        let value = atto2base(item.rewards);
                                        return (
                                            <span>
                                                {defaultrNumberFormatFF4(value)}
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
                         total={this.state.page.total}/>
                    </div>
                </div>
            </div>
        );
    }
}
export default Blocks;
