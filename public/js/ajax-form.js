function ajaxSubmitForm() {
  var checkedItems = {}
  $('#get-checked-data').on('click', function(event) {
      event.preventDefault();
      var counter = 0;
      $("#check-list-box li.active").each(function(idx, li) {
          checkedItems[counter] = $(li).text();
          counter++;
      });
      $('#display-json').html(JSON.stringify(checkedItems, null, '\t'));
  });


  $.ajax({
    type: "POST",
    url: $("#msform").attr("action"),
    data: $("#msform").serialize(),
    success: function() {
      console.log("XXX", $("#msform").serialize(), checkedItems)
      console.log("Saving")
    }
  })
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
