var data = [{
        "method": "Logistic Regression",
        "count": 4636,
        "frequency": "63.50",
}, {
        "method": "Decision Tree",
        "count": 3640,
        "frequency": 49.86,
},{
        "method": "Random Forest",
        "count": 3378,
        "frequency": 46.27,
},{
        "method": "Neural Network",
        "count": 2743,
        "frequency": 37.57,
},{
        "method": "Bayesian Technique",
        "count": 2236,
        "frequency": 30.63,
},{
        "method": "Ensemble Method",
        "count": 2078,
        "frequency": 28.46,
},{
        "method": "SVM",
        "count": 1948,
        "frequency": 26.68,
},{
        "method": "GBM",
        "count": 1742,
        "frequency": 23.86,
},{
        "method": "CNN",
        "count": 1383,
        "frequency": 18.94,
},{
        "method": "RNN",
        "count": 895,
        "frequency": 12.26,
}];

//sort bars based on value
data = data.sort(function (a, b) {
    return d3v4.ascending(a.count, b.count);
})

//set up svg using margin conventions - we'll need plenty of room on the left for labels
var margin = {
    top: 15,
    right: 45,
    bottom: 15,
    left: 150
};

var width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var svg = d3v4.select("#fig1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3v4.scaleLinear()
    .range([0, width])
    .domain([0, d3v4.max(data, function (d) {
        return d.count;
    })]);

var y = d3v4.scaleBand()
    .rangeRound([height, 0])
	.padding(0.1)
    .domain(data.map(function (d) {
        return d.method;
    }));

//make y axis to show bar names
var yAxis = d3v4.axisLeft()
    .scale(y)
    //no tick marks
    .tickSize(0)

var gy = svg.append("g")
    .attr("class", "y axis")
    .attr("fill-opacity", .6)
    .call(yAxis)

var bars = svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("g")

//append rects
bars.append("rect")
    .attr("class", "bar")
    .attr("y", function (d) {
        return y(d.method);
    })
    .attr("height", y.bandwidth())
    .attr("x", 0)
    .attr("fill-opacity", .6)
    .attr("width", function (d) {
        return x(d.count);
    });

//add a frequency label to the right of each bar
bars.append("text")
    .attr("class", "label")
    .attr("y", function (d) {
        return y(d.method) + y.bandwidth() / 2 + 4;
    })
    .attr("x", function (d) {
        return x(d.count) + 3;
    })
    .attr("fill-opacity", .6)
    .text(function (d) {
        return d.count;
    });

//add a frequency label to the left of each bar
bars.append("text")
    .attr("class", "label")
    .attr("y", function (d) {
        return y(d.method) + y.bandwidth() / 2 + 4;
    })
    .attr("x", function (d) {
        return x(d.count) - 60;
    })
    .style("fill", "white")
    .text(function (d) {
        return d.frequency + "%";
    });
