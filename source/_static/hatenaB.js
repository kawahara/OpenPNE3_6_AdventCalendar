$('document').ready(function(){
  $('div.section h1').each(function() {
    var l = window.location;
    var path = l.pathname;
    var f = path.substring(path.lastIndexOf ('/',path.length) +1, path.length);
    if (f && 0 === f.indexOf('index.'))
    {
      path = path.substring(0, path.lastIndexOf('/')) + '/';
    }

    var url = encodeURI(l.protocol + '//' + l.host + path);

    var img1 = $('<img />').attr({
      'src'   : 'http://b.hatena.ne.jp/images/append.gif',
      'alt'   : 'はてなブックマーク',
      'title' : 'はてなブックマーク'
    });
    var img2 = $('<img />').attr({
      'src'   : 'http://b.hatena.ne.jp/entry/image/' + url,
      'alt'   : 'はてなブックマーク',
      'title' : 'はてなブックマーク'
    });

    var a = $('<a />').append(img1).append(img2).attr({
      'href'  : 'http://b.hatena.ne.jp/entry/' + url
    });
    var span = $('<span />').append(a).css({'font-size':"0.5em"}).appendTo(this);
  });
});
