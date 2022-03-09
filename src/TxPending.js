import React from 'react';
import intl from 'react-intl-universal';
import { timeformat } from './util';
import services from './services';
import { atto2base, atto2nano } from './util/xfslibutil';

import { dataFormat, defaultIntNumberFormat, defaultrNumberFormatFF6, hexToUint8Array, } from './util/common';
const api = services.api;
const baseWebsocketurl = process.env.REACT_APP_WEBSOCKET_BASE_URL;
class TxPending extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                data: null,
                gas_limit: 0,
                gas_price: 0,
                nonce: 0, 
                from: "",
                to: "",
                value: 0,
                version: 0
            },
            dataFormat: 'HEX'
        }
    }
    async componentDidMount() {
        const { history, match } = this.props;
        const { params } = match;
        let websocketurl = baseWebsocketurl + '/listen';
        const socket = new WebSocket(websocketurl);
        socket.addEventListener('open', function (event) {
            console.log('Success listen', websocketurl);
        });
        socket.addEventListener('message', async function (event) {
            if (event.data.size===0){
                return;
            }
            event.data.arrayBuffer().then((data)=>{
                let datauint8 = new Uint8Array(data);
                let utf8decoder = new TextDecoder();
                let datastring = utf8decoder.decode(datauint8);
                let dataobj = JSON.parse(datastring);
                const {type} = dataobj;
                if (type !== 2 || !dataobj.data || !dataobj.data.hash){
                    return;
                }
                let txhash = dataobj.data.hash;
                if (txhash !== params.hash){
                    return;
                }
                console.log('receive', dataobj);
                history.replace(`/tx/${params.hash}`);
            });
        });
        // console.log(`data`, data);
        try {
            const data = await api.jsonrpc({
                "method": "TxPool.GetTranByHash",
                "params":{
                    "hash": params.hash,
                },
                "id": 1,
                "jsonrpc": "2.0"
            });
            if (!data || !data.result){
                throw Error('not found');
            }
            this.setState({data: data.result});
        } catch (e) {
            history.replace('/404');
            return;
        }
    }
    render() {
        const valuestr = atto2base(this.state.data.value.toString());
        const gasPriceVal = atto2nano(this.state.data.gas_price.toString());
        let datastr = '';
        if (this.state.data.data){
            datastr = dataFormat({
                data: hexToUint8Array(this.state.data.data||''),
                format: this.state.dataFormat
            }) || 'Cannot Preview!';
        }
        return (
            <div>
                <h1 className="mb-4">
                    {intl.get('PAGE_TITLE_TX_DETAIL')}
                </h1>
                
                <div className="card mb-4">
                    <div className="progress progress-sm">
                        <div className="progress-bar bg-lime progress-bar-indeterminate"></div>
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
                                        <a href={`/accounts/${this.state.data.to}`}>
                                            {this.state.data.to}
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
                                    {defaultIntNumberFormat(this.state.data.gas_limit)}
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

export default TxPending;