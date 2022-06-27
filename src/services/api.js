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

export function getForkBlocksByPage(options){
    return new Promise((resolve, reject)=>{
        apiCli.request({
            url: '/reorg/blocks',
            method: 'GET',
            ...(options||{})
        }).then(res=>{
            resolve(res.data);
        }).catch(err=>{
            reject(err.data);
        });
    });
}

export function getForkBlockDetailByPage(hash,options){
    return new Promise((resolve, reject)=>{
        apiCli.request({
            url: `/reorg/blocks/${hash}`,
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

export function getPendingTxsByPage(options){
    return new Promise((resolve, reject)=>{
        apiCli.request({
            url: '/pending/txs',
            method: 'GET',
            ...(options||{})
        }).then(res=>{
            resolve(res.data);
        }).catch(err=>{
            reject(err.data);
        });
    });
}

export function getPendingTxsDetailByPage(hash,options){
    return new Promise((resolve, reject)=>{
        apiCli.request({
            url: `/pending/txs/${hash}`,
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

export function getSTDTokensByPage(options){
    return new Promise((resolve, reject)=>{
        apiCli.request({
            url: '/std_tokens',
            method: 'GET',
            ...(options||{})
        }).then(res=>{
            resolve(res.data);
        }).catch(err=>{
            reject(err.data);
        });
    });
}

export function getNFTokensByPage(options){
    return new Promise((resolve, reject)=>{
        apiCli.request({
            url: '/nf_tokens',
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

export function getSTDTokenByAddress(address,options){
    return new Promise((resolve, reject)=>{
        apiCli.request({
            url: `/std_tokens/${address}`,
            method: 'GET',
            ...(options||{})
        }).then(res=>{
            resolve(res.data);
        }).catch(err=>{
            reject(err.data);
        });
    });
}

export function getNFTokenByAddress(address,options){
    return new Promise((resolve, reject)=>{
        apiCli.request({
            url: `/nf_tokens/${address}`,
            method: 'GET',
            ...(options||{})
        }).then(res=>{
            resolve(res.data);
        }).catch(err=>{
            reject(err.data);
        });
    });
}
export function getTransactionsByBlockHash(blockHash, options){
    return new Promise((resolve, reject)=>{
        apiCli.request({
            url: `/blocks/${blockHash}/txs`,
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

export function getTxsByAddressFromSTDToken(address, options){
    return new Promise((resolve, reject)=>{
        apiCli.request({
            url: `/std_tokens/${address}/txs`,
            method: 'GET',
            ...(options||{})
        }).then(res=>{
            resolve(res.data);
        }).catch(err=>{
            reject(err.data);
        });
    });
}
export function getTxsByAddressFromNFToken(address, options){
    return new Promise((resolve, reject)=>{
        apiCli.request({
            url: `/nf_tokens/${address}/txs`,
            method: 'GET',
            ...(options||{})
        }).then(res=>{
            resolve(res.data);
        }).catch(err=>{
            reject(err.data);
        });
    });
}
export function getHoldersByAddressFromSTDToken(address, options){
    return new Promise((resolve, reject)=>{
        apiCli.request({
            url: `/std_tokens/${address}/holders`,
            method: 'GET',
            ...(options||{})
        }).then(res=>{
            resolve(res.data);
        }).catch(err=>{
            reject(err.data);
        });
    });
}
export function getHoldersByAddressFromNFToken(address, options){
    return new Promise((resolve, reject)=>{
        apiCli.request({
            url: `/nf_tokens/${address}/holders`,
            method: 'GET',
            ...(options||{})
        }).then(res=>{
            resolve(res.data);
        }).catch(err=>{
            reject(err.data);
        });
    });
}

export function getItemsByAddressFromNFToken(address, options){
    return new Promise((resolve, reject)=>{
        apiCli.request({
            url: `/nf_tokens/${address}/items`,
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
