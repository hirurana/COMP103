var checkedItems = {
  subtitles: false,
  animate: false,
  cma: false,
  credits: false,
  music: false,
  fonts: false,
  releaseForms: false,
  necessarySteps: false,
  accurateInfo: false
}
$('#check-list-box').on('click', function(event) {
    $("#check-list-box li.active").each(function(idx, li) {
        checkedItems[$(li).attr("name")] = true;
    })
});
$('#check-list-box2').on('click', function(event) {
    $("#check-list-box2 li.active").each(function(idx, li) {
        checkedItems[$(li).attr("name")] = true;
    })
});

function ajaxSubmitForm() {
  const arrayFormData = $("#msform").serializeArray()
  const data = {}
  arrayFormData.forEach(function(inputData) {
    data[inputData.name] = inputData.value
  })
  data.checkedItems = checkedItems

  $.ajax({
    type: "POST",
    url: $("#msform").attr("action"),
    data: JSON.stringify(data),
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
