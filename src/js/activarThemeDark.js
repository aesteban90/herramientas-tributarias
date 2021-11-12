export function getStylesDark(){
    let node = document.createElement("style");
    const textCSS = "/*THEME-DARK*/.form-control:disabled{background-color:#56595c;color:#d1d2d3!important}.react-datepicker__input-container input,body{background-color:#202020!important;color:#d1d2d3!important}.dropdown{background-color:var(--bg)!important}.navbar{background-color:#202020!important;background:0 0;border-bottom:1px solid #3b3a3a!important}.icon-button{background-color:#56595c!important}.card,.form-control,.react-datepicker__input-container input{border:1px solid #3b3a3a!important}.card-body,.css-1n7v3ny-option{background-color:#262525!important}.card,.card-header,.list-group-item,.modalContainer{background-color:#262525!important;border:1px solid #3b3a3a!important;color:#d1d2d3!important}.form-control:enabled{background-color:#262525!important;color:#d1d2d3!important}.css-2b097c-container>div,.page:not(.active)>a,.pagination>.disabled>a,.pagination>.first>a,.pagination>.last>a,.pagination>.next>a,.pagination>.pageNumbers>a,.pagination>.prev>a{background-color:#262525!important;color:#d1d2d3!important;border:1px solid #3b3a3a!important}.css-2b097c-container>div>div>div,.titleCloseBtn button{color:#d1d2d3!important}.css-2b097c-container>div:nth-child(3)>div>div:hover{background-color:#676b6e!important}.css-1n7v3ny-option{background-color:#676b6e!important}.btn-light{background-color:#676b6e!important;border-color:#676b6e!important;color:#d1d2d3!important}.btn-light:hover{filter:brightness(1.2);color:var(--text-color)}.container .nav-tabs{border-color:#676b6e}.container .nav-tabs a{color:#dadce1;border-color:#676b6e}.container .nav-tabs .nav-link.active{background-color:#676b6e;color:#dadce1;border-color:#676b6e}.container .nav-tabs a:hover{color:#dadce1}";
    let textnode = document.createTextNode(textCSS);
    node.appendChild(textnode);

    document.querySelectorAll('style').forEach((item) => {
        if(item.innerText.indexOf('THEME-DARK')<0)document.querySelector('head').append(node);
    });
}

export function cleanStylesDark(){
    document.querySelectorAll('style').forEach((item) => {
        if(item.innerText.indexOf('THEME-DARK')>0)item.remove()
    });
}
