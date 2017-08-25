var WIDTH = 800;
var HEIGHT = 800;
var SIZE = 7;
var colors = ["#FF7F0E", "#1F77B4", "#AEC7E8", "#98DF8A", "#2CA02C",
             "#9467BD", "#FFBB78", "#8C564B", "#FF9896", "#C5B0D5"];
//used for the calculation of force
var REPULSION_CONSTANT = 15000;
var ATTRACTION_CONSTANT = 0.1;
var SPRING_LENGTH = 50;

var MAX_ITERATION = 150;


var pos = [];
var findByID = new Array();
var edges = [];
  //============1. initially arrange nodes randomly
function initialGraph(nodes, links, svgID){
  for (var i in nodes){
    pos[i] = Position.createNew(2*WIDTH/5 + Math.floor(Math.random() * (WIDTH/5)),
                                     2*HEIGHT/5 + Math.floor(Math.random() * (HEIGHT/5)), nodes[i].id, nodes[i].group);
    findByID.push(nodes[i].id);
  }
  for (var i in links){
    edges[i] = Edge.createNew(findByID.indexOf(links[i].source), findByID.indexOf(links[i].target), links[i].value);

  }
  draw(pos, svgID);
}


function reArrange(stopCount, timeInterval, links, svgID){
  // var findByID = new Array();


  // var pos = [];
  //============1. initially arrange nodes randomly
  // for (var i in nodes){
  //   pos[i] = Position.createNew(2*WIDTH/5 + Math.floor(Math.random() * (WIDTH/5)),
  //                                    2*HEIGHT/5 + Math.floor(Math.random() * (HEIGHT/5)), nodes[i].id, nodes[i].group);
  // }
  // DrawCircle(pos, svgID);

  // var prevTime = +new Date();
  // for ( var cnt = 0; cnt < MAX_ITERATION; cnt++){
    // var thisTime = +new Date();
    // var timeInterval = (thisTime - prevTime)/1000;
    // prevTime = thisTime;
    // console.log(timeInterval);

    var totalDisplacement = 0;
    // var flag = false;
    for (var i in pos){
        //=============2. calculate repulsion force for every other node
        var netForce = Force.createNew(0, 0);
        // console.log(netForce);
        for (var j in pos){
          if ( i == j)
            continue;
          var repulsionForce = CalcRepulsion(pos[i], pos[j]);
          // console.log(repulsionForce);
          netForce.plusForce(repulsionForce);
          // console.log(netForce);
        }
        // console.log(netForce);
        // =============3. calculate attraction force for links
        for (var j in links){
          var source = -1;
          var target = -1;
          if(pos[i].id == links[j].source){
            source = i;
            target = findByID.indexOf(links[j].target);
          }
          if(pos[i].id == links[j].target){
            source = findByID.indexOf(links[j].source);
            target = i;
          }
          if(source != -1 && target != -1){
            var attractionForce = CalcAttraction(pos[source], pos[target]);
            // console.log(attractionForce);
            netForce.plusForce(attractionForce);
            // console.log(netForce);
          }
        } // end for links
        // console.log(netForce);

        // ===========4. apply force to velocity and location
        pos[i].changeVelocity(netForce, timeInterval);
    }//end for each node

    //move to new location
    for (var i in pos){
      pos[i].nextLocation(timeInterval).adjust(SIZE, WIDTH, HEIGHT);
      // console.log(pos[i]);
      totalDisplacement += CalcDistance(pos[i].nextX, pos[i].nextY, pos[i].x, pos[i].y);
      pos[i].changeLocation();
    }

    if(totalDisplacement < 10) stopCount++;
    console.log(totalDisplacement);
  // }// end interation


  // ================  5. draw
  reDraw(pos, svgID);
  // console.log(stopCount);
  return stopCount;
} // end function reArrange





function CalcDistance(x1, y1, x2, y2){
  return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
}

function CalcRepulsion(p1, p2){
  var proximity = Math.max(CalcDistance(p1.x, p1.y, p2.x, p2.y), 1);

  var totalForce = REPULSION_CONSTANT / Math.pow(proximity, 2);
  var diffX = p2.x - p1.x;
  var diffY = p2.y - p1.y;
  var xForce = -totalForce * diffX / proximity;
  var yForce = -totalForce * diffY / proximity;
  // console.log(xForce);
  // console.log(yForce);
  return Force.createNew(xForce, yForce);
}


function CalcAttraction(p1, p2){
  var proximity = Math.max(CalcDistance(p1.x, p1.y, p2.x, p2.y), 1);

  var totalForce = ATTRACTION_CONSTANT * Math.max(proximity - SPRING_LENGTH, 0);
  var diffX = p2.x - p1.x;
  var diffY = p2.y - p1.y;
  var xForce = totalForce * diffX / proximity;
  var yForce = totalForce * diffY / proximity;
  return Force.createNew(xForce, yForce);
}



function draw(p, svgID){
  for (var i in p){
    var circle = Circle.createNew(p[i].x, p[i].y, p[i].id, p[i].group);
    var circleSVG = document.createElementNS("http://www.w3.org/2000/svg","circle");
    circleSVG.setAttribute('id', 'node' + i);
    circleSVG.setAttribute('cx', circle.x);
    circleSVG.setAttribute('cy', circle.y);
    circleSVG.setAttribute('r', SIZE);
    circleSVG.setAttribute('style', "fill: " + colors[circle.group % 10]);
    $('#' + svgID).append(circleSVG);
  }

  for (var i in edges){
    var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute('id', 'line'+i);
    $('#' + svgID).append(line);
    $('#line' + i).attr({
      'x1': p[edges[i].source].x,
      'y1': p[edges[i].source].y,
      'x2': p[edges[i].target].x,
      'y2': p[edges[i].target].y,
      'stroke-width': edges[i].value / 3,
    });
  }

  $("circle").attr({
    "stroke" : "#fff",
    "stroke-width" : "1.5px"
  });

  $("line").attr({
    'stroke': '#999',
    'stroke-opacity': '0.6',
  });
}

function reDraw(p, svgID){
  for (var i in p){
    $('#node' + i).attr({
      'cx': p[i].x,
      'cy': p[i].y,
    });
  } //end for

  for (var i in edges){
    $('#line' + i).attr({
      'x1': p[edges[i].source].x,
      'y1': p[edges[i].source].y,
      'x2': p[edges[i].target].x,
      'y2': p[edges[i].target].y,
    });
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
