
var SliderRanges = {
		"R" : {"min" :-180, "max" : 180},
		"T" : {"min" : -50, "max" :  50},
		"S" : {"min" :   1, "max" : 100},
		"L" : {"min" : -50, "max" :  50}
		};

$(function() {
	var transf = ["R", "T", "S", "L"], ejes = ["X", "Y", "Z"];
	for (var t in transf) {
		for (var e in ejes) {
			var slider = transf[t] + ejes[e];
			$("#slider" + slider).slider(
				{"value": gid(slider).value,
				 "min" : SliderRanges[transf[t]].min,
				 "max" : SliderRanges[transf[t]].max,
				 "slide": function (s) {
					return function() {
						$("#" + s)[0].value = $("#slider" + s).slider("option", "value");
						drawScene();
						};
					}(slider)
				});			
			$("#" + slider)[0].onchange = function (s) {
				return function() {
					$("#slider" + s).slider({"value":this.value});
					drawScene();
				};
			}(slider);
		}
	}
});

$(document).ready(function() {
    var f = $.farbtastic('#colorpicker');
    var p = $('#picker').css('opacity', 0.25);
    var selected;
    $('.colorwell')
      .each(function () { f.linkTo(this); $(this).css('opacity', 0.75);})
      .focus(function() {
        if (selected) {
          $(selected).css('opacity', 0.75).removeClass('colorwell-selected');
        }
        f.linkTo(this);
        p.css('opacity', 1);
        $(selected = this).css('opacity', 1).addClass('colorwell-selected');
      })
      .change(function() {drawScene();});
    
    $('#picker').click(function () {alert("lal");});
  });

function parseColor(id) {
	var text = gid(id).value;
	return [parseInt(text.substring(1,3),16) / 255, parseInt(text.substring(3,5),16) / 255, parseInt(text.substring(5,7),16) / 255];
}

function parseLightPosition() {
	return [parseFloat(gid("LX").value)/10, parseFloat(gid("LY").value)/10, parseFloat(gid("LZ").value)/10];
}