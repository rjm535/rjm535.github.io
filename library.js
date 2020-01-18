function stopEnterKey(evt) {
    var evt = (evt) ? evt : ((event) ? event : null);
    var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
    if ((evt.keyCode == 13) && (node.type == "text")) {
        saveField();
        return false;
    }
}
document.onkeypress = stopEnterKey;

function msToTime(s) {
    function pad(n, z) {
        z = z || 2;
        return ('00' + n).slice(-z);
    }

    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return pad(hrs) + 'h:' + pad(mins) + 'm:' + pad(secs) + 's';
}

function myTimer() {
    var d = new Date();
    if(current_item) {
        document.getElementById("current_item").innerHTML = todo_list[current_item]["name"] 
                                                            + " --  "
                                                            + msToTime(new Date() - start_time);
    }
}
var myTimer = setInterval(myTimer, 1000);

var todo_list = window.localStorage.todo_list ? JSON.parse(window.localStorage.todo_list) : [];
var deleted_list = window.localStorage.deleted_list ? JSON.parse(window.localStorage.deleted_list) : [];
displayLists();
var current_item;
var start_time;

function saveField() {
    var value = document.getElementById("field");
    if(value.value != "") {
        todo_list.push({"name" : value.value, "time" : 0})
        window.localStorage.todo_list = JSON.stringify(todo_list)
        //displayList(todo_list);
        displayLists();
        value.value = "";
    }
}

function softDeleteItem(target){
    if(target.parentElement.id == current_item) {
        current_item = null;
        document.getElementById("current_item").innerHTML = "Current Item...";
        start_time = null;
    }
    deleted_list.push(todo_list[target.parentElement.id])
    if(todo_list.length > 1) {
        todo_list.splice(target.parentElement.id, 1);
    } else {
        todo_list = [];
    }
    window.localStorage.todo_list = JSON.stringify(todo_list);
    window.localStorage.deleted_list = JSON.stringify(deleted_list);
    displayLists();
}

function hardDeleteItem(target){
    if(deleted_list.length > 1) {
        deleted_list.splice(target.parentElement.id, 1);
    } else {
        deleted_list = [];
    }
    window.localStorage.deleted_list = JSON.stringify(deleted_list);
    displayLists();
}

function startItem(target) {
    if(start_time) {
        todo_list[current_item]["time"]  +=  (new Date()) - start_time;
        start_time = new Date();
    }
    else {
        start_time = new Date();
    }
    current_item = target.parentElement.id;
    document.getElementById("current_item").innerHTML = todo_list[target.parentElement.id]["name"] 
                                                        + "  --  "
                                                        + msToTime(0);
    window.localStorage.todo_list = JSON.stringify(todo_list);
    displayLists(todo_list); 
}

function displayLists() {
    temp_div = '<ul style="list-style-type:none">'
    for(i in todo_list) {
        if(i == current_item) {
            temp_div += '<li id="' + i
                     + '">'
                     + '<button onclick="softDeleteItem(this)">x</button>'
                     + todo_list[i]["name"] + " --  " + msToTime(todo_list[i]["time"])
                     + '</li>';
        }
        else {
            temp_div += '<li id="' + i
                     + '">'
                     + '<button onclick="softDeleteItem(this)">x</button>'
                     + todo_list[i]["name"] + " -- " +  msToTime(todo_list[i]["time"])
                     + '<button onclick="startItem(this)">Start</button>'
                     + '</li>';
        }
    }
    temp_div += '</ul>'
    document.getElementById('todo_list').innerHTML = temp_div
    temp_div = '<ul style="list-style-type:none">'
    for(i in deleted_list) {
        temp_div += '<li id="' + i
                 + '">'
                 + '<button onclick="hardDeleteItem(this)">x</button>'
                 + deleted_list[i]["name"] + " -- " +  msToTime(deleted_list[i]["time"])
                 + '</li>';
    }
    temp_div += '</ul>'
    document.getElementById('completed_list').innerHTML = temp_div
}
