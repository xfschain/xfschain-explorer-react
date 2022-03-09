import axios from "axios";

const apiCli = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    timeout: 1000
});

export function getStatus(options){
    return new Promise((resolve, reject)=>{
        apiCli.request({
            url: '/status',
            method: 'GET',
            ...(options||{})
        }).then(res=>{
            resolve(res.data);
        }).catch(err=>{
            reject(err.data);
        });
    });
}

export function getLatest(options){
    return new Promise((resolve, reject)=>{
        apiCli.request({
            url: '/latest',
            method: 'GET',
            ...(options||{})
        }).then(res=>{
            resolve(res.data);
        }).catch(err=>{
            reject(err.data);
        });
    });
}
export function getBlocksByPage(options){
    return new Promise((resolve, reject)=>{
        apiCli.request({
            url: '/blocks',
            method: 'GET',
            ...(options||{})
        }).then(res=>{
            resolve(res.data);
        }).catch(err=>{
            reject(err.data);
        });
    });
}

export function getTransactionsByPage(options){
    return new Promise((resolve, reject)=>{
        apiCli.request({
            url: '/txs',
            method: 'GET',
            ...(options||{})
        }).then(res=>{
            resolve(res.data);
        }).catch(err=>{
            reject(err.data);
        });
    });
}

export function getBlockByHash(hash,options){
    return new Promise((resolve, reject)=>{
        apiCli.request({
            url: `/blocks/${hash}`,
            method: 'GET',
            ...(options||{})
        }).then(res=>{
            resolve(res.data);
        }).catch(err=>{
            reject(err.data);
        });
    });
}

export function getTransactionByHash(hash,options){
    return new Promise((resolve, reject)=>{
        apiCli.request({
            url: `/txs/${hash}`,
            method: 'GET',
            ...(options||{})
        }).then(res=>{
            resolve(res.data);
        }).catch(err=>{
            reject(err.data);
        });
    });
}

export function getAccountsByPage(options){
    return new Promise((resolve, reject)=>{
        apiCli.request({
            url: '/accounts',
            method: 'GET',
            ...(options||{})
        }).then(res=>{
            resolve(res.data);
        }).catch(err=>{
            reject(err.data);
        });
    });
}

export function getAccountByAddress(address,options){
    return new Promise((resolve, reject)=>{
        apiCli.request({
            url: `/accounts/${address}`,
            method: 'GET',
            ...(options||{})
        }).then(res=>{
            resolve(res.data);
        }).catch(err=>{
            reject(err.data);
        });
    });
}

export function getTransactionsByAddress(address, options){
    return new Promise((resolve, reject)=>{
        apiCli.request({
            url: `/accounts/${address}/txs`,
            method: 'GET',
            ...(options||{})
        }).then(res=>{
            resolve(res.data);
        }).catch(err=>{
            reject(err.data);
        });
    });
}

export function requestSearch(options){
    return new Promise((resolve, reject)=>{
        apiCli.request({
            url: `/search`,
            method: 'GET',
            ...(options||{})
        }).then(res=>{
            resolve(res.data);
        }).catch(err=>{
            reject(err.data);
        });
    });
}

export function getTxCountByDay(options){
    return new Promise((resolve, reject)=>{
        apiCli.request({
            url: '/tx_count_by_day',
            method: 'GET',
            ...(options||{})
        }).then(res=>{
            resolve(res.data);
        }).catch(err=>{
            reject(err.data);
        });
    });
}

export function jsonrpc(data, options){
    return new Promise((resolve, reject)=>{
        apiCli.request({
            url: `/jsonrpc/v2`,
            method: 'POST',
            data: data,
            ...(options||{})
        }).then(res=>{
            resolve(res.data);
        }).catch(err=>{
            reject(err.data);
        });
    });
}