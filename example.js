// U63166005
// Coding Challenge #12

function main(){

let elements
let stock
let startDate
let endDate
let filteredArray       // Defines variables to retain them outside of functions

let width = 600
let height = 600

d3.select('body')
    .append('svg')          // Creates SVG
    .attr('width', width)
    .attr('height', height)

d3.csv('mock_stock_data.csv').then(        // Pulls CSV file
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
    
    let prices = filteredArray.map(({ Price }) => Number(Price))
    let dates = filteredArray.map(({ Date }) => Date)
       
    let svg = d3.select('svg')
    svg.selectAll("*").remove(); // Clear SVG from previous use

    let xScale = d3.scaleBand()
                .domain(dates)
                .range([0, width-50])
                .padding(0.1)

    let yScale = d3.scaleLinear()
                    .domain([100, 170])
                    .range([height-50, 0])

    let x_axis = d3.axisBottom()
                    .scale(xScale)

    let y_axis = d3.axisLeft()
                    .scale(yScale)

    svg.append('g')
            .attr('transform','translate(50,10)')
            .call(y_axis)                           // Adds Y axis

    svg.append('g')
            .attr('transform','translate(50,'+ (height-40)+ ')')
            .call(x_axis)                           // Adds X axis
    
    svg.selectAll('.bar')     
        .data(prices)
        .enter().append('rect')     // Creates rectangles
        .on("mouseover", function (event, d) {highlight(event, d, this, dates, prices);})   // Adds Event Listeners
        .on("mouseout", reset)
        .attr('class','bar')
        .attr('x', function(d, i){return xScale(dates[i])+50})
        .attr('y', function(d){return yScale(d)+10})
        .attr('width', xScale.bandwidth())
        .attr('height', function(d){return height - 50 - yScale(d)})

    function highlight(event, d, element, dates, prices){                                   // Hightlights
            let xPos = parseFloat(d3.select(element).attr('x'))    // Gets x and y position
            let yPos = parseFloat(d3.select(element).attr('y'))

            let index = prices.indexOf(d);
            let date = dates[index];
            let price = prices[index];
        
            d3.select('#tooltip')
                    .style('left', xPos + 'px')
                    .style('top', yPos + 'px')
                    .select('#tooltipText').html(`Stock: ${stock}<br>Date: ${date}<br>Price: ${price}`)         // Displays elements for selected bar
            d3.select('#tooltip').classed('hidden', false); 
            d3.select(element).attr('class','highlight')
        }
        
    function reset(){                                       // Changes back to normal
                    d3.select(this).attr('class','bar')
                    d3.select('#tooltip').classed('hidden', true);   
        }

    })
}
