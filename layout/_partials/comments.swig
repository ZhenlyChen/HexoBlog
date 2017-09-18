{% if page.comments %}
<div id="comments" class="comments">
  <p style="font-size: 20px;">文章评论：</p>
  <div id="loginBox">
    <p>请<a onclick="loginBack()">登陆</a>后再发表评论</p>
  </div>
  <div id="commentBox" style="padding-top: 40px;">
    <section class="comments_m">
      <article class="comment_m" id="submitBox">
        <a class="comment-img_m" href="#non">
          <img src="/me.png" alt="" width="50" height="50">
        </a>
        <div class="comment-body_m">
          <p class="attribution_m"> Hi, <b id="userName">UserName</b>, 你可以在下面畅所欲言</p>
          <div class="text_m" style="text-align: right;">
            <textarea id="commentText" rows="3" style="width: 99%;"></textarea>
            <button onclick="addComment()" class="btn">提交评论</button>
          </div>
        </div>
      </article>
      {% raw %}
      <article class="comment_m" v-for="comment in comments">
        <a class="comment-img_m" href="#non">
          <img src="/me.png" alt="" width="50" height="50">
        </a>
        <div class="comment-body_m">
          <div class="text_m">
            <p>{{comment.text}}</p>
          </div>
          <p class="attribution_m">by <a href="javascript:;">{{comment.user}}</a> at {{comment.time}}</p>
        </div>
      </article>
      {% endraw %}
    </section>
  </div>
</div>
{% endif %}