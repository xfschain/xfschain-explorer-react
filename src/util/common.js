import { BN } from "bn.js";
import _ from 'lodash';
function defaultBalanceFormat(num) {
    let formater = new Intl.NumberFormat('en-US',
    {style: 'decimal', 
    minimumIntegerDigits: 4,
    maximumFractionDigits: 4,
  });
    return formater.format(num);
}
function defaultTxsValueFormat(num) {
  let formater = new Intl.NumberFormat('en-US',
  {style: 'decimal', 
  minimumIntegerDigits: 0,
  maximumFractionDigits: 6,
});
  return formater.format(num);
}

function defaultIntNumberFormat(num) {
  let formater = new Intl.NumberFormat('en-US',
  {style: 'decimal', 
  minimumIntegerDigits: 1,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
  return formater.format(num);
}

function defaultrNumberFormatFF2(num) {
    return defaultrNumberFormatFF(num, 2);
}
function defaultrNumberFormatFF4(num) {
    return defaultrNumberFormatFF(num, 4);
  }
  function defaultrNumberFormatFF6(num) {
    return defaultrNumberFormatFF(num, 6);
  }
  function defaultNumberFormatFF8(num) {
    return defaultrNumberFormatFF(num, 8);
  }
  function defaultNumberFormatFF9(num) {
    return defaultrNumberFormatFF(num, 9);
  }
  function defaultrNumberFormatFF(num,digits) {
    let formater = new Intl.NumberFormat('en-US',
    {style: 'decimal', 
    minimumIntegerDigits: 1,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
    return formater.format(num);
  }
function calcGasFee(gasprice, gaslimit) {
  let gaspricebn = new BN(gasprice, 10);
  let gaslimitbn = new BN(gaslimit, 10);
  let gasfee = gaspricebn.mul(gaslimitbn);
  return gasfee.toString(10);
}
function sortList(data=[],fn) {
  for (let i = 0; i < data.length - 1; i++){
      for (let j = 0; j < data.length - 1 - i; j++) {
          let c = data[j];
          let n = data[j + 1];
          let r = fn(c, n)
          if (r){
            data[j] = n;
            data[j + 1] = c;
          }
      }
  }
  return data;
}

function hashesUnitCover(num) {
  const units = ['K', 'M', 'G', 'T', 'P', 'E'];
  const multiplier = 1000;
  if (num < multiplier){
    return {
      num: num,
      unit: '',
    }
  }
  for (let i=0;i<units.length;i++){
    num /= multiplier;
    if (num < multiplier){
      return {
        num: num,
        unit: units[i]
      };
    }
  }
}

function hexToUint8Array(text){
  if (!text){
    return null;
  }
  text = text.replace(/^0x/, '');
  if (text.length === 0 || text.length % 2 !== 0) {
    return null;
  }
  const arr = text.match(/.{1,2}/g)
  .map(byte => parseInt(byte, 16));
  return new Uint8Array(arr);
}
function intToHex(i) {
  return ('0' + i.toString(16)).slice(-2);
}

function uint8ArrayToText(data){
  let out, i, len, c;
  let char2, char3;
  out = "";
  len = data.length;
  i = 0;
  while (i < len) {
      c = data[i++];
      out = "";
      len = data.length;
      i = 0;
      while (i < len) {
          c = data[i++];
          // eslint-disable-next-line default-case
          switch (c >> 4) {
              case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                  // 0xxxxxxx
                  out += String.fromCharCode(c);
                  break;
              case 12: case 13:
                  // 110x xxxx   10xx xxxx
                  char2 = data[i++];
                  out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                  break;
              case 14:
                  // 1110 xxxx  10xx xxxx  10xx xxxx
                  char2 = data[i++];
                  char3 = data[i++];
                  out += String.fromCharCode(((c & 0x0F) << 12) |
                      ((char2 & 0x3F) << 6) |
                      ((char3 & 0x3F) << 0));
                  break;
          }
      }
  }
  return out;
}

function dataFormat({ data, format }){
  const formaters = [
      {
          key: 'HEX',
          format: (data) => {
              return '0x' + Array.from(data)
                  .map(intToHex).join('');
          }
      },
      {
          key: 'TEXT',
          format: (data) => {
              return uint8ArrayToText(data);
          }
      },
      {
          key: 'JSON',
          format: (data) => {
              const text = uint8ArrayToText(data);
              try {
                const obj = JSON.parse(text);
                return JSON.stringify(obj, null, 4);
              }catch(e){
                // console.error(e);
                return null;
              }
          }
      },
  ];
  if (!data){
    return null;
  }
  const fm = _.find(formaters, { key: format });
  return fm.format(data);
}
export {
    hashesUnitCover,
    defaultIntNumberFormat,
    defaultrNumberFormatFF,
    defaultrNumberFormatFF2,
    defaultrNumberFormatFF4,
    defaultrNumberFormatFF6,
    defaultNumberFormatFF9,
    defaultBalanceFormat,
    defaultTxsValueFormat,
    defaultNumberFormatFF8,
    calcGasFee,
    hexToUint8Array,
    sortList,
    intToHex,
    dataFormat,
    uint8ArrayToText,
}