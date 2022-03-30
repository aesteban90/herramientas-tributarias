import React, {Component} from 'react';
import axios from 'axios';
import NumberFormat from 'react-number-format'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus} from '@fortawesome/free-solid-svg-icons'
import {UserLogueado} from '../../../App';
const configData = require('../../../config.json');

export default class PeriodoForm extends Component{
    constructor(props){
        super(props);
        this.state = {  
            periodo:'',
            informante: this.props.informante
        };
    }
    
    //Metodo que obtiene cualquier actualizacion de otros componentes donde fue llamado
    componentDidUpdate(){}

    //Metodo que se ejecuta antes del render
    componentDidMount(){}

    onChangePeriodo= (e) => {
        this.setState({
            periodo: e.target.value
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
        if(this.state.periodo >= 2021){
            const periodo = {
                periodo: this.state.periodo,
                user: UserLogueado.id,
                informante: this.props.informante,
                user_created: UserLogueado.nick,
                user_updated: UserLogueado.nick
            }            
            axios.post(configData.serverUrl + '/periodos/add',periodo)
                .then(res => this.showNotification(true))
                .catch(err => this.showNotification(false,err));
            this.setState({
                periodo:''
            })       
        }else{
            
        }
    }
    
    render(){             
        return(
            <div>                
                <form onSubmit={this.onSubtmit}>
                    <div className="row">
                        <div className="form-group col-5">
                            <label>Periodo: </label>
                            <NumberFormat                                 
                                autoFocus={true}       
                                getInputRef={c => (this._input = c)}                                 
                                required
                                format="20##"
                                placeholder="20__"
                                className="form-control"
                                value={this.state.periodo}
                                onChange={this.onChangePeriodo}
                            />
                        </div>                                                    
                        <div className="col-1 align-button-periodo">
                            <button type="submit" className="btn btn-success btn-sm mr-1">
                                <FontAwesomeIcon icon={faPlus}  />  
                            </button>                 
                        </div>
                        <div className="form-group col-md-12">El Periodo debe ser mayor o igual que 2021</div>
                    </div>  
                </form>     
            </div>
        )
    }
}