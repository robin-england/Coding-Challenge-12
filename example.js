// U63166005
// Coding Challenge #12

function main(){

let elements
let stock
let startDate
let endDate
let filteredArray       // Defines variables to retain them outside of functions

d3.csv('mock_stock_data.csv', d3.autoType).then(        // Pulls CSV file
    function(d){
        elements = d                                    // Loads CSV data into elements variable
        })

document.getElementById("stockFilter").addEventListener("submit", (event)=>{
    event.preventDefault() 

    stock = document.getElementById("stockChoice").value       // Registers submission from html form
    startDate = document.getElementById("startDate").value    
    endDate = document.getElementById("endDate").value  
        
    if(endDate <= startDate){                                   // Forces user to select end date after the start date
        alert("End date must be after Start date.");
    return;}
              
    document.getElementById("stockFilter").reset()              // Clears form after submission
        
    filteredArray = elements.filter((element) => {              // Filters csv columns between google and apple stock
        return element.Stock === stock 
        })

    for (let index = 1; index < startDate; index++) {           // Removes elements from start of CSV array based on start date
        filteredArray.shift()
        }

    for (let index = 5; index > endDate; index--) {             // Removes elements from end of CSV array based on end date
        filteredArray.pop()
        }
        
    console.log(filteredArray);                                 // Testing array has correct values before proceeding

    })
}