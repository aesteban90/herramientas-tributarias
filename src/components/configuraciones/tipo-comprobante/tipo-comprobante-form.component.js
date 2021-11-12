import React, {Component} from 'react';
import axios from 'axios';
import Select from 'react-select';
import {UserLogueado} from '../../../App';
const configData = require('../../../config.json');

export default class TipoComprobanteForm extends Component{
    constructor(props){        
        super(props);
        this.state = {  
            tipo: '',
            codigo:'',
            descripcion:'',
            user_created:'',
            user_updated:'',
            textButton:'Agregar',
            idUpdate: 'NEW',
            tipoComprobanteOptions: [],
            tipoComprobanteSelected:{}
        };        
    }
    //Metodo que obtiene cualquier actualizacion de otros componentes donde fue llamado
    componentDidUpdate(){        
        if(this.state.idUpdate !== this.props.idUpdate ){
            this.setState({ idUpdate: this.props.idUpdate});
            if(this.props.idUpdate !== "NEW" && this.props.idUpdate !== "" ){
                axios.get(configData.serverUrl + "/tipo-comprobante/"+this.props.idUpdate)
                .then(response => {
                    this.setState({
                        tipo: response.data.tipo,
                        codigo: response.data.codigo,
                        descripcion: response.data.descripcion,
                        user_created: UserLogueado.nick,
                        textButton:'Actualizar'
                    })
                })
                .catch(err => console.log(err));
            }else{
                this.setState({
                    tipo:'',
                    codigo:'',
                    descripcion:'',
                    user_created: UserLogueado.nick,
                    user_updated: UserLogueado.nick,
                    textButton:'Agregar',
                    idUpdate: this.props.idUpdate
                });
            }
        }
    }

    //Metodo que se ejecuta antes del render
    componentDidMount(){
        let options = [];
        options.push({value: 'COMPRAS',label: 'COMPRAS'});
        options.push({value: 'VENTAS',label: 'VENTAS'});
        options.push({value: 'COMPRAS/VENTAS',label: 'COMPRAS/VENTAS'});
        options.push({value: 'INGRESOS',label: 'INGRESOS'});
        options.push({value: 'EGRESOS',label: 'EGRESOS'});
        options.push({value: 'INGRESOS/EGRESOS',label: 'INGRESOS/EGRESOS'});

        this.setState({tipoComprobanteSelected: options[0],tipoComprobanteOptions: options});
    }

    onChangeDescripcion = (e) => {
        this.setState({
            descripcion: e.target.value
        })
    }
    onChangeCodigo = (e) => {
        this.setState({
            codigo: e.target.value
        })
    }
    onChangeTipo = (e) => {
        this.setState({
            tipo: e.target.value
        })
    }
    showNotification(isSuccess){
        document.querySelector('#alert').classList.replace('hide','show');
        if(isSuccess === true){
            document.querySelector('#alert').classList.replace('alert-warning','alert-success');
            document.querySelector('#alert #text').innerHTML = '<strong>Exito!</strong> Los datos han sido actualizados.'
        }else{
            document.querySelector('#alert').classList.replace('alert-success','alert-warning');
            document.querySelector('#alert #text').innerHTML = '<strong>Error!</strong> Contacte con el administrador.'
        }
       
        //actualizar Lista
        this.props.onUpdateParentList('true');
        setTimeout(function(){  document.querySelector('#alert').classList.replace('show','hide'); }, 3000);
    }
    handleCloseAlert = () =>{
        document.querySelector('#alert').classList.replace('show','hide');
    }
    onChangeTipoComprobantesOptions = (selectedOption) => {
        this.setState({
            tipoComprobanteSelected: selectedOption
        })
    };
    
    onSubtmit = (e) => {
        e.preventDefault();
        if(this.props.idUpdate === "NEW" || this.props.idUpdate === "" ){
            const data = {
                tipo: this.state.tipoComprobanteSelected.value,
                codigo: this.state.codigo,
                descripcion: this.state.descripcion,
                user_created: this.state.user_created,
                user_updated: this.state.user_updated
            }
            axios.post(configData.serverUrl + '/tipo-comprobante/add',data)
                .then(res => this.showNotification(true))
                .catch(err => this.showNotification(false));
            this.setState({
                tipo:'',
                codigo:'',
                descripcion:'',
                user_created:'',
                user_updated:'',
                textButton:'Agregar',
                idUpdate:'NEW'
            })       
        }else{
            const tipodocingreso = {
                tipo: this.state.tipoComprobanteSelected.value,
                codigo: this.state.codigo,
                descripcion: this.state.descripcion,
                user_updated: UserLogueado.nick
            }
            axios.post(configData.serverUrl + '/tipo-comprobante/update/'+this.state.idUpdate,tipodocingreso)
            .then(res => this.showNotification(true))
                .then(res => this.showNotification(true))
                .catch(err => this.showNotification(false));
        }
    }   
    
    render(){  
        
        return(
            <div className="container"> 
                <h3>Tipo Comprobante</h3>
                <form onSubmit={this.onSubtmit}>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <label>Tipo: </label>
                                <Select 
                                    noOptionsMessage={() => 'Sin resultados'}
                                    value={this.state.tipoComprobanteSelected} 
                                    options={this.state.tipoComprobanteOptions} 
                                    onChange={this.onChangeTipoComprobantesOptions}                                    
                                    required/>
                            </div> 
                            <div className="form-group col-md-6">
                                <label>Codigo: </label>
                                <input type="text" 
                                    required
                                    className="form-control"
                                    value={this.state.codigo}
                                    onChange={this.onChangeCodigo}
                                />
                            </div>                            
                            <div className="form-group col-md-12">
                                <label>Descripcion: </label>
                                <input type="text" 
                                    required
                                    className="form-control"
                                    value={this.state.descripcion}
                                    onChange={this.onChangeDescripcion} 
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
