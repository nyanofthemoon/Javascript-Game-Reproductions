var arr_nevd_index;
var arr_nevd_solutions;
var arr_nevd_input_fields;
var arr_nevd_columns;
var arr_nevd_rows;
var arr_nevd_regions;
var arr_nevd_elimated_columns;
var arr_nevd_elimated_rows;
var arr_nevd_elimated_regions;
var i_nevd_size;
var i_nevd_field_no;
var obj_nevd_placeholder;
var i_nevd_field_cnt;

var theDiff=0;

function nevd_init(i_size) {
obj_nevd_placeholder = document.getElementById('nevd_gameplate')
i_nevd_size= i_size;
i_nevd_field_no= Math.pow(i_nevd_size, 4);
arr_nevd_solutions= nevd_init_solution_array();
nevd_init_html();
nevd_init_arrays();
nevd_reset_solutions();
}
	
function nevd_init_arrays() {
arr_nevd_index= new Array();
arr_nevd_columns= new Array();
arr_nevd_rows= new Array();
arr_nevd_regions= new Array();
for (i = 0; i < i_nevd_field_no; i++) {
column_index = i % (i_nevd_size * i_nevd_size);
row_index = Math.floor( i / (i_nevd_size * i_nevd_size) );
region_index = (Math.floor(row_index / i_nevd_size)) * i_nevd_size + Math.floor(column_index / i_nevd_size);
arr_nevd_index[i] = Array(column_index, row_index, region_index);
if (typeof(arr_nevd_columns[column_index])!= 'object') arr_nevd_columns[column_index]= new Array();
if (typeof(arr_nevd_rows[row_index])!= 'object') arr_nevd_rows[row_index]= new Array();
if (typeof(arr_nevd_regions[region_index])!= 'object') arr_nevd_regions[region_index]= new Array();
arr_nevd_columns[column_index][arr_nevd_columns[column_index].length]= i;
arr_nevd_rows[row_index][arr_nevd_rows[row_index].length]= i;
arr_nevd_regions[region_index][arr_nevd_regions[region_index].length]= i;
}}
	
function nevd_init_html() {
str_html = '<form><table cellpadding="0" cellspacing="0" class="nevdtable" border="0">';
for (i = 0; i < i_nevd_size * i_nevd_size; i++) {
if (i > 0 && i % i_nevd_size == 0) {
str_html += '<tr><td colspan="' + (i_nevd_size * i_nevd_size + i_nevd_size - 1) + '" class="hsep"></td></tr>'
}
str_html += '<tr>';
for (row = 0; row < i_nevd_size * i_nevd_size; row++) {
if (row > 0 && row % i_nevd_size == 0) {
str_html += '<td class="vsep"></td>'
}
i_field_index = i * i_nevd_size * i_nevd_size + row;
str_html +='<td><input type="text" class="nevd_field" onkeydown="old_val = this.value" onkeyup="nevd_input_change(true, ' + i_field_index + ', this.value)" onfocus="nevd_field_hightlight(' + i_field_index + ')" onblur="nevd_field_blur(' + i_field_index + ')" /></td>';
}
str_html += '</tr>';
}
str_html += '</table>';
obj_nevd_placeholder.innerHTML = str_html;
arr_nevd_input_fields = obj_nevd_placeholder.getElementsByTagName('input');
}
	
function nevd_init_solution_array() {
var arr_fields = new Array(i_nevd_field_no);
for (var i = 0; i < i_nevd_field_no; i++) {
var arr_solutions = new Array();
for (a = 0; a < i_nevd_size * i_nevd_size; a++) { arr_solutions[a] = a; }
arr_fields[i] = [arr_solutions, false];
}
return arr_fields; }

