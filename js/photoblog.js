---
---

var baseurlDev = null;
var size = '380x253';

var data = {
  blog: null,
  blogpost: null,
  albums: null,
  album: null,
};

moment.lang('nl');

// Amount of photos to buffer, before and after current photo - queueSize = 1 loads 3 photos.
var queueSize = 2;

function lightsOut() {
  d3.select('body').classed('lights-out', !d3.select('body').classed('lights-out'));
}

function fullScreen() {
  if (!document.fullscreenElement &&
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
    d3.select('body').classed('fullscreen', true);
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    d3.select('body').classed('fullscreen', false);
  }
}

function fwd() {
  if (data.album && data.album.current >= 0) {
    data.album.current = Math.min(data.album.photos.length - 1, ++data.album.current);
    location.hash = data.album.url.slice(1) + '/' + data.album.photos[data.album.current];
    showPhoto();
  }
}

function rev() {
  if (data.album && data.album.current >= 0) {
    data.album.current = Math.max(0, --data.album.current);
    location.hash = data.album.url.slice(1) + '/' + data.album.photos[data.album.current];
    showPhoto();
  }
}

function esc() {
  if (data.album) {
    data.album.current = -1;
    location.hash = data.album.url.slice(1);
    createAlbum(data.album.year, data.album.name);
  }
}

document.onkeydown = function(e) {
  if (e.which === 39 || e.which === 34) fwd();
  if (e.which === 37 || e.which === 33) rev();
  if (e.which === 27) esc();
  if (e.which === 76) lightsOut();
  if (e.which === 70) fullScreen();
};

document.ontouchstart = function(e) {
  var x0 = e.changedTouches[0].pageX;
  document.ontouchend = function(e) {
    var x1 = e.changedTouches[0].pageX;
    if (x1 - x0 < 0) fwd();
    if (x1 - x0 > 0) rev();
  };
};

function createHome() {
  createBlog();
  createAlbums();
}

function createBlog(year) {
  var t = {year: year};
  if (data.posts) {
    clearAlbums();
    clearAlbum();
    clearPhoto();

    // Filter posts by year
    var posts = data.posts.filter(function(d) {
      if (t.year) {
        return d.key == t.year;
      } else {
        return true;
      }
    });

    // Display blog posts, by year
    var blogYears = d3.select('#blog').selectAll('.blog-year')
        .data(posts, function(d) { return d.key; });

    blogYears.exit().remove();

    var blogYear = blogYears.enter()
      .append('li')
      .attr('class', 'blog-year');

    blogYear.append('h3').append('a')
        .attr('href', function(d) { return '{{ site.baseurl }}/#blog/' + d.key; })
        .html(function(d) { return d.key; });

    var blog = blogYear.append('ol')
        .classed('blog', true)
      .selectAll('li')
        .data(function(d) { return d.values; })
        .enter()
      .append('li')
      .append('a')
        .attr('href', function(d) { return '{{ site.baseurl }}/' + d.url; });
    //
    // album.append('img').attr('src', function(d) { return d.baseurl + 'sizes/240/' + d.index; });
    // album.append('h4').html(function(d) { return d.title; });
    // album.append('span').attr('class', 'album-count').html(function(d) { return d.count == 1 ? ("1 foto") : (d.count + " foto's"); });
    // album.append('div').attr('class', 'album-date').html(function(d) {
    //   var date = moment(d.date).format('MMMM YYYY');
    //   return date.substring(0, 1).toUpperCase() + date.substring(1);
    // });

  } else {
    d3.json('{{ site.baseurl }}/data/posts.json', function(error, json) {
      var posts = json.filter(function(d) { return d; });
      data.posts = d3.nest()
          .key(function(d) { return d.year; })
          .sortKeys(d3.decending)
          .sortValues(function(a, b) {
            return (new Date(a.date)) < (new Date(b.date));
          })
          .entries(posts);

      createBlog(t.year)
    });
  }
}

function createBlogPost(post) {

}

