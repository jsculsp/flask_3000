var log = function() {
    console.log(arguments)
}

var weiboTemplate = function(w) {
    var t = `
        <div class="weibo-cell cell item">
          <img src="${ w.avatar }" class="avatar-l">
          <span class="weibo-font weibo-${ w.id }">${ w.weibo }</span>
          <div class="pure-form div-${ w.id } div-textarea hide">
              <textarea id="id-textarea-${ w.id }" name="weibo" rows="4" cols="35" >${ w.weibo }</textarea>
              <button class="change-button pure-button weibo-button" data-id="${ w.id }">修改</button>
          </div>
          <span class="right span-margin">${ w.created_time }</span>
          <span class="right span-margin">by: ${ w.name }</span>
          <div class="right span-margin">
              <button class="weibo-change weibo-button pure-button" data-id="${ w.id }">编辑</button>
              <button class="weibo-delete weibo-button pure-button" data-id="${ w.id }">删除</button>
              <button class="weibo-comment weibo-button pure-button com comment-${ w.id }" data-id="${ w.comments_num }">评论(${ w.comments_num })</button>
          </div>
          <div class="comment-div hide">
            <div class="comments-container-${ w.id }">
            </div>
              <input type="hidden" name="weibo_id" value="${ w.id }">
              <input name="comment" class="left m m-${ w.id }" placeholder="Comment">
              <button class="weibo-button pure-button comment-button" data-id="${ w.id }">发表</button>
          </div>
        </div>
          `
    return t
}

var commentTemplate = function(c) {
    var t = `
        <div class="cell-inner item">
          <img src="${ c.avatar }" class="avatar">
          <span class="comment">${ c.comment }</span>
          <span class="time right span-margin">${ c.created_time }</span>
          <span class="name right span-margin">by:${ c.name }</span>
        </div>
    `
    return t
}

var bindEventWeiboDelete = function() {
    // 绑定删除微博按钮事件
    $('.weibo-container').on('click', '.weibo-delete', function() {
        var weibo_id = $(this).data('id')
        log(weibo_id)
        var weiboCell = $(this).closest('.weibo-cell')
        var response = function(r) {
            if (r.success) {
                $(weiboCell).slideUp()
                alertify.alert("删除成功！", function(){
                    alertify.message('删除成功！')
                })
            } else {
                alertify.alert(r.message, function(){
                    alertify.message(r.message)
                })
            }
        }
        api.weiboDelete(weibo_id, response)
    })
}

var bindEventWeiboAdd = function() {
    // 给按钮绑定添加 Weibo 事件
    $('#id-button-weibo-add').on('click', function(){
        var weibo = $('#id-input-weibo').val()
        var form = {
            weibo: weibo,
        }
        var response = function(r) {
            console.log('成功', r)
            if (r.success) {
                var w = r.data
                $('.gua-box').prepend(weiboTemplate(w))
                $('#id-input-weibo')[0].value = ''
                alertify.alert("添加成功！", function(){
                    alertify.message('添加成功！')
                })
            } else {
                alertify.alert(r.message, function(){
                    alertify.message(r.message)
                })
            }
        }
        api.weiboAdd(form, response)
    })
}

var bindEventCommentToggle = function() {
    // 展开评论事件
    $('.weibo-container').on('click', '.weibo-comment', function() {
        $(this).parent().next().slideToggle()
    })
}

var bindEventCommentAdd = function() {
    var dict = {}

    $('.weibo-container').on('click', '.comment-button', function(){
        var weibo_id = $(this).data('id')
        var comments_num = $(`.comment-${ weibo_id }`).data('id')
        log('debug comments_num', comments_num)
        var comment = $(`.m-${ weibo_id }`).val()
        var form = {
            comment: comment,
        }
        if (dict[`${weibo_id}`] === undefined) {
            dict[`${weibo_id}`] = 0 || comments_num
        }
        var response = function(r) {
            console.log('成功', arguments, weibo_id)
            if (r.success) {
                var c = r.data
                $(`.comments-container-${ weibo_id }`).append(commentTemplate(c))
                $(`.m-${ weibo_id }`)[0].value = ''
                dict[`${weibo_id}`] += 1
                $(`.comment-${ weibo_id }`)[0].innerHTML = "评论(" + dict[`${weibo_id}`] + ")"
                alertify.alert("添加成功！", function(){
                    alertify.message('添加成功！')
                })
            } else {
                alertify.alert(r.message, function(){
                    alertify.message(r.message)
                })
            }
        }
        api.weiboComment(weibo_id, form, response)
    })
}

var bindEventChangeToggle = function() {
    $('.weibo-container').on('click', '.weibo-change', function() {
        var weibo_id = $(this).data('id')
        $(`.weibo-${ weibo_id }`).toggle(0)
        $(`.div-${ weibo_id }`).toggle(0, function(){
            if ($(this).attr('style') === "display: block;") {
                $(this).attr('style', "display: inline-block;")
            }
        })
    })
}

var bindEventWeiboChange = function() {
    $('.weibo-container').on('click', '.change-button', function() {
        var weibo_id = $(this).data('id')
        var weibo = $(`#id-textarea-${ weibo_id }`).val()
        var form = {
            weibo: weibo,
        }
        var response = function(r) {
            if (r.success) {
                var w = r.data
                $(`.weibo-${ weibo_id }`).html(w.weibo)
                alertify.alert("修改成功！", function(){
                    alertify.message('修改成功！')
                })
                var weibo_cell = $(`#id-textarea-${ weibo_id }`).parent().parent()
                var toggle_button = $(weibo_cell).find('.weibo-change')
                $(toggle_button).click()
            } else {
                alertify.alert(r.message, function(){
                    alertify.message(r.message)
                })
            }
        }
        api.weiboChange(weibo_id, form, response)
    })
}

var bindEvents = function() {
    bindEventCommentToggle()
    bindEventWeiboAdd()
    bindEventWeiboDelete()
    bindEventCommentAdd()
    bindEventChangeToggle()
    bindEventWeiboChange()
}

$(document).ready(function(){
    bindEvents()
})
