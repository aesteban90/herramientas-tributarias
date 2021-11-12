import React, {Component } from 'react';
import companyLogo from '../../../imagens/herramienta.png';
import axios from 'axios';
const jwt = require('jsonwebtoken');
const configData = require('../../../config.json');

export default class ReestablecerPassword extends Component{
    constructor(props){
        super(props);
        this.state = {
            account: '',
            password: '',
            passwordretry: '',
            message_err: '',
            message_success: ''
        }   
    }    

    async componentDidMount(){
        const key = configData.JWTKEY;
        const token = this.props.token;
        const tokenReg = this.props.tokenReg;
        const account = await jwt.verify(token, key, async function(err, decoded) {       
            if (err && err.name === "TokenExpiredError") {
                return await jwt.verify(tokenReg, key, async function(err1, decoded1) {       
                    return decoded1;
                })
            }else{
                /*await axios.post(configData.serverUrl + '/users/verify/update/'+decoded.id)
                    .then(res => {console.log('usuario actualizado')})                   
                */
                return decoded;
            }
        })       
        this.setState({
            account: account
        })
    }

    setRegPasswordConfirm = (e) => {
        this.setState({password: e.target.value})
        this.setRegPasswordCompare();
    }
    setRegPasswordRetryConfirm = (e) => {
        this.setState({passwordretry: e.target.value})
        this.setRegPasswordCompare();
    }
    setRegPasswordCompare = () => {
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

    handleOpenIniciarSession = () =>{
        window.location.href = "/";
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
            email: this.state.account.email,
            password : this.state.password
        }
        await axios.post(configData.serverUrl + '/users/reestablecerPassword/',user)
            .then(res => {
                if(res.data.success){this.setState({ message_success: res.data.message})  
                }else{ this.setState({message_err: res.data.message})}
            })
    }

    handleActions = () => {
        if(this.state.account.id){
            return (
                <div className="activation">
                    <form action="" method="" onSubmit={this.handleSubmit}>
                        <div className="form-group row">
                            <label className="col-md-4 col-form-label text-md-right">Password</label>
                            <div className="col-md-6">
                                <input id="regpass" type="password" onChange={this.setRegPasswordConfirm} className="form-control" required />
                            </div>                                                                                  
                        </div>
                        <div className="form-group row">
                            <label className="col-md-4 col-form-label text-md-right">Confirmar Password</label>
                            <div className="col-md-6">
                                <input id="regpassretry" type="password" onChange={this.setRegPasswordRetryConfirm} className="form-control" required />
                                <span id="conf-pass-error" className="validation-error"></span>
                                <span id="conf-pass-confirm" className="validation-confirm"></span>
                            </div>                                                                                  
                        </div>
                        <div className="form-group col-md-12 text-center">
                            <button type="submit" className="btn btn-warning m-1 col-md-5">
                                Guardar
                            </button>  
                        </div>
                        <div className="form-group col-md-12 text-center">
                            {this.state.message_success && 
                                <div className="msgactivacion-1 alert alert-success" role="alert"><b>{this.state.message_success}</b>
                                    <a style={{color:'#0f5132'}} href="#" onClick={this.handleOpenIniciarSession}> Inicie Session Aqui!</a>    
                                </div>
                            }
                            {this.state.message_err && <div className="msgactivacion-1 alert alert-warning" role="alert"><b>{this.state.message_err}</b></div>}
                        </div>
                    </form>
                </div>
            )
        }else{
            return (
                <div className="activation">
                    <div className="form-group col-md-12 text-center">
                        <div className="msgactivacion alert alert-warning" role="alert"><b>Token Expirado</b> Ha tardado mas de 10 minutos en activar su cuenta.</div>
                    </div>
                    <div className="form-group col-md-12  text-center">
                        <button id="reenviartoken" type="button" onClick={this.handleReenviarToken} className="btn btn-warning m-1 col-md-4">
                            Reenviar Token
                        </button>   
                    </div>
                </div>
            )
        }        
    }

    handleReenviarToken = () => {
        axios.post(configData.serverUrl + '/users/reenviartoken',{account:this.state.account})
    }
    handleIniciarSession = () => {
        window.location = "/"
    }
    render(){             
        return(
            <div id="Verify">            
                <div className="container">
                    <div className="row justify-content-center space-pt--r100 space-pb--r100">
                        <div className="col-md-6">
                            <div className="iniciarsession login-card card mt-5">
                                <div className="card-body">                                
                                    <h3 className="text-center pt-2"><img alt="" src={companyLogo} /> Herramientas Tributarias</h3>
                                    <h3 className="text-center pt-2">Reestablecer Contraseña</h3>
                                    <br/>
                                    {this.handleActions()}                                     
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}