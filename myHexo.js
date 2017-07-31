let findData = (arr, url) => {
  for (let x in arr) {
    if (arr[x].url == url) {
      return arr[x].readCounts;
    } else if (arr[x].url == 'END') {
      return 0;
    }
  }
};

let getReadCount = () => {
  $.post('/api/getReadCount', {}, (data) => {
    $('span[name="readCounts"]').each(function() {
      $(this).html(findData(data.data, $(this).attr('value')));
    });

  });
};

let addReadCount = () => {
  $.post('/api/addReading', {
    url: $('span[name="readCounts"]').eq(0).attr('value')
  }, (data) => {
    $('span[name="readCounts"]').eq(0).html(data.readCounts);
  });
};

let addPeople = () => {
  $.post('/api/addReading', {
    url: 'ALL'
  }, (data) => {
    $('#numPeople').html(data.readCounts);
  });
};

let getCookie = (name) => { //获取cookie
  var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  return (arr = document.cookie.match(reg)) ? unescape(arr[2]) : null;
};

let getQueryString = (name) => { //获取get参数
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  return r != null ? unescape(r[2]) : null;
}

let loginBack = () => {
  window.location.href = "https://oauth.xmatrix.studio/?sid=10003&args=" + sign + "?where=comments";
};

let getComments = () => {
  $.post('/api/getComments', { url: sign }, (data) => {
    commentsData.comments = data.comments;
    if (data.state == 'ok') {
      $('#noComment').hide();
    }
  });
};

let addComment = () => {
  $.post('/api/addComment', {
    url: sign,
    text: $('#commentText').val(),
  }, () => {
    $('#commentText').val('');
    getComments();
  });
}

let commentsData = new Vue({
  el: '#comments',
  data: {
    comments: []
  }
});

$(() => {
  //----------------------------
  //计数系统
  let reg = /page\/[0-9]+\/index.html/;
  if (sign == 'index.html' || reg.test(sign)) getReadCount(); // 主页
  reg = /^[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/[a-zA-z-]+\/$/;
  if (reg.test(sign)) { // 文章页面
    addReadCount();
  }
  addPeople();
  //--------------------------
  //用户系统
  let userLogin = false;
  if (getCookie('isLogin') == 'true' && getCookie('name') !== null) {
    $('#loginLi').html('<a href="/user.html" rel="section" ><i class = "menu-item-icon fa fa-fw fa-user-o"></i><br>' + getCookie('name') + '</a>');
    userLogin = true;
  }
  //--------------------------
  //评论系统
  if (document.getElementById('comments') !== null) {
    getComments();
    if (getQueryString('where') !== null) {
      document.getElementById(getQueryString('where')).scrollIntoView();
    }
    if (userLogin) {
      $('#loginBox').hide();
      $('#userName').html(getCookie('name'));
    } else {
      $('#submitBox').hide();
    }
  }
  //--------------------------
});