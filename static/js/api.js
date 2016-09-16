// 存放 api 的字典
var api = {}

// 总体 api
api.ajax = function(url, method, form, callback) {
    var request = {
        url: url,
        type: method,
        data: form,
        success: function(response) {
            var r = JSON.parse(response)
            callback(r)
        },
        error: function(err) {
            var r = {
            'success': false,
            'message': '网络错误'
            }
            callback(r)
        }
    }
    $.ajax(request)
}
api.post = function(url, form, response) {
    api.ajax(url, 'post', form, response)
}
api.get = function(url, response) {
    api.ajax(url, 'get', {}, response)
}

// ====================
// 以上是内部函数，内部使用
// --------------------
// 以下是功能函数，外部使用
// ====================

// 微博 api
api.weiboAdd = function(form, response) {
    var url = '/api/weibo/add'
    api.post(url, form, response)
}

api.weiboDelete = function(weiboId, response) {
    var url = '/api/weibo/delete/' + weiboId
    api.post(url, {}, response)
}

api.weiboComment = function(weiboId, form, response) {
    var url = '/api/weibo/comment/' + weiboId
    api.post(url, form, response)
}

api.weiboChange = function(weiboId, form, response) {
    var url = '/api/weibo/change/' + weiboId
    api.post(url, form, response)
}
// 评论 api

// 用户 api
