var account_scope = document.getElementById('account_scope').innerHTML;
get_data(account_scope, 'id', '>=', '0');
get_data_dropdown_regencies('regencies', 'id', '>=', '0');

function get_data(based_by, where_clause, where_condition, where_value){
    var string = btoa(based_by+'/'+where_clause+'/'+where_condition+'/'+where_value);
    $.ajax({
        url: base_url+"api/get_data_sum/"+string,
        type: "get",
        success: function(result){
            // console.log('data : '+result);
            var data = JSON.parse(result);
            var r = data['data']['regencies'];
            var d = data['data']['districts'];
            var s = data['data']['sub_districts'];
            $.each(r, function( index, value ) {
                root_view =  '<div class="col-lg-3 col-6 r_reload">'+
                                '<div class="small-box bg-primary">'+
                                '<div class="inner">'+
                                    '<h3>'+value.count_by_regency+'</h3>'+
                                    '<p>'+value.name+'</p>'+
                                '</div>'+
                                '<div class="icon">'+
                                    '<i class="ion ion-pie-graph"></i>'+
                                '</div>'+
                                '</div>'+
                            '</div>';
                $('.count_regencies_load').append(root_view);
            });
        },
        error: function (result, ajaxOptions, thrownError) {
            // console.log('data : '+result.responseText);
            error_message('error', 'Oops! sepertinya ada kesalahan', 'kesalahan tidak diketahui');
            if(result.response.status == false){
                var string = JSON.stringify(result.responseText);
                var msg = JSON.parse(result.responseText);
                error_message('error', 'Oops! sepertinya ada kesalahan', msg.message['indonesia']);
            }
        }
    });
} 

function get_data_dropdown_regencies(table, where_clause, where_condition, where_value){
    $('.regencies_reload').remove();
    var param = btoa(table+"/"+where_clause+"/"+where_condition+"/"+where_value);
    $.ajax({
        url: base_url+"api/get_data_where/"+param,
        type: "get",
        success: function(result){
            // console.log('data : '+result);
            var data = JSON.parse(result);
            var r = data['data'];
            var v;
            $.each(r, function( index, value ) {
                v = v+'<option value="'+value.id+'">'+value.name+'</option>';
            });
            root_view =  '<div class="form-group regencies_reload">'+
                                '<label>Kabupaten</label>'+
                                '<select id="select_regencies" class="form-control select2 select_regencies" style="width: 100%;">'+
                                '<option value="not selected yet">- Pilih Kabupaten -</option>'+
                                v+
                                '</select>'+
                            '</div>';
            $('.regencies_dropdown').append(root_view);
            $('.select_regencies').on('change', function () {
                var selectVal = $(".select_regencies option:selected").val();
                // console.log(selectVal);
                if(selectVal == 'not selected yet'){
                    reset_dropdwon();
                }else{
                    get_data_dropdown_districts('districts', 'regency_id', '=', selectVal, '.districts_dropdown', 'Kecamatan', 'select_districts');
                }
            });
        },
        error: function (result, ajaxOptions, thrownError) {
            // console.log('data : '+result.responseText);
            error_message('error', 'Oops! sepertinya ada kesalahan', 'kesalahan tidak diketahui');
            if(result.response.status == false){
                var string = JSON.stringify(result.responseText);
                var msg = JSON.parse(result.responseText);
                error_message('error', 'Oops! sepertinya ada kesalahan', msg.message['indonesia']);
            }
        }
    });
} 

function reset_dropdwon(){
    $('.districts_reload').remove();
    $('.sub_districts_reload').remove();
    root_view =  '<div class="form-group districts_reload">'+
                                '<label>Kecamatan</label>'+
                                '<select id="select_districts" class="form-control select2 select_districts" style="width: 100%;">'+
                                '<option value="not selected yet">- Pilih Kecamatan -</option>'+
                                '</select>'+
                            '</div>';
    $('.districts_dropdown').append(root_view);
    root_view2 =  '<div class="form-group sub_districts_reload">'+
                                '<label>Kelurahan/Desa</label>'+
                                '<select id="select_sub_districts" class="form-control select2 select_sub_districts" style="width: 100%;">'+
                                '<option value="not selected yet">- Pilih Kelurahan/Desa -</option>'+
                                '</select>'+
                            '</div>';
    $('.sub_districts_dropdown').append(root_view2);
}

