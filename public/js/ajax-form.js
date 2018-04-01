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

function updateCheckedItems() {
  function fn(idx, li) {
    var $li = $(li)
    if ($li.hasClass("active")) checkedItems[$li.attr("name")] = true;
    else checkedItems[$li.attr("name")] = false
  }
  $("#check-list-box li").each(fn)
  $("#check-list-box2 li").each(fn)
}

updateCheckedItems()

$('#check-list-box').on('click', function(event) {
  updateCheckedItems()
});

$('#check-list-box2').on('click', function(event) {
  updateCheckedItems()
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
