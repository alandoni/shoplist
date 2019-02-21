Array.prototype.setElement = (newValue, conditionCallback) => {
  const indexesToSet = [];
  this.forEach((value, index) => {
    if (conditionCallback(value, index, this)) {
      indexesToSet.push(index);
    }
  });
  if (indexesToSet.length) {
    indexesToSet.forEach((index) => {
      this[index] = newValue;
    });
  }
};

class ValidationError extends Error {
}

function formatCurrency(value) {
  const fixedValue = value.toFixed(2);
  const replaceDot = `${fixedValue}`.replace('.', ',');
  return `R$ ${replaceDot}`;
}

function parseCurrency(value) {
  const replaceComma = value.replace(',', '.').substr(3);
  return parseFloat(replaceComma);
}

export {
  ValidationError,
  formatCurrency,
  parseCurrency,
};
