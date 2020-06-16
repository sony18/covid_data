/*===================================================================
   Capture Dom elements
==================================================================*/
const date_div = document.querySelector('.date')

const header_chart = document.querySelector('#header__chart')
const list_ul = document.querySelector('#list')
const updated_date = document.querySelector('#update_date')
const countries_select = document.querySelector('#countries')
const country_title = document.querySelector('.country__title')

// end point
let url = 'https://covid19.mathdro.id/api'
// let liveUrl = 'https://api.covid19api.com/'

/*===================================================================
 change single num to 2 digit
==================================================================*/
const format =(num)=>{
if(num<10){
    return num = '0'+num
}
return num;
}

/*===================================================================
 CURRENT Date time
==================================================================*/
setInterval(() => {
    let date = new Date();
    const hr = format(date.getHours());
    const min = format(date.getMinutes());
    const sec = format(date.getSeconds());    
    date_div.innerHTML = `${date.toDateString()} `;
    date_div.innerHTML += `| ${hr}:${min}:${sec} <br/>`
}, 1000);

/*===================================================================
    FETCH  COUNTRIES... api call
  ==================================================================*/
const fetchCountry = async ()=>{
    const request = await fetch(`${url}/countries`)
    const {countries} = await request.json();
    return countries
    }    
/*===================================================================
 FETCH DATA
==================================================================*/
    const fetchData = async (countryTag)=>{ 
      console.log(countryTag);
        let changeableUrl = url
        let countryName;
        try {
          let countries= await fetchCountry();        
          countries.forEach(country=>{
            if( country.iso3 === countryTag){
              return countryName = country.name
            }
          })  
          // url change to pull data from COUNTRY SPECIFIC
          if(countryTag&&countryTag !== 'global'){
            changeableUrl = `${url}/countries/${countryTag}`
          }
          const request = await fetch(changeableUrl)// api call
          const data = await request.json()
          console.log(data);
          
          //pass data to ui update 
          uiUpdate(data,countryTag,countryName)
          chartUi(data)
        } catch (error) {
          console.log(error.message);
        }
      
      //display chart only for global data
      toggleChartVisibility(countryTag)
    }

/*===================================================================
     Ui... DATA UPDATEs
==================================================================*/    
        const uiUpdate = (data,countryTag,countryName)=>{
                //    destructured api data
            const { confirmed,deaths,recovered,lastUpdate} = data
            const lastUpdated = new Date(lastUpdate).toUTCString();
             //  display  Country Title error handling              
            country_title.innerHTML= 
            (countryTag&& countryTag !=='global'&& countryTag !=='undefined')? countryName:(countryTag === 'undefined')? 'No records found...':'Global'

            // console.log(data.error.message);
            if(countryTag === 'undefined'&& data.error){
              list_ul.innerHTML = `<span class="red-text" >Error..missing country Tag. ${data.error.message}</span>`
            }            
             const list = `<li class="btn btn-large  waves-effect waves-light yellow lighten-1 black-text">Confirmed : ${confirmed.value}</li> <br/><br/>
                    <li class="btn btn-large waves-effect waves-light red lighten-1  black-text">Death : ${deaths.value}</li><br/><br/>
                    <li class="btn btn-large waves-effect waves-light green lighten-1 black-text"> Recovered : ${recovered.value}</li> `  
           list_ul.innerHTML = list
           updated_date.innerHTML = ` <strong> Last Updated: </strong> <small> ${lastUpdated} </small>
                         ` 
    }
/*===================================================================
    TOGGLE CHART VISIBILITY
==================================================================*/
const toggleChartVisibility =(countryTag)=>{
  if(countryTag && countryTag !== 'global'){
    header_chart.style.visibility= 'hidden';    
  }else{
    header_chart.style.visibility= 'visible';  }
}

/*===================================================================
 Ui... DATA CHART
==================================================================*/
const chartUi = ({confirmed,recovered,deaths,lastUpdate})=>{

    var ctx = document.getElementById("covidChart").getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['confirmed','recovered','deaths'], // labels
        datasets: [{        
          label:'global',
          data: [confirmed.value,recovered.value,deaths.value], 
          backgroundColor: [ // custom colors
            'rgba(244, 288, 83,1)',
            'rgba(0, 206, 0,0.5)',
            'rgba(220, 52, 52,1)',
          ],
          borderColor: [ //  custom color borders
            'rgba(255, 206, 86, 1)',
            'rgba(53, 202, 55, 1)',
            'rgba(355, 62, 10, 1)',
          ],
          borderWidth: 1, // bar border width
        }]
      },
      options: {
        responsive: true, 
        maintainAspectRatio: false, // prevent default behavior of full-width/height 
        title:{
            display:true,
            text:`Todays data (updated at: ${new Date(lastUpdate).toLocaleTimeString()})`
        }
      }
    });
    return myChart;
  }

/*===================================================================
 PULL LIST OF COUNTRIES..
==================================================================*/
const fillSelectList = async (e)=>{
    var elems = document.querySelectorAll('select')
    let countries = await fetchCountry()

      countries.forEach(country=> 
                countries_select.innerHTML +=(` <option value="${country.iso3}" data-value="${country.name}">${country.name}</option>`).toString()      
        )
    fetchData()//global data call
    }


// EVENT HANDLER
document.addEventListener('DOMContentLoaded', fillSelectList)                                         
countries_select.addEventListener('change',(e)=>{
    //GET data for user selected country name
  fetchData(e.target.value)
})



  
