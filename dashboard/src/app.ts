

var createRequestsChart = function(hours, selector, header){
    var elm = document.createElement('div');
    var oneMinute = 60 * 1000; 
    var oneHour = oneMinute * 60;

    var dateEnd = new Date().getTime() - oneMinute;
    var dateStart = dateEnd - oneHour * hours;

    var onFetched = (data: any, settings: ElasticDateAggregationRequest) => {
        drawLine({
            header: header,
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

    fetchRequests({
        selector: selector,
        start: dateStart,
        end: dateEnd,
        samples: 15,
        groups: 1,
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
            header: header,
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
    var container = document.getElementById('container-js');
    container.appendChild(createRequestsChart(1, 'environment', 'All Requests'));
    container.appendChild(createRequestsChart(1, 'route', 'Top route'));
    container.appendChild(createRequestsChart(1, 'url', 'Top Url'));
    container.appendChild(createRequestsChart(1, 'siteName', 'Top Site'));
    container.appendChild(createLongRequestChart('Long running requests'));
})