function createAlbums(year) {
  data.album = null;
  var t = {year: year};
  if (data.albums) {
    clearAlbum();
    clearPhoto();
    setTitle();

    // Filter albums by year
    var albums = data.albums.filter(function(d) {
      if (t.year) {
        return d.key == t.year;
      } else {
        return true;
      }
    }).sort(function(a, b) {
      return parseInt(a.key) < parseInt(b.key);
    });

    // Display album list, by year
    var albumYears = d3.select('#album-years').selectAll('.album-year')
        .data(albums, function(d) { return d.key; });

    albumYears.exit().remove();

    var albumYear = albumYears.enter()
      .append('li')
      .attr('class', 'album-year');

    albumYear.append('h3').append('a')
        .attr('href', function(d) { return '{{ site.baseurl }}/#albums/' + d.key; })
        .html(function(d) { return '~ ' + d.key + ' ~'; });

    var album = albumYear.append('ol')
        .classed('album', true)
      .selectAll('li')
        .data(function(d) { return d.values; })
        .enter()
      .append('li')
      .append('a')
        .attr('href', function(d) { return '{{ site.baseurl }}/' + d.url; });

    album.append('img').attr('src', function(d) { return baseurl(d.year, d.name, d.baseurl) + 'sizes/' + size + '/' + d.index; });
    album.append('h4').html(function(d) { return d.title; });
    album.append('span').attr('class', 'album-count').html(function(d) { return d.count == 1 ? ("1 foto") : (d.count + " foto's"); });
    album.append('div').attr('class', 'album-date').html(function(d) {
      var date = moment(d.date).format('MMMM YYYY');
      return date.substring(0, 1).toUpperCase() + date.substring(1);
    });
  } else {
    d3.json('{{ site.baseurl }}/data/albums.json', function(error, json) {
      var albums = json.filter(function(d) { return d; });
      data.albums = d3.nest()
          .key(function(d) { return parseInt(d.year); })
          .sortValues(function(a, b) {
            return (new Date(a.date)) < (new Date(b.date));
          })
          .entries(albums);
      createAlbums(t.year)
    });
  }
}

function createAlbum(year, album, filename) {
  if (data.album) {
    if (!filename) {
      // Display single album

      clearAlbum();
      clearPhoto();
      d3.select('#album').selectAll('li')
          .data(data.album.photos)
          .enter()
        .append('li')
        .append('a')
          .attr('href', function(d) { return '{{ site.baseurl}}#albums/' + data.album.year + '/' + data.album.name + '/' + d; })
        .append('img')
          .attr('src', function(d) { return baseurl(year, album, data.album.baseurl) + 'sizes/' + size + '/' + d; });
      showAlbum();
      data.album.current = -1;
      setTitle();
    } else {
      // Display single photo
      hideAlbum();

      var found = false;
      for (var i = 0; i < data.album.photos.length; i++) {
        if (filename == data.album.photos[i]) {
          found = true;
          data.album.current = i;
          break;
        }
      }
      if (found) {
        showPhoto();
      } else {
        // Filename not found in album, show complete album
        createAlbum(year, album);
      }
    }
  } else {
    d3.json('{{ site.baseurl}}/albums/' + year + '/' + album + '.json', function(error, json) {
      data.album = json;
      data.album.current = -1;

      clearBlog();
      clearBlogPost();
      clearAlbums();

      createAlbum(year, album, filename);
    });
  }
}


function clearAlbums() {
  d3.select('#album-years').selectAll('li').remove();
}

function clearBlog() {
  d3.select('#blog').selectAll('li').remove();
}

function clearBlogPost() {
}

function hideBlog() {
  d3.select('#blog').classed('hidden', true);
}

function hideAlbum() {
  d3.select('#album').classed('hidden', true);
}

function showAlbum() {
  d3.select('#album').classed('hidden', false);
}

function clearAlbum() {
  d3.select('#album').selectAll('li').remove();
}

function hideAlbums() {
  d3.select('#album-years').classed('hidden', true);
}

function hidePhoto() {
  d3.select('#photo').classed('hidden', true);
}

function clearPhoto() {
  hidePhoto();
  d3.select('#photo-queue').selectAll('li').remove();
}

function showPhoto() {
  var filename = data.album.photos[data.album.current];
  var photos = data.album.photos
      .slice(Math.max(0, data.album.current - queueSize), Math.min(data.album.photos.length, data.album.current + queueSize) + 1)
      .map(function(d) {
        return {
          filename: d,
          current: (d == filename)
        }
      });

  var queue = d3.select('#photo-queue').selectAll('li')
      .data(photos, function(d) { return d.filename; });

  queue.exit().remove();

  var photo = queue.enter().append('li');

  d3.select('#photo-queue').selectAll('li').classed('photo-current', function(d) { return d.current; });

  photo.append('img').attr('src', function(d) {
    return baseurl(data.album.year, data.album.name, data.album.baseurl) + 'sizes/1920x1200/' + d.filename;
  });

  // TODO: laad kleinste thumbnail onzichtbaar, en gebruik die voor EXIF
  // EXIF.getData(d3.select('#photo-queue .photo-current img')[0][0], function() {
  //     alert(EXIF.pretty(this));
  // });

  //hasher.setHash(data.album.url + '/' + filename);

  d3.select('#photo').classed('hidden', false);

  setTitle();
}

