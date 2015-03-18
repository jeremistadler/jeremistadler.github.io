var data = [];

$(function () {
    $.get('data.txt').done(function (text)
    {
        data = JSON.parse(text);
		ShowGraph();
    });
});

function ShowGraph()
{
    var mapOptions = {
        zoom: 5,
        center: new google.maps.LatLng(59.277985, 15.214836),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        scaleControl: true,
        panControl: false,
        navigationControl: false,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.BIG,
            //position: google.maps.ControlPosition.RIGHT_CENTER
        },
        //mapTypeControlOptions: {
        //    position: google.maps.MapTypeControlStyle.LEFT_CENTER
        //},
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

	infoWindow = new google.maps.InfoWindow();

	for (var i = 0; i < data.length; i++) {
	    if (isNaN(data[i].latitude) || isNaN(data[i].longitude))
	        continue;

	    var marker = new google.maps.Marker({
	        position: new google.maps.LatLng(data[i].latitude, data[i].longitude),
	        title: data[i].ip,
            itemThing: data[i]
	    });
	    marker.setMap(map);
	    google.maps.event.addListener(marker, 'click', ShowAreaInfo);
	}
    
}

function ShowAreaInfo(event)
{
    var contentHtml = "<h2>" + this.itemThing.ip + "</h2>" +
    '<p class="popupText">Hits: ' + this.itemThing.hits + '</p>' +
    '<p class="popupText">Classification: ' + this.itemThing.classification + '</p>' +
    '<p class="popupText">Zone: ' + this.itemThing.zone_name + '</p>';

    infoWindow.setOptions(
    {
        content: contentHtml,
        title: "hits " + this.itemThing.hits,
        position: new google.maps.LatLng(this.itemThing.latitude, this.itemThing.longitude),
    });

    infoWindow.open(map);
}
