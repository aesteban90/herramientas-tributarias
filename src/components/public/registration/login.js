import React, { useState } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import companyLogo from '../../../imagens/herramienta.png';
const configData = require('../../../config.json');

async function loginUser(credentials) {    
    return fetch(configData.serverUrl + '/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
}

export default function Login({ setToken }) {    
    const [userName, setUserName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPasssword, setRegPassword] = useState('');
    const [regPasswordRetry, setRegPasswordRetry] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errText, setErrText] = useState('');
    const [form, setForm] = useState("FormIniciarSession");
    const [message, setMessage] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
            email,
            password
        });
        setToken(token);
        
        if(token.type){
            switch (token.type) {
                case 'erruser':
                    document.querySelector('#email-error').innerHTML = token.msg;
                    break;
                case 'errpass':
                    document.querySelector('#pass-error').innerHTML = token.msg;
                    break;
                case 'erraccount':
                    setMessage(<p><b>Active su cuenta:</b> Se ha enviado un correo al email registrado para que pueda activar su cuenta.<b> Expira en 10 minutos</b></p>)
                        
                    //document.querySelector('.msgactivacion').setAttribute('class','msgactivacion alert alert-warning');
                    break;
                default:
                    break;
            }
            localStorage.removeItem('token');
        }
    }    
    const setRegEmailVerify = (value) => {
        setRegEmail(value)
        setErrText('');
    }
    const handleSubmitRegistration = async e => {
        e.preventDefault();
        document.querySelector('#loading div').classList.remove('d-none');
        document.querySelector('#loading button').classList.add('d-none');

        const user = {nombre_completo:userName,email:regEmail,password:regPasssword}
        if(regPasswordRetry === regPasssword){
            axios.post(configData.serverUrl + '/users/registrarse',user)
                .then(res => {
                    if(res.data.message){   
                        document.querySelector('#loading div').classList.add('d-none');
                        document.querySelector('#loading button').classList.remove('d-none');
                        setErrText('El email ya existe!')
                    }else{
                        setUserName('');
                        setRegEmail('');
                        setRegPassword('');
                        setRegPasswordRetry('');
                        setEmail('');
                        setPassword('');  
                        setErrText('');
                        setMessage(<p><b>Active su cuenta:</b> Se ha enviado un correo al email registrado para que pueda activar su cuenta.<b> Expira en 10 minutos</b></p>)
                        handleOpenIniciarSession();                          
                    }
                })
        }            
    }

    const handleSubmitForgotPassword = async e => {
        e.preventDefault();
        const user = {email:email}
        document.querySelector('.btn-enviar-forgot').setAttribute('class','btn-enviar-forgot d-none');
        document.querySelector('.msgactivacion-forgot').setAttribute('class','msgactivacion-forgot alert alert-warning');   
        axios.post(configData.serverUrl + '/users/forgotpassword',user)
            .then(res => {
                if(res.data.message){   
                    setErrText('El email no existe!')
                }else{               
                    setUserName('');
                    setRegEmail('');
                    setRegPassword('');
                    setRegPasswordRetry('');
                    setEmail('');
                    setPassword('');                      
                }
            })
    }

    const setRegPasswordConfirm = (e) => {
        setRegPassword(e.target.value);
        setRegPasswordCompare();
    }
    const setRegPasswordRetryConfirm = (e) => {
        setRegPasswordRetry(e.target.value);
        setRegPasswordCompare();
    }
    const setRegPasswordCompare = () => {
        if(document.querySelector('#regpass').value !== document.querySelector('#regpassretry').value){
            document.querySelector('#conf-pass-error').innerHTML = "Password no coincide!";
            document.querySelector('#conf-pass-confirm').innerHTML = "";
        }else if(document.querySelector('#regpass').value === "" && document.querySelector('#regpassretry').value === ""){
            document.querySelector('#conf-pass-confirm').innerHTML = "";
            document.querySelector('#conf-pass-error').innerHTML = "";
        }else{
            document.querySelector('#conf-pass-confirm').innerHTML = "Password coincide";
            document.querySelector('#conf-pass-error').innerHTML = "";
        }
    }
    
    const handleOpenRegistration = () => {setForm("FormRegistrarse");setUserName('');setRegEmail('');setRegPassword('');setRegPasswordRetry('');}
    const handleOpenIniciarSession = () => {setForm("FormIniciarSession");setEmail('');setPassword('');}
    const handleForgotPassword = () => setForm("FormForgotPassword");

    const formIniciarSession = () => {
        return <div className="iniciarsession login-card card mt-5">
                <div className="card-body">                                
                    <h3 className="text-center pt-2"><img alt="" src={companyLogo} /> Herramientas Tributarias</h3>
                    <h3 className="text-center pt-2">Inicio de Sessión</h3>                    
                    <br/>
                    <form action="" method="" onSubmit={handleSubmit}>
                        <div className="form-group row">
                            <label className="col-md-4 col-form-label text-md-right">Email</label>
                            <div className="col-md-6">
                                <input value={email} id="email" type="text" onChange={e => setEmail(e.target.value)} className="form-control" required />
                                <span id="email-error" className="validation-error"></span>
                            </div>                                            
                        </div>
                        <div className="form-group row">
                            <label className="col-md-4 col-form-label text-md-right">Password</label>
                            <div className="col-md-6">
                                <input value={password}  id="password" type="password" onChange={e => setPassword(e.target.value)} className="form-control" required />
                                <span id="pass-error" className="validation-error"></span>
                                <a href="#" onClick={handleForgotPassword} className="btn aforgot">
                                    Olvide mi password?
                                </a>   
                            </div>                                                                                  
                        </div>
                        <div className="form-group col-md-12  text-center">
                            <button type="submit" className="btn btn-primary m-1 col-md-4">
                                Iniciar Sessión
                            </button>
                            <button type="button" onClick={handleOpenRegistration} className="btn btn-warning m-1 col-md-4">
                                Registrarse
                            </button>                                        
                        </div>
                        {message && 
                            <div className="form-group col-md-12 text-center">
                                <div className="msgactivacion alert alert-warning" role="alert">
                                    {message}
                                </div>
                            </div>
                        }     
                    </form>
                </div>
            </div>
    }

    const formRegistrarse = () => {        
        return  <div className="registrarse login-card card mt-5">
                    <div className="card-body">
                        <h3 className="text-center pt-2"><img alt="" src={companyLogo} /> Herramientas Tributarias</h3>
                        <h3 className="text-center pt-2">Crear Cuenta</h3>
                        <br/>
                        <form action="" method="" onSubmit={handleSubmitRegistration}>
                        <div className="form-group row">
                                <label className="col-md-4 col-form-label text-md-right">Nombre</label>
                                <div className="col-md-6">
                                    <input value={userName} type="text" onChange={e => setUserName(e.target.value)} className="form-control" required />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-md-4 col-form-label text-md-right">Email</label>
                                <div className="col-md-6">
                                    <input value={regEmail} type="text" onChange={e => setRegEmailVerify(e.target.value)} className="form-control" required />
                                    {errText && <span className="validation-error">El email ya existe!</span>}
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-md-4 col-form-label text-md-right">Password</label>
                                <div className="col-md-6">
                                    <input value={regPasssword} id="regpass" type="password" onChange={setRegPasswordConfirm} className="form-control" required />
                                </div>                                                                                  
                            </div>
                            <div className="form-group row">
                                <label className="col-md-4 col-form-label text-md-right">Confirmar Password</label>
                                <div className="col-md-6">
                                    <input value={regPasswordRetry} id="regpassretry" type="password" onChange={setRegPasswordRetryConfirm} className="form-control" required />
                                    <span id="conf-pass-error" className="validation-error"></span>
                                    <span id="conf-pass-confirm" className="validation-confirm"></span>
                                </div>                                                                                  
                            </div>
                            <div id="loading"  className="form-group col-md-12 text-center">
                                <button type="submit" className="btn btn-warning m-1 col-md-5">
                                    Registrarse
                                </button>
                                <div className='d-none'>
                                    <span className="spinner-border" role="status"> </span> Enviando Datos...
                                </div>
                            </div>
                            
                            <div className="form-group col-md-12 text-center">
                                Ya tienes una Cuenta? 
                                <a href="#" className="aforgot" onClick={handleOpenIniciarSession}> Inicie Session</a>    
                            </div>           
                            <div className="credential-error d-none">
                                <div className="body alert alert-danger" role="alert"></div>
                            </div>
                        </form>
                    </div>
                </div>
    }
    const formForgotPassword = () => {
        return <div className="forgotpassword login-card card mt-5">
                <div className="card-body">                                
                    <h3 className="text-center pt-2"><img alt="" src={companyLogo} /> Herramientas Tributarias</h3>
                    <h3 className="text-center pt-2">Olvido su Password?</h3>
                    <br/>
                    <form action="" method="" onSubmit={handleSubmitForgotPassword}>
                        <div className="form-group row">
                            <label className="col-md-4 col-form-label text-md-right">Email</label>
                            <div className="col-md-6">
                                <input value={email} id="email" type="text" onChange={e => setEmail(e.target.value)} className="form-control" required />
                                <span id="email-error" className="validation-error"></span>
                                {errText && <span className="validation-error">El email no existe!</span>}
                            </div>                                            
                        </div> 
                        <div className="btn-enviar-forgot form-group col-md-12  text-center">
                            <button type="submit" className="btn btn-primary m-1 col-md-4">
                                Enviar
                            </button> 
                        </div>
                        <div className="form-group col-md-12 text-center">
                            Ya tienes una Cuenta? 
                            <a href="#" className="aforgot" onClick={handleOpenIniciarSession}> Inicie Session</a>    
                        </div>   
                        <div className="form-group col-md-12 text-center">
                            <div className="msgactivacion-forgot alert alert-warning d-none" role="alert">
                                <b>Atencion:</b> Le enviaremos un email a su cuenta de correo registrada en el sistema.   
                            </div>
                        </div>
                    </form>
                </div>
            </div>
    }

    const formulario = () => {
        if(form === "FormIniciarSession"){
            return formIniciarSession();
        }else if(form === "FormRegistrarse"){
            return formRegistrarse();
        }else if(form === "FormForgotPassword"){
            return formForgotPassword();
        }
    }
    return(
        <div id="login">       
            <div className="container">
                <div className="row justify-content-center space-pt--r100 space-pb--r100">
                    <div className="col-md-6">
                        {formulario()}                        
                    </div>
                </div>
            </div>
        </div>
    )    
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}