function get_data_dropdown_districts(table, where_clause, where_condition, where_value){
    $('.districts_reload').remove();
    $('.sub_districts_reload').remove();
    root_view2 =  '<div class="form-group sub_districts_reload">'+
                                '<label>Kelurahan/Desa</label>'+
                                '<select id="select_sub_districts" class="form-control select2 select_sub_districts" style="width: 100%;">'+
                                '<option value="not selected yet">- Pilih Kelurahan/Desa -</option>'+
                                '</select>'+
                            '</div>';
    $('.sub_districts_dropdown').append(root_view2);
    var param = btoa(table+"/"+where_clause+"/"+where_condition+"/"+where_value);
    $.ajax({
        url: base_url+"api/get_data_where/"+param,
        type: "get",
        success: function(result){
            // console.log('data : '+result);
            var data = JSON.parse(result);
            var r = data['data'];
            var v;
            $.each(r, function( index, value ) {
                v = v+'<option value="'+value.id+'">'+value.name+'</option>';
            });
            root_view =  '<div class="form-group districts_reload">'+
                                '<label>Kecamatan</label>'+
                                '<select id="select_districts" class="form-control select2 select_districts" style="width: 100%;">'+
                                '<option value="not selected yet">- Pilih Kecamatan -</option>'+
                                v+
                                '</select>'+
                            '</div>';
            $('.districts_dropdown').append(root_view);
            $('.select_districts').on('change', function () {
                var selectVal = $(".select_districts option:selected").val();
                // console.log(selectVal);
                if(selectVal == 'not selected yet'){
                    console.log('not select yet');
                }else{
                    get_data_dropdown_sub_districts('sub_districts', 'distric_id', '=', selectVal);
                }
            });
        },
        error: function (result, ajaxOptions, thrownError) {
            // console.log('data : '+result.responseText);
            error_message('error', 'Oops! sepertinya ada kesalahan', 'kesalahan tidak diketahui');
            if(result.response.status == false){
                var string = JSON.stringify(result.responseText);
                var msg = JSON.parse(result.responseText);
                error_message('error', 'Oops! sepertinya ada kesalahan', msg.message['indonesia']);
            }
        }
    });
} 

function get_data_dropdown_sub_districts(table, where_clause, where_condition, where_value){
    $('.sub_districts_reload').remove();
    var param = btoa(table+"/"+where_clause+"/"+where_condition+"/"+where_value);
    $.ajax({
        url: base_url+"api/get_data_where/"+param,
        type: "get",
        success: function(result){
            // console.log('data : '+result);
            var data = JSON.parse(result);
            var r = data['data'];
            var v;
            $.each(r, function( index, value ) {
                v = v+'<option value="'+value.id+'">'+value.name+'</option>';
            });
            root_view =  '<div class="form-group sub_districts_reload">'+
                                '<label>Kelurahan/Desa</label>'+
                                '<select id="select_sub_districts" class="form-control select2 select_sub_districts" style="width: 100%;">'+
                                '<option value="not selected yet">- Pilih Kelurahan/Desa -</option>'+
                                v+
                                '</select>'+
                            '</div>';
            $('.sub_districts_dropdown').append(root_view);
        },
        error: function (result, ajaxOptions, thrownError) {
            // console.log('data : '+result.responseText);
            error_message('error', 'Oops! sepertinya ada kesalahan', 'kesalahan tidak diketahui');
            if(result.response.status == false){
                var string = JSON.stringify(result.responseText);
                var msg = JSON.parse(result.responseText);
                error_message('error', 'Oops! sepertinya ada kesalahan', msg.message['indonesia']);
            }
        }
    });
}

