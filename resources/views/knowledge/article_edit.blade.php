@extends('layouts._default')

@section('content')
<link rel="stylesheet" href="/css/house/new_house.css?time={{time()}}">
<div class="breadcrumbs" id="breadcrumbs">
    <ul class="breadcrumb">
        <li>
            <i class="menu-icon fa fa-book"></i>
            <a href="/knowledge/categories">知识管理</a>
        </li>
        <li>编辑文章</li>
    </ul>
</div>

<div class="page-content">
    <div class="row" style="margin:5px;">
        <form class="form-horizontal" role="form" action="/knowledge/article/save" method="POST">
            <input type="hidden" name="_token" value="{{ csrf_token() }}" />
            <input type="hidden" name="id" value="{{array_get($article, 'id', '')}}" />

            <div class="form-group">
                <input type="text" name="title" value="{{array_get($article, 'title', '')}}"
                    style="width:600px"
                    placeholder="文章标题"
                    required
                />
            </div>

            <div class="form-group">
                <input type="text" name="keywords" value="{{array_get($article, 'keywords', '')}}"
                    placeholder="关键字，多个关键字用空格隔开"
                    style="width:700px"
                />
            </div>

            <div class="form-group form-inline">
                <select class="select form-control parent-category-id" name="parent_category_id" style="width:200px;">
                    <option value="">-- 请选择分类 --</option>
                    @foreach ($parents as $id => $name)
                    <option value="{{$id}}" @if (array_get($article, 'parent_category_id') == $id) selected @endif>{{$name}}</option>
                    @endforeach
                </select>
                <select class="select form-control category-id" name="knowledge_category_id" style="width:200px;" data-c-category-id={{array_get($article, 'knowledge_category_id', 0)}}>
                    <option value="">-- 请选择 --</option>
                </select>
            </div>

            <div class="form-group">
                <select class="select form-control" name="status" style="width:150px;">
                    <option value="">-- 请选择状态 --</option>
                    @foreach (\App\Models\Store\KnowledgeArticle::$status as $key => $value)
                    <option value="{{$key}}" @if (array_get($article, 'status') == $key) selected @endif>{{$value}}</option>
                    @endforeach
                </select>
            </div>

            <div class="form-group">
                <select class="select form-control" name="need_alert" style="width:150px;">
                    <option value="">-- 请选择弹窗提示 --</option>
                    @foreach (\App\Models\Store\KnowledgeArticle::$needAlert as $key => $value)
                    <option value="{{$key}}" @if (array_get($article, 'need_alert') == $key) selected @endif>{{$value}}</option>
                    @endforeach
                </select>
            </div>

            <div class="form-group form-inline">
                <select class="select form-control set-province" name="all_flag" style="width:150px;" data-article-id="{{array_get($article, 'id', 0)}}">
                    <option value="1" @if (array_get($article, 'all_flag', 1) == 1) selected @endif>全部门店适用</option>
                    <option value="0" @if (array_get($article, 'all_flag', 1) != 1) selected @endif>部分门店适用</option>
                </select>
                <select multiple="" style="display: none;" name="province_ids[]" id="province-ids"></select>
                <select multiple="" style="display: none;" name="store_ids[]" id="store-ids"></select>
            </div>

            <div class="form-group form-inline" style="margin-bottom:-8px;">
                <font size="2" color="#CECECE">&nbsp;&nbsp;附件支持图片和PDF文件，大小10M以内</font>
            </div>
            <div class="form-group content-wrap" style="padding-top:0px;">
                <div class="box-content" data-name="attachments" style="margin-top:-10px; padding-bottom:0px;">
                    <div class="input-wrap">
                        <label class="upload" for="id-file-1" style="margin-left: 5px;">
                            <div class="cross-r" style="left:-50px;"></div>
                            <div class="cross-l" style="left:-50px;"></div>
                            <div class="cross-text">附件</div>
                        </label>
                        <input multiple="" type="file" class="upload-img" id="id-file-1" style="display:none;"
                            accept="image/*, application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.ms-powerpoint"
                        />
                    </div>
                    @foreach (array_get($article, 'attachments', []) as $ind => $file)
                    <div class="input-wrap" data-name="attachments">
                        <a href="javascript:;" class="upload">
                            <div class="cross-r"></div>
                            {{ $file['origin_name'] }}
                        </a>
                        <input type="hidden" name="attachments[{{$ind}}][file_size]" value="{{ $file['file_size'] }}" />
                        <input type="hidden" name="attachments[{{$ind}}][file_name]" value="{{ $file['file_name'] }}" />
                        <input type="hidden" name="attachments[{{$ind}}][file_path]" value="{{ $file['file_path'] }}" />
                        <input type="hidden" name="attachments[{{$ind}}][sort]" value="{{ $file['sort'] }}" />
                        <input type="hidden" name="attachments[{{$ind}}][id]" value="{{ $file['id'] }}" />
                        <input type="hidden" name="attachments[{{$ind}}][origin_name]" value="{{ $file['origin_name'] }}" />
                        <input type="hidden" name="attachments[{{$ind}}][del]" value="{{ $file['del'] }}" class="img-del" />
                    </div>
                    @endforeach
                </div>
            </div>

            <div class="form-group">
                <textarea id="article_textarea" name="content">{{array_get($article, 'content', '')}}</textarea>
            </div>

            <div class="clearfix">
                <div class="col-md-offset-5 col-md-7">
                    <button class="btn" type="reset"><i class="ace-icon fa fa-undo bigger-110"></i>重置</button>
                    <button class="btn btn-info" type="submit"><i class="ace-icon fa fa-check bigger-110"></i>保存</button>
                </div>
            </div>

        </form>
    </div>
