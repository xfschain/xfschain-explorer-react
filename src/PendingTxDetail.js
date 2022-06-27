import React from 'react';
import intl from 'react-intl-universal';
import services from './services';
import { atto2base, atto2nano } from './util/xfslibutil';

import { dataFormat, defaultIntNumberFormat, defaultrNumberFormatFF6, hexToUint8Array, } from './util/common';
import classNames from 'classnames';
const api = services.api;
class PendingTxDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 0,
            data: {
                data: null,
                gasLimit: 0,
                gasPrice: 0,
                nonce: 0, 
                from: "",
                to: "",
                value: 0,
                version: 0
            },
            dataFormat: 'HEX',
            pingLoopId: 0  
        }
    }
    pingLoop(txhash){
        let loopId = setInterval(async()=>{
            if (this.status ==1){
                return;
            }
            const data = await api.getPendingTxsDetailByPage(txhash)
            if (!data) {
                this.setState({status:1})
                return
            }
        }, 1000);
        this.setState({pingLoopId: loopId});
    }
    componentWillUnmount(){
        clearInterval(this.state.pingLoopId);
    }
    async componentDidMount() {
        const { history, match } = this.props;
        const { params } = match;
        
        if (!params.hash || !/^0x[0-9a-fA-F]{64}$/.test(params.hash)) {
            // history.replace('/404');
            return;
        }
        this.pingLoop(params.hash);
        try {
            // const data = await api.getPendingTxsDetailByPage(params.hash);
            // this.setState({data: data});
            const data = await api.getPendingTxsDetailByPage(params.hash);
            this.setState({ data: data });
        }catch(e){
            // history.replace('/404');
            return;
        }
   
    }
    render() {
        const valuestr = atto2base(this.state.data.value.toString());
        const gasPriceVal = atto2nano(this.state.data.gasPrice.toString());
        let datastr = '';
        if (this.state.data.data){
            datastr = dataFormat({
                data: hexToUint8Array(this.state.data.data||''),
                format: this.state.dataFormat
            }) || 'Cannot Preview!';
        }
        let StatusView = (props)=>{
            if (this.state.status === 1){
                return (
                    <div className="col-md-10">
                    <div className="d-flex">
                        <span style={{
                            marginRight: '1rem'
                        }}>
                            <i style={{verticalAlign: 'middle'}} className="ti ti-check"></i>
                        </span>
                        <span style={{
                            marginTop: '.15rem'
                        }}>
                            {intl.get('TX_DETAIL_STATUS_SUCCESS')}
                        </span>
                    </div>
                </div>
                );
            }
            return (
                <div className="col-md-10">
                    <div className="d-flex">
                        <span style={{
                            marginRight: '1rem'
                        }}>
                            <div className="spinner-border text-muted" style={{color:'#2fb344 !important'}}></div>
                        </span>
                        <span style={{
                            marginTop: '.15rem'
                        }}>
                            {intl.get('TX_DETAIL_STATUS_PENDING')}
                        </span>
                    </div>
                </div>
            );
        }
        let progressStyles = {
            width: this.state.status === 0?0:'100%'
        };
        let progressClasses = classNames({
            [`progress-bar-indeterminate`]: this.state.status === 0,
        }, 'progress-bar bg-lime');
        const addrPrefixStyle = {
            fontSize: '.6rem',
            marginRight: this.state.data.type === 1 ? '.2rem':'0',
        };
        return (
            <div>
                <h1 className="mb-4">
                    {intl.get('PAGE_TITLE_TX_DETAIL')}
                </h1>
                
                <div className="card mb-4">
                    <div className="progress progress-sm">
                        <div style={progressStyles} className={progressClasses}></div>
                    </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('TX_DETAIL_HASH')}:
                                </div>
                                <div className="col-md-10">
                                    {this.state.data.hash}
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2" style={{
                                    marginTop: '.2rem'
                                }}>
                                    {intl.get('TX_DETAIL_STATUS')}:
                                </div>
                                {<StatusView />}
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('TX_DETAIL_VERSION')}:
                                </div>
                                <div className="col-md-10">
                                    {this.state.data.version}
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('TX_DETAIL_FROM')}:
                                </div>
                                <div className="col-md-10">
                                    <div className="d-flex">
                                        <a href={`/accounts/${this.state.data.from}`}>
                                            {this.state.data.from}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('TX_DETAIL_TO')}:
                                </div>
                                <div className="col-md-10">
                                    <div className="d-flex">
                                        <span style={addrPrefixStyle}>
                                            {`${this.state.data.type === 1 ? '[CREATE]': ''}`}
                                        </span>
                                        <a href={`/accounts/${this.state.data.type === 1 ? this.state.data.contractAddress:this.state.data.to}`}>
                                        {this.state.data.type === 1 ? this.state.data.contractAddress:this.state.data.to}
                                       </a>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('TX_DETAIL_VALUE')}:
                                </div>
                                <div className="col-md-10">
                                    {defaultrNumberFormatFF6(valuestr)} XFSC
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('TX_DETAIL_GAS_PRICE')}:
                                </div>
                                <div className="col-md-10">
                                    {defaultIntNumberFormat(gasPriceVal)} NanoXFSc
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('TX_DETAIL_GAS_LIMIT')}:
                                </div>
                                <div className="col-md-10">
                                    {defaultIntNumberFormat(this.state.data.gasLimit)}
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('TX_DETAIL_NONCE')}:
                                </div>
                                <div className="col-md-10">
                                    {this.state.data.nonce}
                                </div>
                            </div>
                        </li>
                    </ul>
                    
                </div>

                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">
                            {intl.get('TX_DETAIL_TRANSACTION_DATA')}
                        </h5>
                        <div className="py-2">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input"
                                    type="radio" id="dataFormatHEX"
                                    checked={this.state.dataFormat === 'HEX'}
                                    onChange={(e) => {
                                        this.setState({ dataFormat: 'HEX' });
                                    }}
                                />
                                <label className="form-check-label" htmlFor="dataFormatHEX">
                                    HEX
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input"
                                    type="radio" id="dataFormatTEXT"
                                    checked={this.state.dataFormat === 'TEXT'}
                                    onChange={(e) => {
                                        this.setState({ dataFormat: 'TEXT' });
                                    }}
                                />
                                <label className="form-check-label" htmlFor="dataFormatTEXT">
                                    TEXT
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input"
                                    type="radio" id="dataFormatJSON"
                                    checked={this.state.dataFormat === 'JSON'}
                                    onChange={(e) => {
                                        this.setState({ dataFormat: 'JSON' });
                                    }}
                                />
                                <label className="form-check-label" htmlFor="dataFormatJSON">
                                    JSON
                                </label>
                            </div>
                        </div>
                        <div>
                            <textarea
                                className="form-control"
                                rows="3"
                                readOnly
                                value={datastr}></textarea>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PendingTxDetail;
