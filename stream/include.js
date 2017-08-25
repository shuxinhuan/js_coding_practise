var Layer = {
  createNew: function(index, data, g0){
    var layer = {};
    layer.index = index + 1;  //coresponding to the functions
    layer.weight = 0;
    layer.onset = data[index][0];
    layer.g = new Array();

    for(var i = 0; i < M; i++){
      layer.weight += data[index][i];
    }

    layer.computeG = function(index, data, g0){
      // console.log(index);
      for(var i = 0; i < M; i++){
        var sum = 0;
        for(var j = 0; j < index + 1; j++)
          sum += data[j][i];
        layer.g.push(g0[i] + sum);
      }
    }

    return layer;
  }

}