function nevd_create_do(i_filled_fields_fac) {
var bol_game_solvable = false;
var i_filled_fields= Math.pow(i_nevd_size, 3) + Math.round(i_nevd_size * i_filled_fields_fac / 10);
var i_min_filled_fields= 1;
while (!bol_game_solvable) {
nevd_init_arrays();
arr_nevd_solutions= nevd_init_solution_array();
var i_cnt= 0;
var arr_empty_fields= new Array(i_nevd_field_no);
var arr_filled_fields= new Array();
for (i = 0, i_length = arr_empty_fields.length; i < i_length; i++) arr_empty_fields[i] = i;
while (
i_cnt < i_min_filled_fields && nevd_eliminate(true)) {
i_rnd_field_index = nevd_random(0, arr_empty_fields.length);
i_field_index = arr_empty_fields[i_rnd_field_index];
i_rnd_number_solu_index= nevd_random(0, arr_nevd_solutions[i_field_index][0].length - 1);
i_rnd_number_put_in_field= arr_nevd_solutions[i_field_index][0][i_rnd_number_solu_index];
arr_nevd_solutions[i_field_index][0] = [i_rnd_number_put_in_field];
arr_filled_fields[arr_filled_fields.length] = i_field_index;
arr_empty_fields = nevd_array_delete(arr_empty_fields, i_rnd_field_index);
nevd_eliminate_solution(i_field_index, i_rnd_number_put_in_field, true);
i_cnt++;
if (i_cnt == i_min_filled_fields && !(bol_game_solvable = nevd_solve(true, true))) i_min_filled_fields++;
}
}
var arr_filled_fields_new = arr_filled_fields;
var i_filled_cnt = 0;
var bol_donttesttherest = false;
for (var i = 0, i_length = arr_filled_fields.length; i < i_length; i++) {
if (arr_filled_fields_new.length <= i_filled_fields) {
bol_donttesttherest = true;
}
var arr_old = arr_nevd_solutions;
var arr_filled_fields_old = arr_filled_fields_new;
if (!bol_donttesttherest) {
arr_filled_fields_new = nevd_array_delete_value(arr_filled_fields_new, arr_filled_fields[i]);
arr_nevd_solutions = nevd_init_solution_array();
for (var a = 0, a_length = arr_filled_fields_new.length; a < a_length; a++) {
arr_nevd_solutions[arr_filled_fields_new[a]][0] = arr_old[arr_filled_fields_new[a]][0];
nevd_eliminate_solution(arr_filled_fields_new[a], arr_old[arr_filled_fields_new[a]][0][0], true);
}
}
if (bol_donttesttherest || !nevd_solve(true)) {
arr_nevd_solutions = arr_old;
arr_filled_fields_new = arr_filled_fields_old;
arr_nevd_input_fields[arr_filled_fields[i]].value = nevd_translate_input(arr_nevd_solutions[arr_filled_fields[i]][0][0], true);
arr_nevd_input_fields[arr_filled_fields[i]].disabled = true;
arr_nevd_input_fields[arr_filled_fields[i]].style.color = '#002200';
}
}
arr_nevd_solutions = nevd_init_solution_array();
nevd_eliminate_human(true);
theMessage('<b>NeverDoku rules</b>: fill <u>all</u> empty squares so that the numbers 1 to 9 appear once in each row, column and 3x3 box.'); }
	
function nevd_array_delete(arr_perfom_in, i_member) {
var arr_return = new Array();
for (i = 0, i_length = arr_perfom_in.length; i < i_length; i++) {
if (i != i_member) arr_return[arr_return.length] = arr_perfom_in[i];
} return arr_return; }

function nevd_array_delete_value(arr_perfom_in, i_value) {
var arr_return = new Array();
for (i = 0, i_length = arr_perfom_in.length; i < i_length; i++) {
if (arr_perfom_in[i] != i_value) arr_return[arr_return.length] = arr_perfom_in[i];
} return arr_return; }
	
function nevd_random(i_from, i_to) { return Math.floor(Math.random() * (i_from - i_to + 1) + i_to); }

function nevd_reset_solutions() {
if (arguments.length == 0) {
for (i = 0; i < i_nevd_field_no; i++) {
i_input_val = arr_nevd_input_fields[i].value;
if (i_input_val != '') {
arr_nevd_solutions[i][0] = [nevd_translate_input(i_input_val, false)];
}}} else {
i_input_val = arr_nevd_input_fields[arguments[0]].value;
if (i_input_val != '') {
arr_nevd_solutions[arguments[0]][0] = [nevd_translate_input(i_input_val, false)];
}}}
	
function nevd_solve(bol_quiet, bol_skip_elimination) {
if (!bol_quiet && isNaN(i_nevd_size)) { return; }
bol_nevd_solved = (bol_skip_elimination || nevd_eliminate(bol_quiet));
for (i = 0; i < i_nevd_field_no && bol_nevd_solved; i++) {
if (arr_nevd_solutions[i][0].length != 1) { bol_nevd_solved = false;
} else if (!bol_quiet) { arr_nevd_input_fields[i].value = nevd_translate_input(arr_nevd_solutions[i][0], true);
}}
if (!bol_nevd_solved && !bol_quiet) {
} else if (!bol_quiet) {
} return bol_nevd_solved; }

function nevd_eliminate(bol_quiet) { return nevd_eliminate_do(arr_nevd_columns, bol_quiet) && nevd_eliminate_do(arr_nevd_rows, bol_quiet) && nevd_eliminate_do(arr_nevd_regions, bol_quiet); }
	
