@extends('layouts.app')



@section('content')


    <div class="row" id="paramsPanel">
        <div class="panel panel-default panel-border panel-shadow ">
            <div class="panel-heading">
                <h3 class="panel-title">查询条件</h3>
            </div>

            <div class="panel-body">

                <form role="form" class="form-inline">

                    <div class="form-group">
                        {{--<label for="">通话ID:</label>--}}
                        {{--{{ Form::input('text','call_id', Request::get('call_id',''),  ['class' => 'form-control']) }}--}}
                    </div>



                    <br/>

                    <div class="form-group">

                        <button class="btn btn-success btn-icon" type="submit">
                            <i class="fa fa-th-list"></i>
                            <span>查询</span>
                        </button>

                    </div>

                </form>

            </div>
        </div>



        <div class="panel panel-default panel-border panel-shadow">

            <div class="panel-body">

                <table class="table table-bordered table-striped">
                    {{--<colgroup>--}}
                        {{--<col width="15%">--}}
                        {{--<col width="15%">--}}
                        {{--<col width="10%">--}}
                        {{--<col width="40%">--}}
                        {{--<col width="10%">--}}

                    {{--</colgroup>--}}
                    <thead>
                    <tr>
                        <th>商品ID</th>
                        <th>商品名称</th>

                        <th>内容</th>
                        <th>操作</th>
                    </tr>
                    </thead>

                    <tbody>
                    @forelse ($list as $item)
                        <tr>
                            <td>{{ array_get($item, 'id', '') }}</td>
                            <td>{{ array_get($item, 'name', '') }}</td>
                            <td>{{ array_get($item, 'remark', '') }}</td>
                            <td>
                                <a class="btn btn-info btn-sm iframeTabLink" href="javascript:void(0);"
                                   tab-title="{{ '商品详情-' . array_get($item, 'name', '') }}"
                                   tab-id="{{ 'sku_item-' . array_get($item, 'id', '') }}"
                                   tab-url="{{ '/sku/item/' . array_get($item, 'id', '') }}">
                                    <span class="title">商品详情</span>
                                </a>
                            </td>

                        </tr>
                    @empty
                        <tr>

                            <td colspan="15">没有数据</td>

                        </tr>
                    @endforelse

                    </tbody>
                </table>


                <div class="pull-right ">
                    {!! $list->render() !!}
                    <br />
                    共{{ $list->total() }}条记录
                </div>

            </div>

        </div>
    </div>


    <script type="text/javascript">


    </script>

@endsection


