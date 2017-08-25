var WIDTH = 960;
var HEIGHT = 500;
var MARGIN = 40;
var N = 20;  //the number of layers
var M = 200; //the number of samples per layer
var K = 10; //the number of bumps per layer

var colors = ["#008792", "#00a6ac", "#78cdd1", "#d3d7d4",
              "#00ae9d", "#508a88", "#70a19f", "#50b7c1"];

function stream(dataset, svgID){
  //==============1. generate the test dataset f0....fn
  generateData(dataset);
  // console.log(dataset);
  //adjust the raw data according to the svg size
  adjust(dataset)
  // console.log(dataset);

  //==============2. compute g0
  var g0 = new Array();
  for (var i = 0; i < M; i++){
    var sum = 0;
    for(var j = 0; j < N; j++)
      sum += dataset[j][i];
    g0[i] = - sum / 2;  //g0+gn=0
  }
  // console.log(g0);

  //=============3. computer each layer
  var layers = new Array();
  var totalWeight = 0;
  for (var i = 0; i < N; i++){
    layers.push(Layer.createNew(i, dataset, g0));
    totalWeight += layers[i].weight;
  }
  // console.log(totalWeight / 2);


  //===========4. layer ordering
  layers.sort(function(a, b){
    return a.onset - b.onset;
  });
  // console.log(layers);
  var layers_o = new Array();   //layers in order
  layers_o.push(layers[0]);
  for(var i = 1; i < N; i++){
    var currentWeight = 0;
    for(var j = 0; j < layers_o.length / 2; j++){
      currentWeight += layers_o[j].weight;
    }
    // console.log(currentWeight);
    if(currentWeight > totalWeight / 2){
      layers_o.push(layers[i]);
      // console.log("push");
    }
    else {
      layers_o.unshift(layers[i]);
      // console.log("unshift");
    }
  }//end for-i
  for(var i = 0; i < layers_o.length; i++){
    layers_o[i].computeG(i, dataset, g0)
  }

  console.log(layers_o);

  //===============5. draw
  //g0-g1
  var d0 = "M0 " + (-g0[0] + (HEIGHT - MARGIN) / 2);
  for(var j = 1; j < M; j++){
    // console.log(-g0[j] + (HEIGHT - MARGIN) / 2);
    d0 += " L" + (WIDTH - MARGIN) * j / M + " " + (-g0[j] + (HEIGHT - MARGIN) / 2);
  }
  for(var j = M-1; j >= 0; j--){
    // console.log(-layers_o[0].g[j] + (HEIGHT - MARGIN) / 2);
    d0 += " L" + (WIDTH - MARGIN) * j / M + " " + (-layers_o[0].g[j] + (HEIGHT - MARGIN) / 2);
  }
  d0 += " Z";
  var path0 = document.createElementNS("http://www.w3.org/2000/svg","path");
      path0.setAttribute("id", "path0");
      path0.setAttribute("d", d0);
      path0.setAttribute("fill", colors[0]);
  $('#' + svgID).append(path0);

  // g1.....gn
  for (var i = 0; i < N-1; i++){
    var g = layers_o[i].g;
    var d = "M0 "+ ((HEIGHT - MARGIN) / 2 - g[0]);
    for(var j = 1; j < M; j++){
      var x = (WIDTH - MARGIN) * j / M;
      var y = (HEIGHT - MARGIN) / 2 - g[j];
      d += " L" + x + " " + y;
    }
    g = layers_o[i+1].g;
    for (var j = M - 1; j >= 0; j--){
      var x = (WIDTH - MARGIN) * j / M;
      var y = (HEIGHT - MARGIN) / 2 - g[j];
      d += " L" + x + " " + y;
    }
    d += " Z";
    var path = document.createElementNS("http://www.w3.org/2000/svg","path");
        path.setAttribute("id", "path" + (i + 1));
        path.setAttribute("d", d);
        path.setAttribute("fill", colors[(i+1)%8]);
    $('#' + svgID).append(path);
  }

}



function adjust(data){
  var max = 0; //the max sum of the functions among each time point
  for(var i = 0; i < M; i++){
    var sum = 0;
    for (var j = 0; j < N; j++){
      sum += data[j][i];
    }//end for-j
    if(sum > max)
      max = sum;
  }// end for-i
  // console.log(max);
  for(var i = 0; i < N; i++){
    for(var j = 0; j < M; j++){
      data[i][j] = (HEIGHT - MARGIN) * data[i][j] / max;
      // if(data[i][j] == 0)
      //   console.log(i+" "+j);
    }
  }// end for-i, namely each layer
}



function generateData(dataset){
  for(var i = 0; i < N; i++){
    dataset[i] = new Array();
    for(var j = 0; j < M; j++){
      dataset[i][j] = 0;
    }
    for(var k = 0; k < K; k++){
      bump(dataset[i], M); //重复K次碰撞得到函数f
    }//end for-j
  }//end for-i
}

function bump(arr, t){
  var x = 1 / (0.1 + Math.random()),
      y = 2 * Math.random() - 0.5,
      z = 10 / (0.1 + Math.random());
  for (var i = 0; i < t; i++) {
    var w = (i / t - y) * z;
    arr[i] += x * Math.exp(-w * w);
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
