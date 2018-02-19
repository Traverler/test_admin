<div class="page-content">
    <div class="row">
        <div class="col-xs-12">
            <table id="" class="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th width="60px">序列号</th>
                        <th width="200px">门店</th>
                        <th width="90px">店员</th>
                        <th width="400px">反馈内容</th>
                        <th width="150px">反馈时间</th>
                    <tr>
                </thead>
                <tbody>
                    @foreach ($list as $key => $log)
                    <tr>
                        <td>{{$log->id}}</td>
                        <td>{{$log->feedback_store_name}}</td>
                        <td>{{$log->feedback_user_name}}</td>
                        <td>{{$log->content}}</td>
                        <td>{{$log->created_at}}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>
