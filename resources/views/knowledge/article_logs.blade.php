<div class="page-content">
    <div class="row">
        <div class="col-xs-12">
            <table id="" class="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th width="60px">序列号</th>
                        <th width="90px">操作信息</th>
                        <th width="200px">基本信息</th>
                        <th width="200px">附件</th>
                        <th width="200px">适用门店</th>
                    <tr>
                </thead>
                <tbody>
                    @foreach ($list as $key => $log)
                    <tr>
                        <td>{{$log->id}}</td>
                        <td>
                            {{$log->operator_name}}<br />
                            {{$log->created_at}}
                        </td>
                        <td>
                            标题：{{$log->title}}<br />
                            关键字：{{$log->keywords}}<br />
                            阅读：{{$log->reading}}<br />
                            点赞：{{$log->upvote}}
                        </td>
                        <td>
                        <?php $attachments = json_decode($log->attachments, true); ?>
                        新增：<br />
                            @foreach (array_get($attachments, 'insert', []) as $key => $value) &nbsp;&nbsp;{{$value}} <br /> @endforeach
                        删除：<br />
                            @foreach (array_get($attachments, 'delete', []) as $key => $value) &nbsp;&nbsp;{{$key}}：{{$value}} <br /> @endforeach
                        </td>
                        <td>
                            {{$log->stores}}
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>
