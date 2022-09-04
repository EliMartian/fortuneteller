(function() {
  window.addEventListener('load', init);
  const APIkey = "TLUYLC7Y5VCCJC9A"; 

  function init() {
    console.log("Country Walker");
    getTSLA();
  }

  function getTSLA() {
    console.log("Trying to get TSLA");
    let URL = "https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=TSLA&apikey=" + APIkey;
    fetch(URL)
      .then(statusCheck)
      .then(res => res.json())
      .then(showTSLA)
  }

  function showTSLA(response) {
    let parent = document.getElementById('TSLA_info');
    // console.log(response);
    // let length=0;
    //  if(response){       
    //     length=JSON.stringify(response).length;
    //  }
    // console.log("length: " + length);
    console.log("high")
    var updatedInfo = response['Weekly Adjusted Time Series'];
    console.log(Object.keys(updatedInfo).length)
    console.log(updatedInfo[Object.keys(updatedInfo)[634]]);
    console.log("low")
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
      console.log("there was an error lol");
   }
})();