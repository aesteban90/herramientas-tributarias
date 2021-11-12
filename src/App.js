import React from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Login from './components/public/registration/login';
import logout from './components/public/registration/logout';
import VerifyAccount from './components/public/registration/verifyAccount';
import ReestablecerPassword from './components/public/registration/reestablecerPassword';
import {Navbar, DropdownMenu, NavItem} from './components/configuraciones/navbar.component';
import {NavbarPublic, DropdownMenuPublic, NavItemPublic} from './components/configuraciones/navbar-public.component';

import Dashboard from './components/public/dashboard.component'
import UserList from './components/configuraciones/user/user-list.component';
import UserCreate from './components/configuraciones/user/user-create.component';
import UserUpdate from './components/configuraciones/user/user-update.component';
import InformanteList from './components/configuraciones/informante/informante-list.component';
import ParentezcoList from './components/configuraciones/parentezco/parentezco-list.component';
import RegimenMatrimonialList from './components/configuraciones/regimen-matrimonial/regimen-list.component';
import BancosList from './components/configuraciones/bancos/bancos-list.component';
import TipoDocumentoIngreso from './components/configuraciones/tipo-documento-ingreso/tpdoc-ingreso-list.component';
import TipoDocumentoEgreso from './components/configuraciones/tipo-documento-egreso/tpdoc-egreso-list.component';
import TipoIngreso from './components/configuraciones/tipo-ingreso/tipo-ingreso-list.component';
import TipoEgreso from './components/configuraciones/tipo-egreso/tipo-egreso-list.component';
import TipoIdentificacion from './components/configuraciones/tipo-identificacion/tipo-identificacion-list.component';
import TipoComprobante from './components/configuraciones/tipo-comprobante/tipo-comprobante-list.component';

import PublicFormularioEgreso from './components/public/formulario-egreso/formulario-egreso-create.component';
import PublicFormularioEgresoUpdate from './components/public/formulario-egreso/formulario-egreso-update.component';
import PublicFormularioIngreso from './components/public/formulario-ingreso/formulario-ingreso-create.component';
import PublicFormularioIngresoUpdate from './components/public/formulario-ingreso/formulario-ingreso-update.component';
import PublicListaRuc from './components/public/tabs-rucs.component';

import useToken from './components/configuraciones/useToken';
import {faCaretDown} from '@fortawesome/free-solid-svg-icons'
import companyLogo from './imagens/herramienta.png';
import './js/utils.js';

const jwt = require('jsonwebtoken');
const configData = require('./config.json');
const key = configData.JWTKEY;
let UserLogueado = {};

export default function App() {
  const { token, theme, setToken } = useToken(); 
  const verify = window.location.pathname.split('/verify').length >= 2;  
  const reestablecerPassword = window.location.pathname.split('/reestrablecer').length >= 2; 
  const tokenVerify = getUrlParameter('token');
  const tokenReg = getUrlParameter('tokenReg');

  if(theme === "dark"){
    require('./css/themeDark.css');
  }
  
  if (!token) {
    console.log('Unauthorized: No token provided');    
  } else {
    jwt.verify(token, key, async function(err, decoded) {
      if (err) {
        console.log('Unauthorized: Invalid token');  
        logout();
      }else{       
        UserLogueado = {
          id: decoded.id,
          name: decoded.nombre_completo,
          rol: decoded.rol,
          nick: decoded.nickname,
          informante: decoded.informante,
          expira: decoded.expira,
        }
      }
    });
  }
   
  const menupublic = () =>{
    return(
      <div id="container">        
          <Router>
            <NavbarPublic>
              <NavItemPublic class="nav-item-logo" image={companyLogo}></NavItemPublic>
              <NavItemPublic class="nav-item-informante"></NavItemPublic>
              <NavItemPublic class="nav-item-export"></NavItemPublic>
              <NavItemPublic id="dropConf" icon={faCaretDown}>
                <DropdownMenuPublic />
              </NavItemPublic>
            </NavbarPublic>
            
            <Route path="/verify/:token" exact component={VerifyAccount} />    
            <Route path="/" exact component={Dashboard} />
            <Route path="/informante" exact component={InformanteList} />      
            <Route path="/formularioIngreso" exact component={PublicFormularioIngreso} />
            <Route path="/formularioIngreso/update/:id" exact component={PublicFormularioIngresoUpdate} />
            <Route path="/formularioEgreso" exact component={PublicFormularioEgreso} />
            <Route path="/formularioEgreso/update/:id" exact component={PublicFormularioEgresoUpdate} />
            <Route path="/rucs/:id" exact component={PublicListaRuc} />
            
          </Router>        
      </div>
    );
  }
  if(verify){    
    return <VerifyAccount token={tokenVerify} tokenReg={tokenReg} />
  }else if(reestablecerPassword){
    return <ReestablecerPassword token={tokenVerify} tokenReg={tokenReg} />
  }else if(!token) {
    return <Login setToken={setToken} />  
  }else if(UserLogueado){
    getInformante();//Obteniendo datos informante
    if(UserLogueado.rol && UserLogueado.rol.includes('ADM')){
      return(
          <div id="container">     
            <Router>
              <Navbar>
                <NavItem class="nav-item-logo" image={companyLogo}></NavItem>
                <NavItem class="nav-item-informante"></NavItem>
                <NavItem class="nav-item-export"></NavItem>
                <NavItem id="dropConf" icon={faCaretDown} >
                  <DropdownMenu />
                </NavItem>
              </Navbar>

              <Route path="/" exact component={Dashboard} />
              <Route path="/usuarios" exact component={UserList} />      
              <Route path="/usuarios/create" exact component={UserCreate} />
              <Route path="/usuarios/update/:id" exact component={UserUpdate} />          
              <Route path="/parentezco" exact component={ParentezcoList} />
              <Route path="/regimen" exact component={RegimenMatrimonialList} />      
              <Route path="/bancos" exact component={BancosList} />       
              <Route path="/tipodocingreso" exact component={TipoDocumentoIngreso} />
              <Route path="/tipodocegreso" exact component={TipoDocumentoEgreso} />
              <Route path="/tipoingreso" exact component={TipoIngreso} />
              <Route path="/tipoegreso" exact component={TipoEgreso} />
              <Route path="/tipoidentificacion" exact component={TipoIdentificacion} />
              <Route path="/tipocomprobante" exact component={TipoComprobante} />

              <Route path="/informante" exact component={InformanteList} />      
              <Route path="/formularioIngreso" exact component={PublicFormularioIngreso} />
              <Route path="/formularioIngreso/update/:id" exact component={PublicFormularioIngresoUpdate} />
              <Route path="/formularioEgreso" exact component={PublicFormularioEgreso} />
              <Route path="/formularioEgreso/update/:id" exact component={PublicFormularioEgresoUpdate} />
              {/* <Route path="/rucs/:id" exact component={PublicListaRuc} /> */}
              <Route path="/rucs" exact component={PublicListaRuc} />
              
            </Router>        
          </div>
      );
    }else{
       return menupublic()
    }
  }else{
     return menupublic()
  }

}

function getInformante(){
  axios.get(configData.serverUrl + "/users/informante/"+UserLogueado.id)
    .then(response => {
      let informante_selected = response.data.ruc +"-"+response.data.div+" | "+ response.data.razonSocial;
      informante_selected += (response.data.periodo ? " | " + response.data.periodo : "");
      document.querySelector('.nav-item-informante span').innerText = informante_selected; 
      UserLogueado.ruc = response.data.rucID;      
    })
    .catch(err => console.log(err))
};

var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

  for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
          return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
      }
  }
  return false;
};

export { UserLogueado};