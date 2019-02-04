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
  return `R$ ${(`${value}`).replace('.', ',')}`;
}

export {
  ValidationError,
  formatCurrency,
};
