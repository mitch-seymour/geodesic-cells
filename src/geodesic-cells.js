(function(){
      
    var width = 960,
        height = 500,
        scale = 240,
        progress = 0;

    var velocity = [-.003, .003];

    var projection = d3.geo.orthographic()
        .scale(scale);

    var path = d3.geo.path()
        .projection(projection);

    // append the svg to the body
    var g = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(0,0)");

    // append the inner circles
    g.append("circle")
        .attr("class", "middle")
        .attr("r", scale / 1.29)
        .attr("cx", width / 2)
        .attr("cy", height / 2);

    g.append("circle")
        .attr("class", "inner")
        .attr("r", scale / 2)
        .attr("cx", width / 2)
        .attr("cy", height / 2);

    // append the geodesic globe
    var globeLines = g.append("path")
        .datum(d3.geodesic.multilinestring(6));      

    // append the innermost circle
    g.append("circle")
        .attr("class", "inner-most")
        .attr("r", scale / 3.428)
        .attr("cx", width / 2)
        .attr("cy", height / 2);

    // append the small circles with letters
    var labels = ['V', 'P', 'D', 'S'];
    for (var i=0; i < 4; i++){

        var offset = 84,
            w = width / 2 + (50*i) + offset;

        var container = g.append('g')
            .attr("class", function(){return i== 0 ? "dc active" : "dc";})
            .attr("transform", "translate(" + w + "," + height / 2 + ")");

        container.append("circle")
            .attr("r", 20);

        container.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "4px")
            .text(labels[i]);

    }

    // append the arc
    var arc = d3.svg.arc()
        .startAngle(0)
        .innerRadius(53)
        .outerRadius(57);

    var arc_bg = g.append("g")
        .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

    arc_bg.append("path")
        .attr("class", "arc-background")
        .attr("d", arc.endAngle(2 * Math.PI));

    var foreground = arc_bg.append("path")
        .attr("class", "arc-foreground");

    var text = arc_bg.append("text")
        .attr("class", "arc-text top")
        .attr("text-anchor", "middle")
        .attr("dy", "-3px")
        .text("40");

    arc_bg.append("text")
        .attr("class", "arc-text bottom")
        .attr("text-anchor", "middle")
        .attr("dy", "15px")
        .text("MB");


    function rotate(){

        d3.timer(function(elapsed) {
          projection.rotate([elapsed * velocity[0], elapsed * velocity[1]]);
          globeLines.attr("d", path);
        });

    }

    function randomNumberBetween(min, max){

        return Math.floor(Math.random()*(max-min+1)+min);
    }

    function updateProgress(num){

        var num = num/100,
            i = d3.interpolate(progress, num);
        
        d3.transition().duration(1000).tween("progress", function() {
            return function(t) {
              progress = i(t);
              foreground.attr("d", arc.endAngle( ( 2 * Math.PI )* progress));
              text.text(d3.round(num*100, 2));
            };
          });

    }

    updateProgress(82);

    setInterval(function(){

        updateProgress(randomNumberBetween(0,100));

    }, 2000);


    rotate();

    
})();