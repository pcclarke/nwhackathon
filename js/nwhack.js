var mapWidth = 1200,
    mapHeight = 1000;

var projection = d3.geoMercator()
    .scale(586000)
    .translate([7200, -845])
    .center([-122.275085, 49.292385]);

var color = d3.scaleOrdinal()
    .range(["#000000", "#ff0000"]);

var path = d3.geoPath()
    .projection(projection);

var mapSvg = d3.select("#map").append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 " + mapWidth + " " + mapHeight)
      .classed("svg-content", true);

var type = function(d) {
    console.log("arrgh");
    return d;
}

d3.queue()
    .defer(d3.json, "data/lowermainland.json")
    .defer(d3.csv, "data/fountains.csv", type)
    .await(function ready(error, nw, fountains) {
        console.log(nw);
        console.log(fountains);

        var viewMapInfo = function(d) {

            d3.select("#infoBox")
                .style("left", function(temp) {
                    var shift = (d3.event.pageX + 5) + "px";
                    if (d3.event.pageX > 500) {
                      shift = (d3.event.pageX - 330) + "px";
                    }
                    return shift;
                })
                .style("top", (d3.event.pageY - 12) + "px");

            d3.select("#area").text(d.Area);
            d3.select("#type").text(d.Type);
            d3.select("#neighbourhood").text(d.Neighbourhood);
            d3.select("#colour").text(d["Colour/Material"]);
            d3.select("#style").text(d.Style);
            d3.select("#height").text(d["Bowl Height"]);
            d3.select("#objid").text(d.OBJECTID);

            d3.select("#infoImg").attr("src", "img/" + d.OBJECTID + ".jpg");

            d3.select("#infoBox").classed("hidden", false);
        };

        var ndub = mapSvg.selectAll(".ndub")
            .data(topojson.feature(nw, nw.objects.lowermainland).features)
            .enter().append("path")
            .attr("class", function(d) {
                if (d.properties.CSDNAME === "New Westminster") {
                    return "ndub";
                }
                return "city";
            })
            .attr("d", path);

        var fountains = mapSvg.selectAll(".fountain")
            .data(fountains)
            .enter()
            .append("circle")
            .attr("class", "fountain")
            .attr("cx", function(d) {
                return projection([d.X, d.Y])[0];
            })
            .attr("cy", function(d) {
                return projection([d.X, d.Y])[1];
            })
            .attr("r", 3)
            .style("fill", function(d) {
                if (d.Type === "Standard") {
                    return "blue";
                } else if (d.Type === "Combo") {
                    return "purple";
                } else if (d.Type === "Dog") {
                    return "red";
                } else {
                    return "black";
                }
            })
            .on("mouseover", viewMapInfo)
            .on("mouseout", function(d) {
                d3.select("#infoBox").classed("hidden", true);
            });

    });