var renderTemplate = function(selector, data) {
  return Mustache.render($(selector).html(), data);
}

var onAuthorize = function() {
  updateLoggedIn();
  $("#output").empty().text('loading...');

var containsLabel = function(labels, name){
  for	(var i = 0; i < labels.length; i++)
    if (labels[i].name.toLowerCase() == name.toLowerCase())
      return true;

  return false;
}

Trello.get("boards/LqUUuhsu/cards", function(cards) {
  $("#output").empty();
  var cardsByLabel = {};
  var cardsByList = {};

  $.each(cards, function(ix, card) {
    for	(var i = 0; i < card.labels.length; i++)
    {
      cardsByLabel[card.labels[i].name] = cardsByLabel[card.labels[i].name] || [];
      cardsByLabel[card.labels[i].name].push(card);
    }

    cardsByList[card.listId] = cardsByList[card.listId] || [];
    cardsByList[card.listId].push(card);
  });

  var templateId = '#trello__template';
  $('#trello__content').html('');
  var renderTrelloItem = function(name) {
      var renderedHtml = renderTemplate(templateId, { name: name, count: (cardsByLabel[name] || []).length });
      $('#trello__content').append(renderedHtml);
  }

  renderTrelloItem('Normal')
  renderTrelloItem('High')
  renderTrelloItem('Low')
  renderTrelloItem('App')

  $('.trello__wrapper').show();
});
};

var updateLoggedIn = function() {
var isLoggedIn = Trello.authorized();
$("#loggedout").toggle(!isLoggedIn);
$("#loggedin").toggle(isLoggedIn);
};

updateLoggedIn();

var logout = function() {
Trello.deauthorize();
updateLoggedIn();
};


Trello.authorize({
interactive: false,
success: onAuthorize
});

$("#connectLink").click(function(){
Trello.authorize({
  type: "popup",
  success: onAuthorize
})
});

$("#disconnect").click(logout);