function baseurl(year, name, baseurl) {
  return [baseurlDev ? baseurlDev : baseurl, year, name].join('/') + '/';
}

function setTitle() {
  albumParts = []
  if (data.album) {
    albumParts = [
      data.album.year,
      {
        title: data.album.title,
        name: data.album.name
      }
    ];
    if (data.album.current >= 0) {
      albumParts.push(data.album.photos[data.album.current]);
    }
  } else {

  }

  var breadcrumbs = d3.select('#menu-albums').selectAll('.breadcrumb')
      .data(albumParts, function(d) { return d.name ? d.name : d; });

  breadcrumbs.exit().remove();

  var breadcrumb = breadcrumbs.enter()
    .append('li')
      .attr('class', 'breadcrumb');

  breadcrumb.append('span').attr('class', 'raquo').html(' &raquo; ');
  breadcrumb.append('a')
      .attr('href', function(d, i) {
        var url = "{{ site.baseurl }}#albums";
        for (var n = 0; n < i + 1; n++) {
          url += '/';
          url += (albumParts[n].name ? albumParts[n].name : albumParts[n]);
        }
        return url;
      })
      .html(function(d) { return d.title ? d.title : d; });


  var title = '';
  for (var i = 0; i < albumParts.length; i++) {
    title += ' » ' + (albumParts[i].title ? albumParts[i].title : albumParts[i]);
  }

  document.title = '{{ page.title }} | bertspaan.nl' + title;



  // //parts
  // // parts is array of paths OR {title: "{title}", path: "{path}"} objects
  // var breadcrumbs = d3.select('#menu-albums').selectAll('.breadcrumb');
  // breadcrumbs.remove();
  //
  // var breadcrumb = breadcrumbs.data(parts).enter()
  //   .append('li')
  //     .attr('class', 'breadcrumb');
  //
  // breadcrumb.append('span').attr('class', 'raquo').html(' &raquo; ');
  // breadcrumb.append('a')
  //     .attr('href', function(d, i) {
  //       var url = "{{ site.baseurl }}/albums";
  //       for (var n = 0; n < i + 1; n++) {
  //         url += n == 0 ? '#' : '/';
  //         url += (parts[n].path ? parts[n].path : parts[n]);
  //       }
  //       return url;
  //     })
  //     .html(function(d) { return d.title ? d.title : d; });
  //
  // var title = '';
  // for (var i = 0; i < parts.length; i++) {
  //   title += ' » ' + (parts[i].title ? parts[i].title : parts[i]);
  // }
  //
  // location.hash = [parts[0], parts[1].path, parts[2]].join('/')
  //
  // document.title = '{{ page.title }} | bertspaan.nl' + title;
}
//
//
//
// function go(filename) {
//   var found = false;
//   for (var i = 0; i < data.photos.length; i++) {
//     if (filename == data.photos[i]) {
//       found = true;
//       cur = i;
//       break;
//     }
//   }
//
//   if (found) {
//     var photos = data.photos
//         .slice(Math.max(0, cur  - queueSize), Math.min(data.photos.length, cur + queueSize) + 1)
//         .map(function(d) {
//           return {
//             filename: d,
//             current: (d == filename)
//           }
//         });
//
//     var queue = d3.select('#photo-queue').selectAll('li')
//         .data(photos, function(d) { return d.filename; });
//
//     queue.exit().remove();
//
//     var photo = queue.enter().append('li');
//
//     d3.select('#photo-queue').selectAll('li').classed('photo-current', function(d) { return d.current; });
//
//     photo.append('img').attr('src', function(d) { return data.baseurl + 'sizes/1200/' + d.filename; });
//
//     // TODO: laad kleinste thumbnail onzichtbaar, en gebruik die voor EXIF
//     // EXIF.getData(d3.select('#photo-queue .photo-current img')[0][0], function() {
//     //     alert(EXIF.pretty(this));
//     // });
//
//     d3.select('#album-years').classed('hidden', true);
//     d3.select('#photo').classed('hidden', false);
//     disableHashChange = true;
//     setTitle([
//       data.year,
//       {
//         title: data.title,
//         path: data.name
//       },
//       data.photos[cur]
//     ]);
//   } else {
//     // Error! laat album zien!
//   }
// }