function nevd_eliminate_do(arr_perform_in, bol_quiet) {
for (i = 0, i_length = arr_perform_in.length; i < i_length; i++) {
var arr_solutions_first_occur = new Array(i_nevd_size * i_nevd_size);
var arr_count = new Array(i_nevd_size * i_nevd_size);
for (a = 0, a_length = arr_count.length; a < a_length; a++) arr_count[a] = 0;
var arr_perform_in_i = arr_perform_in[i];
for (a = 0, a_length = arr_perform_in_i.length; a < a_length; a++) {
var arr_perform_in_i_a = arr_perform_in_i[a];
if (!arr_nevd_solutions[arr_perform_in_i_a][1] && arr_nevd_solutions[arr_perform_in_i_a][0].length == 1) {
nevd_eliminate_solution(arr_perform_in_i_a, arr_nevd_solutions[arr_perform_in_i_a][0][0], bol_quiet);
return nevd_eliminate_do(arr_perform_in, bol_quiet);
}
for (b = 0, b_length = arr_nevd_solutions[arr_perform_in_i_a][0].length; b < b_length; b++) {
i_this_solution = arr_nevd_solutions[arr_perform_in_i_a][0][b];
arr_count[i_this_solution]++;
if (arr_count[i_this_solution] == 1) arr_solutions_first_occur[i_this_solution] = arr_perform_in_i_a;
}
}
for (a = 0, a_length = arr_count.length; a < a_length; a++) {
if (arr_count[a] == 0) {
return false;
} else if (arr_count[a] == 1 && !arr_nevd_solutions[arr_solutions_first_occur[a]][1]) {
nevd_eliminate_solution(arr_solutions_first_occur[a], a, bol_quiet);
return nevd_eliminate_do(arr_perform_in, bol_quiet);
} else {}}} return true; }
	
function nevd_eliminate_solution(i_elim_index, i_number_to_remove, bol_quiet) {
arr_nevd_solutions[i_elim_index][0]= [i_number_to_remove];
arr_nevd_solutions[i_elim_index][1]= true;
!bol_quiet ? arr_nevd_input_fields[i_elim_index].value = nevd_translate_input(i_number_to_remove, true) : false;
nevd_eliminate_solution_do(i_elim_index, i_number_to_remove, arr_nevd_columns[arr_nevd_index[i_elim_index][0]], arr_nevd_solutions);
nevd_eliminate_solution_do(i_elim_index, i_number_to_remove, arr_nevd_rows[arr_nevd_index[i_elim_index][1]], arr_nevd_solutions);
nevd_eliminate_solution_do(i_elim_index, i_number_to_remove, arr_nevd_regions[arr_nevd_index[i_elim_index][2]], arr_nevd_solutions);
}
	
function nevd_eliminate_solution_do(i_elim_index, i_number_to_remove, arr_perform_in) {
for (i = 0, i_length = arr_perform_in.length; i < i_length; i++) {
i_index = arr_perform_in[i];
if (i_index != i_elim_index) {
arr_new_array = new Array();
for (a = 0, a_length = arr_nevd_solutions[i_index][0].length; a < a_length; a++) {
var i_this_solution = arr_nevd_solutions[i_index][0][a];
i_this_solution != i_number_to_remove ? arr_new_array[arr_new_array.length] = i_this_solution : false;
} arr_nevd_solutions[i_index][0] = arr_new_array; }}}

function nevd_eliminate_human(bol_start_over, i_index, i_value) {
if (bol_start_over) {
arr_nevd_solutions = nevd_init_solution_array();
nevd_reset_solutions();
for (j = 0, j_length = i_nevd_field_no; j < j_length; j++) {
if (arr_nevd_solutions[j][0].length == 1) {
nevd_eliminate_solution(j, arr_nevd_solutions[j][0][0], true);
}}} else {
nevd_eliminate_solution(i_index, i_value, true);
}}
	
function nevd_input_change(bol_start_over, i_index, i_value) {

if (nevd_validate_input(i_value) || i_value == '') {
nevd_eliminate_human(bol_start_over, i_index, nevd_translate_input(i_value, false));
nevd_update_field_info(i_index);
if (i_value != '') {
nevd_test_input(i_index);
}
} else if (i_value != '') {
arr_nevd_input_fields[i_index].value = old_val;
}
i_nevd_field_cnt = 0;
for (i = 0; i < i_nevd_field_no; i++) {
if (arr_nevd_input_fields[i].value != '') {
i_nevd_field_cnt++;
}
}
if (i_nevd_field_cnt == i_nevd_field_no && nevd_solve(true)) {
theMessage('Congratulations! This current puzzle is solved.');
updateScore(999999999);
} else if (i_nevd_field_cnt == i_nevd_field_no) {
theMessage('Sorry, the solution enterred for this puzzle is incorrect...');
}}

