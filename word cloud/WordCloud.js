//main function
function WordCloud(words, canvas, canvasTmp){
    for(var i = 0; i < words.length; i++){
        addWord(words[i], canvas, canvasTmp);
    }
}
var circle = 0;
// add words one by one
function addWord(w, canvas, canvasTmp){
    // 1. initial position for each word
    var word = Word.createNew(w.text, w.frequency, canvasTmp);
    var posInit = makeInitialPositon(word, canvas);
    var pos = Position.createNew(posInit.x, posInit.y);

    // 2. draw image to the canvasTmp
    circle = 0;
    while(true){
        canvasTmp.clear();
        word.draw(pos, canvasTmp);
        // detect collision
        if(!detectCollision(word.Rect, canvas, canvasTmp)){
            break; // no collision, end while
        }
        // if detect collision, update the position
        pos =  updatePosition(posInit, pos, 15);
    }
    // 3. draw image to the canvas
    drawToCanvas(word.Rect, canvas, canvasTmp);
    canvasTmp.clear();
}

function drawToCanvas(rect, canvas, canvasTmp){
    var Dst = canvas.canvas.getContext("2d");
    // console.log(rect.x);
    // console.log(rect.y);
    // console.log(rect.width);
    // console.log(rect.height);
    var imgDataDst = Dst.getImageData(rect.x, rect.y, rect.width, rect.height);
    var Src = canvasTmp.canvas.getContext("2d");
    var imgDataSrc = Src.getImageData(rect.x, rect.y, rect.width, rect.height);
    var imgData = Dst.createImageData(imgDataSrc);
    var flag = -1;
    for(var i = 0; i < imgData.data.length; i++){
        // console.log(imgDataSrc.data[i]);
        if(i % 4 == 0)
            flag += 4;
        if(imgDataSrc.data[flag] > 0){
            // console.log("imgDataSrc.data[i]");
            imgData.data[i] = imgDataSrc.data[i];
        }
        else {
            imgData.data[i] = imgDataDst.data[i];
        }
        // console.log(imgData.data[i]);
    }
    Dst.putImageData(imgData, rect.x, rect.y);
}

function updatePosition(pos0, position, step){
    var r = circle * step;
    var diffX = position.x - pos0.x;
    var diffY = pos0.y - position.y;//reverse y-axis
    var newDiffX;
    var newDiffY;
    if(diffX == 0 && diffY == r){
        //'circle' increasing
        circle ++;
        newDiffX = step;
        newDiffY = circle * step;
    }
    else if (diffX >= 0 && diffX < r && diffY == r) {
        //1st quartile: x increase
        newDiffX = diffX + step;
        newDiffY = diffY;
    }
    else if (diffX == r && diffY <=r && diffY > 0) {
        //1st quartile: y decrease
        newDiffX = diffX;
        newDiffY = diffY - step;
    }
    else if (diffX == r && diffY <=0 && diffY > -r) {
        //2nd quartile: y decrease
        newDiffX = diffX;
        newDiffY = diffY - step;
    }
    else if (diffY == -r && diffX <= r && diffX > 0) {
        //2nd quartile: x decrease
        newDiffX = diffX - step;
        newDiffY = diffY;
    }
    else if (diffY == -r && diffX <= 0 && diffX > -r) {
        //3nd quartile: x decrease
        newDiffX = diffX - step;
        newDiffY = diffY;
    }
    else if (diffX == -r && diffY >= -r && diffY < 0) {
        //3nd quartile: y increase
        newDiffX = diffX;
        newDiffY = diffY + step;
    }
    else if (diffX == -r && diffY >= 0 && diffY < r) {
        //4nd quartile: y increase
        newDiffX = diffX;
        newDiffY = diffY + step;
    }
    else if (diffY == r && diffX >= -r && diffX < 0) {
        //4nd quartile: x increase
        newDiffX = diffX + step;
        newDiffY = diffY;
    }

    position.update(pos0.x + newDiffX, pos0.y - newDiffY);

    return position;
}

function detectCollision(rect, canvas, canvasTmp){
    // check the rectangular is within the canvas
    if((rect.x + rect.width) <= canvasTmp.width && (rect.y + rect.height) <= canvasTmp.height
        && rect.x >= 0 && rect.y >= 0){ // within the boudary
            var imgData = canvas.canvas.getContext("2d").getImageData(rect.x, rect.y, rect.width, rect.height).data;
            var imgDataTmp = canvasTmp.canvas.getContext("2d").getImageData(rect.x, rect.y, rect.width, rect.height).data;
            for(var i = 3; i < imgData.length; i += 4){
                if(imgData[i] > 0 && imgDataTmp[i] > 0){
                    return true; // collapse
                }
            }
            return false;
    }
    else // beyond the boundary
        return true;
}


// initial position for each word
function makeInitialPositon(word, canvas){
    var x = Math.floor(canvas.width/3 + Math.random() * (canvas.width/3));
    if(word.direction == 1){ //vertical center
        var y = Math.floor(canvas.height/2 - word.width/2);
    }
    else { // horizontal center
        var y = Math.floor(canvas.height/2);
    }
    return Position.createNew(x, y);
}
