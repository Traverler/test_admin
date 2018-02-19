@extends('layouts.app')

@section('content')

    <div class="panel panel-default panel-border panel-shadow">
        <div class="panel-heading">
            <h3 class="panel-title">保存商品</h3>

            <div class="panel-options">
                <a href="#" data-toggle="panel">
                    <span class="collapse-icon">–</span>
                    <span class="expand-icon">+</span>
                </a>
            </div>
        </div>

        <div class="panel-body">

            <form class="form-horizontal" role="form" action="/sku/save" method="POST">
                <input type="hidden" value="{{ csrf_token() }}" name="_token">
                <div class="form-group-separator"></div>

                <div class="form-group">
                    <label class="col-sm-2 control-label" for="name">商品名称</label>

                    <div class="col-sm-10">
                        <input class="form-control" type="text" name="name" id="name"
                               value="{{ array_get($item, 'name') }}" />

                    </div>
                </div>

                <div class="form-group-separator"></div>

                <div class="form-group">
                    <label class="col-sm-2 control-label" for="remark">商品图片</label>

                    <div class="col-sm-10">
                        <div class="box-content" data-name="attachments" style="margin-top:-10px; padding-bottom:0px;">
                            <div class="input-wrap">
                                <label class="upload" for="id-file-1" style="margin-left: 5px;">
                                    <span class="cross-r" style="left:-50px;"></span>
                                    <span class="cross-l" style="left:-50px;"></span>
                                    <span class="cross-text">附件</span>
                                </label>
                                <input multiple="" type="file" class="upload-img" id="id-file-1" style="display:none;"
                                       accept="image/*, application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.ms-powerpoint"
                                />
                            </div>
                            @foreach (array_get($item, 'attachments', []) as $ind => $file)
                                <div class="input-wrap" data-name="attachments">
                                    <a href="javascript:;" class="upload">
                                        <div class="cross-r"></div>
                                        {{ array_get($file, 'origin_name' ) }}
                                    </a>

                                    <input type="hidden" name="attachments[{{$ind}}][file_path]" value=" {{ array_get($file, 'file_path' ) }}" />
                                    <input type="hidden" name="attachments[{{$ind}}][del]" value="{{ $file['del'] }}" class="img-del" />

                                </div>
                            @endforeach
                        </div>
                    </div>
                </div>

                <div class="form-group-separator"></div>

                <div class="form-group">
                    <label class="col-sm-2 control-label" for="remark">商品描述</label>

                    <div class="col-sm-10">
                        <textarea class="form-control" cols="5" id="remark"
                                  name="remark" >{{ array_get($item, 'remark') }}</textarea>

                    </div>
                </div>

                <div class="form-group-separator"></div>



                <div class="row">

                    <div class="col-sm-4">

                    </div>

                    <div class="col-sm-8" style="text-align: right;">
                        <button class="btn btn-info" type="submit"><i class="ace-icon fa fa-check bigger-110"></i>保存</button>

                        <button class="btn btn-white btn-icon"  type="button"  id="btn-closeCheck">
                            <i class="fa fa-times"></i>
                            <span>关闭</span>
                        </button>
                    </div>

                </div>

            </form>



        </div>
    </div>


    <script src="/js/uploadAttachment.js"></script>
    <script>
        $("#btn-closeCheck").click(function(){
            closeCheckTab();
        });

        function closeCheckTab(){
            var curTab = parent.document.getElementById('tabA_task_myTask');
            curTab = $(curTab);
            curTab && curTab.length > 0 && (parent.refreshTab(curTab));
            parent.closeCurrentTab('#tabA_task_myTask');
        }

        $("#id-file-1").on("change", function (e) {
            uploadAttachment(e, false);
        });

        $(function() {
            $('a.upload').on('click', function() {
                $(this).parent().addClass('hide').find('input.img-del').val(1);
            });
        });



    </script>
    <style>

    </style>
@endsection
