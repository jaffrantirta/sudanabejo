var table;
var base_url = document.getElementById('base_url').innerHTML;
var link = document.getElementById('link').innerHTML;
var vLink;
console.log('link 222 : '+link);
switch(link){
    case 'get_all_users':
        vLink = base_url+'api/get_users_data_table?field=id>&where_clause=0';
        break;
    case 'regencies':
        var id_clause = document.getElementById('id_clause').innerHTML;
        vLink = base_url+'api/get_users_data_table?field=regency_id&where_clause='+id_clause;
        break;
    case 'districts':
        var id_clause = document.getElementById('id_clause').innerHTML;
        vLink = base_url+'api/get_users_data_table?field=districts_id&where_clause='+id_clause;
        break;
    case 'sub_districts':
        var id_clause = document.getElementById('id_clause').innerHTML;
        vLink = base_url+'api/get_users_data_table?field=sub_district_id&where_clause='+id_clause;
        break;
    case 'birthday':
        var day_value = document.getElementById('day_value').innerHTML;
        var month_value = document.getElementById('month_value').innerHTML;
        vLink = base_url+'api/get_users_data_table?day='+day_value+'&month='+month_value;
        break;
    default :
        vLink = base_url+link;
}
$(document).ready(function() {
    // console.log(link);
    table = $('#table').DataTable({
        "responsive": true,
        "processing": true,
        "serverSide": true,
        "ajax": vLink,
        "bSort":true,
        "bPaginate": true,
        "iDisplayLength": 10,
        "language": {
            "searchPlaceholder": "Pencarian...",
            "search":""
        },
        "fnInitComplete": function(oSettings, json) {
            $('#table_filter :input').addClass('form-control').css({'width':'10em'});
        }
    });
});

function reply(){
    var name = $('#name').val();
    var email = $('#email').val();
    var comment = $('#comment').val();
    var url = "send_email('"+name+"','"+email+"','"+comment+"')";

    Swal.fire({
        title: 'Balas',
        html:
        '<label>Subjek</label>'+
        '<input id="subject" type="text" class="form-control" placeholder="masukan subjek">'+
        '<div class="form-group">'+
                '<label>Komentar</label><br>'+
                '<div class="input-group">'+
                    '<div class="input-group-prepend">'+
                        '<span class="input-group-text"><i class="fas fa-pen"></i></span>'+
                    '</div>'+
                        '<textarea Required name="content" id="message" class="form-control" rows="5" placeholder="masukan pesan"></textarea>'+
                '</div>'+
        '</div>'+
        '<button onclick="'+url+'" class="btn btn-primary">Kirim</button>',
        showCloseButton: false,
        showCancelButton: false,
        showConfirmButton: false
    });
}

function send_email(name, email, comment){
    var subject = $('#subject').val();
    var message = $('#message').val();
    $('.loader').attr('hidden', false);
    $.ajax({
        url: base_url+"api/send_message",
        type: "post",
        data: {'name':name, 'email':email, 'comment':comment, 'subject':subject, 'message':message},
        success: function(result){
            $('.loader').attr('hidden', true);
            var data = JSON.parse(result);
            if(data['response']['status']){
                error_message('success', data['response']['message']['indonesia'], '');
            }
        },
        error: function(error, x, y){
            $('.loader').attr('hidden', true);
            // console.log('data : '+result.responseText);
            error_message('error', 'Oops! sepertinya ada kesalahan', 'kesalahan tidak diketahui');
            if(error.response.status == false){
                var string = JSON.stringify(error.responseText);
                var msg = JSON.parse(error.responseText);
                error_message('error', 'Oops! sepertinya ada kesalahan', msg.message['indonesia']);
            }
        }
    })
}

function error_message($icon, $title, $message){
    Swal.fire({
        icon: $icon,
        html:
        '<div class="col-12">'+
        '<center>'+
        '<strong>'+$title+'</strong><br>'+
        '<small>'+$message+'</small>'+
        '</center>'+
        '</div>',
        showCloseButton: false,
        showCancelButton: false,
        showConfirmButton: true
    });
}

