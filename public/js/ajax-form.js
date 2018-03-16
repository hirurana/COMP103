function ajaxSubmitForm() {
  $.ajax({
    type: "POST",
    url: $("#msform").attr("action"),
    data: $("#msform").serialize(),
    success: function() {
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

$(document).ready(function() {
  var id = getUrlParameter("id");
  var authKey = getUrlParameter("key");
  if (id && authKey) {
    var url = '/userdata/' + id + '/' + authKey;
    $.getJSON(url, function(data) {
      console.log(data);
    });
  }
});