</div>

<script src="/js/jquery-ui.js"></script>
<script src="/js/uploadAttachment.js"></script>
<script src="/js/ckeditor/ckeditor.js"></script>
<script src="/js/bootstrap-multiselect.js"></script>
<script type="text/javascript">
    CKEDITOR.replace('article_textarea', {
        customConfig : baseUrl('/js/ckeditor/config-customer.js')
    });

    $("#id-file-1").on("change", function (e) {
        uploadAttachment(e, false);
    });

    $(function() {
        $('a.upload').on('click', function() {
            $(this).parent().addClass('hide').find('input.img-del').val(1);
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
        var cCategoryId = $(".category-id").attr('data-c-category-id');

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

    $(".set-province").ready(function () {
        var articleId = $(".set-province").attr('data-article-id');
        var selected = $(".set-province").val();

        if (selected != 1) {
            $.ajax({
                url: '/knowledge/article/' + articleId + '/area',
                type: 'GET',
                async: false,
                dataType: 'json',
                success: function(data) {
                    list = data.data;
                    var e = $("#province-ids");
                    var one = e.find('option:first');
                    e.empty();
                    e.append(one);

                    for(var i = 0; i < list.length; i++) {
                        var op = $('<option></option>');
                        op.val(list[i].id);
                        op.html(list[i].area_name);
                        if (list[i].selected == 1) {
                            op.prop('selected', true);
                        }
                        e.append(op);
                    }

                    multiSelect("#province-ids");
                }
            });
        } else {
            multiSelect("#province-ids");
        }
    });

    $("#province-ids").ready(function () {
        var selected = $("#province-ids").val();
        var articleId = $(".set-province").attr('data-article-id');

        $.ajax({
            url: '/store/provinces?ids=' + selected + '&articleId=' + articleId,
            type: 'GET',
            async: false,
            dataType: 'json',
            success: function(data) {
                list = data.data;
                var e = $("#store-ids");
                e.empty();

                for(var i = 0; i < list.length; i++) {
                    var op = $('<option></option>');
                    op.val(list[i].id);
                    op.html(list[i].name);
                    if (list[i].selected == 1) {
                        op.prop('selected', true);
                    }
                    e.append(op);
                }

                multiSelect("#store-ids");
            }
        });
    });

    $(".set-province").on("change", function (e) {
        var selected = $(".set-province").val();

        if (selected != 1) {
            $.ajax({
                url: '/area/1/subAreas',
                type: 'GET',
                async: false,
                dataType: 'json',
                success: function(data) {
                    list = data.data;
                    var e = $("#province-ids");
                    var one = e.find('option:first');
                    e.empty();
                    e.append(one);

                    for(var i = 0; i < list.length; i++) {
                        var op = $('<option></option>');
                        op.val(list[i].id);
                        op.html(list[i].area_name);
                        e.append(op);
                    }

                    multiSelect("#province-ids");
                }
            });
        } else {
            $("#province-ids").empty();
            $("#store-ids").empty();
            multiSelect("#province-ids");
            multiSelect("#store-ids");
        }
    });

    $("#province-ids").on('change', function (e) {
        var selected = $("#province-ids").val();

        $.ajax({
            url: '/store/provinces?ids=' + selected,
            type: 'GET',
            async: false,
            dataType: 'json',
            success: function(data) {
                list = data.data;
                var e = $("#store-ids");
                e.empty();

                for(var i = 0; i < list.length; i++) {
                    var op = $('<option></option>');
                    op.val(list[i].id);
                    op.html(list[i].name);
                    op.prop('selected', true);
                    e.append(op);
                }

                multiSelect("#store-ids");
            }
        });
    });

    function multiSelect(id) {
        $(id).multiselect({
            enableFiltering: true,
            buttonClass: 'btn btn-white btn-primary',
            preventInputChangeEvent: true,
            templates: {
                button: '<button type="button" class="multiselect dropdown-toggle" data-toggle="dropdown"></button>',
                ul: '<ul class="multiselect-container dropdown-menu"></ul>',
                filter: '<li class="multiselect-item filter"><div class="input-group"><span class="input-group-addon"><i class="fa fa-search"></i></span><input class="form-control multiselect-search" type="text"></div></li>',
                filterClearBtn: '<span class="input-group-btn"><button class="btn btn-default btn-white btn-grey multiselect-clear-filter" type="button"><i class="fa fa-times-circle red2"></i></button></span>',
                li: '<li><a href="javascript:void(0);"><label></label></a></li>',
                divider: '<li class="multiselect-item divider"></li>',
                liGroup: '<li class="multiselect-item group"><label class="multiselect-group"></label></li>'
            }
        }).multiselect('rebuild');
    }
</script>

@endsection
