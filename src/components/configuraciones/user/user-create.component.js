import React, {Component} from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../utiles/registerLocaleEsp.js';
import {UserLogueado} from '../../../App';
const configData = require('../../../config.json');

export default class UserCreate extends Component{
    constructor(props){
        super(props);
        this.state = {
            email:'',
            nickname:'',
            nombre_completo:'',
            password:'',
            roles:[],
            user_created:'',
            user_updated:'',
            expira: new Date()
        };
    }

    componentDidMount(){        
        this.setState({
            user_created:UserLogueado.nick,
            user_updated:UserLogueado.nick
        })
        axios.get(configData.serverUrl + "/roles")
            .then(response => {
                if(response.data.length > 0){                    
                    this.setState({
                        roles: response.data
                    })
                }
            })
            .catch(err => console.log(err));                  
    }

    buttonActivated = () => {window.location.href = "/usuarios";}
    onChangeNickname = (e) => {this.setState({nickname: e.target.value})}
    onChangeEmail = (e) => {this.setState({email: e.target.value})}
    onChangeNombreCompleto = (e) => {this.setState({nombre_completo: e.target.value})}
    onChangePassword = (e) => {this.setState({password: e.target.value})}
    onChangeExpira = (date) => {this.setState({expira: date})}

    showNotification(isSuccess){
        document.querySelector('#alert').classList.replace('hide','show');
        if(isSuccess === true){
            document.querySelector('#alert #text').innerHTML = '<strong>Exito!</strong> Los datos han sido actualizados.'
            document.querySelectorAll("[type='checkbox']:checked").forEach((item) => {item.checked = false});
            this.setState({
                nickname:'',
                nombre_completo:'',
                password:'',
                expira: new Date()
            })
            
        }else{
            document.querySelector('#alert').classList.replace('alert-success','alert-warning');
            document.querySelector('#alert #text').innerHTML = '<strong>Error!</strong> Contacte con el administrador.'
        }
        setTimeout(function(){  document.querySelector('#alert').classList.replace('show','hide'); }, 3000);
    }

    handleCloseAlert = () =>{
        document.querySelector('#alert').classList.replace('show','hide');
    }
    
    onSubtmit = (e) => {
        e.preventDefault();
        let rolesSelected = [];
        document.querySelectorAll("[type='checkbox']:checked").forEach((item) => {rolesSelected.push(item.value)})
        
        const user = {
            email: this.state.email,
            nickname: this.state.nickname,
            nombre_completo: this.state.nombre_completo,
            password: this.state.password,
            expira: this.state.expira,
            user_created: this.state.user_created,
            user_updated: this.state.user_updated,
            roles:rolesSelected
        }
        axios.post(configData.serverUrl + '/users/add',user)
            .then(res => this.showNotification(true))
            .catch(err => this.showNotification(false));

        
        
    }
    roleslist = () => {    
        return this.state.roles.map((rol,index) => {
            return (<li className="list-group-item d-flex" key={"key-"+index}>
                    <div className="col-md-1">
                        <input className="form-check-input" type="checkbox" value={rol.rol} id={"check_"+rol.rol}></input>
                    </div>
                    <div className="col-md-4">{rol.rol}</div>
                    <div className="col-md-7">{rol.descripcion}</div>
                </li>)
        })
    }

    render(){             
        return(
            <div className="container">
                <h3>Crear Nuevo Usuario</h3>
                <form onSubmit={this.onSubtmit}>
                    <div className="row col-md-12">
                        <div className="col-md-5">
                            <div className="form-group">
                                <label>Email: </label>
                                <input type="text" 
                                    required
                                    className="form-control"
                                    value={this.state.email}
                                    onChange={this.onChangeEmail}
                                />
                            </div>
                            <div className="form-group">
                                <label>Nickname: </label>
                                <input type="text" 
                                    required
                                    className="form-control"
                                    value={this.state.nickname}
                                    onChange={this.onChangeNickname}
                                />
                            </div>
                            <div className="form-group">
                                <label>Nombre Completo: </label>
                                <input type="text" 
                                    required
                                    className="form-control"
                                    value={this.state.nombre_completo}
                                    onChange={this.onChangeNombreCompleto}
                                />
                            </div>
                            <div className="form-group">
                                <label>Password: </label>
                                <input type="password" 
                                    required
                                    className="form-control"
                                    value={this.state.password}
                                    onChange={this.onChangePassword}
                                />
                            </div>
                            <div className="form-group">
                                <label>Expiracion: </label><br/>
                                <DatePicker 
                                    className="form-control" 
                                    locale="esp"
                                    dateFormat="dd/MM/yyyy"
                                    selected={this.state.expira}
                                    onChange={this.onChangeExpira}
                                    showYearDropdown
                                    isClearable
                                />
                            </div>  
                            <div id="alert" className="alert alert-success alert-dismissible fade hide" role="alert">
                                <span id="text"></span>
                                <button type="button" className="close" onClick={this.handleCloseAlert}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>  
                        </div>    
                        <div className="col-md-7">                                                      
                            <div className="card">
                                <div className="card-header">
                                    <div className="card-title row mb-0">  
                                        <div className="col-md-1"></div>
                                        <div className="col-md-4">Rol</div>
                                        <div className="col-md-7">Descripcion</div>  
                                    </div>                              
                                </div>
                                {this.roleslist()}  
                            </div>                            
                        </div>             
                    </div>  
                    <div className="form-group">
                        <input type="submit" value="Crear Usuario" className="btn btn-primary" />
                        <input onClick={this.buttonActivated} type="button" value="Salir" className="btn btn-light ml-1" />
                    </div>                                        
                </form>
            </div>
        )
    }
}
