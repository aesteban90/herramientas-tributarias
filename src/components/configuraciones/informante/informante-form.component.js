import React, {Component} from 'react';
import axios from 'axios';
import NumberFormat from 'react-number-format'; 
import {UserLogueado} from '../../../App';
import {getDiv} from '../../../js/utils.js'
const configData = require('../../../config.json');

export default class InformanteForm extends Component{
    constructor(props){
        super(props);
        this.state = {  
            idRuc:'',
            ruc:'',
            div:'',
            razonSocial:'',
            user_created:'',
            user_updated:'',
            textButton:'Agregar',
            idUpdate: 'NEW'
        };
    }
    
    //Actualizar Datos
    actualizarDatos = () =>{
        if(this.state.idUpdate !== this.props.idUpdate ){
            this.setState({ idUpdate: this.props.idUpdate});
            if(this.props.idUpdate !== "NEW" && this.props.idUpdate !== "" ){
                axios.get(configData.serverUrl + "/informante/"+this.props.idUpdate)
                .then(response => {
                    this.setState({
                        idRuc: response.data.ruc._id,
                        ruc: response.data.ruc.ruc,
                        div: response.data.ruc.div,
                        razonSocial: response.data.ruc.razonSocial,
                        user_created: UserLogueado.nick,
                        textButton:'Actualizar'
                    })
                })
                .catch(err => console.log(err));
            }else{
                this.setState({
                    ruc:'',
                    div:'',
                    razonSocial:'',
                    user_created: UserLogueado.nick,
                    user_updated: UserLogueado.nick,
                    textButton:'Agregar',
                    idUpdate: this.props.idUpdate
                });
            }
        }
    }

    //Metodo que obtiene cualquier actualizacion de otros componentes donde fue llamado
    componentDidUpdate(){    
        this.actualizarDatos()
    }

    //Metodo que se ejecuta antes del render
    componentDidMount(){
        this.actualizarDatos()
    }

    onChangeRazonSocial = (e) => {
        this.setState({
            razonSocial: e.target.value
        })
    }
    onChangeRuc = (e) => {
        this.setState({
            ruc: e.target.value,
            div: getDiv(e.target.value)
        })
    }
    
    showNotification(isSuccess, err){
        console.log('showNotification');
        document.querySelector('#alert').classList.replace('hide','show');
        if(isSuccess === true){
            document.querySelector('#alert').classList.replace('alert-warning','alert-success');
            document.querySelector('#alert #text').innerHTML = '<strong>Exito!</strong> Los datos han sido actualizados.'
        }else{
            let errText = " Contacte con el administrador.";
            if(err && err.response.status === 422){
                errText = " EL RUC ya existe!";
            }
            document.querySelector('#alert').classList.replace('alert-success','alert-warning');
            document.querySelector('#alert #text').innerHTML = '<strong>Error!</strong>'+ errText;
        }
        //Enfocar el input
        this._inputInformante.focus(); 
        //actualizar Lista
        this.props.onUpdateParentList('true');
        setTimeout(function(){  document.querySelector('#alert').classList.replace('show','hide'); }, 3000);
    }

    handleCloseAlert = () =>{
        document.querySelector('#alert').classList.replace('show','hide');
    }
    
    onSubtmit = (e) => {
        e.preventDefault();
        if(this.props.idUpdate === "NEW" || this.props.idUpdate === "" ){            
            const informante = {
                user: UserLogueado.id,
                ruc: this.state.ruc,
                div: this.state.div,
                razonSocial: this.state.razonSocial,
                user_created: this.state.user_created,
                user_updated: this.state.user_updated
            }            
            
            axios.post(configData.serverUrl + '/informante/add',informante)
                .then(res => this.showNotification(true))
                .catch(err => this.showNotification(false, err));
            this.setState({
                ruc:'',
                div:'',
                razonSocial:'',
                user_created:'',
                user_updated:'',
                textButton:'Agregar',
                idUpdate:'NEW'
            })       
        }else{           
            const ruc = {
                ruc: this.state.ruc,
                div: this.state.div,
                razonSocial: this.state.razonSocial,
                user_updated: UserLogueado.nick
            }
            
            axios.post(configData.serverUrl + '/rucs/update/'+this.state.idRuc+"/"+UserLogueado.id,ruc)
                .then(res => this.showNotification(true))
                .catch(err => this.showNotification(false,err));           
        } 
    }
    
    render(){             
        return(
            <div className="container"> 
                <h3>Informante</h3>
                <form onSubmit={this.onSubtmit}>
                        <div className="row">
                            <div className="form-group col-md-7">
                                <label>RUC: </label>
                                <NumberFormat 
                                    thousandSeparator = "."
                                    decimalSeparator = ","
                                    autoFocus={true}       
                                    getInputRef={c => (this._inputInformante = c)}                                 
                                    required
                                    className="form-control"
                                    value={this.state.ruc}
                                    onChange={this.onChangeRuc}
                                />
                            </div>                            
                            <div className="form-group col-md-5">
                                <label>DIV: </label>
                                <input type="text" 
                                    disabled
                                    id="idDiv"
                                    className="form-control"
                                    value={this.state.div}                                    
                                />
                            </div>
                        
                            <div className="form-group col-md-12">
                                <label>Razon Social: </label>
                                <input type="text" 
                                    required                                    
                                    className="form-control"
                                    value={this.state.razonSocial}
                                    onChange={this.onChangeRazonSocial}
                                />
                            </div>                              
                        </div>
                    <div className="form-group">
                        <input type="submit" value={this.state.textButton} className="btn btn-success" />
                    </div> 
                    <div id="alert" className="alert alert-success alert-dismissible fade hide" role="alert">
                        <span id="text"></span>
                        <button type="button" className="close" onClick={this.handleCloseAlert}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>                                       
                </form>
            </div>
        )
    }
}
