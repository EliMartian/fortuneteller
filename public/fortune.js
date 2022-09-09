(function() {
  window.addEventListener('load', init);
  const APIkey = "TLUYLC7Y5VCCJC9A"; 

  function init() {
    document.getElementById('submission').addEventListener('click', function(el) {
      console.log("test1");
      el.preventDefault();
      console.log("test2");
      showStock();
    }); 
  }

  function showStock() {
    console.log("Trying to get Stock");
    let symbol = document.getElementById("ticker").value;
    console.log("This was the reported value: " + symbol);
    let URL = "https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=" + symbol + "&apikey=" + APIkey;
    fetch(URL)
      .then(statusCheck)
      .then(res => res.json())
      .then(calculateStock)
  }

  function calculateStock(response) {
    console.log(response);
    // let length=0;
    //  if(response){       
    //     length=JSON.stringify(response).length;
    //  }
    // console.log("length: " + length);
    let date = document.getElementById("date").value; 
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
    let startMoney = document.getElementById('amount').value;
    let symbol = document.getElementById("ticker").value;
    console.log("today ")
    console.log(updatedInfo[Object.keys(updatedInfo)[0]]);
    let marketPrice = updatedInfo[Object.keys(updatedInfo)[0]]['5. adjusted close'];
    let investmentValue = ((startMoney / adjClose) * marketPrice);
    investmentValue = investmentValue.toFixed(2); 
    console.log("Your investment in " + symbol + " would be worth approximately $" + investmentValue + " today...")
    console.log("Your Money Multiplier would have been: " + (investmentValue / startMoney).toFixed(1) + "x more than your initial investment!")
    // 5. adjusted close:

    console.log(length);
    console.log("this is the most recent week's info");
    console.log();

    // var test = JSON.parse(updatedInfo);
    // console.log(test);
    // console.log("big walk");
    // console.log(updatedInfo['2010-07-09']);
    // console.log(response['Weekly Adjusted Time Series'][1]);
    // for (let i = 0; i < 500; i++) {
    //   //console.log(response['Weekly Adjusted Time Series'][i]['5. adjusted close']);
    // }
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