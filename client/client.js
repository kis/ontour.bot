(function() {
    const sourceURL = "http://ec2-54-84-149-116.compute-1.amazonaws.com:54062/topn/updates";
    const source = new EventSource(sourceURL);

    function addDataToDOM(data) {
        const events = document.getElementById("events");
        const line1 = document.getElementsByClassName("line")[0];
        var line = document.createElement("div");
        line.className = "line";
        events.insertBefore(line, line1);
        const div1 = document.createElement("div");
        const div2 = document.createElement("div");
        const div3 = document.createElement("div");
        const div4 = document.createElement("div");
        div1.innerHTML = data.name;
        div2.innerHTML = data.nick;
        div3.innerHTML = data.event;
        div4.innerHTML = data.params;
        line.appendChild(div1);
        line.appendChild(div2);
        line.appendChild(div3);
        line.appendChild(div4);
    }

    Highcharts.chart('chart', {
        chart: {
            type: 'spline',
            animation: Highcharts.svg,
            events: {
                load: function () {
                    let series = this.series[0];
                    source.onmessage = (event) => {
                        const data = JSON.parse(event.data);
                        addDataToDOM(data);
                        const x = (new Date()).getTime(),
                            y = Math.random();
                        series.addPoint([x, y], true, true);
                    };
                }
            },
            scrollablePlotArea: {
                minWidth: 600,
                scrollPositionX: 1
            }
        },
        title: {
            text: 'Live bot events data'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150,
        },
        yAxis: {
            title: {
                text: 'Bot event random value'
            },
            minorGridLineWidth: 0,
            gridLineWidth: 0,
            alternateGridColor: null,
        },
        series: [{
            name: 'Bot events live data',
            data: (function () {
                let data = [],
                    time = (new Date()).getTime(),
                    i;
        
                for (i = -19; i <= 0; i += 1) {
                    data.push({
                        x: time + i * 1000,
                        y: Math.random()
                    });
                }
                return data;
            }())
        }],
    });
})();
