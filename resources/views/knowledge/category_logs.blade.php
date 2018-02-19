<div class="page-content">
    <div class="row">
        <div class="col-xs-12">
            <table id="" class="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th width="60px;">序列号</th>
                        <th width="90px;">操作人</th>
                        <th>变更内容</th>
                        <th width="150px;">操作时间</th>
                    <tr>
                </thead>
                <tbody>
                    @foreach ($list as $key => $log)
                    <tr>
                        <td>{{$log->id}}</td>
                        <td>{{$log->operator_name}}</td>
                        <td>
                            @foreach (json_decode($log->content, true) as $key => $value)
                                &nbsp;&nbsp;{{$key}}&nbsp;&nbsp;{{array_get($value, 'old', '空') ?:'空'}}&nbsp;<strong>--></strong>&nbsp;{{array_get($value, 'new')}}</strong></br>
                            @endforeach
                        </td>
                        <td>{{$log->created_at}}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>
