const buttons = document.querySelector('.button-container');
const display = document.querySelector('.display-content');

let num1 = '';
let num2 = '';
let operator = '';
let displayValue = '';
let result = '';
let isSecondNumber = false;

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return b !== 0 ? a / b : 'Error';
}

function operate(operator, a, b) {
  switch (operator) {
    case '+':
      return add(a, b);

    case '-':
      return subtract(a, b);

    case '*':
      return multiply(a, b);

    case '/':
      return divide(a, b);

    default:
      break;
  }
}

function handleInput(value) {
  if (!isNaN(value) || value === '.') {
    // Prevent multiple decimals
    if (value === '.' && displayValue.includes('.')) return;
    if (value === '.' && displayValue === '') {
      displayValue = '0';
    }
    updateDisplay(value);
    return;
  }

  switch (value) {
    case 'AC':
      resetCalculator();
      break;

    case 'DEL':
      if (displayValue === '' && isSecondNumber) {
        operator = '';
        isSecondNumber = false;

        // restore num1 into displayValue so it can be reused
        displayValue = num1;
        display.textContent = displayValue;
        return;
      }

      // Otherwise, delete last digit from displayValue
      displayValue = displayValue.slice(0, -1);
      display.textContent = displayValue;

      // Reflect the change in num1 or num2
      if (!isSecondNumber) {
        num1 = displayValue;
      } else {
        num2 = displayValue;
      }
      break;

    case '+':
    case '-':
    case '*':
    case '/':
      if (!isSecondNumber) {
        num1 = displayValue || result.toString();
      } else if (displayValue !== '') {
        num2 = displayValue;
        result = operate(operator, Number(num1), Number(num2));
        num1 = result.toString();
      }
      operator = value;
      isSecondNumber = true;
      displayValue = '';
      display.textContent = `${num1} ${operator}`;
      break;

    case '=':
      if (operator && isSecondNumber && displayValue !== '') {
        num2 = displayValue;
        result = operate(operator, Number(num1), Number(num2));
        display.textContent = result;
        displayValue = '';
        num1 = result.toString(); // allow chaining
        operator = '';
        isSecondNumber = false;
      }
      break;

    default:
      break;
  }
}

buttons.addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON') return;

  value = e.target.textContent;
  handleInput(value);
});

function removeLastValue() {
  updateDisplay(displayValue.slice(0, -1));
}

function updateDisplay(value) {
  displayValue += value;
  display.textContent = displayValue;
  display.scrollLeft = display.scrollWidth;
}

function resetCalculator() {
  num1 = '';
  num2 = '';
  operator = '';
  displayValue = '';
  result = '';
  isSecondNumber = false;
  display.textContent = '';
}

document.addEventListener('keydown', (e) => {
  const key = e.key;

  if (!isNaN(key) || key === '.') {
    handleInput(key);
    e.preventDefault();
    return;
  }

  if (['+', '-', '*', '/'].includes(key)) {
    handleInput(key);
    e.preventDefault();
    return;
  }

  if (key === 'Enter' || key === '=') {
    handleInput('=');
    e.preventDefault();
    return;
  }

  if (key === 'Backspace') {
    handleInput('DEL');
    e.preventDefault();
    return;
  }

  if (key === 'Escape') {
    handleInput('AC');
    e.preventDefault();
    return;
  }
});
