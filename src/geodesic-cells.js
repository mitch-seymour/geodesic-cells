(function() {

    var width = 960,
        height = 700,
        scale = 240,
        progress = 0,
        inner_radius = (scale / 3.428);

    var velocity = [-.003, .003];

    var projection = d3.geo.orthographic()
        .scale(scale)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    // append the svg to the body
    var g = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(0,0)")
        .attr("class", "container");

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
        .attr("class", "lines")
        .datum(d3.geodesic.multilinestring(6));

    // append the innermost circle
    g.append("circle")
        .attr("class", "inner-most")
        .attr("r", inner_radius)
        .attr("cx", width / 2)
        .attr("cy", height / 2);

    // append the small circles with letters
    var labels = ['V', 'P', 'D', 'S'];
    for (var i = 0; i < 4; i++) {

        var offset = scale / 2.86,
            w = width / 2 + (scale / 4.8 * i) + offset;

        var container = g.append('g')
            .attr("class", function() {
                return i == 0 ? "dc active" : "dc";
            })
            .attr("transform", "translate(" + w + "," + height / 2 + ")");

        container.append("circle")
            .attr("r", scale / 12);

        container.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "4px")
            .text(labels[i]);

    }

    // append the arc
    var arc = d3.svg.arc()
        .startAngle(0)
        .innerRadius(scale / 4.53)
        .outerRadius(scale / 4.21);

    var arc_bg = g.append("g")
        .attr("class", "arc-container")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

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


    function addSatellite(angle) {


        (function() {

            var satellite_radius = 40,
                offset = 90,
                radius = scale + (satellite_radius * 2) + offset,
                x1 = Math.cos((angle) * (Math.PI / 180)) * inner_radius + width / 2,
                y1 = Math.sin((angle) * (Math.PI / 180)) * inner_radius + height / 2,
                x2 = Math.cos((angle) * (Math.PI / 180)) * radius + width / 2,
                y2 = Math.sin((angle) * (Math.PI / 180)) * radius + height / 2,
                x2_line = Math.cos((angle) * (Math.PI / 180)) * (radius - satellite_radius) + width / 2,
                y2_line = Math.sin((angle) * (Math.PI / 180)) * (radius - satellite_radius) + height / 2;

            var satellite = g.append("g")
                .attr("class", "satellite")
                .attr("height", 100)
                .attr("width", 100);

            satellite
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
                .transition().duration(1000)
                .attr("transform", "translate(" + parseInt(x2) + "," + parseInt(y2) + ")");

            // the line that connects the inner circle to the satellite circle
            var line = g.append("line")
                .attr("class", "satellite-connector")
                .attr("x1", x1)
                .attr("y1", y1)
                .attr("x2", x1)
                .attr("y2", y1);

            line
                .transition().duration(2000)
                .attr("x2", x2_line)
                .attr("y2", y2_line);

            satellite.append("circle")
                .attr("class", "satellite-circle")
                .attr("r", 0)
                .transition().duration(2400)
                .attr("r", satellite_radius);

            var _projection = d3.geo.orthographic()
                .scale(80)
                .translate([x2, y2]);

            var _path = d3.geo.path()
                .projection(_projection);

            var _lines = g.append("path")
                .attr("class", "satellite-path")
                .datum(d3.geodesic.multilinestring(4));

            d3.timer(function(elapsed) {

                _projection.rotate([elapsed * velocity[0], elapsed * velocity[1]]);
                _lines.attr("d", _path);

            });



        })();
    }

    function randomNumberBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function rotate() {

        d3.timer(function(elapsed) {
            projection.rotate([elapsed * velocity[0], elapsed * velocity[1]]);
            d3.selectAll('.lines').attr("d", path);
        });

    }

    function updateProgress(num) {

        var num = num / 100,
            i = d3.interpolate(progress, num);

        d3.transition().duration(1000).tween("progress", function() {
            return function(t) {
                progress = i(t);
                foreground.attr("d", arc.endAngle((2 * Math.PI) * progress));
                text.text(d3.round(num * 100, 2));
            };

        });

    }


    // demo
    updateProgress(10);
    addSatellite(-35);


    setInterval(function() {
        updateProgress(randomNumberBetween(0, 100));
    }, 1500);

    rotate();


})();