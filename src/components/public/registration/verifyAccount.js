import React, {Component } from 'react';
import companyLogo from '../../../imagens/herramienta.png';
import axios from 'axios';
const jwt = require('jsonwebtoken');
const configData = require('../../../config.json');

export default class VerifyAccount extends Component{
    constructor(props){
        super(props);
        this.state = {
            account: '',
            isVerified: false, 
            message_err: '',
            message_success: '',
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

                await axios.post(configData.serverUrl + '/users/verify/update/'+decoded.id)
                    .then(res => {console.log('usuario actualizado')})
                    .catch(erro => console.log(erro))                   
                return decoded;

            }
        })       
        this.setState({
            account: account,
            isVerified: true
        })
    }

    handleActions = () => {
        if(!this.state.isVerified){
            return (
                <div id="loading"  className="form-group col-md-12 text-center">
                    <div >
                        <span className="spinner-border" role="status"> </span> Verificando Datos...
                    </div>
                </div>
            )
        }
        if(this.state.account.id){
            return (
                <div className="activation">
                    <div className="form-group col-md-12 text-center">
                        <div className="msgactivacion alert alert-success" role="alert"><b>Cuenta Activada</b> Su cuenta esta verificada y activada por un mes de prueba.</div>
                    </div>
                    <div className="form-group col-md-12  text-center">
                        <button id="iniciarsession" type="button" onClick={this.handleIniciarSession} className="btn btn-warning m-1 col-md-4">
                            Iniciar Sessión
                        </button>
                    </div>
                </div>
            )
        }
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

    handleReenviarToken = () => {
        document.querySelector('.msgactivacion').setAttribute('class','msgactivacion alert alert-success');
        document.querySelector('.msgactivacion').innerHTML = '<b>Token Reenviado</b> Verifique su correo.';
        document.querySelector('#reenviartoken').remove();
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
                                    <h3 className="text-center pt-2">Verificacion de Cuenta</h3>
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