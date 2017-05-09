// ============Color============
var Colors = ["#d3d7d4", "#1F77B4", "#AEC7E8", "#508a88", "#9467BD", "#C5B0D5","#999d9c"];

// ============Word============
var Word ={
    //constructor
    createNew: function(text, size, canvas){
        var word = {};
        word.text = text;
        word.size = (size < 10) ? 0 : size;// set the minimum size

        //initialize word information
        word.width = -1; //rect's width
        word.height = -1; //rect's height
        word.x = -1;//text position
        word.y = -1;
        word.diffY = 0; //text.y - rect.y
        word.Rect = {};

        if(Math.random() > 0.7){
            word.direction = 1; //vertical
        }
        else{
            word.direction = 0;//horizontal
        }

        // initialize width, height, diffY
        var env = canvas.canvas.getContext("2d");
        env.font = "bold " + size + "px Georgia";
        env.fillText(text, 0, size * 2);
        word.width = Math.ceil(env.measureText(text).width);
        word.height = measureHeight(word, canvas);
        canvas.clear();

        word.draw = function(pos, canvasTmp){
            var context = canvasTmp.canvas.getContext("2d");
            context.font = "bold " + word.size + "px Georgia";
            var color = Colors[Math.floor(Math.random() * Colors.length)];
            context.fillStyle = color;
            // console.log(color);
            word.x = pos.x;
            word.y = pos.y;

            if(word.direction == 1){ // vertical
                // rotate canvas to draw vertical text
                context.rotate(Math.PI/2);
                context.translate(pos.y, -pos.x);
                context.fillText(word.text, 0, 0);
                // recover canvas
                context.rotate(-Math.PI/2);
                context.translate(-pos.x, -pos.y);
                // calculate the outside rectangular of text
                var rect = new Rect(word.x - (word.height + word.diffY), word.y, word.height, word.width);
                word.Rect = rect;
            }
            else{ // horizontal
                // console.log(word.text);
                context.fillText(word.text, pos.x, pos.y);
                // calculate the outside rectangular of text
                console.log(word.x +" " + word.y);
                // console.log(word.diffY);
                console.log(word.height);
                var rect = new Rect(word.x, word.y + word.diffY, word.width, word.height);
                word.Rect = rect;
                console.log(word.Rect.x + " " + word.Rect.y);
            }
        }

        return word;
    }
}

// ============Rect============
function Rect(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

// calculate the max height of words
function measureHeight(word, canvas){
    var env = canvas.canvas.getContext("2d");
    var max = 0;
    var min = canvas.height;
    var imgData = env.getImageData(0,0, word.width, canvas.height);

    for(var i = 3; i < imgData.data.length; i += 4){
        var row = Math.floor( (i-3)/4 / word.width);
        if(imgData.data[i] > 0){
            if(row < min) min = row;
            if(row > max) max = row;
        }
    }
    word.diffY = min - word.size * 2;
    return max-min+1;
}

// ============Canvas============
var Canvas = {
    createNew: function(canvas, width, height){
        var canvasObj = {};
        canvasObj.canvas = canvas;
        canvasObj.width = width;
        canvasObj.height = height;

        canvasObj.clear = function(){
            var env = canvasObj.canvas.getContext("2d");
            env.clearRect(0, 0, canvasObj.width, canvasObj.height);
        }
        return canvasObj;
    }
}

// ============Position============
var Position = {
    createNew: function(x, y){
        var position = {};
        position.x = x;
        position.y = y;

        position.update = function(x, y){
            position.x = x;
            position.y = y;
            return position;
        }
        return position;
    }
}
