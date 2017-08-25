// ===============circles============
var Circle = {
  createNew: function(x, y, id, group){
    var circle = {};
    if( x < 0)
      circle.x = 0;
    else if ( x > WIDTH)
      circle.x = WIDTH;
    else {
      circle.x = x;
    }
    if( y < 0)
      circle.y = 0;
    else if( y > HEIGHT)
      circle.y = HEIGHT;
    else {
      circle.y = y;
    }
    circle.id = id;
    circle.group = group;
    return circle;
  }
}

var Position = {
  createNew: function(x, y, id, group){
    var position = {};
    position.x = x;
    position.y = y;
    position.id = id;
    position.group = group;
    position.velocity = Velocity.createNew(0, 0);
    position.nextX = position.x;
    position.nextY = position.y;

    position.changeVelocity = function(force, time){
      position.velocity.xVelocity += force.xForce * time; // v = v0 + at
      position.velocity.yVelocity += force.yForce * time; // v = v0 + at
      return position;
    }

    position.nextLocation = function(time){
      position.nextX = position.x + position.velocity.xVelocity * time; // x = x0 + vt
      position.nextY = position.y + position.velocity.yVelocity * time; // x = x0 + vt
      return position;
    }

    position.changeLocation = function(){
      position.x = position.nextX;
      position.y = position.nextY;
      return position;
    }

    position.adjust = function(size, width, height){
      var aX = position.nextX;
      var aY = position.nextY;
      if(aX > width - size) aX = width - size;
      if(aX < size) aX = size;
      if(aY > width - size) aY = height - size;
      if(aY < size) aY = size;
      position.nextX = parseInt(aX);
      position.nextY = parseInt(aY);
      return position;
    }
    return position;
  }
}

var Velocity = {
  createNew: function(xVelocity, yVelocity){
    var velocity = {};
    velocity.xVelocity = xVelocity;
    velocity.yVelocity = yVelocity;
    return velocity;
  }
}

var Force = {
  createNew: function(xForce, yForce){
    var force = {};
    force.xForce = xForce;
    force.yForce = yForce;
    force.plusForce = function(another){
      force.xForce += another.xForce;
      force.yForce += another.yForce;
      return force;
    }
    return force;
  }
}

var Edge = {
  createNew: function(source, target, value){
    var edge = {};
    edge.source = source;
    edge.target = target;
    edge.value = value;
    return edge;
  }
}
