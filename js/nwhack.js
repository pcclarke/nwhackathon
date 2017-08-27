var iconColour = d3.scaleOrdinal()
  .domain(["Standard", "Combo", "Dog", "Decomissioned", "Tap"])
  .range(["#590CE8", "#C500DB", "#E80C35", "#754c24", "#078e6c"]);

var iconSize = d3.scaleOrdinal()
  .domain([14, 15, 16, 17, 18])
  .range([12, 16, 22, 30, 40]);

var corner1 = L.latLng(49.254074, -123.003616),
  corner2 = L.latLng(49.162721, -122.857018),
bounds = L.latLngBounds(corner1, corner2);

var map = L.map('map', {
    renderer: L.svg(),
    maxBounds: bounds,
    minZoom: 14
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

var svg = d3.select("#map")
  .select("svg");

var g = d3.select("#map").select("svg").select('g');
g.attr("class", "leaflet-zoom-hide");

var viewMapInfo = function(d) {
    d3.select("#infoBox")
        .style("left", function(temp) {
            var shift = (d3.event.pageX + 8) + "px";
            if (d3.event.pageX > 500) {
                shift = (d3.event.pageX - 310) + "px";
            }
            return shift;
        })
        .style("top", function(temp) {
            var shift = (d3.event.pageY - 6) + "px";
            if (d3.event.pageY > 300) {
                shift = (d3.event.pageY - 360) + "px";
            }
            return shift;
        })
        .style("background", function(e) {
            return iconColour(d.Type);
        });

    d3.select("#area").text(d.Area);
    d3.select("#type").text(d.Type);
    d3.select("#neighbourhood").text(d.Neighbourhood);

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
        .append("image")
        .attr("class", "fountain")
        .attr("xlink:href", function(d) {
          switch (d.Type) {
            case "Combo":
              return "img/combo_fountain.png";
              break;
            case "Dog":
              return "img/dog_fountain.png";
              break;
            case "Tap":
              return "img/tap_fountain.png";
              break;
            case "Decomissioned":
              return "img/decomissioned_fountain.png";
              break;
            default:
              return "img/standard_fountain.png";
          }
        })
        .on("mouseover", viewMapInfo)
        .on("mouseout", function(d) {
            d3.select("#infoBox").classed("hidden", true);
        });

    map.on("zoomend", update);
    update();

    function update() {
      fountainCircles.attr("transform", function(d) { 
        var halfSize = iconSize(map.getZoom()) / 2;
        return "translate(" +
          (map.latLngToLayerPoint(d.LatLng).x - halfSize) + "," +
          (map.latLngToLayerPoint(d.LatLng).y - halfSize) + ")";
      })
      .attr("width", function(d) { return iconSize(map.getZoom()); })
      .attr("height", function(d) { return iconSize(map.getZoom()); });
    }
});

if (!detectmob()) {
  var mapObj = document.getElementById("map");

  var legend = d3.select("#legend")
    .style("top", function(d) {
      return (mapObj.getBoundingClientRect().bottom - 250) + "px";
    })
    .style ("left", function(d) {
      return (mapObj.getBoundingClientRect().right - 280) + "px";
    });
  } else {
    d3.select("#legend")
      .style("display", "none");
  }

function detectmob() { 
 if( navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)
  ){
    return true;
  } else {
    return false;
  }
}