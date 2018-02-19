@extends('layouts._default')

@section('content')

<div class="breadcrumbs" id="breadcrumbs">
    <ul class="breadcrumb">
        <li>
            <i class="menu-icon fa fa-book"></i>
            <a href="/knowledge/categories">知识管理</a>
        </li>
        <li>类别管理</li>
    </ul>
</div>

<div class="page-content">
    <div class="row">
        <form method="get" style="padding:10px" class="form-inline">
            <div class="form-group form-inline">
                <div class="form-group form-inline">
                    <input value="{{array_get($request, 'name')}}" type="text" class="input" name="name" placeholder="类别名称">
                    <select class="select form-control" name="parent_id">
                        <option value="">-- 父类名称 --</option>
                        @foreach ($pCategories as $key => $value)
                        <option value="{{$key}}" @if (array_get($request, 'parent_id') == $key) selected @endif>{{$value}}</option>
                        @endforeach
                    </select>
                    <select class="select form-control" name="status">
                        <option value="0">-- 状态 --</option>
                        @foreach (\App\Models\Store\KnowledgeCategory::$status as $key => $value)
                        <option value="{{$key}}" @if (array_get($request, 'status') == $key) selected @endif>{{$value}}</option>
                        @endforeach
                    </select>
                </div>
                <button class="btn btn-sm btn-info" type="submit"><i class="ace-icon fa fa-check bigger-110"></i>查询</button>
            </div>

            <div class="form-group" style="float:right;">
                <button class="btn btn-sm btn-info create" type="button">
                    <i class="ace-icon fa glyphicon-plus bigger-110"></i>添加类别
                </button>
            </div>
        </form>
    </div>
    <div class="row">
        <div class="col-xs-12">
            <table id="" class="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th width="60px;">序列号</th>
                        <th>名称</th>
                        <th>父类名称</th>
                        <th width="90px;">创建人</th>
                        <th width="70px;">状态</th>
                        <th width="180px;">相关操作</th>
                    <tr>
                </thead>
                <tbody>
                    @foreach ($list as $key => $category)
                    <tr>
                        <td>{{$category->id}}</td>
                        <td>{{$category->name}}</td>
                        <td>{{array_get($pCategories, $category->parent_id, '')}}</td>
                        <td>{{$category->created_user_name}}</td>
                        <td>{{array_get(\App\Models\Store\KnowledgeCategory::$status, $category->status, '未知')}}</td>
                        <td>
                            <button class="btn btn-sm btn-inverse edit" data-id="{{$category->id}}" type="button">编辑</button>
                            <button class="btn btn-sm btn-info logs" data-id="{{$category->id}}" type="button">日志</button>
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
        $(".create").click(function () {
            $.ajax({
                "url": "/knowledge/category/create",
                "dataType": "text",
                "success": function(result) {
                    layer.open({
                        title: '添加类别',
                        type: 1,
                        area: ['600px', '270px'],
                        content:result
                    });
                }
            });
        });

        $(".edit").click(function () {
            var categoryId = $(this).attr('data-id');
            $.ajax({
                "url": "/knowledge/category/" + categoryId + "/edit",
                "dataType": "text",
                "success": function(result) {
                    layer.open({
                        title: '编辑类别',
                        type: 1,
                        area: ['600px', '270px'],
                        content:result
                    });
                }
            });
        });

        $(".logs").click(function () {
            var categoryId = $(this).attr('data-id');
            $.ajax({
                "url": "/knowledge/category/" + categoryId + "/logs",
                "dataType": "text",
                "success": function(result) {
                    layer.open({
                        title: '查看日志',
                        type: 1,
                        area: ['800px', '600px'],
                        content:result
                    });
                }
            });
        });
    });
</script>

@endsection
