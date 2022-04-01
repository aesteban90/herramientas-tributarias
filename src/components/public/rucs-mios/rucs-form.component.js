import React, {Component} from 'react';
import axios from 'axios';
import Select from 'react-select';
import NumberFormat from 'react-number-format'; 
import {UserLogueado} from '../../../App';
import {getDiv} from '../../../js/utils.js'
const configData = require('../../../config.json');

export default class RucsForm extends Component{
    constructor(props){
        super(props);
        this.state = {  
            ruc:'',
            div:'',
            razonSocial:'',
            user_created:'',
            user_updated:'',
            textButton:'Agregar',
            idUpdate: 'NEW',
            tipoEgresosOptions: [],
            tipoEgresosSelected:{}
        };
    }
    
    //Metodo que obtiene cualquier actualizacion de otros componentes donde fue llamado
    componentDidUpdate(){        
        if(this.state.idUpdate !== this.props.idUpdate ){
            //Enfocar el input
            this._input.focus(); 
            this.setState({ idUpdate: this.props.idUpdate});
            if(this.props.idUpdate !== "NEW" && this.props.idUpdate !== "" ){
                axios.get(configData.serverUrl + "/rucs/"+this.props.idUpdate)
                .then(response => {
                    this.setState({
                        tipoEgresosSelected: this.state.tipoEgresosOptions.filter(
                            item => item.value === response.data.tipoEgreso
                        ),
                        ruc: response.data.ruc,
                        div: response.data.div,
                        razonSocial: response.data.razonSocial,
                        user_created: UserLogueado.nick,
                        textButton:'Actualizar'
                    })
                })
                .catch(err => console.log(err));
            }else{
                //Enfocar el input
                this._input.focus(); 
                this.setState({
                    tipoEgresosSelected: this.state.tipoEgresosOptions[0],
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
    //Metodo que se ejecuta antes del render
    componentDidMount(){
        axios.get(configData.serverUrl + "/tipo-egreso/")
            .then(response => {
                let options = [];
                response.data.forEach(element => {
                    options.push({value:element._id,label:element.descripcion});
                });
                this.setState({
                    tipoEgresosSelected: options[0],
                    tipoEgresosOptions: options
                });
            })
            .catch(err => console.log(err))
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
    onChangeTipoEgresos = (selectedOption) => {
        this.setState({
            tipoEgresosSelected: selectedOption
        })
    };
    showNotification(isSuccess, err){
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
        this._input.focus(); 
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
            const ruc = {
                user: UserLogueado.id,
                tipoEgreso: this.state.tipoEgresosSelected.value,
                ruc: this.state.ruc,
                div: this.state.div,
                razonSocial: this.state.razonSocial,
                user_created: this.state.user_created,
                user_updated: this.state.user_updated
            }            
            axios.post(configData.serverUrl + '/rucs/add',ruc)
                .then(res => this.showNotification(true))
                .catch(err => this.showNotification(false,err));
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
                tipoEgreso: this.state.tipoEgresosSelected.value,
                ruc: this.state.ruc,
                div: this.state.div,
                razonSocial: this.state.razonSocial,
                user_updated: UserLogueado.nick
            }
            axios.post(configData.serverUrl + '/rucs/update/'+this.state.idUpdate+"/"+UserLogueado.id,ruc)
                .then(res => this.showNotification(true))
                .catch(err => this.showNotification(false,err));
        } 
    }
    
    render(){             
        return(
            <div> 
                <h3>Rucs</h3>
                <form onSubmit={this.onSubtmit}>
                        <div className="row">
                            <div className="form-group col-md-7">
                                <label>RUC: </label>
                                <NumberFormat 
                                    thousandSeparator = "."
                                    decimalSeparator = "_"
                                    autoFocus={true}       
                                    getInputRef={c => (this._input = c)}                                 
                                    required
                                    className="form-control"
                                    value={this.state.ruc}
                                    onChange={this.onChangeRuc}
                                />
                            </div>                            
                            <div className="form-group col-md-5">
                                <label>DIV: </label>
                                <input type="number" 
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
                            <div className="form-group col-md-12">
                                <label>Tipo Egreso: </label>
                                <Select 
                                    noOptionsMessage={() => 'Sin resultados'}
                                    value={this.state.tipoEgresosSelected} 
                                    options={this.state.tipoEgresosOptions} 
                                    onChange={this.onChangeTipoEgresos}
                                    required/>
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