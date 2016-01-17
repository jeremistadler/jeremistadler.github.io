

var createRequestsChart = function(hours, selector, header){

    var elm = document.createElement('div');

    var dateEnd = new Date().getTime() - 1000 * 10;
    var dateStart = dateEnd - 1000 * 60 * 60 * hours;

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
        onComplete: onFetched
    });
    return elm;
}

document.addEventListener('DOMContentLoaded', function() {
    var container = document.getElementById('container-js');
    container.appendChild(createRequestsChart(1, 'environment', 'All Requests'));
    container.appendChild(createRequestsChart(1, 'route', 'Top route'));
    container.appendChild(createRequestsChart(1, 'url', 'Top Url'));
    container.appendChild(createRequestsChart(1, 'siteName', 'Top Site'));
})
