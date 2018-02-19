@extends('layouts._default')

@section('content')

<div class="breadcrumbs" id="breadcrumbs">
    <ul class="breadcrumb">
        <li>
            <i class="menu-icon fa fa-book"></i>
            <a href="/knowledge/categories">知识管理</a>
        </li>
        <li>文章管理</li>
    </ul>
</div>

<div class="page-content">
    <div class="row">
        <form method="get" style="padding:10px" class="form-inline">
            <div class="form-group form-inline">
                <div class="form-group form-inline">
                    <input value="{{array_get($request, 'title')}}" type="text" class="input" name="title" placeholder="标题">
                    <input value="{{array_get($request, 'keywords')}}" type="text" class="input" name="keywords" placeholder="关键字">
                    <input value="{{array_get($request, 'author_name')}}" type="text" class="input" name="author_name" placeholder="作者姓名">
                    <select class="select form-control parent-category-id" name="parent_category_id" data-c-category-id="{{array_get($request, 'knowledge_category_id', '')}}">
                        <option value="">-- 分类 --</option>
                        @foreach ($parents as $id => $name)
                        <option value="{{$id}}" @if (array_get($request, 'parent_category_id') == $id) selected @endif>{{$name}}</option>
                        @endforeach
                    </select>
                    <select class="select form-control category-id" name="knowledge_category_id">
                        <option value="">-- 子分类 --</option>
                    </select>
                    <select class="select form-control" name="status">
                        <option value="0">-- 状态 --</option>
                        @foreach (\App\Models\Store\KnowledgeArticle::$status as $key => $value)
                        <option value="{{$key}}" @if (array_get($request, 'status') == $key) selected @endif>{{$value}}</option>
                        @endforeach
                    </select>
                </div>
                <button class="btn btn-sm btn-info" type="submit"><i class="ace-icon fa fa-check bigger-110"></i>查询</button>
            </div>

            <div class="form-group" style="float:right;">
                <a href="/knowledge/article/create" class="btn btn-sm btn-info" type="button">
                    <i class="ace-icon fa glyphicon-plus bigger-110"></i>添加文章
                </a>
            </div>
        </form>
    </div>
    <div class="row">
        <div class="col-xs-12">
            <table id="" class="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th width="60px">序列号</th>
                        <th>标题</th>
                        <th>关键字</th>
                        <th>分类名称</th>
                        <th>适用门店</th>
                        <th width="70px">作者</th>
                        <th width="60px">阅读量</th>
                        <th width="70px">状态</th>
                        <th width="70px">弹窗</th>
                        <th width="180px">相关操作</th>
                    <tr>
                </thead>
                <tbody>
                    @foreach ($list as $key => $article)
                    <tr>
                        <td>{{$article->id}}</td>
                        <td>{{$article->title}}</td>
                        <td>{{$article->keywords}}</td>
                        <td>{{array_get($categories, $article->knowledge_category_id, '')}}</td>
                        <td>
                            @if (! $article->all_flag)
                                @foreach (array_get($article, 'provinces', []) as $province)
                                    {{array_get($provinces, $province->province_id, '')}}&nbsp;&nbsp;
                                @endforeach
                            @else
                                全部
                            @endif
                        </td>
                        <td>{{$article->author_name}}</td>
                        <td>{{$article->reading}}</td>
                        <td>{{array_get(\App\Models\Store\KnowledgeArticle::$status, $article->status, '未知')}}</td>
                        <td>{{array_get(\App\Models\Store\KnowledgeArticle::$needAlert, $article->need_alert, '未知')}}</td>
                        <td>
                            <a href="/knowledge/article/{{$article->id}}/edit" class="btn btn-sm btn-inverse" type="button">编辑</a>
                            <button class="btn btn-sm btn-info feedbacks" data-id="{{$article->id}}" type="button">反馈</button>
                            <button class="btn btn-sm btn-info logs" data-id="{{$article->id}}" type="button">日志</button>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <div>
            <span style="display:block; float:left; height:33px; line-height:33px; margin:20px 0 0 20px;">共计：{{$list->total()}} 条&nbsp;&nbsp;&nbsp;&nbsp;</span>
            {{$list->links()}}
        </div>
    </div>
</div>

<script src="/js/layer/layer.js"></script>
<script>
    $(document).ready(function(){
        $(".logs").click(function () {
            var articleId = $(this).attr('data-id');
            $.ajax({
                "url": "/knowledge/article/" + articleId + "/logs",
                "dataType": "text",
                "success": function(result) {
                    layer.open({
                        title: '查看日志',
                        type: 1,
                        area: ['1200px', '600px'],
                        content:result
                    });
                }
            });
        });
        $(".feedbacks").click(function () {
            var articleId = $(this).attr('data-id');
            $.ajax({
                "url": "/knowledge/article/" + articleId + "/feedbacks",
                "dataType": "text",
                "success": function(result) {
                    layer.open({
                        title: '查看反馈',
                        type: 1,
                        area: ['1200px', '600px'],
                        content:result
                    });
                }
            });
        });
    });

    $(".parent-category-id").on('change', function (e) {
        var parentId = $(".parent-category-id").val();

        $.ajax({
            url: '/knowledge/category/' + parentId+ '/children',
            type: 'GET',
            async: false,
            dataType: 'json',
            success: function (data) {
                list = data.data;
                var e = $(".category-id");
                var one = e.find('option:first');
                e.empty();
                e.append(one);

                for(var i = 0; i < list.length; i++) {
                    var op = $('<option></option>');
                    op.val(list[i].id);
                    op.html(list[i].name);
                    e.append(op);
                }
            }
        });
    });

    $(".category-id").ready(function () {
        var parentId = $(".parent-category-id").val();
        var cCategoryId = $(".parent-category-id").attr('data-c-category-id');

        $.ajax({
            url: '/knowledge/category/' + parentId+ '/children?cCategory=' + cCategoryId,
            type: 'GET',
            async: false,
            dataType: 'json',
            success: function (data) {
                list = data.data;
                var e = $(".category-id");
                var one = e.find('option:first');
                e.empty();
                e.append(one);

                for(var i = 0; i < list.length; i++) {
                    var op = $('<option></option>');
                    op.val(list[i].id);
                    op.html(list[i].name);
                    if (list[i].selected == 1) {
                        op.prop('selected', true);
                    }
                    e.append(op);
                }
            }
        });
    });

</script>

@endsection
