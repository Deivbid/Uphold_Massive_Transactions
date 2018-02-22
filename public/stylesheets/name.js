

    $("[type=file]").on("change", function(){
      // Name of file and placeholder
      var file = this.files[0].name;
      var dflt = $(this).attr("placeholder");
      if($(this).val()!=""){
        $(this).next().text(file);
      } else {
        $(this).next().text(dflt);
      }
      
        console.log(file);
      console.log(dflt);
    });   // jQuery methods go here...

