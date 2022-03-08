import React from 'react';
import { Table } from './components';
import intl from 'react-intl-universal';
import services from './services';
import { timeformat } from './util';
import { defaultIntNumberFormat,defaultrNumberFormatFF2,defaultrNumberFormatFF4,hashesUnitCover } from './util/common';
import { atto2base } from './util/xfslibutil';
import Chart from "react-apexcharts";
import moment from 'moment';
const api = services.api;


function splitAndEllipsisAddress(address, len=5){
    let start = address.substring(0, len);
    let last = address.substring(address.length, address.length-len);
    return [start,'...', last].join('');
}
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: {
                latestHeight: 0,
                transactions: 0,
                difficulty: 0,
                power: 0,
                accounts: 0,
                blockTime: 0,
                blockRewards: 0,
                txsInBlock: 0,
                tps: 0
            },
            globalTdStyle: {
                fontSize:'1rem', 
                paddingTop: '1rem',
                paddingBottom: '1rem',
                whiteSpace: 'nowrap',
            },
            txCountByDayChartOptions: {
                chart: {
                    id: "basic-bar",
                    animations: {
                        enabled: false
                    },
                    toolbar: {
                        show: false,
                    },
                    zoom: {
                        enabled: false,
                    }
                },
                xaxis: {
                    categories: ['00-00', '00-00', '00-00', '00-00', '00-00', '00-00', '00-00'],
                    labels: {
                        padding: 0,
                    },
                    tooltip: {
                        enabled: false
                    },
                    axisBorder: {
                        show: false,
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                fill: {
                    opacity: .16,
                    type: 'solid'
                },
                stroke: {
                    width: 2,
                    lineCap: "round",
                    curve: "smooth",
                },
                colors: ["#206bc4"],
                legend: {
                    show: false,
                },
                grid: {
                    show: true,
                },
            },
            txCountByDayChartSeries: [
                {
                    name: intl.get('HOME_TXCOUNT_BY_DAY_VOLUME'),
                    data: [0, 0, 0, 0, 0, 0, 0]
                }
            ],
            latestBlocks: [
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
            latestTxs: [
                // {
                //     id: 10571,
                //     blockHash: "0x000000a797900f9a7a6bd6185bd111c47b23f649811c4e383b83d5619d861f09",
                //     blockHeight: 17082,
                //     blockTime: 1639652840,
                //     version: 0,
                //     from: "f3A6FZfuesZ98dFmduCR7YLffmkqnjgnA",
                //     to: "fKg8tMyp4uvMFiJ9J71Xxn5G5dbLbse4Q",
                //     gasPrice: "10000000000",
                //     gasLimit: "25000",
                //     gasUsed: "25000",
                //     gasFee: "250000000000000",
                //     data: null,
                //     nonce: 858,
                //     value: "410000000000000000",
                //     signature: null,
                //     hash: "0x463ff654b54bbb815e8e70dbae28d061e5348b53cabdf94a5f7d3e55c5d17136",
                //     status: 1,
                //     type: 0
                // },
                
            ],
        }
    }
    
    componentDidMount() {
        console.log('EntryHomePage');
        api.getStatus().then((data)=>{
            this.setState({
                status: data
            });
        });
        api.getLatest().then((data)=>{
            const { blocks, txs } = data;
            this.setState({
                latestBlocks: blocks,
                latestTxs: txs,
            });
        });
        
        api.getTxCountByDay().then((data)=>{
            let times = data.map(({time})=>{
                return moment(time).format('MM-DD');
            });
            let counts = data.map(({count})=>{
                return count;
            });
            this.setState({
                txCountByDayChartOptions:{
                    ...this.state.txCountByDayChartOptions,
                    xaxis: {
                        ...this.state.txCountByDayChartOptions.xaxis,
                        categories: times,
                    }, 
                },
                txCountByDayChartSeries: [
                    {
                        ...this.state.txCountByDayChartSeries[0],
                        data: counts,
                    }
                ]
            });
        });
    }
    render() {
        const difficultyCardText = (num)=>{
            const du = hashesUnitCover(num);
            return (
                <p className="card-text" style={{
                    fontSize: '26px',
                    fontWeight: 400,
                }}>
                    {defaultrNumberFormatFF2(du.num)}
                    <span style={{
                        fontSize: '18px',
                    }}> {du.unit}</span>
                </p>
            );
        }

        const powerCardText = (num)=>{
            const du = hashesUnitCover(num);
            return (
                <p className="card-text" style={{
                    fontSize: '26px',
                    fontWeight: 400,
                }}>
                    {defaultrNumberFormatFF2(du.num)}
                    <span style={{
                        fontSize: '18px',
                    }}> {du.unit} / S</span>
                </p>
            );
        }
        const blocksAvgRewards = atto2base(this.state.status.blockRewards);
        return (
            <div>
                <div className="row mb-4">
                    <div className="col-lg-6">
                        <div className="row">
                            <div className="col-lg-4 mb-3">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            {intl.get('HOME_STATE_LATEST_HEIGHT')}
                                        </h5>
                                        <p className="card-text" style={{
                                            fontSize: '26px',
                                            fontWeight: 400,
                                        }}>
                                            {/* <div class="skeleton-line"></div>
                                            <div class="skeleton-line"></div> */}
                                            {defaultIntNumberFormat(this.state.status.latestHeight)}
                                            {/* {this.state.status.latestHeight} */}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 mb-3">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">
                                        {intl.get('HOME_STATE_TRANSACTIONS')}
                                        </h5>
                                        <p className="card-text" style={{
                                            fontSize: '26px',
                                            fontWeight: 400,
                                        }}>
                                            {defaultIntNumberFormat(this.state.status.transactions)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 mb-3">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">
                                        {intl.get('HOME_STATE_DIFFICULTY')}
                                        </h5>
                                        {difficultyCardText(this.state.status.difficulty)}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 mb-3">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">
                                        {intl.get('HOME_STATE_POWER')}
                                        </h5>
                                        {powerCardText(this.state.status.power)}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 mb-3">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">
                                        {intl.get('HOME_STATE_ACCOUNTS')}
                                        </h5>
                                        <p className="card-text" style={{
                                            fontSize: '26px',
                                            fontWeight: 400,
                                        }}>
                                            {defaultIntNumberFormat(this.state.status.accounts)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 mb-3">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">
                                        {intl.get('HOME_STATE_AVG_BLOCK_TIME')}
                                        </h5>
                                        <p className="card-text" style={{
                                            fontSize: '26px',
                                            fontWeight: 400,
                                        }}>
                                            {defaultIntNumberFormat(this.state.status.blockTime)}
                                            <span style={{
                                                fontSize: '18px',
                                            }}> Sec</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 mb-3">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">
                                        {intl.get('HOME_STATE_AVG_BLOCK_REWARD')}
                                            </h5>
                                        <p className="card-text" style={{
                                            fontSize: '26px',
                                            fontWeight: 400,
                                        }}>
                                            {defaultrNumberFormatFF2(blocksAvgRewards)}
                                            <span style={{
                                                fontSize: '18px',
                                            }}> XFSC</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 mb-3">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">
                                        {intl.get('HOME_STATE_AVG_TXS_IN_BLOCKS')}
                                        </h5>
                                        <p className="card-text" style={{
                                            fontSize: '26px',
                                            fontWeight: 400,
                                        }}>
                                            {defaultIntNumberFormat(this.state.status.txsInBlock)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 mb-3">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">
                                        {intl.get('HOME_STATE_TXS_PRE_SECOND')}
                                        </h5>
                                        <p className="card-text" style={{
                                            fontSize: '26px',
                                            fontWeight: 400,
                                        }}>
                                            {defaultIntNumberFormat(this.state.status.tps)}
                                            <span style={{
                                                fontSize: '18px',
                                            }}> TXS / S</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="card" style={{
                            height: '365.406px'
                        }}>
                            <div className="card-body">
                                <h5 className="card-title">
                                {intl.get('HOME_TRANSACTION_HISTORY_IN_7_DAYS')}
                                </h5>
                                <Chart
                                    type="area"
                                    className={'chart-lg'}
                                    height="280px"
                                    options={this.state.txCountByDayChartOptions}
                                    series={this.state.txCountByDayChartSeries}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="col-md-6 mb-3">
                        <div className="card">
                            <div className="card-header">
                                <span style={{
                                    verticalAlign: 'middle'
                                }}>{intl.get('HOME_LATEST_BLOCKS')}</span>
                                <span className="ms-auto">
                                    <a href="/blocks" >
                                    {intl.get('HOME_VIEW_ALL')}
                                    </a>
                                </span>
                            </div>
                            <div className="card-table table-responsive">
                                <Table columns={[
                                    {
                                        field: 'height', name: intl.get('HOME_LATEST_BLOCKS_HEIGHT'),
                                        render: (item) => {
                                            return (
                                                <a href={`/blocks/${item.hash}`}>
                                                    {item.height}
                                                </a>
                                            );
                                        }
                                    },
                                    {
                                        field: 'timestamp', name: intl.get('HOME_LATEST_BLOCKS_TIME'),
                                        render: (item) => {
                                            let t = parseInt(item.timestamp);
                                            let datetime = new Date(t * 1000);
                                            const timestr = timeformat(datetime);
                                            return (
                                                <span>
                                                    {timestr}
                                                </span>
                                            );
                                        }
                                    },
                                    {
                                        field: 'coinbase', name: intl.get('HOME_LATEST_BLOCKS_MINER'),
                                        tdStyle: { maxWidth: '180px'},
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
                                    { field: 'txCount', name: intl.get('HOME_LATEST_BLOCKS_TXS'), 
                                    render: (item) => {
                                        return (
                                            <div>
                                                {defaultIntNumberFormat(item.txCount)}
                                            </div>
                                        );
                                    }},
                                    { field: 'reward', name: intl.get('HOME_LATEST_BLOCKS_REWARD'), 
                                    thStyle: {textAlign: 'right'},
                                    tdStyle: { textAlign: 'right'},
                                    render: (item) => {
                                        const rewards = atto2base(item.rewards);
                                        return (
                                            <span>
                                                {defaultrNumberFormatFF4(rewards)}
                                                <span style={{
                                                fontSize: '.8rem',
                                            }}> XFSC</span>
                                            </span>
                                        );
                                    }
                                 },
                                ]} data={this.state.latestBlocks} click={() => { }} >
                                </Table>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="card">
                            <div className="card-header">
                                <span style={{ verticalAlign: 'middle' }}>{intl.get('HOME_LATEST_TRANSACTIONS')}</span>
                                <span className="ms-auto">
                                    <a href="/txs" >
                                    {intl.get('HOME_VIEW_ALL')}
                                    </a>
                                </span>
                            </div>
                            <div className="card-table table-responsive">
                                <Table columns={[
                                    {
                                        field: 'hash', name: intl.get('HOME_LATEST_TRANSACTIONS_HASH'),
                                        tdStyle: { maxWidth: '180px',},
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
                                        name: intl.get('HOME_LATEST_TRANSACTIONS_ADDRESS'),
                                        render: (item) => {
                                            let fromAddr = splitAndEllipsisAddress(item.from);
                                            let toAddress = splitAndEllipsisAddress(item.to);
                                            return (
                                                <span>
                                                    <a href={`/accounts/${item.from}`}>
                                                            {fromAddr}
                                                        </a>&nbsp;&raquo;&nbsp;
                                                        <a href={`/accounts/${item.to}`}>
                                                            {toAddress}
                                                        </a>
                                                </span>
                                            );
                                        }
                                    },
                                    {
                                        field: 'value', name: intl.get('HOME_LATEST_TRANSACTIONS_VALUE'), 
                                        thStyle: {textAlign: 'right'},
                                        tdStyle: {textAlign: 'right'},
                                        render: (item) => {
                                            let value = atto2base(item.value);
                                            return (
                                                <span>
                                                {defaultrNumberFormatFF4(value)}
                                                <span style={{
                                                fontSize: '.8rem',
                                            }}> XFSC</span>
                                            </span>
                                            )
                                        }
                                    },
                                ]} data={this.state.latestTxs} click={() => { }} >
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Home;