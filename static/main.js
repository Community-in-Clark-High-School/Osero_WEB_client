const URL="api"
const playerName="Dummy";
const password="Dummy";

var connect_id="";
var Game_id="";
var Can_click=true;
var isFirst=true;
var TURN=1;
var OnClick=false;

function Set_osero_view(x,y,v){
    let td=$(`#osero_${String(y)+String(x)}`);
    if(v==1){
        td.text("●")
    }else if(v==2){
        td.text("〇")
    }else{
        td.text("　")
    }
}

function request(v,f){
    const query_params = new URLSearchParams(v); 
    fetch(`${URL}?` + query_params,{
        method: 'GET',
        headers: {
            'Content-Type': 'text/plain'
        },
        credentials: 'omit'
    })
    .then(f)
    .catch(error => {
        console.error('ERRO', error);
    });;
}

function onclick(x,y){
    if(!OnClick)
        return;
    OnClick=false;
    request({
        "STATUS":"PLAY",
        "CON_ID":connect_id,
        "GAME_ID":Game_id,
        "TURN":TURN,
        "MOVE":String(x)+String(y)
    },function(v){
        v.text().then(function (text) {
            OnClick=true;
            let temp=text.split(" ");
            if(temp[0]=="OK"){
                TURN++;
                Set_osero_view_all(temp[3]);
                ENEMY_TURN_LOOP_request();
            }else if(temp[0]=="NG"){
                return;
            }
        });
    })  
}

function Set_osero_view_all(v){
    for(let y=0;y<8;y++){
        for(let x=0;x<8;x++){
            let t=v[8*y+x];
            if(t=="B"){
                Set_osero_view(x,y,1);
            }else if(t=="W"){
                Set_osero_view(x,y,2);
            }else{

            }
        }
    }

}

function ENEMY_TURN_LOOP_request(){
                    
    request({
        "STATUS":"WAIT",
        "CON_ID":connect_id,
        "GAME_ID":Game_id,
        "TURN":TURN+1,
    },function(v){
        v.text().then(function (text) {
            let temp=text.split(" ");
            console.log(temp)
            if(temp[0]=="OK"){
                TURN++;
                Set_osero_view_all(temp[4]);
            }else{
                setTimeout("ENEMY_TURN_LOOP_request()",800);
            }
        });
    });

}

function BEGIN_LOOP_request(){
                    
    $("#info_Status").text("対戦相手を待ち中...");
    request({
        "STATUS":"BEGIN",
        "CON_ID":connect_id
    },function(v){
        v.text().then(function (text) {
            let temp=text.split(" ");
            console.log(temp)
            if(temp[0]=="OK"){
                Game_id=temp[1];
                if(temp[2]=="YES")
                {
                    isFirst=true
                }else{
                    isFirst=false;
                }
                OnClick=true;
                $("#info_Status").text("対戦中...");
                $("#info_ENEMY_NAME").text("対戦相手:"+temp[4]);
                if(isFirst){
                    $("#info_MY_TURN").text("あなたは黒番です");
                }else{
                    $("#info_MY_TURN").text("あなたは白番です");
                    ENEMY_TURN_LOOP_request();
                }
            }else{
                setTimeout("BEGIN_LOOP_request()",800);
            }
        });
    });

}

$(document).ready(function(){
    let osero=$(".osero");
    for(let y=0;y<8;y++){
        osero.append(`<tr id="osero_${String(y)}">`)
        let tr=$(`#osero_${String(y)}`)
        for(let x=0;x<8;x++){
            tr.append(`<td id="osero_${String(y)+String(x)}"></td>`)
            let td=$(`#osero_${String(y)+String(x)}`)
            let x2=x;
            let y2=y;
            td.click(function(){
                onclick(x2,y2);
            });
            td.addClass("one_osero");
            Set_osero_view(x,y,0)
        }
    }
    Set_osero_view(4,3,1)
    Set_osero_view(3,4,1)
    Set_osero_view(4,4,2)
    Set_osero_view(3,3,2)
    $("#info_Status").text("接続中...");
    request({
        "STATUS":"CONNECT",
        "GAME":"OTHELLO",
        "CLIENT":playerName,
        "PASS":password
    },function(v){
        v.text().then(function (text) {
            let temp=text.split(" ");
            console.log(temp)
            if(temp[0]=="OK"){
                connect_id=temp[1];
                BEGIN_LOOP_request();
            }else{
                alert("ERROR "+text);
            }
        });
    })
});