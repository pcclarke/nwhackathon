var z = d3.scaleOrdinal()
    .range(["#590CE8", "#C500DB", "#E80C35", "#AAAAAA", "#a05d56", "#d0743c", "#ff8c00"]);

var corner1 = L.latLng(49.254074, -123.003616),
  corner2 = L.latLng(49.162721, -122.857018),
bounds = L.latLngBounds(corner1, corner2);

var map = L.map('map', {
    renderer: L.svg(),
    maxBounds: bounds
  })
  .setView([49.205718, -122.910956], 13);

var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

L.tileLayer(
  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
  {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 18,
  }
).addTo(map);

var svgLayer = L.svg();
svgLayer.addTo(map);

var svg = d3.select("#map").select("svg");
var g = d3.select("#map").select("svg").select('g');
g.attr("class", "leaflet-zoom-hide");

var viewMapInfo = function(d) {
    d3.select("#infoBox")
        .style("left", function(temp) {
            var shift = (d3.event.pageX + 5) + "px";
            if (d3.event.pageX > 500) {
                shift = (d3.event.pageX - 330) + "px";
            }
            return shift;
        })
        .style("top", function(temp) {
            var shift = (d3.event.pageY - 12) + "px";
            if (d.Y < 49.20752788) {
                shift = (d3.event.pageY - 420) + "px";
            }
            return shift;
        });

    d3.select("#area").text(d.Area);
    d3.select("#type").text(d.Type);
    d3.select("#neighbourhood").text(d.Neighbourhood);
    d3.select("#colour").text(d["Colour/Material"]);
    if (d.Style === "-") {
        d3.select("#styleLine").classed("hidden", true);
    } else {
        d3.select("#style").text(d.Style);
        d3.select("#styleLine").classed("hidden", false);
    }
    if (d["Bowl Height"] === "-") {
        d3.select("#bowlLine").classed("hidden", true);
    } else {
        d3.select("#height").text(d["Bowl Height"]);
        d3.select("#bowlLine").classed("hidden", false);
    }
    d3.select("#objid").text(d.OBJECTID);

    d3.select("#infoImg").attr("src", "img/" + d.OBJECTID + ".jpg");

    d3.select("#infoBox").classed("hidden", false);
};

d3.csv("data/fountains.csv", function(error, fountains) {
    if (error) throw error;

    fountains.forEach(function(d) {
      d.LatLng = new L.LatLng(d.Y, d.X);
    });

    var fountainCircles = g.selectAll(".fountain")
        .data(fountains)
        .enter()
        .append("circle")
        .attr("class", "fountain")
        .attr("r", 3)
        .style("fill", function(d) {
            return z(d.Type);
        })
        .on("mouseover", viewMapInfo)
        .on("mouseout", function(d) {
            d3.select("#infoBox").classed("hidden", true);
        });

    map.on("zoomend", update);
    update();

    function update() {
      fountainCircles.attr("transform", function(d) { 
        return "translate(" + 
          map.latLngToLayerPoint(d.LatLng).x + ","+ 
          map.latLngToLayerPoint(d.LatLng).y + ")";
      });
    }
});