document.getElementById('rows').addEventListener('input', createMatrix);
document.getElementById('cols').addEventListener('input', createMatrix);

// On page load, create the default matrix
window.onload = function() {
  createMatrix();
}

function createMatrix() {
  const rows = parseInt(document.getElementById('rows').value);
  const cols = parseInt(document.getElementById('cols').value);
  const matrixContainer = document.getElementById('matrix-inputs');

  matrixContainer.innerHTML = '';  // Clear previous inputs

  // Generate matrix inputs dynamically
  for (let i = 0; i < rows; i++) {
    const row = document.createElement('div');
    row.classList.add('matrix-row');

    for (let j = 0; j < cols; j++) {
      const input = document.createElement('input');
      input.type = 'number';
      input.classList.add('matrix-cell');
      input.id = `cell-${i}-${j}`;
      input.value = 0; // Default value for each cell
      row.appendChild(input);
    }

    matrixContainer.appendChild(row);
  }
}

document.getElementById('solve').addEventListener('click', function() {
  const rows = parseInt(document.getElementById('rows').value);
  const cols = parseInt(document.getElementById('cols').value);
  const matrix = [];

  // Collect the matrix values
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      const value = parseFloat(document.getElementById(`cell-${i}-${j}`).value) || 0;
      row.push(value);
    }
    matrix.push(row);
  }

  const rrefMatrix = reducedRowEchelonForm(matrix);
  displaySolution(rrefMatrix, 'fraction');  // Display fraction form by default
});

// Button to switch to decimal form
document.getElementById('change-form').addEventListener('click', function() {
  const rows = parseInt(document.getElementById('rows').value);
  const cols = parseInt(document.getElementById('cols').value);
  const matrix = [];

  // Collect the matrix values
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      const value = parseFloat(document.getElementById(`cell-${i}-${j}`).value) || 0;
      row.push(value);
    }
    matrix.push(row);
  }

  const rrefMatrix = reducedRowEchelonForm(matrix);
  displaySolution(rrefMatrix, 'decimal');  // Display decimal form when button is clicked
});

// Function to transform matrix into Reduced Row Echelon Form (RREF)
function reducedRowEchelonForm(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  let lead = 0;

  for (let r = 0; r < rows; r++) {
    if (lead >= cols) {
      return matrix;
    }
    let i = r;
    while (matrix[i][lead] === 0) {
      i++;
      if (i === rows) {
        i = r;
        lead++;
        if (lead === cols) {
          return matrix;
        }
      }
    }

    // Swap rows i and r
    [matrix[i], matrix[r]] = [matrix[r], matrix[i]];

    // Normalize the lead row (make the pivot = 1)
    const leadValue = matrix[r][lead];
    for (let j = 0; j < cols; j++) {
      matrix[r][j] /= leadValue;
    }

    // Eliminate all other entries in the lead column
    for (let i = 0; i < rows; i++) {
      if (i !== r) {
        const factor = matrix[i][lead];
        for (let j = 0; j < cols; j++) {
          matrix[i][j] -= factor * matrix[r][j];
        }
      }
    }
    lead++;
  }

  return matrix;
}

// Helper function to find greatest common divisor (GCD) for fraction simplification
function gcd(a, b) {
  if (b === 0) return a;
  return gcd(b, a % b);
}

// Function to convert a decimal to a simplified fraction
function toFraction(decimal) {
  const tolerance = 1.0E-6; // Set a tolerance to avoid floating point precision issues
  let h1 = 1, h2 = 0, k1 = 0, k2 = 1, b = decimal;
  do {
    let a = Math.floor(b);
    let aux = h1; h1 = a * h1 + h2; h2 = aux;
    aux = k1; k1 = a * k1 + k2; k2 = aux;
    b = 1 / (b - a);
  } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);

  // Simplify the fraction
  const divisor = gcd(h1, k1);

  // Return fraction or whole number if numerator == denominator
  return (h1 === k1) ? h1 : `${h1 / divisor}/${k1 / divisor}`;
}

// Function to display the solution matrix based on form (fraction or decimal)
function displaySolution(matrix, form) {
  const solutionOutput = document.getElementById('solution-output');
  solutionOutput.innerHTML = '';

  const outputTable = document.createElement('div');
  outputTable.classList.add('output-table');

  if (form === 'fraction') {
    outputTable.innerHTML = '<h2>Fraction Form:</h2>';

    matrix.forEach(row => {
      const rowDiv = document.createElement('div');
      rowDiv.classList.add('matrix-row');

      row.forEach(cell => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('matrix-cell');

        const fraction = toFraction(cell);  // Get fraction form
        cellDiv.innerHTML = fraction;
        rowDiv.appendChild(cellDiv);
      });

      outputTable.appendChild(rowDiv);
    });
    solutionOutput.appendChild(outputTable);

  } else if (form === 'decimal') {
    outputTable.innerHTML = '<h2>Decimal Form:</h2>';

    matrix.forEach(row => {
      const rowDiv = document.createElement('div');
      rowDiv.classList.add('matrix-row');

      row.forEach(cell => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('matrix-cell');

        const decimalValue = cell.toFixed(2); // Format to 2 decimal places
        cellDiv.innerHTML = decimalValue;
        rowDiv.appendChild(cellDiv);
      });

      outputTable.appendChild(rowDiv);
    });
    solutionOutput.appendChild(outputTable);
  }
}
