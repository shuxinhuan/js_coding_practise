var WIDTH = 1000;
var HEIGHT = 500;
var colors = ["#FF7F0E", "#1F77B4", "#AEC7E8", "#98DF8A", "#2CA02C",
             "#9467BD", "#FFBB78", "#8C564B", "#FF9896", "#C5B0D5"];

function generateGraph(nodes, links, svgID){
  //1. initially arrange nodes randomly
  for (var i in nodes){
    var circle = Circle.createNew(Math.random()*WIDTH, Math.random()*HEIGHT, nodes[i].id, nodes[i].group);
    var circleSVG = document.createElementNS("http://www.w3.org/2000/svg","circle");
            circleSVG.setAttribute('cx', circle.x);
            circleSVG.setAttribute('cy', circle.y);
            circleSVG.setAttribute('r', 4);
            circleSVG.setAttribute('style', "fill: " + colors[circle.group]);
            $('#' + svgID).append(circleSVG);

  }
}

function initialSVG(parentId, svgID){
    var svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
        svg.setAttribute("id", svgID);
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("version", "1.1");
        svg.setAttribute("width", WIDTH);
        svg.setAttribute("height", HEIGHT);

        $('#' + parentId).append(svg);

    return svgID;
}