function nevd_test_input(i_index) {
//if (nevd_solve(true)) {
//arr_nevd_input_fields[i_index].style.backgroundColor = '#00EE00';
//theMessage('The number enterred is <font color=#00EE00>valid</font>.');
//} else {
//arr_nevd_input_fields[i_index].style.backgroundColor = '#EE0000';
//theMessage('The number enterred is <font color=#EE0000>invalid</font>.');
//}
}
arr_nevd_number_to_char = new Array(1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F', 'G')
arr_nevd_char_to_number = new Array(arr_nevd_number_to_char.length);
for (i = 0; i < arr_nevd_number_to_char.length; i++) {
arr_nevd_char_to_number[arr_nevd_number_to_char[i].toString()] = i;
}

function nevd_translate_input(mixed_input, bol_in_out) { if (bol_in_out) { return arr_nevd_number_to_char[mixed_input]; } else { return arr_nevd_char_to_number[mixed_input.toString()]; }}
function nevd_validate_input(s_input) {
for (i = 0, i_length = i_nevd_size * i_nevd_size; i < i_length; i++) { if (s_input == arr_nevd_number_to_char[i]) return true;
} return false; }
function nevd_field_fellows(i_index) { return arr_nevd_columns[arr_nevd_index[i_index][0]].concat(arr_nevd_rows[arr_nevd_index[i_index][1]], arr_nevd_regions[arr_nevd_index[i_index][2]]); }
	
function nevd_field_hightlight(i_index) {
arr_member_of = nevd_field_fellows(i_index);
for (i = 0; i < arr_member_of.length; i++) {
if (arr_member_of[i] != i_index) arr_nevd_input_fields[arr_member_of[i]].style.backgroundColor = '#FFCC00';
}
arr_nevd_input_fields[i_index].style.backgroundColor = '#FF9900';
nevd_update_field_info(i_index);
}

function nevd_field_blur(i_index) {
arr_member_of = nevd_field_fellows(i_index);
for (i = 0; i < arr_member_of.length; i++) {
arr_nevd_input_fields[arr_member_of[i]].style.backgroundColor = '#FFFFFF';
}
nevd_update_field_info(-1); }
	
function nevd_update_field_info(i_index) {
var str_html = '';
nevd_eliminate_human(true, i_index, true);
if (i_index > -1) {
this_solution = arr_nevd_solutions[i_index][0];
for (i = 0, i_length = this_solution.length; i < i_length; i++) {

switch(theDiff) {
case 0:
str_html += '<input type="text" class="nevd_field" value="' + nevd_translate_input(this_solution[i], true) + '" style="margin-bottom: 4px;" /> ';
break;
case 1:
str_html += '<input type="text" class="nevd_field" value="?" style="margin-bottom: 4px;" /> ';
break;
case 2:
str_html = "<b>Hard Mode</b>: Solutions are hidden!";
break;
default: break; }

}
}
document.getElementById('nevd_field_info').innerHTML = str_html;}
	
function nevd_print(obj_to_print) {
if (isNaN(i_nevd_size)) {
return;
}
var obj_noprint = document.getElementById('nevd_noprint');
var obj_body = document.getElementsByTagName('body');
obj_noprint.style.display = 'none';
obj_temp_print = document.createElement('div');
obj_temp_print.innerHTML = obj_to_print.innerHTML;
var obj_old_plate = obj_temp_print.getElementsByTagName('input');
for (i = 0; i < obj_old_plate.length; i++) {
obj_old_plate[i].value = arr_nevd_input_fields[i].value;
}
obj_temp_print.style.display = 'block';
obj_body[0].appendChild(obj_temp_print);
window.print();
obj_body[0].removeChild(obj_temp_print);
obj_noprint.style.display = 'block'; }

function nevd_format_number(i_no) { if (i_no < 10) { return '0' + i_no; } else { return i_no; } }
function theMessage(str_mesg) { document.getElementById('theMessage').innerHTML = str_mesg; }

function easyGame() { theDiff=0; nevd_init_arrays(); nevd_init(3); nevd_create_do(20); var thediv = document.getElementById('startDiv'); thediv.style.display = 'none'; thediv=document.getElementById('playDiv'); thediv.style.display = 'block'; }
function averageGame() { theDiff=1; nevd_init_arrays(); nevd_init(3); nevd_create_do(10); var thediv = document.getElementById('startDiv'); thediv.style.display = 'none'; thediv=document.getElementById('playDiv'); thediv.style.display = 'block'; }
function hardGame() { theDiff=2; nevd_init_arrays(); nevd_init(3); nevd_create_do(-10); var thediv = document.getElementById('startDiv'); thediv.style.display = 'none'; thediv=document.getElementById('playDiv'); thediv.style.display = 'block'; }