function add_districts(){
    $('.loader').attr('hidden', false);
    $.ajax({
        url: base_url+"api/get_data/regencies",
        type: "get",
        success: function(result){
            $('.loader').attr('hidden', true);
            var v = "'add_districts'";
            // console.log('data 222 : '+result);
            var data = JSON.parse(result);
            var size = data.data.length;
            var i = 0;
            var txt;
            var d;
            for(i=0;i<size;i++){
                d = data.data[i];
                txt = txt+'<option value="'+d.id+'" >'+d.name+'</option>';
            }
            Swal.fire({
                html:
                '<div class="form-group">'+
                    '<label>Tambah Kecamatan</label><br>'+
                    '<small id="msg_select" hidden style="color: red">pilih kabupaten terlebih dahulu</small>'+
                    '<select title="pilih kabupaten" id="select" class="form-control select2" style="width: 100%;">'+
                        '<option value="not selected yet">Pilih Kabupaten</option>'+
                        txt+
                    '</select>'+
                '</div>'+
                '<div class="form-group">'+
                    '<small id="msg_districts" hidden style="color: red">nama kecamatan harus diisi</small>'+
                    '<input title="nama kecamatan" id="name_to_be_add" class="form-control" type="text" placeholder="Nama Kecamatan">'+
                '</div>'+
                '<div class="form-group">'+
                    '<button class="btn btn-primary btn-sm" onClick="action_check('+v+')">tambah</button>'+
                '</div>',
                showConfirmButton: false
            });
        },
        error: function (result, ajaxOptions, thrownError) {
            $('.loader').attr('hidden', true);
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


function action_check(v){
    // console.log('action check : '+select_value+name_to_be_add)
    if(select_value != 'not selected yet'){
        if(name_to_be_add != ''){
            // console.log('oke');
            switch (v){
                case 'add_districts':
                    var name_to_be_add = $("#name_to_be_add").val();
                    var select_value = $("#select").val();
                    add_districts_process(name_to_be_add, select_value);
                    break;
                case 'update_districts':
                    var name_to_be_add = $("#name_to_be_add").val();
                    var select_value = $("#select").val();
                    var id = $("#id").val();
                    console.log('id districts : '+id);
                    update_districts_process(name_to_be_add, select_value, id);
                    break;
                case 'add_sub_districts':
                    var name_to_be_add = $("#name_to_be_add").val();
                    var select_value = $("#select").val();
                    add_sub_districts_process(name_to_be_add, select_value);
                    break;
                case 'update_sub_districts':
                    var name_to_be_add = $("#name_to_be_add").val();
                    var select_value = $("#select").val();
                    var id = $("#id").val();
                    console.log('id sub districts : '+id);
                    update_sub_districts_process(name_to_be_add, select_value, id);
                    break;
                case 'add_news_categories':
                    var name_to_be_add = $("#name_to_be_add").val();
                    add_news_categories_process(name_to_be_add);
                    break;
                case 'update_news_categories':
                    var name_to_be_add = $("#name_to_be_add").val();
                    var id = $("#id").val();
                    update_news_categories_process(name_to_be_add, id);
                    break;
                case 'add_popular_news':
                    var select_value = $("#select").val();
                    add_popular_news_process(select_value);
                    break;
                case 'add_headline_news':
                    var select_value = $("#select").val();
                    add_headline_news_process(select_value);
                    break;
            }
        }else{
            $('#msg_districts').attr('hidden', false);
        }
    }else{
        $('#msg_select').attr('hidden', false);
    }
}

function add_districts_process(districts_name, regency_id){
    $('.loader').attr('hidden', false);
    $.ajax({
        url: base_url+"api/insert_districts",
        type: "post",
        data: {'districts_name':districts_name, 'regency_id':regency_id},
        success: function(result){
            $('.loader').attr('hidden', true);
            // console.log('data : '+result);
            var data = JSON.parse(result);
            Swal.fire({
                allowOutsideClick: false,
                text: data.response.message['indonesia'],
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload(true);
                }
              });
        },
        error: function (result, ajaxOptions, thrownError) {
            $('.loader').attr('hidden', true);
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
function update_districts_process(districts_name, regency_id, id){
    $('.loader').attr('hidden', false);
    $.ajax({
        url: base_url+"api/update_districts",
        type: "post",
        data: {'districts_name':districts_name, 'regency_id':regency_id, 'id':id},
        success: function(result){
            $('.loader').attr('hidden', true);
            console.log('data : '+result);
            var data = JSON.parse(result);
            Swal.fire({
                allowOutsideClick: false,
                text: data.response.message['indonesia']
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload(true);
                }
            });
        },
        error: function (result, ajaxOptions, thrownError) {
            $('.loader').attr('hidden', true);
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

function edit_districts(id){
    $('.loader').attr('hidden', false);
    $.ajax({
        url: base_url+"api/edit_districts_view/"+id,
        type: "get",
        success: function(result){
            $('.loader').attr('hidden', true);
            var v = "'update_districts'";
            // console.log('data : '+result);
            var data = JSON.parse(result);
            var size = data.data.regencies.length;
            var i = 0;
            var txt;
            var d;
            for(i=0;i<size;i++){
                d = data.data.regencies[i];
                txt = txt+'<option value="'+d.id+'" >'+d.name+'</option>';
            }
            Swal.fire({
                html:
                '<div class="form-group">'+
                    '<label>Edit Kecamatan</label><br>'+
                    '<small id="msg_select" hidden style="color: red">pilih kabupaten terlebih dahulu</small>'+
                    '<input id="id" type="hidden" value="'+data.data.districts[0]['id']+'">'+
                    '<select title="pilih kecamatan" id="select" class="form-control select2" style="width: 100%;">'+
                        '<option value="'+data.data.districts[0]['regency_id']+'">'+data.data.districts['regency'][0]['name']+' (dipilih)</option>'+
                        txt+
                    '</select>'+
                '</div>'+
                '<div class="form-group">'+
                    '<small id="msg_districts" hidden style="color: red">nama kecamatan harus diisi</small>'+
                    '<input title="nama kecamatan" id="name_to_be_add" class="form-control" type="text" placeholder="Nama Kecamatan" value="'+data.data.districts[0]['name']+'">'+
                '</div>'+
                '<div class="form-group">'+
                    '<button class="btn btn-primary btn-sm" onClick="action_check('+v+')">edit</button>'+
                '</div>',
                showConfirmButton: false
            });
            
        },
        error: function (result, ajaxOptions, thrownError) {
            $('.loader').attr('hidden', true);
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
function delete_data_districts(id){
    $('.loader').attr('hidden', false);
    // console.log(id);
    $.ajax({
        url: base_url+"api/delete_districts",
        type: "post",
        data: {"id":id},
        success: function(result){
            $('.loader').attr('hidden', true);
            // console.log('data : '+result);
            var data = JSON.parse(result);
            Swal.fire({
                title: data.response.message['indonesia'],
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload(true);
                }
              });
        },
        error: function (result, ajaxOptions, thrownError) {
            $('.loader').attr('hidden', true);
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
function delete_districts(id){
    Swal.fire({
        title: 'Yakin Hapus ?',
    }).then((result) => {
        if (result.isConfirmed) {
            delete_data_districts(id);
        }
    });
}