class Cryptarithmetic {
    constructor({ operand, result, operandAndResult, idxChar, maxLen }) {
        this.operand = operand;
        this.result = result;
        this.operandAndResult = operandAndResult;
        this.idxChar = idxChar;
        this.maxLen = maxLen;
        this.arr = [];
        this.sol = [];
        this.n = 0;
    }

    // Fungsi pembangkit untuk membangkitkan nilai xk
    tempat(i, k) {
        for (let j = 0; j < k; j++) {
            if (this.arr[j] == i) {
                return false;
            }
        }
        return true;
    }

    boundingFunction(k) {
        var Xi = 0;

        for (let i = 0; i < this.maxLen; i++) {
            var hsl = 0;
            for (let strop of this.operand) {
                idxtemp = strop.length - 1 - i;
                if (idxtemp >= 0) {
                    if (this.idxChar[strop[idxtemp]] > k) {
                        return true;
                    }
                    hsl += this.arr[this.idxChar[strop[idxtemp]]];
                }
            }
            var idxResult = this.idxChar[this.result[this.result.length - 1 - i]];
            var xResult = this.arr[idxResult];

            if (idxResult > k) {
                return true;
            }
            if (i != maxLen - 1) {
                if ((hsl + Xi) % 10 != xResult) {
                    return false;
                }
            } else {
                if (hsl + Xi != xResult) {
                    return false;
                }
            }
            Xi = Math.floor((hsl + Xi) / 10);
        }

        for (let strOpRes of this.operandAndResult) {
            if (strOpRes.length > 1 && this.arr[this.idxChar[strOpRes[0]]] == 0) {
                return false;
            }
        }

        return true;
    }

    backtracking(k) {
        for (let i = 0; i < 10; i++) {
            if (this.tempat(i, k)) {
                this.arr[k] = i;
                if (this.boundingFunction(k)) {
                    if (k == this.n) {
                        this.sol.push(this.arr.slice());
                    } else {
                        this.backtracking(k + 1);
                    }
                    this.arr[k] = -1;
                }
            }
        }
    }

    isSolveable() {
        var maxOp = this.operand[0].length;
        for (let op of this.operand) {
            if (maxOp < op.length) {
                maxOp = op.length;
            }
        }
        return this.result.length >= maxOp && this.result.length <= maxOp + 1;
    }

    getSolution() {
        var strRet = "";
        var solusike = 1;
        var arrchr = [];
    
        for (let key in this.idxChar) {
            arrchr.push(key);
        }
        arrchr.sort();
    
        strRet += `<div class="card-solve">`;
        strRet += `<p class="text-center mt-3">Terdapat <span class="text-success fw-bold">${this.sol.length} Solusi</span> dari Persoalan Cryptarithmetic ini, yaitu:</p>`;
    
        for (let solusi of this.sol) {
            var strSol = "";
            for (let i = 0; i < arrchr.length; i++) {
                strSol += `${arrchr[i]}=${solusi[this.idxChar[arrchr[i]]]}${i != arrchr.length - 1 ? ', ' : ' '}`;
            }
            strRet += `<p class="text-center mb-4">Solusi ke-${solusike}: ${strSol}</p>`;
            
            for (let opr of this.operand) {
                strRet += `<p class="mb-1 text-center">`;
                for (let chrOp of opr) {
                    strRet += `${solusi[this.idxChar[chrOp]]}`;
                }
                strRet += `</p>`;
            }
            
            strRet += `<p class="text-center mb-2">`;
            strRet += `-`.repeat(9) + `+</p>`;
            
            strRet += `<p class="text-center">`;
            for (let chrRes of this.result) {
                strRet += `${solusi[this.idxChar[chrRes]]}`;
            }
            strRet += `</p>`;
            
            strRet += `</div>`;
            solusike += 1;
        }
    
        return strRet;
    }
    

    solve() {
        this.n = Object.keys(this.idxChar).length - 1;
        if (this.n < 10) {
            if (this.isSolveable()) {
                this.arr = Array(this.n + 1).fill(-1);
                this.backtracking(0);
                if (this.sol.length > 0) {
                    return this.getSolution();
                } else {
                    return `<p class="text-danger text-center">Tidak ada solusi yang memenuhi.</p>`
                }
            } else {
                return `<p class="text-danger text-center">Persoalan tersebut tidak dapat diselesaikan.</p>`
            }
        } else {
            return `<p class="text-danger text-center">Persoalan tidak dapat diselesaikan karena jumlah huruf uniknya lebih dari 10.</p>`
        }
    }

}

cryptarithmetic_conf = {
    number_operand: 2
}

