import { isNumeric } from ".";

export function numberWithCommas(x: any, fractionDigits?: any) {
  const [naturalPart, decimalPart] = x.toString().split(".");
  let out = naturalPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (decimalPart) {
    if (!isNumeric(fractionDigits)) {
      out += "." + decimalPart;
    } else if (decimalPart.length >= fractionDigits) {
      out += "." + decimalPart.substr(0, fractionDigits);
    } else {
      out += "." + decimalPart + "0".repeat(fractionDigits - decimalPart.length);
    }
  }
  return out;
}

export function formatPrice(price: any) {
  if (price < 1e6) return numberWithCommas(Number(price.toFixed(4)));
  if (price < 1e15) {
    const suffixes = ["", "K", "M", "B", "T"];
    const suffixNum = Math.floor((("" + parseInt(price)).length - 1) / 3);
    const shortValue = parseFloat((price / Math.pow(1000, suffixNum)).toFixed(1));
    return shortValue + suffixes[suffixNum];
  }
  return price;
}

export function formatPrice2(price: any) {
  if (price < 1e6) return numberWithCommas(Number(price.toFixed(2)));
  if (price < 1e15) {
    const suffixes = ["", "K", "M", "B", "T"];
    const suffixNum = Math.floor((("" + parseInt(price)).length - 1) / 3);
    const shortValue = parseFloat((price / Math.pow(1000, suffixNum)).toFixed(1));
    return shortValue + suffixes[suffixNum];
  }
  return price;
}

export function formatAddress(address: any, index = 6) {
  return address.slice(0, index) + "..." + address.slice(-4);
}
