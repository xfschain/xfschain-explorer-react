import React, {useState, useMemo, useEffect} from 'react';
import {
    useLocation,
    useRouteMatch,
} from "react-router-dom";
import intl from 'react-intl-universal';
import { Table, Pagination } from './components';
import services from './services';
import { atto2base,bigToBase } from './util/xfslibutil';
import { defaultIntNumberFormat, defaultNumberFormatFF9, defaultrNumberFormatFF4, defaultrNumberFormatFF6, numberFormatPercent } from './util/common';
import classNames from 'classnames';
import qs from 'qs';

function TableNav(props){
    const {data,} = props;
    const [actived,setActived] = useState(props?.defaultActive);
    const activeChildren = [...props.children].filter((item)=>{
        return item.key === actived});
    console.log(activeChildren);
    return (
    <div>
      <ul className="home-data-nav">
        {data?.map((item)=>{
          const itemLinkClass = classNames({
            [`active`]: actived === item.key
          }, 'nav-link');
          return (

        <li className="nav-item" key={item?.key}>
          <a className={itemLinkClass} onClick={(e)=>{
            setActived(item?.key);
			if(props.onChange){
                props?.onChange(item);
            }
          }}>
            {item?.title}
          </a>
        </li>
          );
        })}
      </ul>
        {activeChildren}
    </div>
    );
}
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
            pathname={`/std_tokens/${address}`}
            pageSize={pageSize} total={total} />
    );
}
const api = services.api;

const HoldersTable = (props)=>{

    const [data, setData] = useState({
        total: 0,
        records: [],
    });
    const pageSize = 20;
        const { search } = useLocation();
    const match = useRouteMatch();
    const params = match.params;
        const sq = qs.parse(search.replace(/^\?/, ''));
        let pageNum = sq['p'];
        pageNum = parseInt(pageNum || 1);
    useEffect(()=>{
         api.getHoldersByAddressFromSTDToken(params.address,{
                 params: {
                     p: pageNum,
                 }
          }).then((pagedata)=>{
             setData(pagedata);
         });
    },[]);
     let pn = parseInt(data.total / pageSize);
     const m = data.total % pageSize;
     pn = m > 0 ? pn + 1 : pn;
    return (
        <div className="mt-2">
            <div className="card-table table-responsive">
                <Table columns={[
                    {
                        field: 'address', name: intl.get('TOKENS_HOLDER_ADDRESS'),
                        tdStyle: { maxWidth: '160px' },
                        render: (item) => {
                            const AddressView = ()=>{
                                if (item.address){
                                    return (
                                        <a href={`/accounts/${item.address}`}>
                                         {item.address}
                                        </a>
                                    );
                                }
                                return (
                                <span>NULL ADDRESS</span>
                                );
                            };
                            return (
                                <div className="text-truncate">
                                    <AddressView />
                                </div>
                            );
                        }
                    },
                    {
                        field: 'amount', name: intl.get('TOKENS_AMOUNT'),
                        thStyle: { textAlign: 'right' },
                        tdStyle: { textAlign: 'right' },
                        render: (item) => {
                            let val = bigToBase(item.balance, props.decimals,1);
                            return (
                                <span>
                                    {defaultrNumberFormatFF4(val)}
                                    <span style={{
                                        fontSize: '.8rem',
                                    }}> {props?.symbol}</span>
                                </span>
                            );
                        }
                    },
                    {
                        name: intl.get('TOKENS_HOLDER_PERCENTAGE'),
                        thStyle: { textAlign: 'right' },
                        tdStyle: { textAlign: 'right',width:'6rem' },
                        render: (item) => {
                            let percentage = parseFloat(item.proportion);
                            percentage = percentage * 100.0;
                            return (
                                <span className="fs-6">
                                    {numberFormatPercent(percentage)}
                                    <span>%</span>
                                </span>
                            );
                        }
                    },
                    {
                        name: intl.get('TOKENS_HOLDER_UPDATE'),
                        thStyle: { textAlign: 'right' },
                        tdStyle: { textAlign: 'right',width:0 },
                        render: (item) => {
                            return (
                                <span className="fs-6">
                                    {item.updateTime}
                                </span>
                            );
                        }
                    },
                ]} data={data.records} click={() => { }} >
                </Table>

            </div>
            <div className="card-footer">
                <PaginationWapper
                    address={props?.address}
                    pageSize={pageSize}
                    total={data.total} />
            </div>
            </div>
    );
};

