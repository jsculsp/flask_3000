from flask import Blueprint
from flask import request
from flask import abort

from models import Comment
from models import Weibo
from routes.user import current_user

import json

# 创建一个 蓝图对象 并且路由定义在蓝图对象中
# 然后在 flask 主代码中「注册蓝图」来使用
# 第一个参数是蓝图的名字，第二个参数是套路
main = Blueprint('weibo', __name__)


def api_response(success, data=None, message=''):
    r = {
        'success': success,
        'data': data,
        'message': message,
    }
    return json.dumps(r, ensure_ascii=False)


@main.route('/weibo/add', methods=['POST'])
def add():
    form = request.form
    u = current_user()
    t = Weibo(form)
    t.name = u.username
    if t.valid():
        t.save()
        return api_response(True, data=t.json())
    else:
        return api_response(False, message=t.error_message())


@main.route('/weibo/delete/<int:weibo_id>', methods=['POST'])
def delete(weibo_id):
    u = current_user()
    w = Weibo.query.get(weibo_id)
    c = Comment.query.filter_by(weibo_id=weibo_id)
    if u.username == w.name:
        c.delete()
        w.delete()
        return api_response(True, data=w.json())
    else:
        return api_response(False, message='怎么能修改别人的微博呢？这不好！')


@main.route('/weibo/comment/<int:weibo_id>', methods=['POST'])
def comment(weibo_id):
    form = request.form
    u = current_user()
    c = Comment(form)
    c.name = u.username
    c.weibo_id = weibo_id
    if c.valid():
        c.save()
        return api_response(True, data=c.json())
    else:
        return api_response(False, message=c.error_message())


@main.route('/weibo/change/<int:weibo_id>', methods=['POST'])
def change(weibo_id):
    form = request.form
    u = current_user()
    w = Weibo.query.get(weibo_id)
    w.weibo = form.get('weibo', '')
    if u.username == w.name:
        if w.valid():
            w.save()
            return api_response(True, data=w.json())
        else:
            return api_response(False, message=w.error_message())
    else:
        return api_response(False, message='怎么能够修改别人的微博呢？这不好！')