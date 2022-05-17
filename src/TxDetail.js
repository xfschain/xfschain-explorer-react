import React from 'react';
import intl from 'react-intl-universal';
import { timeformat } from './util';
import services from './services';
import { atto2base, atto2nano } from './util/xfslibutil';

import { dataFormat, defaultIntNumberFormat, defaultrNumberFormatFF6, hexToUint8Array, } from './util/common';

const api = services.api;
class TXDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                // id: 33001,
                // blockHash: "0x000000066bd59cb78e12e76d43706c38218a297d1ebf4717c7618f6efacb284c",
                // blockHeight: 23325,
                // blockTime: 1640863204,
                // version: 0,
                // from: "YTYQ9j75fcvCB7at2UB6ot2rXPCPPKhx2",
                // to: "fyjs3YU8AVakCua2etn1uqfkY8dcBUWne",
                // gasPrice: "10000000000",
                // gasLimit: "25000",
                // gasUsed: "25000",
                // gasFee: "250000000000000",
                // data: null,
                // nonce: 198,
                // value: "420000000000000000",
                // signature: null,
                // hash: "0x96884b53f5a0540453e9e2fc92aa963bd46b6deb8fbbb2b8ce3ad8a32c9fa20b",
                // status: 1,
                // type: 0
            },
            dataFormat: 'HEX'
        }
    }
    async componentDidMount() {
        const { history, match } = this.props;
        const { params } = match;
        // console.log(`data`, data);
        try {
            const data = await api.getTransactionByHash(params.hash);
            this.setState({data: data});
        } catch (e) {
            history.replace('/404');
            return;
        }
    }
    render() {
        let time = parseInt(this.state.data.blockTime);
        const timestr = timeformat(new Date(time * 1000));
        const valuestr = atto2base(this.state.data.value);
        const gasPriceVal = atto2nano(this.state.data.gasPrice);
        const gasFeeVal = atto2base(this.state.data.gasFee);
        let datastr = '';
        if (this.state.data.data){
            datastr = dataFormat({
                data: hexToUint8Array(this.state.data.data||''),
                format: this.state.dataFormat
            }) || 'Cannot Preview!';
        }
        let statusFormat = ()=>{
            switch (this.state.data.status){
                case 1:
                    return intl.get('TX_DETAIL_STATUS_SUCCESS');
                default:
                    return intl.get('TX_DETAIL_STATUS_FAILED');
            }
        }

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
                                <div className="col-md-2">
                                    {intl.get('TX_DETAIL_STATUS')}:
                                </div>
                                <div className="col-md-10">
                                    <div className="d-flex">
                                        {statusFormat(this.state.data.status)}
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('TX_DETAIL_BLOCK')}:
                                </div>
                                <div className="col-md-10">
                                    <div className="d-flex">
                                        <a href={`/blocks/${this.state.data.blockHash}`}>
                                            {this.state.data.blockHeight}
                                        </a>
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
                                    {intl.get('TX_DETAIL_TIME')}:
                                </div>
                                <div className="col-md-10">
                                    {timestr}
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('TX_DETAIL_FROM')}:
                                </div>
                                <div className="col-md-10">
                                    <a href={`/accounts/${this.state.data.from}`}>
                                        {this.state.data.from}
                                    </a>
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('TX_DETAIL_TO')}:
                                </div>
                                <div className="col-md-10">
                                    <span style={addrPrefixStyle}>
                                        {`${this.state.data.type === 1 ? '[CREATE]': ''}`}
                                    </span>
                                    <a href={`/accounts/${this.state.data.to}`}>
                                        {this.state.data.to}
                                    </a>
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
                                    {intl.get('TX_DETAIL_GAS_USED')}:
                                </div>
                                <div className="col-md-10">
                                    {defaultIntNumberFormat(this.state.data.gasUsed)}
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <div className="row">
                                <div className="col-md-2">
                                    {intl.get('TX_DETAIL_GAS_FEE')}:
                                </div>
                                <div className="col-md-10">
                                    {defaultrNumberFormatFF6(gasFeeVal)} XFSC
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

export default TXDetail;
