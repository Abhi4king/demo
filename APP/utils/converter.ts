/**
 * Converts a number from one base to another, handling floating points.
 * 
 * @param value The string value to convert
 * @param fromBase The base of the input value (2, 8, 10, 16)
 * @param toBase The target base (2, 8, 10, 16)
 * @returns The converted string
 */
export const convertBase = (value: string, fromBase: number, toBase: number): string => {
    if (!value) return "";
  
    // Clean input: remove irrelevant characters but keep the first point
    let cleaned = value.toUpperCase().replace(/[^0-9A-F.]/g, '');
    
    // Validate characters based on fromBase
    const validChars = getValidChars(fromBase);
    cleaned = cleaned.split('').filter(c => validChars.includes(c) || c === '.').join('');
  
    if (!cleaned) return "";
  
    const parts = cleaned.split('.');
    const integerPart = parts[0];
    const fractionalPart = parts.length > 1 ? parts[1] : null;
  
    let decimalInteger = 0;
    let decimalFraction = 0;
  
    // 1. Convert Input Integer to Decimal
    try {
      decimalInteger = parseInt(integerPart || '0', fromBase);
    } catch (e) {
      return "Error";
    }
  
    // 2. Convert Input Fraction to Decimal
    if (fractionalPart) {
      for (let i = 0; i < fractionalPart.length; i++) {
        const digitVal = parseInt(fractionalPart[i], fromBase);
        decimalFraction += digitVal * Math.pow(fromBase, -(i + 1));
      }
    }
  
    // 3. Convert Decimal Integer to Target Base
    let targetInteger = decimalInteger.toString(toBase).toUpperCase();
  
    // 4. Convert Decimal Fraction to Target Base
    let targetFraction = "";
    if (decimalFraction > 0) {
      let currentFraction = decimalFraction;
      const precision = 8; // Limit precision to prevent infinite loops
      for (let i = 0; i < precision; i++) {
        currentFraction *= toBase;
        const digit = Math.floor(currentFraction);
        targetFraction += digit.toString(toBase).toUpperCase();
        currentFraction -= digit;
        if (currentFraction === 0) break;
      }
    }
  
    if (fractionalPart || targetFraction.length > 0) {
       // If original had fraction, show result fraction even if 0 to indicate type
       return `${targetInteger}.${targetFraction || '0'}`;
    }
  
    return targetInteger;
  };
  
  const getValidChars = (base: number): string[] => {
    const chars = "0123456789ABCDEF".split('');
    return chars.slice(0, base);
  };