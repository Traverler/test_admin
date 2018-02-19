@extends('layouts.app')

@section('content')

    <div class="panel panel-default panel-border panel-shadow">
        <div class="panel-heading">
            <h3 class="panel-title">商品详情</h3>

            <div class="panel-options">
                <a href="#" data-toggle="panel">
                    <span class="collapse-icon">–</span>
                    <span class="expand-icon">+</span>
                </a>
            </div>
        </div>

        <div class="panel-body">

            <form role="form" class="form-horizontal" id="checkForm">

                <div class="form-group-separator"></div>

                <div class="form-group">
                    <label class="col-sm-2 control-label" for="id">商品ID</label>

                    <div class="col-sm-10">
                        <input class="form-control" type="text" name="id" id="id"
                               value="{{ array_get($item, 'id') }}" readonly />

                    </div>
                </div>

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
                        @if(!empty($attachments))
                            @foreach($attachments as $attachment)
                        <a target="_blank" title="照片" data-rel="colorbox" href="{{ DIRECTORY_SEPARATOR . $attachment->file_path }}">
                            <img width="100px" height="100px" alt="照片" src="{{ DIRECTORY_SEPARATOR . $attachment->file_path }}"
                                 onerror="this.alt='加载图片失败'" />
                        </a>
                            @endforeach
                        @endif
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

                        <button class="btn btn-white btn-icon"  type="button"  id="btn-closeCheck">
                            <i class="fa fa-times"></i>
                            <span>关闭</span>
                        </button>
                    </div>

                </div>

            </form>



        </div>
    </div>



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

    </script>
    <style>

    </style>
@endsection
