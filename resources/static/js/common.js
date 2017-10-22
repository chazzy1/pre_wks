$(document).ready(function()  {

	$(".contentsWrap .contents .leftDiv").css("height", $(".contentsWrap").height());

});


function fileAppend(fName)  {
	$(".contentsWrap .contents .contentsDiv .communityWriteDiv .contentsArea .attachArea .attachList").append("<li><a href='#'>" + fName + "</a></li>");
}