const TransfersTable = (props)=>{

    const [data, setData] = useState({
        total: 0,
        records: [],
    });
    const pageSize = 20;
        const { search } = useLocation();
    const match = useRouteMatch();
    const params = match.params;
        const sq = qs.parse(search.replace(/^\?/, ''));
        let pageNum = sq['p'];
        pageNum = parseInt(pageNum || 1);
    useEffect(()=>{
         api.getTxsByAddressFromSTDToken(params.address,{
                 params: {
                     p: pageNum,
                 }
          }).then((pagedata)=>{
             setData(pagedata);
         });
    },[]);
     let pn = parseInt(data.total / pageSize);
     const m = data.total % pageSize;
     pn = m > 0 ? pn + 1 : pn;
    return (
        <div className="mt-2">
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
                        field: 'txHash', name: intl.get('ACCOUNT_DETAIL_TRANSACTIONS_HASH'),
                        tdStyle: { maxWidth: '160px' },
                        render: (item) => {
                            return (
                                <div className="text-truncate">
                                    <a href={`/txs/${item.txHash}`}>
                                        {item.txHash}
                                    </a>
                                </div>
                            );
                        }
                    },
                    {
                        field: 'from', name: intl.get('ACCOUNT_DETAIL_TRANSACTIONS_FROM'),
                        tdStyle: { maxWidth: '160px' },
                        render: (item) => {
                            const AddressView = ()=>{
                                if (item.fromAddress){
                                    return (
                                        <a href={`/accounts/${item.fromAddress}`}>
                                         {item.fromAddress}
                                        </a>
                                    );
                                }
                                return (
                                <span>NULL ADDRESS</span>
                                );
                            };
                            return (
                                <div className="text-truncate">
                                    <AddressView />
                                </div>
                            );
                        }
                    },
                    {
                        field: 'to', name: intl.get('ACCOUNT_DETAIL_TRANSACTIONS_TO'),
                        tdStyle: { maxWidth: '160px' },
                        render: (item) => {
                            const AddressView = ()=>{
                                if (item.toAddress){
                                    return (
                                        <a href={`/accounts/${item.toAddress}`}>
                                         {item.toAddress}
                                        </a>
                                    );
                                }
                                return (
                                <span>NULL ADDRESS</span>
                                );
                            };
                            return (
                                <div className="text-truncate">
                                    <AddressView />
                                </div>
                            );
                        }
                    },
                    {
                        field: 'amount', name: intl.get('TOKENS_AMOUNT'),
                        thStyle: { textAlign: 'right' },
                        tdStyle: { textAlign: 'right' },
                        render: (item) => {
                            let val = bigToBase(item.amount, props.decimals,1);
                            return (
                                <span>
                                    {defaultrNumberFormatFF4(val)}
                                    <span style={{
                                        fontSize: '.8rem',
                                    }}> {props?.symbol}</span>
                                </span>
                            );
                        }
                    },
                ]} data={data.records} click={() => { }} >
                </Table>

            </div>
            <div className="card-footer">
                <PaginationWapper
                    address={props?.address}
                    pageSize={pageSize}
                    total={data.total} />
            </div>
            </div>
    );
};
class STDTokenItem extends React.Component {
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
            tableNavs: [
                {
                    key: 'transfers',
                    title: intl.get('TOKENS_TABLE_TRANSFERS'),
                },
                {
                    key: 'holders',
                    title: intl.get('TOKENS_TABLE_HOLDERS'),
                },
            ],
			defaultNav: 'transfers',
            data: {
            },
        }
    }
    async componentDidMount() {
        const { history, location, match } = this.props;
        const { params } = match;
        try {
            const data = await api.getSTDTokenByAddress(params.address);
            this.setState({data: data});
        }catch(e){
            history.replace('/404');
        }
    }
    render() {
        // let time = parseInt(this.state.data.header.timestamp);
        // const timestr = timeformat(new Date(time * 1000));
        const { history, location, match } = this.props;
        const { params } = match;
        const decimals = this.state?.data.decimals;
        const totalSupply = bigToBase(this.state?.data.totalSupply, decimals, 1);
        return (
            <div>
                <h1 className="mb-4">
                {intl.get('PAGE_TITLE_STD_TOKEN_ITEM')}
                </h1>
                <div className="row">
                    <div className="col-6">
                <div className="card mb-4">
                    <ul className="list-group list-group-flush">
                    <li className="list-group-item py-3">
                        <div className="row">
                            <div className="col-md-2">
                            {intl.get('TOKENS_ADDRESS')}:
                            </div>
                            <div className="col-md-10">
                                <div className="d-flex">
                                    <a href={`/accounts/${this.state.data.contractAddress}`}>
                                        {this.state.data.contractAddress}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li className="list-group-item py-3">
                        <div className="row">
                            <div className="col-md-2">
                            {intl.get('TOKENS_NAME')}:
                            </div>
                            <div className="col-md-10">
                                <div className="d-flex">
                                    {this.state?.data.name}
                                </div>
                            </div>
                        </div>
                    </li>
                    <li className="list-group-item py-3">
                        <div className="row">
                            <div className="col-md-2">
                            {intl.get('TOKENS_SYMBOL')}:
                            </div>
                            <div className="col-md-10">
                                <div className="d-flex">
                                    {this.state?.data.symbol}
                                </div>
                            </div>
                        </div>
                    </li>
                    <li className="list-group-item py-3">
                        <div className="row">
                            <div className="col-md-2">
                                {intl.get('TOKENS_DECIMALS')}:
                            </div>
                            <div className="col-md-10">
                                {defaultIntNumberFormat(this.state?.data.decimals)}
                            </div>
                        </div>
                    </li>
                    <li className="list-group-item py-3">
                        <div className="row">
                            <div className="col-md-2">
                            {intl.get('ACCOUNT_DETAIL_CREATER')}:
                            </div>
                            <div className="col-md-10">
                                <a href={`/accounts/${this.state.data.createFromAddress}`}>
                                    {this.state?.data.createFromAddress}
                                </a>
                            </div>
                        </div>
                    </li>
                    </ul>
                </div>
                    </div>

                    <div className="col-6">
                <div className="card mb-4">
                    <ul className="list-group list-group-flush">
                    <li className="list-group-item py-3">
                        <div className="row">
                            <div className="col-md-2">
                                {intl.get('TOKENS_TOTAL_SUPPLY')}:
                            </div>
                            <div className="col-md-10">
                                {defaultrNumberFormatFF6(totalSupply)}
                            </div>
                        </div>
                    </li>
                    <li className="list-group-item py-3">
                        <div className="row">
                            <div className="col-md-2">
                            {intl.get('TOKENS_TXS')}:
                            </div>
                            <div className="col-md-10">
                            {defaultIntNumberFormat(this.state?.data.txNum)}
                            </div>
                        </div>
                    </li>
                    <li className="list-group-item py-3">
                        <div className="row">
                            <div className="col-md-2">
                            {intl.get('TOKENS_HOLDERS')}:
                            </div>
                            <div className="col-md-10">
                            {defaultIntNumberFormat(this.state?.data.holderNum)}
                            </div>
                        </div>
                    </li>
                    <li className="list-group-item py-3">
                        <div className="row">
                            <div className="col-md-2">
                                {intl.get('ACCOUNT_DETAIL_NONCE')}:
                            </div>
                            <div className="col-md-10">
                            {defaultIntNumberFormat(this.state.data.nonce)}
                            </div>
                        </div>
                    </li>
                    <li className="list-group-item py-3">
                        <div className="row">
                            <div className="col-md-2">
                                {intl.get('TOKENS_UPDATE_TIME')}:
                            </div>
                            <div className="col-md-10">
                                {this.state?.data.updateTime}
                            </div>
                        </div>
                    </li>
                    </ul>
                </div>
                    </div>
                </div>
                <div className="card">
                    <TableNav 
                        data={this.state.tableNavs}
                        defaultActive={this.state.defaultNav}
                    >
                        <TransfersTable key={`transfers`} 
                            address={params.address}
                            decimals={this.state?.data.decimals}
                            symbol={this.state?.data.symbol}
                        />
                        <HoldersTable key={`holders`} 
                            address={params.address}
                            decimals={this.state?.data.decimals}
                            symbol={this.state?.data.symbol}
                        />
                    </TableNav>
                </div>
            </div>
        );
    }
}

export default STDTokenItem;
