$('document').ready(function(){
  $('div.section h1').each(function() {
    var l = window.location;
    var url = encodeURI(l.protocol + '//' + l.host + l.pathname);

    var img = $('<img />').attr({
      'src'   : 'http://b.hatena.ne.jp/entry/image/' + url,
      'alt'   : 'はてなブックマーク',
      'title' : 'はてなブックマーク'
    });
    var a = $('<a />').append(img).attr({
      'href'  : 'http://b.hatena.ne.jp/entry/' + url
    });
    var span = $('<span />').append(a).css({'font-size':"0.5em"}).appendTo(this);
  });
});
