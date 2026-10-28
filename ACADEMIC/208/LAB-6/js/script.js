// Small helpers keep the assignment code readable.
const getNumber = (id) => document.getElementById(id).value.trim();
const showResult = (id, message, isError = false) => {
  const output = document.getElementById(id);
  output.textContent = message;
  output.classList.toggle("error", isError);
};
const validNumber = (value) => value !== "" && Number.isFinite(Number(value));

// Assignment 1: Even or Odd
document.getElementById("evenBtn").addEventListener("click", () => {
  const value = getNumber("evenInput");
  if (!validNumber(value)) return showResult("evenResult", "Please enter a number.", true);
  const number = Number(value);
  if (number % 2 === 0) showResult("evenResult", `${number} is an even number.`);
  else showResult("evenResult", `${number} is an odd number.`);
});

// Assignment 2: Largest of Two Numbers
document.getElementById("largeBtn").addEventListener("click", () => {
  const aValue = getNumber("largeA");
  const bValue = getNumber("largeB");
  if (!validNumber(aValue) || !validNumber(bValue)) return showResult("largeResult", "Please enter both numbers.", true);
  const a = Number(aValue);
  const b = Number(bValue);
  if (a > b) showResult("largeResult", `${a} is the largest number.`);
  else if (b > a) showResult("largeResult", `${b} is the largest number.`);
  else showResult("largeResult", "Both numbers are equal.");
  console.log("Largest of two numbers:", Math.max(a, b));
});

// Assignment 3: Simple Calculator
document.getElementById("calcBtn").addEventListener("click", () => {
  const aValue = getNumber("calcA");
  const bValue = getNumber("calcB");
  if (!validNumber(aValue) || !validNumber(bValue)) return showResult("calcResult", "Please enter both numbers.", true);
  const a = Number(aValue);
  const b = Number(bValue);
  const operator = document.getElementById("operator").value;
  let result;
  switch (operator) {
    case "+": result = a + b; break;
    case "-": result = a - b; break;
    case "*": result = a * b; break;
    case "/":
      if (b === 0) return showResult("calcResult", "Cannot divide by zero.", true);
      result = a / b;
      break;
    default: return showResult("calcResult", "Choose a valid operation.", true);
  }
  showResult("calcResult", `Result: ${result}`);
});

// Assignment 4: Positive, Negative or Zero
document.getElementById("signBtn").addEventListener("click", () => {
  const value = getNumber("signInput");
  if (!validNumber(value)) return showResult("signResult", "Please enter a number.", true);
  const number = Number(value);
  if (number > 0) showResult("signResult", `${number} is positive.`);
  else if (number < 0) showResult("signResult", `${number} is negative.`);
  else showResult("signResult", "The number is zero.");
});

// Assignment 5: Sum of First N Natural Numbers
document.getElementById("sumBtn").addEventListener("click", () => {
  const value = getNumber("sumInput");
  const n = Number(value);
  if (!validNumber(value) || !Number.isInteger(n) || n < 1 || n > 10000) return showResult("sumResult", "Enter a whole number from 1 to 10,000.", true);
  let sum = 0;
  for (let i = 1; i <= n; i++) sum += i;
  showResult("sumResult", `Sum from 1 to ${n} = ${sum}`);
});

// Assignment 6: Multiplication Table
document.getElementById("tableBtn").addEventListener("click", () => {
  const value = getNumber("tableInput");
  if (!validNumber(value)) return showResult("tableResult", "Please enter a number.", true);
  const number = Number(value);
  let table = "";
  for (let i = 1; i <= 10; i++) table += `${number} × ${i} = ${number * i}${i < 10 ? "\\n" : ""}`;
  showResult("tableResult", table);
});

// Assignment 7: Factorial
document.getElementById("factBtn").addEventListener("click", () => {
  const value = getNumber("factInput");
  const n = Number(value);
  if (!validNumber(value) || !Number.isInteger(n) || n < 0 || n > 170) return showResult("factResult", "Enter a whole number from 0 to 170.", true);
  let factorial = 1;
  for (let i = 1; i <= n; i++) factorial *= i;
  showResult("factResult", `${n}! = ${factorial}`);
});

// Assignment 8: Count Digits
document.getElementById("digitsBtn").addEventListener("click", () => {
  const value = getNumber("digitsInput");
  const number = Number(value);
  if (!validNumber(value) || !Number.isSafeInteger(number)) return showResult("digitsResult", "Enter a valid whole number.", true);
  let remaining = Math.abs(number);
  let count = remaining === 0 ? 1 : 0;
  while (remaining > 0) {
    count++;
    remaining = Math.floor(remaining / 10);
  }
  showResult("digitsResult", `Digit count: ${count}`);
});

// Assignment 9: Reverse a Number
document.getElementById("reverseBtn").addEventListener("click", () => {
  const value = getNumber("reverseInput");
  const number = Number(value);
  if (!validNumber(value) || !Number.isSafeInteger(number)) return showResult("reverseResult", "Enter a valid whole number.", true);
  const sign = number < 0 ? -1 : 1;
  let remaining = Math.abs(number);
  let reversed = 0;
  while (remaining > 0) {
    const digit = remaining % 10;
    reversed = reversed * 10 + digit;
    remaining = Math.floor(remaining / 10);
  }
  showResult("reverseResult", `Reversed number: ${sign * reversed}`);
});

// Assignment 10: Prime Number Check (only test divisors up to sqrt(n))
document.getElementById("primeBtn").addEventListener("click", () => {
  const value = getNumber("primeInput");
  const number = Number(value);
  if (!validNumber(value) || !Number.isSafeInteger(number)) return showResult("primeResult", "Enter a valid whole number.", true);
  if (number < 2) return showResult("primeResult", `${number} is not a prime number.`);
  let isPrime = true;
  for (let i = 2; i * i <= number; i++) {
    if (number % i === 0) { isPrime = false; break; }
  }
  showResult("primeResult", isPrime ? `${number} is a prime number.` : `${number} is not a prime number.`);
});

// Mark assignments as completed.
const checkboxes = document.querySelectorAll("[data-task]");
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    checkbox.closest(".assignment-card").classList.toggle("done", checkbox.checked);
  });
});

// Logo: cycle accent colours on click
const logoColors = ["#ffd93d", "#74b9ff", "#5eead4", "#ff9ecb", "#ffa94d", "#c4b0ff"];
let logoIndex = 0;
const logo = document.querySelector(".brand");
const logoMark = document.querySelector(".brand-mark");

logo.addEventListener("click", (e) => {
  e.preventDefault(); // stops the "#" link from jumping to the top
  logoIndex = (logoIndex + 1) % logoColors.length;
  logoMark.style.background = logoColors[logoIndex];
});
