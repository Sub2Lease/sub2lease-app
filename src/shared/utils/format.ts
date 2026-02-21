import { min, toNumber } from "./number";

export function removeZeros(val: string | number) {
  const str = val.toString();
  const parts = str.split(".");

  if (parts.length < 2) return str;

  const [start, decimals] = parts;

  let depth = decimals.length;

  for (let i = decimals.length - 1; i >= 0; i--) {
    if (decimals[i] !== "0") break;

    depth--;
  }

  const newDecimals = decimals.slice(0, depth);

  return `${start}${newDecimals.length > 0 ? `.${newDecimals}` : ""}`;
}

const magnitudeMap = ["k", "m", "b", "t", "q", "qq", "qqq", "qqqq", "qqqqq", "qqqqqq", "qqqqqqq", "qqqqqqqq"];

export function numberScale(val: string | number, decimals: number) {
  const num = toNumber(val);
  const magnitude = Math.floor(min(Math.log10(num) / 3, magnitudeMap.length));
  if (magnitude < 1) {
    return [num, ""] as const;
  }
  return [Number.parseFloat((num / 10 ** (magnitude * 3)).toFixed(decimals)), magnitudeMap[magnitude - 1]] as const;
}

export function formatNumber(val: string | number, decimals = 2, doScale = false, zeros = true, uppercase = false) {
  if (typeof val === "string") {
    val = toNumber(val);
  }

  val = val.toFixed(decimals);

  let [value, suffix] = [val, ""];

  if (doScale) {
    let new_value;
    [new_value, suffix] = numberScale(val, decimals);
    value = new_value.toString();
  }

  if (uppercase && suffix) suffix = ` ${suffix.toUpperCase()}`;

  let result = `${value.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}${suffix}`;

  if (!zeros) {
    result = removeZeros(result);
  }

  return result;
}

export function formatNumberWithCommas(value: number | string | undefined, decimals: number = 2): string {
  if (value === undefined) {
    return "-";
  }

  const number = typeof value === "string" ? Number.parseFloat(value) : value;

  if (Number.isNaN(number)) {
    throw new TypeError("Invalid number input");
  }

  const fixedNumber = number.toFixed(decimals);
  const [integerPart, decimalPart] = fixedNumber.split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return decimals === 0 ? formattedInteger : `${formattedInteger}.${decimalPart}`;
}

export function formatCurrency(
  value: number | string | undefined | null,
  decimals: number = 2,
  doScale = false,
  zeros = true,
  uppercase = false,
): string {
  if (!value) return "-";
  return `$${formatNumber(value, decimals, doScale, zeros, uppercase)}`;
}

export function formatCurrencyWithCommas(value: number | string, decimals: number = 2): string {
  return `$${formatNumberWithCommas(value, decimals)}`;
}

type FormatArg = string | number;

export function formatString(pattern: string, ...args: FormatArg[]) {
  let builder = "";
  let argIndex = 0;

  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === "}" && pattern[i + 1] === "}") {
      i++;
    } else if (pattern[i] === "{" && pattern[i + 1] !== "{") {
      let innerContent = "";

      for (i++; i < pattern.length; i++) {
        if (pattern[i] === "}") {
          break;
        }

        innerContent += pattern[i];
      }

      if (innerContent === "") {
        builder += processArg(args[argIndex]);
        argIndex++;
      } else if (/^\d+$/.test(innerContent)) {
        const argIndex = Number.parseInt(innerContent);
        builder += processArg(args[argIndex]);
      } else {
        throw new Error("Uknown argument format");
      }

      continue;
    }

    builder += pattern[i];
  }

  return builder;
}

function processArg(arg: FormatArg) {
  if (typeof arg === "number") {
    return arg.toString();
  }

  return arg;
}

export function capitalize(str: string | undefined | null) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatBalance(val: number | string, digits = 2): string {
  // Convert the value to a string with more decimal places
  const num = typeof val === "number" ? val : Number(val);
  // Set the maximum possible number of decimal places in order not to lose accuracy (18 decimals)
  const fixedStr = num.toFixed(18);
  const [integerPart, fractionalPart] = fixedStr.split(".");

  // Find the index of the first non-zero character in the fractional part
  let firstNonZeroIndex = 0;
  while (firstNonZeroIndex < fractionalPart.length && fractionalPart[firstNonZeroIndex] === "0") {
    firstNonZeroIndex++;
  }

  // Determine the number of digits after the leading zeros (two by default)
  const digitsToKeep = digits;
  const sliceEnd = firstNonZeroIndex + digitsToKeep;
  const resultFractional = fractionalPart.slice(0, sliceEnd);

  // Remove extra zeros if they are at the end (e.g. 1.2300 -> 1.23)
  const trimmedFractional = resultFractional.replace(/0+$/, "");

  return trimmedFractional.length > 0 ? `${integerPart}.${trimmedFractional}` : integerPart;
}

export function truncateBalance(str: string, maxDecimalDigits: number) {
  if (str.includes(".")) {
    const parts = str.split(".");
    return `${parts[0]}.${parts[1].slice(0, maxDecimalDigits)}`;
  }
  return str;
}
