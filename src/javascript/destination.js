let nr = document.getElementById("nr").innerText;

function plusFcn(){
    if(nr < 3){
        nr++;
        document.getElementById("nr").innerText = nr;
    }
    else{
        document.getElementById("nr").innerText = "3";
    }
}

function minusFcn(){
    if(nr > 0){
        nr--;
        document.getElementById("nr").innerText = nr;
    }
    else{
        document.getElementById("nr").innerText = "0";
    }
}