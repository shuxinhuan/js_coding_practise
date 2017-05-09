// =============the whole layout==============
var Layout = {
    createNew: function(name){
        var layout = {};
        layout.name = name;

        layout.setDivs = function(divs){
            layout.divs = divs;
            layout.children = new Array();
            for(var i in divs){
                layout.children[i] = Layout.createNew("flag");
            }
        }

        layout.setChildName = function(i, name){
            layout.children[i] = Layout.createNew(name);
        }

        return layout;
    }
}

// =============division for each group of children==============
var Division =  {
    createNew: function(x, y, width, height){
        var division = {};
        division.x = x;
        division.y = y;
        division.width = width;
        division.height = height;
        division.area = 0;
        // fixed layout
        division.squares = new Array();

        division.currentSquare = Square.createNew(x, y, width, height);
        division.squares.push(division.currentSquare);
        // console.log(division.currentSquare);

        division.addSquare = function(area, name){
            var node = division.currentSquare.addSquare(area, name);
            if(typeof(node) == "object"){
                division.currentSquare = node;
                division.squares.push(node);
                division.currentSquare.addSquare(area, name);
            }
        }

        return division;
    }
}

// =============Square==============
var Square = {
    createNew: function(x, y, width, height){
        var square = {};
        square.x = x;
        square.y = y;
        square.width = width;
        square.height = height;
        // 1--cling to height
        // 0--cling to width
        square.direction = width > height ? 1 : 0;
        square.areaSum = 0;
        square.maxRatio = 32767;
        square.rects = new Array();
        square.dir = 0;

        square.addSquare = function(area, name){
            var areaSum = square.areaSum + area;

            var newRects = new Array(); // after adding the new square
            var newMaxRatio = 0;

            if(square.direction == 1){ // divide line is horizontal
                var newWidth = areaSum / square.height;
                var newY = square.y;
                for(var i = 0; i < square.rects.length; i++){
                    newRects[i] = Rect.createNew(square.x, newY,
                                    newWidth, square.rects[i].area / newWidth,
                                    square.rects[i].area, square.rects[i].name);
                    newY += newRects[i].height;
                    if(newRects[i].ratio > newMaxRatio)
                        newMaxRatio = newRects[i].ratio;

                }
                newRects[i] = Rect.createNew(square.x, newY, newWidth, area / newWidth,area, name);
                if(newRects[i].ratio > newMaxRatio)
                    newMaxRatio = newRects[i].ratio;
            }
            else{ // divide line is vertical
                var newHeight = areaSum / square.width;
                var newX = square.x;
                for(var i = 0; i < square.rects.length; i++){
                    newRects[i] = Rect.createNew(newX, square.y,
                                    square.rects[i].area / newHeight, newHeight,
                                    square.rects[i].area, square.rects[i].name);
                    newX += newRects[i].width;
                    if(newRects[i].ratio > newMaxRatio)
                        newMaxRatio = newRects[i].ratio;
                }
                newRects[i] = Rect.createNew(newX, square.y, area / newHeight, newHeight, area, name);
                if(newRects[i].ratio > newMaxRatio)
                    newMaxRatio = newRects[i].ratio;
            }
            //judge whether new Rectangular can be added
            if(newMaxRatio < square.maxRatio){ // Yes, add the new square and update square
                square.rects = newRects;
                square.areaSum = areaSum;
                square.maxRatio = newMaxRatio;
                if(square.direction == 1) square.dir = newWidth;
                else square.dir = newHeight;
                return "add";
            }
            else{ // No, return the new square and conserve the previous square
                if(square.direction == 1) {
                    return Square.createNew(square.x + square.dir, square.y,
                                        square.width - square.dir, square.height);
                }
                else{
                    return Square.createNew(square.x, square.y + square.dir,
                                        square.width, square.height - square.dir);
                }
            }


        }

        return square;
    }
}


// =============Rectangular==============
var Rect = {
    createNew: function(x, y, width, height, area, name){
        var rect = {};
        rect.name = name;
        rect.x = x;
        rect.y = y;
        rect.width = width;
        rect.height = height;
        rect.area = area;
        rect.ratio = Math.max(rect.width/rect.height, rect.height/rect.width);
        return rect;
    }
}
