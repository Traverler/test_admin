<div class="page-content">
    <div class="row">
        <div class="col-xs-10">
            <form class="form-horizontal" role="form" action="/knowledge/category/save" method="POST">
                <input type="hidden" name="_token" value="{{ csrf_token() }}" />
                <input type="hidden" name="id" value="{{array_get($category, 'id', '')}}" />

                <div class="form-group">
                    <label class="col-sm-2 control-label no-padding-right">类别名称</label>
                    <div class="col-sm-9">
                        <input type="text" name="name" class="col-sm-8" value="{{array_get($category, 'name', '')}}" required />
                    </div>
                    <div class="space-4"></div>
                </div>

                <div class="form-group">
                    <label class="col-sm-2 control-label no-padding-right">父类名称</label>
                    <div class="col-sm-9">
                        <select class="select form-control" name="parent_id" style="width:200px;">
                            <option value="0"></option>
                            @foreach ($pCategories as $key => $value)
                            <option value="{{$key}}" @if (array_get($category, 'parent_id') == $key) selected @endif>{{$value}}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="space-4"></div>
                </div>

                <div class="form-group">
                    <label class="col-sm-2 control-label no-padding-right">启用状态</label>
                    <div class="col-sm-9">
                        <select class="select form-control" name="status" style="width:100px;">
                            @foreach (\App\Models\Store\KnowledgeCategory::$status as $key => $value)
                            <option value="{{$key}}" @if (array_get($category, 'status') == $key) selected @endif>{{$value}}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="space-4"></div>
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
</div>
