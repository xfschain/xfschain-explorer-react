import { BN } from "bn.js";

const ATTO_BASE_LEN = 18;

const ATTO_NANO_LEN = 9;

function atto2base(val,pad) {
    let valbn = new BN(val, 10);
    let base = new BN(10).pow(new BN(ATTO_BASE_LEN));
    let fraction = valbn.mod(base).toString(10);;
    while (fraction.length < ATTO_BASE_LEN) {
        fraction = `0${fraction}`;
    }
    if (!pad){
        fraction = fraction.match(/^([0-9]*[1-9]|0)(0*)/)[1];
    }
    let whole = valbn.div(base).toString(10);
    let value = `${whole}${fraction === '0' ? '' : `.${fraction}`}`;
    return value;
}

function bigToBase(val, decimals, pad){
    let valbn = new BN(val, 10);
    let base = new BN(10).pow(new BN(decimals));
    let fraction = valbn.mod(base).toString(10);;
    while (fraction.length < decimals) {
        fraction = `0${fraction}`;
    }
    if (!pad){
        fraction = fraction.match(/^([0-9]*[1-9]|0)(0*)/)[1];
    }
    let whole = valbn.div(base).toString(10);
    let value = `${whole}${fraction === '0' ? '' : `.${fraction}`}`;
    return value;
}

function base2atto(val) {
    let comps = val.split('.');
    if (comps.length > 2){
        throw new Error('too many decimal points');
    }
    let whole = comps[0], fraction = comps[1];
    if (!whole) { whole = '0'; }
    if (!fraction) { fraction = '0'; }
    if (fraction.length > ATTO_BASE_LEN) {
        throw new Error('too many decimal places');
    }
    while (fraction.length < ATTO_BASE_LEN) {
        fraction += '0';
    }
    whole = new BN(whole);
    fraction = new BN(fraction);
    let base = new BN(10).pow(new BN(ATTO_BASE_LEN));
    let atto = (whole.mul(base)).add(fraction);
    return atto.toString(10);
}

function atto2nano(val,pad) {
    let valbn = new BN(val, 10);
    let base = new BN(10).pow(new BN(ATTO_NANO_LEN));
    let fraction = valbn.mod(base).toString(10);;
    while (fraction.length < ATTO_NANO_LEN) {
        fraction = `0${fraction}`;
    }
    if (!pad){
        fraction = fraction.match(/^([0-9]*[1-9]|0)(0*)/)[1];
    }
    let whole = valbn.div(base).toString(10);
    let value = `${whole}${fraction === '0' ? '' : `.${fraction}`}`;
    return value;
}
function nano2atto(val) {
    let comps = val.split('.');
    if (comps.length > 2){
        throw new Error('too many decimal points');
    }
    let whole = comps[0], fraction = comps[1];
    if (!whole) { whole = '0'; }
    if (!fraction) { fraction = '0'; }
    if (fraction.length > ATTO_NANO_LEN) {
        throw new Error('too many decimal places');
    }
    while (fraction.length < ATTO_NANO_LEN) {
        fraction += '0';
    }
    whole = new BN(whole);
    fraction = new BN(fraction);
    let base = new BN(10).pow(new BN(ATTO_NANO_LEN));
    let atto = (whole.mul(base)).add(fraction);
    return atto.toString(10);
}

export {
    atto2base,
    base2atto,
    atto2nano,
    nano2atto,
    bigToBase,
}

