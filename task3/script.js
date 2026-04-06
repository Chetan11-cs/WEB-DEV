let displayElement = document.getElementById('display');
let currentInput = '';

// Function to update the screen
function appendToDisplay(value) {
    if (currentInput === '0' && value !== '.') {
        currentInput = value;
    } else {
        currentInput += value;
    }
    updateDisplay();
}

// Function to clear the screen
function clearDisplay() {
    currentInput = '0';
    updateDisplay();
}

// Function to calculate the result
function calculate() {
    try {
        // We use eval() for simplicity in a basic project
        // For production, you'd use a custom parser to prevent security risks
        let result = eval(currentInput);
        
        // Handle decimals (round to 4 places)
        if (!Number.isInteger(result)) {
            result = result.toFixed(4);
        }
        
        currentInput = result.toString();
        updateDisplay();
    } catch (error) {
        currentInput = "Error";
        updateDisplay();
        setTimeout(clearDisplay, 1500);
    }
}

function updateDisplay() {
    displayElement.innerText = currentInput;
}