/**
 * Created by Eric on 09/12/2016.
 */

$.fn.dataTable.ext.errMode = 'none';

var dataTableLanguage = {
    "lengthMenu": "每页显示 _MENU_ 条记录",
    "zeroRecords": "没有数据",
    "emptyTable": "没有数据",
    "info": "共_MAX_条记录，当前第_PAGE_页，共 _PAGES_ 页",
    "infoEmpty": "共_MAX_条记录",
    "infoFiltered": "(当前显示的是筛选后的数据)",
    "paginate": {
        "first": "首页",
        "last": "末页",
        "next": "下一页",
        "previous": "上一页"
    },
    "search": "快速搜索:",
    "processing": "处理中...",
    "loadingRecords": "读取中..."
};
 
//Datatable的默认配置
var dataTableDefaultProps = {
    "lengthMenu": [50,200,600,100,25,10,5,1],
    "bStateSave": true,
    "language": dataTableLanguage,
    "processing": true,
    "searching": false,
    "ordering": false,
    "scrollX": true,
    "scrollY": '500',
    "scrollCollapse": true,
    "pagingType": "full_numbers",
    "bDestroy": true,
}


//Datatable的默认配置
var simpleDataTableProps = {
    "language": dataTableLanguage,
    "processing": true,
    "searching": false,
    "ordering": false,
    "scrollX": true,
    "scrollY": '500',
    "scrollCollapse": true,
    "bDestroy": true,
    paging: false,
    info:false
}
