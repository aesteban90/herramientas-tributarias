import React, {Component} from 'react';
import axios from 'axios';
import NumberFormat from 'react-number-format'; 
import DatePicker from 'react-datepicker';
import MaskedInput from 'react-maskedinput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus} from '@fortawesome/free-solid-svg-icons';
import {UserLogueado} from '../../../App';
const configData = require('../../../config.json');

export default class TimbradoForm extends Component{
    constructor(props){
        super(props);
        this.state = {  
            numero:'',
            vencimiento:'',
            ruc: this.props.ruc
        };
    }
    
    //Metodo que obtiene cualquier actualizacion de otros componentes donde fue llamado
    componentDidUpdate(){}

    //Metodo que se ejecuta antes del render
    componentDidMount(){}

    onChangeNumero= (e) => {
        this.setState({
            numero: e.target.value
        })
    }
    onChangeVencimiento = (date) => {
        this.setState({
            vencimiento: date
        })
    }    
    showNotification(isSuccess, err){       
        //Enfocar el input
        this._input.focus(); 
        //actualizar Lista
        this.props.onUpdateParentList('true');
    }
    handleCloseAlert = () =>{
        document.querySelector('#alert').classList.replace('show','hide');
    }    

    onSubtmit = (e) => {
        e.preventDefault();
        const timbrado = {
            user: UserLogueado.id,
            ruc: this.props.ruc,
            numero: this.state.numero,
            vencimiento: this.state.vencimiento,
            user_created: UserLogueado.nick,
            user_updated: UserLogueado.nick
        }            
        axios.post(configData.serverUrl + '/timbrados/add',timbrado)
            .then(res => this.showNotification(true))
            .catch(err => this.showNotification(false,err));
        this.setState({
            numero:'',
            vencimiento:''
        })       
    }
    
    render(){             
        return(
            <div>                
                <form onSubmit={this.onSubtmit}>
                    <div className="row">
                        <div className="form-group col-md-5">
                            <label>Numero: </label>
                            <NumberFormat 
                                autoFocus={true}       
                                getInputRef={c => (this._input = c)}                                 
                                required
                                className="form-control"
                                value={this.state.numero}
                                onChange={this.onChangeNumero}
                            />
                        </div>                            
                        <div className="form-group vencimiento col-md-5">
                            <label>Vencimiento: </label>
                            <DatePicker 
                                className="form-control" 
                                required
                                locale="esp"
                                dateFormat="dd/MM/yyyy"
                                selected={this.state.vencimiento}
                                onChange={this.onChangeVencimiento}
                                showYearDropdown
                                isClearable
                                customInput={
                                    <MaskedInput mask="11/11/1111" placeholder="mm/dd/yyyy" />
                                }
                            />
                        </div> 
                        <div className="col-md-1 align-button-timbrado">
                            <button type="submit" className="btn btn-success btn-sm mr-1">
                                <FontAwesomeIcon icon={faPlus}  />  
                            </button>                 
                        </div>
                    </div>  
                </form>     
            </div>
        )
    }
}