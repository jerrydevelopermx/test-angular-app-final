const copyText = function( id ){
    let $temp = $("<input>");
    $("body").append($temp);
    $temp.val( $(`#${id}`).html().replace(/(<br>|<br\/>|<p>|<\/p>|<strong>|<\/strong>)/img, ' ') ).select();
    document.execCommand("copy");
    $temp.remove();
}