function show(){
    var select_sub_districts = $("#select_sub_districts").val();
    var select_districts = $("#select_districts").val();
    var select_regencies = $("#select_regencies").val();

    // console.log('data : '+select_regencies+select_districts+select_sub_districts);

    if(select_sub_districts == 'not selected yet'){
        if(select_districts == 'not selected yet'){
            if(select_regencies == 'not selected yet'){
                $('#label_districts').attr('hidden', true);
                $('#label_sub_districts').attr('hidden', true);
                get_data_sum(account_scope, 'id', '>=', '0');
            }else{
                $('#label_districts').attr('hidden', false);
                $('#label_sub_districts').attr('hidden', true);
                get_data_sum('districts', 'regency_id', '=', select_regencies);
            }
        }else{
            $('#label_districts').attr('hidden', false);
            $('#label_sub_districts').attr('hidden', false);
            get_data_sum('sub_districts', 'distric_id', '=', select_districts);
        }
    }else{
        $('#label_districts').attr('hidden', false);
        $('#label_sub_districts').attr('hidden', false);
        get_data_sum('sub_districts', 'id', '=', select_sub_districts);
    }
}

function get_data_sum(table, where_clause, where_condition, where_value){
    console.log(table+"/"+where_clause+"/"+where_condition+"/"+where_value);
    var param = btoa(table+"/"+where_clause+"/"+where_condition+"/"+where_value);
    $.ajax({
        url: base_url+"api/get_data_sum/"+param,
        type: "get",
        success: function(result){
            console.log('data : '+result);
            var data = JSON.parse(result);
            var d = data['data'];
            var regencies = d.regencies;
            var districts = d.districts;
            var sub_districts = d.sub_districts;
            console.log('haha : '+regencies+districts+sub_districts);
            if(sub_districts == 'undefined'){
                if(districts == 'undefined'){
                    if(regencies == 'undefined'){
                        console.log('anda tidak memilih apapun');
                    }else{
                        var r = data['data']['regencies'];
                        view_count_regencies(r);
                    }
                }else{
                    var r = data['data']['regencies'];
                    var d = data['data']['districts'];
                    view_count_regencies(r);
                    view_count_districts(d);
                }
            }else{
                var r = data['data']['regencies'];
                var d = data['data']['districts'];
                var s = data['data']['sub_districts'];
                view_count_regencies(r);
                view_count_districts(d);
                view_count_sub_districts(s);
            }
        },
        error: function (result, ajaxOptions, thrownError) {
            // console.log('data : '+result.responseText);
            error_message('error', 'Oops! sepertinya ada kesalahan', 'kesalahan tidak diketahui');
            if(result.response.status == false){
                var string = JSON.stringify(result.responseText);
                var msg = JSON.parse(result.responseText);
                error_message('error', 'Oops! sepertinya ada kesalahan', msg.message['indonesia']);
            }
        }
    });
}

function view_count_regencies(r){
    $('.r_reload').remove();
    $.each(r, function( index, value ) {
        root_view =  '<div class="col-lg-3 col-6 r_reload">'+
                        '<div class="small-box bg-primary">'+
                        '<div class="inner">'+
                            '<h3>'+value.count_by_regency+'</h3>'+
                            '<p>'+value.name+'</p>'+
                        '</div>'+
                        '<div class="icon">'+
                            '<i class="ion ion-pie-graph"></i>'+
                        '</div>'+
                        '</div>'+
                    '</div>';
        $('.count_regencies_load').append(root_view);
    });
}
function view_count_districts(r){
    // $('#label_districts').attr('hidden', false);
    $('.d_reload').remove();
    $.each(r, function( index, value ) {
        root_view =  '<div class="col-lg-3 col-6 d_reload">'+
                        '<div class="small-box bg-danger">'+
                        '<div class="inner">'+
                            '<h3>'+value.count_by_districts+'</h3>'+
                            '<p>'+value.name+'</p>'+
                        '</div>'+
                        '<div class="icon">'+
                            '<i class="ion ion-pie-graph"></i>'+
                        '</div>'+
                        '</div>'+
                    '</div>';
        $('.count_districts_load').append(root_view);
    });
}
function view_count_sub_districts(r){
    // $('#label_sub_districts').attr('hidden', false);
    $('.s_reload').remove();
    $.each(r, function( index, value ) {
        root_view =  '<div class="col-lg-3 col-6 s_reload">'+
                        '<div class="small-box bg-warning">'+
                        '<div class="inner">'+
                            '<h3>'+value.count_by_sub_districts+'</h3>'+
                            '<p>'+value.name+'</p>'+
                        '</div>'+
                        '<div class="icon">'+
                            '<i class="ion ion-pie-graph"></i>'+
                        '</div>'+
                        '</div>'+
                    '</div>';
        $('.count_sub_districts_load').append(root_view);
    });
}