function createOperandItem() {
    var id = cryptarithmetic_conf['number_operand'] + 1;
    const operandInput = document.createElement('input');
    operandInput.type = 'text';
    operandInput.name = `operand-${id}`;
    operandInput.id = `operand-${id}`;
    operandInput.placeholder = `Operand ${id}`;
    operandInput.required = true;
    operandInput.pattern = "[a-zA-Z]*";
    operandInput.classList.add('form-control');
    operandInput.oninput = function () { this.value = this.value.toUpperCase() };

    operandInput.addEventListener('change', onChangeHandler);

    const operandCol = document.createElement('div');
    operandCol.classList.add('operand');
    operandCol.append(operandInput);

    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fas', 'fa-times');

    const deleteButton = document.createElement('a');
    deleteButton.classList.add('btn-delete');
    deleteButton.setAttribute('id', `delete-button-operand-${id}`);
    deleteButton.append(deleteIcon);


    deleteButton.addEventListener('click', (event) => deleteHandler(event, id));


    const deleteCol = document.createElement('div');
    deleteCol.append(deleteButton);

    const rowOperand = document.createElement('div');
    rowOperand.classList.add('row', 'mb-2');
    rowOperand.setAttribute('id', `row-operand-${id}`);
    rowOperand.append(operandCol, deleteCol);

    const operands = document.getElementById('operands');
    operands.append(rowOperand);
    cryptarithmetic_conf['number_operand'] += 1;


}

function recreateNode(el, withChildren) {
    if (withChildren) {
        el.parentNode.replaceChild(el.cloneNode(true), el);
    }
    else {
        var newEl = el.cloneNode(false);
        while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
        el.parentNode.replaceChild(newEl, el);
    }
}

function deleteHandler(event, id) {
    const rowOperand = document.getElementById(`row-operand-${id}`);
    rowOperand.remove();
    for (let i = id + 1; i <= cryptarithmetic_conf['number_operand']; i++) {
        const operandInput = document.getElementById(`operand-${i}`);
        document.getElementById(`row-operand-${i}`).setAttribute('id', `row-operand-${i - 1}`);
        operandInput.name = `operand-${i - 1}`;
        operandInput.id = `operand-${i - 1}`;
        operandInput.placeholder = `Operand ${i - 1}`;
        const deleteButton = document.getElementById(`delete-button-operand-${i}`);
        deleteButton.setAttribute('id', `delete-button-operand-${i - 1}`);
        recreateNode(deleteButton, true);
        document.getElementById(`delete-button-operand-${i - 1}`).addEventListener('click', (event) => deleteHandler(event, i - 1));
    }
    cryptarithmetic_conf['number_operand'] -= 1;
}

function findMaxLen(operandAndResult) {
    var max = operandAndResult[0].length;
    for (let strop of operandAndResult) {
        if (max < strop.length) {
            max = strop.length;
        }
    }
    return max;
}

function getInput() {
    const operand = [];
    var result = "";
    var operandAndResult = [];
    const idxChar = {};

    for (let i = 0; i < cryptarithmetic_conf['number_operand']; i++) {
        operand.push(document.getElementById(`operand-${i + 1}`).value);
    }
    result = document.getElementById('result').value;
    operandAndResult = operandAndResult.concat(operand);
    operandAndResult.push(result);

    maxLen = findMaxLen(operandAndResult);

    idx = 0;

    for (let i = 0; i < maxLen; i++) {
        for (let strop of operandAndResult) {
            idxtemp = strop.length - 1 - i;
            if (idxtemp >= 0) {
                if ((idxChar[strop[idxtemp]] ?? -1) == -1) {
                    idxChar[strop[idxtemp]] = idx;
                    idx += 1;
                }
            }
        }
    }

    return {
        'operand': operand,
        'result': result,
        'operandAndResult': operandAndResult,
        'idxChar': idxChar,
        'maxLen': maxLen
    };
}

function onSubmitHandler(event) {
    event.preventDefault();
    var input = getInput();
    const cryptarithmetic = new Cryptarithmetic(input);
    var output = cryptarithmetic.solve();
    document.getElementById('result-content').innerHTML = output;
    const value = JSON.stringify({
        'operand': input.operand,
        'result': input.result,
        'idxChar': cryptarithmetic.idxChar,
        'solution': cryptarithmetic.sol
    });
}

function onChangeHandler(event) {
    const value = JSON.stringify({
        'id': event.target.id,
        'value': event.target.value
    });
    trackEvent(value);
}

document.getElementById("add-operand-button").addEventListener("click", createOperandItem);
document.getElementById("input-form").addEventListener("submit", onSubmitHandler);
document.getElementById("operand-1").addEventListener("change", onChangeHandler);
document.getElementById("operand-2").addEventListener("change", onChangeHandler);
document.getElementById("result").addEventListener("change", onChangeHandler);

