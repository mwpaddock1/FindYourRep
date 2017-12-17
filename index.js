 //'use strict';

const CONGRESSPERSON_SEARCH_URL = 'https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDmy5GqaG7XhLaYLbAUuoUqO4DRFT_Lgz4&address=';

function handleForm() {
  const addressForm = $('form[name=rep-search]');
  //when the user clicks on "Lookup Representative"
  addressForm.on('submit', function(e) {
    e.preventDefault();

    //hide the search form and display the results
     $('.js-search-form').addClass('hidden');
     $('.js-search-results').removeClass('hidden');
     $('.new-search').removeClass('hidden');
    //get the address information that was entered 
     const line1Field = $('input[name=line1]');
     const cityField = $('input[name=city');
     const stateField = $('select[name=state]');     
     const zipcodeField = $('input[name=zipcode]');
     
    //get the address info that was entered
   const voterZipcode = zipcodeField.val();
   const voterLine1 = line1Field.val();
   const voterCity = cityField.val();
   const voterState = stateField.val();
 
    //make sure the user entered five digits for the zipcode
    if (voterZipcode.length === 5) {       
      //concatenate the address
      
      const voterAddress = (voterLine1 + voterCity + voterState + voterZipcode);   
       
      //and pass the address in along with the Congressperson endpoint
      fetchData(CONGRESSPERSON_SEARCH_URL, voterAddress);
    }
    //if the user entered more or less than 5-digits- Alert
    else {
      alert("Please enter a valid 5-digit zipcode.")
    }
    //reset the input}
    line1Field.val('');
    cityField.val('');
    stateField.val('');
    zipcodeField.val('');
  })
}
function fetchData(baseURL, zipcode) {
  //make the complete url by concatenating 
  //the endpoint and the zipcode together
  const url = baseURL + zipcode;
  //get the JSON data
  //and show something to the user.
  $.getJSON(url, showRepInfo)
  // ... and show an error if we can't 
  .fail(showErr);
} 

function formatRepInfo(officialInfo) {
const repInfoHTML = (
`<div class ="rep col-4">
  <section class ="name-box">
    <div class="image-box">
     <div class="image">
       <img src="${officialInfo.photoUrl}" alt="representative-head-shot" class="headshot">
     </div> 
     </div>
     <div class= "name-title-text">    
       <h1>${officialInfo.name}</h1>
       <h2>${officialInfo.officeName}</h2>
     </div>  
     <div class ="info-box">
       <ul>
         <li>Party: ${officialInfo.party}</li>
         <li>Phone: ${officialInfo.phones}</li>
         <li><a href ='${officialInfo["urls"]}' target="_blank">Visit the official website</a></li>
         <li>Go to Facebook: <a href="https://www.facebook.com/${officialInfo.facebook}" target="_blank" class="fa fa-facebook"></a></li>
       </ul>
      </div>
  <button class="tweets-button">Tweets</button>
  <section class="tweets hidden">
       <a class="twitter-timeline" href="https://twitter.com/${officialInfo.tweets}"></a>
  </section>
 </section>
</div> 
`

  );
  return repInfoHTML;  
  debugger 
}

function showRepInfo(repData) {
  // store the element we'll be appending to
  const outputResults= $('row.reps');
  
  //then empty the output region
  outputResults
  
  .empty()
   //store the parts we want from the data
  //using object destructuring
  let {officials, offices} = repData;
  //map the office info to a new object where we just need the office name and the officialIndices
  const formattedData = offices.map((officeData)=> {
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
  
    //starts the iterating over the offices
    for (let office of formattedData) {
    //pulls out just the Senators and the US Reps 
       if ((office.name.indexOf("United States House") >= 0) || (office.name === "United States Senate"))          
        // iterates over the officials in the Senator or Rep office  //to find the Twitter handle
             for (let official of office.officials) {
               function isTwitter(socialMedia) {
                 return socialMedia.type === 'Twitter';                
               }
              const twitterHandle = (official.channels.find(isTwitter).id);

        //and to find the Facebook handle       
          function isFacebook(socialMedia) {
            return socialMedia.type === 'Facebook';                
          }
         const facebookHandle = (official.channels.find(isFacebook).id);
           
         //gets the details on the specific official
             let officialInfo = {
               officeName: office.name,
               name: official.name, 
               party: official.party, 
               phones: official.phones,
               urls: official.urls,
               photoUrl: official.photoUrl,
               tweets: twitterHandle,
               facebook: facebookHandle
             }
    let htmlResults = formatRepInfo(officialInfo);
   //output the results
      outputResults  
      .append(htmlResults);
     $('.tweets-button').on('click', function(e) {e.preventDefault();
        $(".tweets").toggleClass('hidden');       
      })
     }
    $(".new-search-button").on('click', function(event) {
      $(".new-search").addClass('hidden');
      $('.js-search-form').removeClass('hidden');
      $('.js-search-results').addClass('hidden');
     
   })
  }
  //load the tweets
    twttr.widgets.load();    
  }
    //handle user input errors
 function showErr(err) {
    const outputResults = $('row.reps');
    const {status } = err;

   console.log (err)

    let errMsg;
   if (status === 404) {
    errMsg = `We couldn't find that address`
   }
   if (status === 503) {
   errMsg = `We couldn't reach the database's servers!`
   }
  const errHTML = (
    `<div class="error"">
      <p>${errMsg}. Please enter a valid 5-digit zipcode!<p>
     </div>`
     );
    
  outputResults
  .empty()
  .append(errHTML)
  .prop('hidden', false);
}

$(handleForm);