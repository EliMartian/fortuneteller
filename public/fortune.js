(function() {
  window.addEventListener('load', init);
  const APIkey = "TLUYLC7Y5VCCJC9A"; 
  let totalPortfolioValue = 0; 
  let stockIteration = 0; 
  let moneyTracker = []; 
  let stockTracker = []; 
  let godCounter = 0; 

  function init() {
    document.getElementById('new_portfolio').addEventListener('click', buildNewPortfolio);
    document.getElementById('submission').addEventListener('click', function(el) {
      el.preventDefault();
      showStock();
    }); 
    document.getElementById('add_stock').addEventListener('click', function(el) {
      el.preventDefault(); 
      addNewStockInput('ticker', 'Stock:');
      addNewStockInput('amount', 'Amount:'); 
      addNewStockInput('date', 'Date:'); 
    })
  }

  function buildNewPortfolio() {
    // resets portfolio value at each new call
    totalPortfolioValue = 0;
    let newPort = document.querySelector('.new_port');
    newPort.style['display'] = 'block';
    let newBtn = document.querySelector('#new_portfolio');
    newBtn.style['display'] = 'none';
    let divArray = document.querySelectorAll(".stock_input"); 
    for (let i = 0; i < divArray.length; i++) {
      let curr = divArray[i]; 
      // unhides each stock input field
      curr.style.display = "flex";
    }
    let add = document.getElementById("add_stock"); 
    add.style.display = "block";

    let sub = document.getElementById("submission"); 
    sub.style.display = "block";

    let innards = document.getElementById('portfolio_value'); 
    innards.innerHTML = ""; 

    let inputCleaner = document.querySelectorAll('input');  
    for (let i = 0; i < inputCleaner.length; i++) {
      if (inputCleaner[i].value != "") {
        inputCleaner[i].value = ""; 
      }
    }

  }

  function addNewStockInput(value, displayedText) {
    let input = document.createElement('div'); 
    input.classList.add('stock_input');
    let inptLabel = document.createElement('label');
    inptLabel.for = value;
    inptLabel.textContent = displayedText; 
    input.appendChild(inptLabel);
    let actualInput = document.createElement('input');
    actualInput.type = 'text';
    actualInput.classList.add(value); 
    input.appendChild(actualInput); 
    let stockContainer = document.getElementById('stocks_container');
    stockContainer.appendChild(input);
  }


  function showStock() {
    let symbols = document.querySelectorAll(".ticker");
    for (let i = 0; i < symbols.length; i++) {
      stockTracker[i] = symbols[i].value; 
    }
    stockIteration = symbols.length - 1; 
    for (let i = stockIteration; i >= 0; i--) {
      let symbol = symbols[i].value; 
      let URL = "https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=" + symbol + "&apikey=" + APIkey;
      fetch(URL)
        .then(statusCheck)
        .then(res => res.json())
        .then(calculateStock)
        .catch(handleErr);
    }
  }

  function calculateStock(response) {
    let symbolizer = document.querySelectorAll(".ticker");
    let dates = document.querySelectorAll(".date"); 
    let date = dates[stockIteration].value; 
    let dateArray = date.split('-');
    let year = dateArray[0];
    let month = dateArray[1];
    let day = dateArray[2];
    var updatedInfo = response['Weekly Adjusted Time Series'];
    let length = Object.keys(updatedInfo).length
    let minIndex = 0;
    let min = 100000;
    let validData = false; // UPDATE THIS TO INCLUDE IF THEY GO TOO EARLY LATER
    for (let i = 0; i < length; i++) {
      let tuple = Object.keys(updatedInfo)[i]; 
      tupleData = tuple.split('-');
      if (tupleData[0] === year) {
        if (tupleData[1] === month) {
          if (tupleData[2] >= day) {
            let temp = Math.abs((tupleData[2] / 7) - (day / 7));
            if (temp < min) {
            min = temp;
            minIndex = i; 
            }
          }
        }
      }
    }
    let adjClose = updatedInfo[Object.keys(updatedInfo)[minIndex]]['5. adjusted close']
    let amounts = document.querySelectorAll('.amount')
    let startMoney = amounts[stockIteration].value; 
    let symbols = document.querySelectorAll('.ticker'); 
    let symbol = symbols[stockIteration].value;
    let marketPrice = updatedInfo[Object.keys(updatedInfo)[0]]['5. adjusted close'];
    let investmentValue = ((startMoney / adjClose) * marketPrice);
    totalPortfolioValue += investmentValue; 
        
        stockTracker[godCounter] = response['Meta Data']['2. Symbol']; 
        moneyTracker[godCounter] = investmentValue;
        godCounter++; 

    investmentValue = investmentValue.toFixed(2); 

    stockIteration = stockIteration - 1; 
    if (stockIteration === -1) {
      
      let divArray = document.querySelectorAll(".stock_input"); 
      let totalP = document.createElement('p');
      let finalPortValue = totalPortfolioValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

      totalP.textContent = "Your investment would be worth: $" + finalPortValue + " in today's market..."; 
      for (let i = 0; i < divArray.length; i++) {
        let curr = divArray[i]; 
        curr.style.display = "none";
      }
      document.getElementById('portfolio_value').appendChild(totalP);
      let newSymbols = document.querySelectorAll('.ticker'); 

      for (let i = 0; i < stockTracker.length; i++) {
        let newStockInfo = document.createElement('p'); 
        let pArray = document.querySelectorAll('.removable'); 
        for (let i = 0; i < pArray.length; i++) {
          pArray[i].classList.add("remove"); 
        }
        newStockInfo.classList.add('removable');
        newStockInfo.textContent = "Your investment in " + stockTracker[i] + " would be worth $" + moneyTracker[i].toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        document.getElementById('portfolio_value').appendChild(newStockInfo);
      }

      let newBtn = document.querySelector('#new_portfolio');
      newBtn.style['display'] = 'block';
      document.getElementById('add_stock').style.display = "none";
      document.getElementById('submission').style.display = "none";

    }
  }


  /**
   * checks the status of the response
   * @param {DOMList} res - the response 
   * @return {object} the response if it is valid and acceptable
   */
   async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Handles an error produced from trying to fetch any of the possible endpoints
   */
   function handleErr() {
      console.log("there was an error");
   }


   // Code for a rainy day 

   /* 
    //clean up big numbers like Market Cap
    const shortenBigNumber = (value) => {
      const suffixes = ["", "K", "M", "B", "T"];
      let suffixNum = Math.floor(("" + value).length / 3);
      let shortValue = parseFloat(
        (suffixNum !== 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(
          4
        )
      );
      if (shortValue % 1 !== 0) {
        shortValue = shortValue.toFixed(2);
      }
      return shortValue + suffixes[suffixNum];
    };
   */
})();