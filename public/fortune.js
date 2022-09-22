(function() {
  window.addEventListener('load', init);
  const APIkey = "TLUYLC7Y5VCCJC9A"; 
  let totalPortfolioValue = 0; 
  let stockIteration = 0; 

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
    let newPort = document.querySelector('.new_port');
    newPort.style['display'] = 'block';
    let newBtn = document.querySelector('#new_portfolio');
    newBtn.style['display'] = 'none';
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
    console.log("Trying to get Stock");
    let symbols = document.querySelectorAll(".ticker");
    stockIteration = symbols.length - 1; 
    for (let i = stockIteration; i >= 0; i--) {
      let symbol = symbols[i].value; 
      console.log("This was the reported value: " + symbol);
      let URL = "https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=" + symbol + "&apikey=" + APIkey;
      console.log("URL: " + URL)
      fetch(URL)
        .then(statusCheck)
        .then(res => res.json())
        .then(calculateStock)
        .catch(handleErr);
    }
  }

  function calculateStock(response) {
    console.log("this was the stock symbol"); 
    let symbolizer = document.querySelectorAll(".ticker");
    console.log(symbolizer[stockIteration].value);
    console.log('this was supposed to be the response....');
    console.log(response);
    let dates = document.querySelectorAll(".date"); 
    console.log("this was the date array")
    console.log(dates)
    console.log("this was the stock iteration");
    console.log(stockIteration); 
    let date = dates[stockIteration].value; 
    console.log("this was supposed to be the date lol");
    console.log(date);
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
          console.log(tuple)
          console.log(Math.abs((tupleData[2] / 7) - (day / 7)));
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
    console.log("we found the best candidate"); 
    console.log(Object.keys(updatedInfo)[minIndex])
    console.log(updatedInfo[Object.keys(updatedInfo)[minIndex]]);
    let adjClose = updatedInfo[Object.keys(updatedInfo)[minIndex]]['5. adjusted close']
    let amounts = document.querySelectorAll('.amount')
    let startMoney = amounts[stockIteration].value; 
    let symbols = document.querySelectorAll('.ticker'); 
    let symbol = symbols[stockIteration].value;
    console.log("today ")
    console.log(updatedInfo[Object.keys(updatedInfo)[0]]);
    let marketPrice = updatedInfo[Object.keys(updatedInfo)[stockIteration]]['5. adjusted close'];
    let investmentValue = ((startMoney / adjClose) * marketPrice);
    totalPortfolioValue += investmentValue; 
    investmentValue = investmentValue.toFixed(2); 
    console.log("Your investment in " + symbol + " would be worth approximately $" + investmentValue + " today...")
    console.log("Your Money Multiplier would have been: " + (investmentValue / startMoney).toFixed(1) + "x more than your initial investment!")
    // 5. adjusted close:

    console.log("We finished this round");
    console.log("Total Port Value was this: $" + totalPortfolioValue.toFixed(2));
    stockIteration = stockIteration - 1; 
    console.log("THIS WAS THE STOCK ITERATION: " + stockIteration);
    if (stockIteration === -1) {
      let divArray = document.querySelectorAll(".stock_input"); 
      console.log(divArray)
      let totalP = document.createElement('p');
      let finalPortValue = totalPortfolioValue.toFixed(2); 

      // HOW TO INSERT COMMAS EASILY?

      // console.log("Digits of the port wasss: " + finalPortValue.length);
      // if (finalPortValue.length >= 7) {
      //   for (let i = finalPortValue.length - 6; i >= 0; i--) {
      //       finalPortValue.charAt(i) = ","
      //       //finalPortValue = finalPortValue + finalPortValue.charAt(i)
      //   }
      //   console.log(finalPortValue); 
      // }
      totalP.textContent = "Your investment would be worth: $" + finalPortValue + " in today's market..."; 
      console.log(totalP);
      for (let i = 0; i < divArray.length; i++) {
        let curr = divArray[i]; 
        console.log(curr); 
        curr.style.display = "none";
      }
      document.getElementById('portfolio_value').appendChild(totalP);
      let newBtn = document.querySelector('#new_portfolio');
      newBtn.style['display'] = 'flex';
      document.getElementById('add_stock').style.display = "none";
      document.getElementById('submission').style.display = "none";
    }
  }


  /**
   * checks the tatus of the response from the Memes API
   * @param {DOMList} res - the response from Memes API
   * @return {object} the response if it is valid and acceptable
   */
   async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Handles an error produced from trying to fetch any of the Yipper endpoints
   */
   function handleErr() {
      console.log("there was an error");
   }
})();