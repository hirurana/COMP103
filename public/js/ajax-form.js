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
