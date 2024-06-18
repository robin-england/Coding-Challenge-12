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
    
    console.log(filteredArray);                                 // Testing array has correct values before proceeding
    console.log(prices);
    console.log(dates);
       
    let svg = d3.select('svg')
    svg.selectAll("*").remove(); // Clear SVG from previous use

    let xScale = d3.scaleLinear()
                .domain([])
                .range([0, width-100])

    let yScale = d3.scaleLinear()
                    .domain([d3.min(prices)-10, d3.max(prices)+10])
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
    
    let g = svg.append("g").attr('transform', 'translate('+50+','+(-50)+')')

    g.selectAll('.bar')     
        .data(prices)
        .enter().append('rect')     // Creates rectangles
        .on("mouseover", highlight)   // Adds Event Listeners
        .on("mouseout", reset)
        .attr('class','bar')
        .attr('x', function(d, i){return i*100+15})
        .attr('y', function(prices){return yScale(prices)+10})
        .attr('width', function(d, i){return width/6 -25})
        .attr('height', function(prices){return height - yScale(prices)})

    function highlight(d, i){                                   // Hightlights
            let xPos = parseFloat(d3.select(this).attr('x'))    // Gets x and y position
            let yPos = parseFloat(d3.select(this).attr('y'))
            d3.select('#tooltip')
                    .style('left', xPos + 'px')
                    .style('top', yPos + 'px')
                    .select('#tooltipText').text(stock)         // Displays stock of select attributes
            d3.select('#tooltip').classed('hidden', false); 
            d3.select(this).attr('class','highlight')
        }
        
    function reset(d, i){                                       // Changes back to normal
                    d3.select(this).attr('class','bar')
                    d3.select('#tooltip').classed('hidden', true);   
        }

    })
}