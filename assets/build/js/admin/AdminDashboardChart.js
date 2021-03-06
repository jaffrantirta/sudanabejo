get_data_gender();
get_data_sum_occ('occupations', 'id', '>=', '0');
get_data_age();

function charts(ctx, label, data, backgroundColor, borderColor, type){
    var myChart = new Chart(ctx, {
        type: type,
        data: {
            labels: label,
            datasets: [{
                label: 'Pengguna',
                data: data,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function get_data_gender(){
    var ctx = document.getElementById('chart_gender').getContext('2d');
    var male = document.getElementById('male').innerHTML;
    var female = document.getElementById('female').innerHTML;
    var label = ['Perempuan', 'Laki - laki'];
    var data = [female, male];
    var backgroundColor = ['#f54131','#007cf7'];
    var borderColor = ['#8a0000','#004385'];
    charts(ctx, label, data, backgroundColor, borderColor, 'pie');
}

function get_data_sum_occ(table, where_clause, where_condition, where_value){
    // console.log(table+"/"+where_clause+"/"+where_condition+"/"+where_value);
    var param = btoa(table+"/"+where_clause+"/"+where_condition+"/"+where_value);
    $('.loader').attr('hidden', false);
    $.ajax({
        url: base_url+"api/get_data_sum/"+param,
        type: "get",
        success: function(result){
            $('.loader').attr('hidden', true);
            // console.log('data : '+result);
            var data = JSON.parse(result);
            var d = data['data'];
            var label = new Array();
            var data = new Array();
            var backgroundColor = new Array();
            var borderColor = new Array();
            var count = d.length;
            for(i=0;i<count;i++){
                data.push(d[i]['count_by_occupations']);
                label.push(d[i]['name']);
                var random_color = "#"+Math.floor(Math.random()*16777215).toString(16);
                backgroundColor.push(random_color);
                borderColor.push(random_color);
            }
            var ctx = document.getElementById('chart_occupasion').getContext('2d');
            charts(ctx, label, data, backgroundColor, borderColor, 'pie');
            // console.log(pick_backgroundColor);
            
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

function get_data_age(){
    // console.log(table+"/"+where_clause+"/"+where_condition+"/"+where_value);
    $('.loader').attr('hidden', false);
    $.ajax({
        url: base_url+"api/get_data_age/",
        type: "get",
        success: function(result){
            $('.loader').attr('hidden', true);
            var data = JSON.parse(result);
            // var str = JSON.stringify(result);
            // console.log('data : '+str);
            var d = data['age'];
            var label = new Array();
            var data = new Array();
            var backgroundColor = new Array();
            var borderColor = new Array();
            var count = d.length;
            for(i=0;i<count;i++){
                data.push(d[i]['sum']);
                label.push(d[i]['range_age']);
                var random_color = "#28a745";
                backgroundColor.push(random_color);
                borderColor.push(random_color);
            }
            var ctx = document.getElementById('chart_age').getContext('2d');
            charts(ctx, label, data, backgroundColor, borderColor, 'bar');
            // console.log(pick_backgroundColor);
            
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