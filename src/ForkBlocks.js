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
  
class ForkBlocks extends React.Component {
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
            data: [],
        }
    }
    async componentDidMount(){
        const { history, location } = this.props;
        const {search} = location;
        const sq = qs.parse(search.replace(/^\?/,''));
        let pageNum = sq['p'];
        pageNum = parseInt(pageNum||1);
        try{
            let pagedata = await api.getForkBlocksByPage({params: {
                p: pageNum,
            }});
            let {total,records} = pagedata;
            let pageSize = this.state.page.pageSize;
            console.log(pageSize)
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
                    {intl.get('PAGE_TITLE_FORK_BLOCKS')}
                </h1>
                <div className="card">
                    <div className="card-table table-responsive">
                        <Table columns={[
                            {
                                field: 'height', name: intl.get('BLOCKS_HEIGHT'), 
                                render: (item) => {
                                    return (
                                        <a href={`/fork_blocks/${item.hash}`}>
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
                                            <a href={`/fork_blocks/${item.hash}`}>
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
export default ForkBlocks;
