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
            id: '',
            nickname:'',
            nombre_completo:'',
            password:'',
            roles:[],
            rolesSelected: [],
            user_updated:'',
            expira: undefined
        }        
    }

    buttonActivated = () => {
        window.location.href = "/usuarios";
    }
    componentDidUpdate(){
        this.getRolesSelected();
    }
    componentDidMount(req, res){
        this.setState({
            user_updated:UserLogueado.nick
        });

        axios.get(configData.serverUrl + "/users/"+this.props.match.params.id)
            .then(response => {
                this.setState({
                    id: response.data._id,
                    nickname: response.data.nickname,
                    nombre_completo: response.data.nombre_completo,
                    rolesSelected: response.data.roles,
                    password:'',
                    expira: new Date(response.data.expira)
                })
            })
            .catch(err => console.log(err));
        
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

    onChangeNickname = (e) => {
        this.setState({
            nickname: e.target.value
        })
    }
    onChangeNombreCompleto = (e) => {
        this.setState({
            nombre_completo: e.target.value
        })
    }
    onChangePassword = (e) => {
        this.setState({
            password: e.target.value
        })
    }
    onChangeExpira = (date) => {
        this.setState({
            expira: date
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
        setTimeout(function(){  document.querySelector('#alert').classList.replace('show','hide'); }, 3000);
    }

    handleCloseAlert = () =>{
        document.querySelector('#alert').classList.replace('show','hide');
    }

    getRolesSelected = (e) => {
        this.state.rolesSelected.forEach(item => {
           if(document.querySelector('#check_'+item)){
                document.querySelector('#check_'+item).checked = true; 
           }
        })
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
        
    onSubtmit = (e) => {
        e.preventDefault();
        let rolesSelected = [];
        document.querySelectorAll("[type='checkbox']:checked").forEach((item) => {rolesSelected.push(item.value)})
        
        const user = {
            nickname: this.state.nickname,
            nombre_completo: this.state.nombre_completo,
            password: this.state.password,
            expira: this.state.expira,
            user_updated: this.state.user_updated,
            roles: rolesSelected
        }

        axios.post(configData.serverUrl + '/users/update/'+this.state.id, user)
            .then(res => this.showNotification(true))
            .catch(err => this.showNotification(false));
    }
    render(){    
        return(
            <div className="container">
                <h3>Actualizar Usuario</h3>
                <form onSubmit={this.onSubtmit}>
                    <div className="row col-md-12">
                        <div className="col-md-5">
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
                                <label>Nuevo Password: </label>
                                <input type="password" 
                                    className="form-control"
                                    value={this.state.password}
                                    onChange={this.onChangePassword}
                                />
                            </div>
                            <div className="form-group">
                                <label>Expiracion: </label><br/>
                                <DatePicker 
                                    required
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
                        <input type="submit" value="Actualizar" className="btn btn-success" />
                        <input onClick={this.buttonActivated} type="button" value="Salir" className="btn btn-light ml-1" />
                    </div>                             
                </form>                
            </div>
        )        
    }
}