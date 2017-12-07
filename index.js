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

function  formatRepInfo(officialInfo) {
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
     <a class = "twitter-timeline" href="https://twitter.com/'${officialInfo.twitterHandle}'">Recent Tweets</a>
     </section>
   </div>    
`
  );   
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
debugger
   //map the office info to a new object where we just need the office name and the officialIndices
  const formattedData = offices.map((officeData)=> {
    let newOfficeData = {
      //get the office name (eventually we just want senators and reps)
      name: officeData.name,
      officialIndices: officeData.officialIndices
    }
    console.log(`The new office name is ${officeData.name} and officialIndices is ${officeData.officialIndices}`);

    //get the officials from the office officialIndices
    const newOfficials = officeData.officialIndices.map((officialIndex) => (officials[officialIndex].name));
       
    console.log(`The official is ${newOfficials}`)
   });
  
debugger
    for (let office of formattedData) {
      for (let official of officials) {
        let officialInfo = {
           officeName: offices[name],
           name: officials[name], 
           party: officials[party], 
           urls: officials[urls],
           photoUrl: officials[photoUrl]
        }
      }    
    }    
  formatRepInfo(officialInfo);

  outputResults  
  append(repInfoHTML)
 }
    
//     console.log(`The name is ${officialInfo.name}. With Phone: ${officialInfo.phone}, party: ${officialInfo.party} and so on`)

//Twitter Section
//      //iterate over type to get the index of the twitter handle
//      //or use find-indexOf
//     // const twitter = function findTwitter(type) {
//       //return type==="Twitter";
//  // }
//  // console.log(officials.channels.type.indexOf(findTwitter))
//   // then get the Twitter handle 
  
//  // const twitterHandle = officials.channels.id[twitterIndex];
//    } )      
//  }   
// // just do Senators - until we have a working app and then figure out partial strings for the reps
// //    || (offices[names[i]] == "PARTIAL string")
  
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