const URL="http://clark.nazocollection.com/if/othello_api.php"
const playerName="Player";//Sample
const password="Password";//Sample

Can_click=true;

function Set_osero_view(x,y,v){
    let td=$(`#osero_${String(y)+String(x)}`);
    if(v==1){
        td.text("●")
    }else if(v==2){
        td.text("〇")
    }else{
        td.text("□")
    }
}

function request(v,f){
    const query_params = new URLSearchParams(v); 
    fetch(`${URL}?` + query_params,{
        method: 'GET'
    })
    .then(f)
    .catch(error => {
        console.error('ERRO', error);
    });;
}

function onclick(x,y){

}

$(document).ready(function(){
    let osero=$(".osero");
    for(let y=0;y<8;y++){
        osero.append(`<tr id="osero_${String(y)}">`)
        let tr=$(`#osero_${String(y)}`)
        for(let x=0;x<8;x++){
            tr.append(`<td id="osero_${String(y)+String(x)}"></td>`)
            //let td=$(`#osero_${String(y)+String(x)}`)
            Set_osero_view(x,y,0)
        }
    }
    Set_osero_view(3,3,1)
    Set_osero_view(4,4,1)
    Set_osero_view(4,3,2)
    Set_osero_view(3,4,2)
    request({
        "STATUS":"CONNECT",
        "GAME":"OTHELLO",
        "CLIENT":playerName,
        "PASS":password
    },function(v){
        console.log(v);
        v.text().then(function (text) {
            console.log(text);
          });
          v.blob().then(function (text) {
            console.log(text);
          });
    })
});