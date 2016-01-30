

var fetchLongRequests = function(request: ElasticDateAggregationRequest) {
  var query = {
    "size": 0,
    "query": {
      "filtered": {
        "query": {
          "query_string": {
            "query": "*",
            "analyze_wildcard": true
          }
        },
        "filter": {
          "range": {
            "startTime": {
              "gte": request.start,
              "lte": request.end
            }
          }
        }
      }
    },
    "aggs": {
      "data": {
        "terms": {
          "field": "requestId",
          "size": request.groups
        },
        "aggs": {
          "1": {
            "min": {
              "field": "startTime"
            }
          },
          "perRequest": {
            "terms": {
              "field": "url",
              "size": 1,
            },
            "aggs": {
              "startTime": {
                "min": {
                  "field": "startTime"
                }
              },
              "processTime": {
                "max": {
                  "field": "processTimeMs"
                }
              }
            }
          }
        }
      }
    }
  }


  var client = new elasticsearch.Client({
    host: 'http://elastic.laget.se/'
  });

  client.search({
    index: ElasticHelper.getDateIndexNames('long-requests_', new Date(request.start), new Date(request.end)),
    size: 0,
    body: query
  }).then(function(resp) {
    console.log(resp.aggregations.data.buckets);
    request.onComplete(resp.aggregations.data.buckets, request);
  });
}
