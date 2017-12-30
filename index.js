'use strict';

const CONGRESSPERSON_SEARCH_URL = "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDmy5GqaG7XhLaYLbAUuoUqO4DRFT_Lgz4&address=";

function handleForm() {
  const addressForm = $("form[name=rep-search]");
  addressForm.on("submit", function (e) {
    e.preventDefault();

    const line1Field = $("input[name=line1]");
    const cityField = $("input[name=city]");
    const stateField = $("select[name=state]");
    const zipcodeField = $("input[name=zipcode]");

    const voterLine1 = line1Field.val();
    const voterCity = cityField.val();
    const voterState = stateField.val();
    const voterZipcode = zipcodeField.val();
    const voterAddress = (voterLine1 + voterCity + voterState + voterZipcode);

    line1Field.val("");
    cityField.val("");
    stateField.val("");
    zipcodeField.val("");
    if (voterZipcode.length === 5) {
      //hide the search form and display the results
      $(".js-search-form").addClass("hidden");
      $(".js-search-results").removeClass("hidden");
      $(".js-handle-errors").addClass("hidden");
     
      fetchData(CONGRESSPERSON_SEARCH_URL, voterAddress);

    } else {
      alert("Please enter a valid 5-digit zipcode.")
    }
  })

  function fetchData(baseURL, zipcode) {
    const url = baseURL + zipcode;

    $.getJSON(url, showRepInfo)
      .fail(showErr);
  }
}

function formatRepInfo(officialInfo) {
  const repInfoHTML = (
    `<div class ="rep col-4">
       <section class ="name-box">
         <div class="image-box">
           <div class="image">
             <img src="${officialInfo.photoUrl}" alt="When available, the representative's headshot is displayed" class="headshot">
           </div> 
         </div>
         <div class= "name-title-text">    
           <h1>${officialInfo.name}</h1>
           <h2>${officialInfo.officeName}</h2>
         </div>
       </section>  
       <section class ="info-box">
         <ul>
           <li>Party: ${officialInfo.party}</li>
           <li>Phone: ${officialInfo.phones}</li>
           <li><a href ='${officialInfo["urls"]}' target="_blank">Visit the official website</a></li>
       ${officialInfo.hasFacebook ? `<li>Go to Facebook: <a href="https://www.facebook.com/${officialInfo.facebook}" target="_blank" class="fa fa-facebook" aria-label="Go to Facebook" role="none"></a></li>` : ''};
         </ul>
       </section>
       ${officialInfo.hasTweets ? `
       <button class="tweets-button">Tweets</button>
       <section class="tweets hidden">
         <a class="twitter-timeline" href="https://twitter.com/${officialInfo.tweets}"></a>
       </section>
       ` : ''} 
     </div> 
`
  );
  return repInfoHTML;
}

function showRepInfo(repData) {

  const outputResults = $("row.reps");

  outputResults

    .empty()
  //store the parts we want from the data
  let {
    officials,
    offices
  } = repData;

  const formattedData = offices.map((officeData) => {
    let newOfficeData = {
      //get the office name 
      name: officeData.name,
      officialIndices: officeData.officialIndices
    }
    //get the officials from the office officialIndices
    const newOfficials = officeData.officialIndices.map((officialIndex) => (officials[officialIndex]));
    newOfficeData.officials = newOfficials;

    return newOfficeData;
  });

  for (let office of formattedData) {

    if ((office.name.indexOf("United States House") >= 0) || (office.name === "United States Senate"))

      for (let official of office.officials) {
        function isTwitter(socialMedia) {
          return socialMedia.type === "Twitter";
        }
        const hasTweets = (official.channels.some(isTwitter))
        const twitterHandle = hasTweets ? (official.channels.find(isTwitter).id) : null;


        function isFacebook(socialMedia) {
          return socialMedia.type === "Facebook";
        }
        const hasFacebook = (official.channels.some(isFacebook))
        const facebookHandle = hasFacebook ? (official.channels.find(isFacebook).id) : null;

        //get the details on the specific official
        let officialInfo = {
          officeName: office.name,
          name: official.name,
          party: official.party,
          phones: official.phones,
          urls: official.urls,
          photoUrl: official.photoUrl,
          tweets: twitterHandle,
          hasTweets: hasTweets,
          facebook: facebookHandle,
          hasFacebook: hasFacebook
        }
        let htmlResults = formatRepInfo(officialInfo);

        outputResults
          .append(htmlResults);
      }
  }

  $(".tweets-button").on("click", function (e) {
    e.preventDefault();
    $(e.currentTarget).siblings(".tweets").toggleClass("hidden");
  })
  //start a new search
  $(".new-search-button").on("click", function (event) {
    $(".js-search-form").removeClass("hidden");
    $(".js-search-results").addClass("hidden");
  })

  twttr.widgets.load();
}
//handle user input errors
function showErr(err) {
  const outputResults = $("row.errors");
  const {
    status
  } = err;

  console.log(err)

  let errMsg;
  if (status === 400) {
    errMsg = `We couldn't find that address`
  }
  if (status === 503) {
    errMsg = `We couldn't reach the database's servers!`
  }
  const errHTML = (
    `<div class="error">
        <p>${errMsg}. Please enter a valid address!<p>
      </div>`
  );
  $(".js-search-form").removeClass("hidden");
  $(".js-search-results").addClass("hidden");
  $(".js-handle-errors").removeClass("hidden");

  outputResults
    .append(errHTML)
}

$(handleForm);