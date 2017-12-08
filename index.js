 //'use strict';

const CONGRESSPERSON_SEARCH_URL = 'https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDmy5GqaG7XhLaYLbAUuoUqO4DRFT_Lgz4&address=';

function handleForm() {
  const zipcodeForm = $('form[name=rep-search]');
  const zipcodeField = $('input[name=zipcode]');
  //when the user clicks on "Lookup Representative"
  zipcodeForm.on('submit', function(e) {
    e.preventDefault();

    //hide the search form and display the results
     $('.search').addClass('hidden');
     $('.js-search-results').removeClass('hidden');
    
    //get the zipcode that was entered
    const voterZipcode = zipcodeField.val();
    //make sure the user entered five digits
    if (voterZipcode.length === 5) {
      //pass zipcode in along with the Congressperson endpoint
      fetchData(CONGRESSPERSON_SEARCH_URL, voterZipcode);
    }
    //if the user entered more or less than 5-digits- Alert
    else {
      alert("Please enter a valid 5-digit zipcode.")
    }
  //reset the input}
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
     <section class="image">
       <img src="${officialInfo.photoUrl}">
     </section>
     <section class ="name-box1">
       <h2 class='js-search-results'>${officialInfo.name}</h2>
       <h2>${officialInfo.officeName}</h2><br>
     </section>
     <section class ="info-box">
       Party: ${officialInfo.party}<br>
       Phone: ${officialInfo.phones}<br>
       <a href ='${officialInfo["urls"]}'>Visit the website</a>
     </section>
     <section class="tweets">
     <a class = "twitter-timeline" href="https://twitter.com/'${officialInfo.tweets}'">Recent Tweets</a>
     </section>
   </div>    
`
  );
  return repInfoHTML;   
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
      //get the office name (eventually we just want senators and reps)
      name: officeData.name,
      officialIndices: officeData.officialIndices
    }
    // console.log(`The new office name is ${officeData.name} and officialIndices is ${officeData.officialIndices}`);

    //get the officials from the office officialIndices
    const newOfficials = officeData.officialIndices.map((officialIndex) => (officials[officialIndex]));
   newOfficeData.officials = newOfficials;    
      
  return newOfficeData;  
});
  
    //starts the iterating over the offices
    for (let office of formattedData) {
    //pulls out just the Senators and the US Reps 
       if ((office.name.indexOf("United States House") >= 0) || (office.name === "United States Senate"))          
        // iterates over the officials in the Senator or Rep office
             for (let official of office.officials) {
              function isTwitter(socialMedia) {
                return socialMedia.type === 'Twitter';                
              }
              const twitterHandle = (official.channels.find(isTwitter).id);

          //gets the details on the specific official
            let officialInfo = {
              officeName: office.name,
              name: official.name, 
              party: official.party, 
              phones: official.phones,
              urls: official.urls,
              photoUrl: official.photoUrl,
              tweets: twitterHandle
            }
            
  let htmlResults = formatRepInfo(officialInfo);
     
      outputResults  
      .append(htmlResults);
//Twitter Section
//iterate over type to get the index of the twitter handle
///or use find-indexOf
         
            // function isTwitter(socialMedia) {
            //   return socialMedia.type === 'Twitter';
              
            // }
            // const twitterHandle = (official.channels.find(isTwitter).id);

  console.log(official.channels.find(isTwitter)); 
  console.log(official.channels.find(isTwitter).id);
  console.log(twitterHandle)
    }      
  }
   
  }
    
//   function add(num1, num2){
//    const added= (num1 +num2);
//    const addAgain = (num1 + num2 + num2)
//    return (added + addAgain);
//   }
// let addedUp =add(1,2);  
 function showErr(err) {
    const outputResults = $('row.reps');
    const {status } = err;

   console.log (err)

    let errMsg;
   if (status === 404) {
    errMsg = `We couldn't find that zipcode`
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