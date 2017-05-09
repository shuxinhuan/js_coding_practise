var WIDTH = 1000;
var HEIGHT = 500;
var SIZE = 0;
var AREA = WIDTH * HEIGHT;
var color = 0;//index for colors
var id = 0;//id for each Rectangular

// color table
var colors = ["#FF7F0E", "#1F77B4", "#AEC7E8", "#98DF8A", "#2CA02C",
             "#9467BD", "#FFBB78", "#8C564B", "#FF9896", "#C5B0D5"];


function treemap(dataset, svgID){
    //1. allocate area for each rectangle in descending area order
    // console.log(dataset);
    SIZE = getSizeSum(dataset);
    // console.log(SIZE);
    // console.log(dataset);
    allocArea(dataset);
    console.log(dataset);

    //2. allocate each rectangle on the svg
    var layout = Layout.createNew(dataset.name);
    allocLayout(layout, 0, 0, WIDTH, HEIGHT, dataset.children);
    console.log(layout);

    //3. draw on the svg
    draw(layout, svgID);

}


function draw(layout, svgID){
    for(var i in layout.children){
        if(layout.children[i].name == "flag"){
            var rect = layout.divs[i];
            var rectSVG = document.createElementNS("http://www.w3.org/2000/svg","rect");
            rectSVG.setAttribute('x', rect.x);
            rectSVG.setAttribute('y', rect.y);
            rectSVG.setAttribute('width', rect.width);
            rectSVG.setAttribute('height', rect.height);
            rectSVG.setAttribute('style', "fill: " + colors[color%10] +"; stroke-width: 1; stroke: rgb(255, 255, 255)");
            $('#' + svgID).append(rectSVG);

            var textSVG = document.createElementNS("http://www.w3.org/2000/svg", "text");
            textSVG.setAttribute('x', rect.x + 3);
            textSVG.setAttribute('y', rect.y + 15);
            textSVG.setAttribute('font-size', 10);
            textSVG.setAttribute('id', 'rect' + id);
            $('#' + svgID).append(textSVG);
            document.getElementById('rect' + id).innerHTML = rect.name;
            id++;
        }
        else{
            draw(layout.children[i], svgID);
        }
    }
    color++;
}


function allocLayout(layout, x, y, width, height, children){
    var divs = squarify(x, y, width, height, children);
    layout.setDivs(divs);
    console.log(divs);
    // console.log(layout);

    for(var i = 0; i < children.length; i++){
        if(children[i].hasOwnProperty('children')){
            // console.log(children[i].children);
            layout.setChildName(i, children[i].name);
            allocLayout(layout.children[i],
                layout.divs[i].x, layout.divs[i].y,
                layout.divs[i].width, layout.divs[i].height, children[i].children);
        }
    }


}

function squarify(x, y, width, height, children){
    var division = Division.createNew(x, y, width, height);
    for(var i in children){
        division.addSquare(children[i].area, children[i].name);
    }
    //prepare for the Layout
    var rects = new Array();
    for(var j in division.squares){
        for(var k in division.squares[j].rects){
            var rect = division.squares[j].rects[k];
            rects.push(rect);
            console.log(rect);
        }
    }
    return rects;
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

function getSizeSum(dataset){
    // judge a variable whether it's object or array--instanceof
    if(dataset instanceof Array){
        // console.log('array');
        var sum = 0;
        for(var i in dataset){
            sum += getSizeSum(dataset[i]);
        }
        return sum;
    }
    else{
        // console.log('object');
        if(dataset.hasOwnProperty('children')){
            dataset.size = getSizeSum(dataset.children);
            return dataset.size;
        }
        else return dataset.size;
    }
}

function allocArea(dataset){
    if(dataset instanceof Array){
        for(var i in dataset){
            allocArea(dataset[i]);
        }
        dataset.sort(function(a,b){ // descending sort
            return b.area - a.area;
        });
    }
    else{
        dataset.area = dataset.size / SIZE * AREA;
        if(dataset.hasOwnProperty('children')){
            allocArea(dataset.children);
        }
    }

}
