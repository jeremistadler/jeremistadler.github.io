interface ElasticDateAggregationRequest {
    start: number,
    end: number,
    selector: string,
    onComplete: (data:any, request: ElasticDateAggregationRequest) => void,
    samples: number,
    groups: number,
}

var fetchRequests = function(request: ElasticDateAggregationRequest) {
    var secondsPerSample = ((request.end - request.start) / 1000) / request.samples;
    var query = {
        "size": 0,
        "query": {
            "filtered": {
                "filter": {
                    "range": {
                        "time": {
                            "gte": request.start,
                            "lte": request.end
                        }
                    }
                }
            }
        },
        "aggs": {
            "routes": {
                "terms": {
                    "field": request.selector,
                    "size": request.groups,
                    "order": {
                        "_count": "desc"
                    }
                },
                "aggs": {
                    "dates": {
                        "date_histogram": {
                            "field": "time",
                            "interval": secondsPerSample + "s",
                            "pre_zone": "+01:00",
                            "pre_zone_adjust_large_interval": true,
                            "min_doc_count": 0,
                            "extended_bounds": {
                                "min": request.start,
                                "max": request.end
                            }
                        },
                        "aggs": {
                            "times": {
                                "avg": {
                                    "field": "processTime"
                                }
                            }
                        }
                    }
                }
            }
        }
    };


    var client = new elasticsearch.Client({
        host: 'http://elastic.laget.se/'
    });

    client.search({
        index: ElasticHelper.getIndicesNames('requests'),
        size: 0,
        body: query
    }).then(function(resp) {
        console.log(resp.aggregations.routes.buckets);
        request.onComplete(resp.aggregations.routes.buckets, request);
    });
}

class ElasticHelper {
    static getIndicesName(name: string, date: Date){
        var month = '' + (date.getMonth() + 1);
        var day = '' + date.getDate();
        var year = date.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return name + '-' + [year, month, day].join('-');
    }

    static getIndicesNames(name: string){
        var now = new Date();
        return [
            ElasticHelper.getIndicesName(name, now),
            ElasticHelper.getIndicesName(name, new Date(now.getTime() - 1000 * 60 * 60 * 24))
        ].join(',')
    }
}
