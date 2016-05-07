class Chart {
    elm: HTMLElement;
    onDataFetch: any[] = [];

    constructor(parent: HTMLElement){
        this.elm = document.createElement('div');
        this.elm.classList.add('box');
        parent.appendChild(this.elm);
    }

    addHeader(text: string){
        d3.select(this.elm)
          .append("p")
          .attr("class", "box__title")
          .html(text);

      return this;
    }

    addLine(start, end, selector){
     var g = d3.select(this.elm)
               .append('svg')
               .attr('width', 500)
               .attr('height', 250)
               .append('g')
               .attr('transform', 'translate(10,10)')
               ;

    this.onDataFetch.push({
        g: g,
        fun: g => {
            var request = {
                selector: selector,
                start: start,
                end: end,
                samples: 10,
                groups: 2,
            }

            fetchRequests(request).then(data => {
                g.selectAll('*').remove();
                drawLine({
                    elm: g,
                    start: start,
                    end: end,
                    smooth: false,
                    width: 400,
                    height: 200,
                    lines: data.map(line => ({
                        name: line.key,
                        points: line.dates.buckets.map(x => ({
                            x: x.key,
                            y: x.times.value,
                        }))
                    }))
                });
            });


        }
    });

     return this;
    }

    fetch(){
        for (var i = 0; i < this.onDataFetch.length; i++)
            this.onDataFetch[i].fun(this.onDataFetch[i].g);

        return this;
    }
}


var createRequestsChart = function(hours, selector, header){
    var elm = document.createElement('div');


    var onFetched = (data: any, settings: ElasticDateAggregationRequest) => {
        elm.innerHTML = '';
        drawLine({
            elm: d3.select(elm).append('g'),
            start: dateStart,
            end: dateEnd,
            smooth: true,
            width: 300,
            height: 200,
            lines: data.map(line => ({
                name: line.key,
                points: line.dates.buckets.map(x => ({
                    x: x.key,
                    y: x.times.value,
                }))
            }))
        });
    }

    fetchRequests({
        selector: selector,
        start: dateStart,
        end: dateEnd,
        samples: 30,
        groups: 3,
        onComplete: onFetched,
        xSelector: d => d,
        ySelector: d => d,
        nameSelector: d => d,
    });
    return elm;
}

var createLongRequestChart = function(header){
    var elm = document.createElement('div');

    var dateEnd = new Date().getTime() - 1000 * 10;
    var dateStart = dateEnd - 1000 * 60 * 60;

    var onFetched = (data: any, settings: ElasticDateAggregationRequest) => {
        drawTimeline({
            elm: elm,
            lines: [
                {
                    start: dateStart,
                    end: dateEnd,
                    data: data
                }
            ]
        });
    }

    fetchLongRequests({
        selector: '',
        start: dateStart,
        end: dateEnd,
        samples: 15,
        groups: 10,
        onComplete: onFetched,
        xSelector: d => d,
        ySelector: d => d,
        nameSelector: d => d,
    });
    return elm;
}

document.addEventListener('DOMContentLoaded', function() {
    var oneMinute = 60 * 1000;
    var oneHour = oneMinute * 60;

    var dateEnd = new Date().getTime() - oneMinute;
    var dateStart = dateEnd - oneMinute * 60;

    var container = document.getElementById('container-js');
    var chart1 = new Chart(container)
                        .addHeader('Requests')
                        .addLine(dateStart, dateEnd, 'machene')
                        .fetch()
                        ;

    // window.setInterval(() => {
    //     chart1.fetch();
    // }, 4000)
    // container.appendChild(createRequestsChart(1, 'route', 'Top route'));
    // container.appendChild(createRequestsChart(1, 'url', 'Top Url'));
    // container.appendChild(createRequestsChart(1, 'siteName', 'Top Site'));
    // container.appendChild(createLongRequestChart('Long running requests'));
})
