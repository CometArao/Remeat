//Set dimentions and margin for the chart
const margin = { top: 70, right: 30, bottom: 40, left: 80 };
const width = 1200 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

//Set up the x and y scales

//Crea un objeto timeScale
const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0])

//Create the SVG element and append it to the chart container

const svg = d3.select("#chart-container")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")//group
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip");

//Create fake dataset
const dataset = [
    { date: new Date("2022-01-01"), value: 200 },
    { date: new Date("2022-02-01"), value: 250 },
    { date: new Date("2022-03-01"), value: 180 },
    { date: new Date("2022-04-01"), value: 300 },
    { date: new Date("2022-05-01"), value: 280 },
    { date: new Date("2022-06-01"), value: 220 },
    { date: new Date("2022-07-01"), value: 300 },
    { date: new Date("2022-08-01"), value: 450 },
    { date: new Date("2022-09-01"), value: 280 },
    { date: new Date("2022-10-01"), value: 600 },
    { date: new Date("2022-11-01"), value: 780 },
    { date: new Date("2022-12-01"), value: 320 }
  ];

console.log(dataset);

//define x and y domains

x.domain(d3.extent(dataset, d => d.date));
y.domain([0, d3.max(dataset, d => d.value)]);

//Add x-axis
svg.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x)
    .ticks(d3.timeMonth.every(1))
    .tickFormat(d3.timeFormat("%b %Y")))

//Add y-axis
svg.append("g")
  .call(d3.axisLeft(y))

// Create a line generator
const line = d3.line()
  .x(d => x(d.date))
  .y(d => y(d.value));

//Add the line path to the SVG element
svg.append("path")
  .datum(dataset)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 1)
  .attr("d", line);

//ADD a circle
const circle = svg.append("circle")
  .attr("r", 0)
  .attr("fill", "steelblue")
  .style("stroke", "white")
  .attr("opacity", .7)
  .style("pointer-events", "none")

//Create a listening rectangle
const listeningRect = svg.append("rect")
  .attr("width", width)
  .attr("height", height);

  //listeningRect.on("mousemove", function (event) {
    ////supongo que extrae la cordenada x del mouse
    //const [xCoord] = d3.pointer(event, this);
    ////si se añadiera un elemento cual seria su index
    ////left al final dice que en caso de que se repita el valor
    ////ponlo a la izquierda del elemento
    //const bisectDate = d3.bisector(d => d.date).left;
    ////intenta dar vuelta el rango para usar las cordenadas del mouse en
    ////el grafico
    //const x0 = x.invert(xCoord);
    //const i = bisectDate(dataset, x0, 1);
    //const d0 = data[i - 1];
    //const d1 = data[i];
    //const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    
  //})

// Add a chart tittle
//svg.append("text")
  //.attr("class", "chart-tittle")
  //.attr("x", margin.left - 115)
  //.attr("y", margin.top -100)
  //.style("font-size", "24px")
  //.style("font-weight", "bold")
  //.style("font-family, sans-serif")
  //.text("Mi titulo")

console.log("test")
svg.append("text")
.attr("class", "chart-title")
.attr("x", margin.left - 115)
.attr("y", margin.top - 100)
.style("font-size", "24px")
.style("font-weight", "bold")
.style("font-family", "sans-serif")
.text("Mi titulo");