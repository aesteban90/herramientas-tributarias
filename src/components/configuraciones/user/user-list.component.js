import React, {Component} from 'react';
import axios from 'axios';
import Modal from '../../modals/modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
const configData = require('../../../config.json');

export default class UserList extends Component{
    constructor(props){
        super(props);
        this.state = {
            users: [],
            modalOpen:false,
            modalAction: '',
            modalID: '',
            modalTitle: '',
            modalBody:''
        }
        this.deleteUser = this.deleteUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.userslist = this.userslist.bind(this);
        this.createUser = this.createUser.bind(this);
    }

    componentDidMount(){
        axios.get(configData.serverUrl + "/users/")
            .then(response => {
                if(response.data.length > 0){                    
                    this.setState({
                        users: response.data
                    })
                }
            })
            .catch(err => console.log(err))
    }
    componentDidUpdate(){
        window.paginar('list-group','list-group-item',true);
    }
    /*
    async deleteUser(user){
        await axios.delete(configData.serverUrl + "/users/"+user._id)
            .then(res => console.log(res.data))
            .catch(err => console.log(err))

        this.setState({
            users: this.state.users.filter(el => el._id !== user._id)
        })        
    }*/
    deleteUser = async (jsondatos) => {
        this.setState({
            modalOpen: true,
            modalAction: 'delete',
            modalID: jsondatos._id,
            modalTitle: 'Esta seguro de eliminar el Usuario?',
            modalBody: 'Nickname: '+jsondatos.nickname+'\nNombre: '+jsondatos.nombre_completo 
        })
    }    
    actionConfirmModal = () =>{
        if(this.state.modalAction === "delete"){
            axios.delete(configData.serverUrl + "/users/" + this.state.modalID)
                .then(res => console.log(res.data))
                .catch(err => console.log(err))

            this.setState({
                users: this.state.users.filter(el => el._id !== this.state.modalID),
                modalOpen: false,
            });
        }
    }
    setOpenModal = () =>{this.setState({modalOpen: !this.state.modalOpen})}
    
    updateUser(user){
        window.location.href = "/usuarios/update/"+user._id
    }

    createUser(){
        window.location.href = "/usuarios/create"
    }

    userslist(){
        return this.state.users.map(user => {
            let dateExpira = new Date(user.expira);
            let expiraString =  ((dateExpira.getDate() > 9) ? dateExpira.getDate() : ('0' + dateExpira.getDate()))+ '/' + ((dateExpira.getMonth() > 8) ? (dateExpira.getMonth() + 1) : ('0' + (dateExpira.getMonth() + 1))) + '/' + dateExpira.getFullYear();
            return (<li className="list-group-item" key={user._id}>
                    <div className="datos-table-desktop">
                        <div className="col-md-2">{user.email+' / '+user.nickname}</div>
                        <div className="col-md-3">{user.nombre_completo}</div>
                        <div className="col-md-2">{expiraString}</div>
                        <div className="col-md-3">{user.roles.join(', ')}</div>
                        <div className="col-md-2 text-right">
                            <button id={"ed_"+user._id} onClick={() => this.updateUser(user)} type="button" className="btn btn-light btn-sm mr-1"><FontAwesomeIcon icon={faEdit}/> Editar</button>
                            <button id={"el_"+user._id} onClick={() => this.deleteUser(user)} type="button" className="btn btn-danger btn-sm"><FontAwesomeIcon icon={faTrash}/> Eliminar</button>
                        </div>
                    </div>
                    <div className="datos-table-mobile col-12 pl-1">
                        <div className="col-md-12"><b>Email: </b>{user.email}</div>
                        <div className="col-md-12"><b>Nickname: </b>{user.nickname}</div>
                        <div className="col-md-12"><b>Nombre: </b>{user.nombre_completo}</div>
                        <div className="col-md-12"><b>Expira: </b>{expiraString}</div>
                        <div className="col-md-12"><b>Roles: </b>{user.roles.join(', ')}</div>
                        <div className="row">
                            <div className="text-left col-12">
                                <button onClick={() => this.updateUser(user)} type="button" className="btn btn-light btn-sm mr-1"><FontAwesomeIcon icon={faEdit}/> Editar</button>
                                <button onClick={() => this.deleteUser(user)} type="button" className="btn btn-danger btn-sm"><FontAwesomeIcon icon={faTrash}/> Eliminar</button>
                            </div>
                        </div>
                    </div>
                </li>)
        })
    }
    render(){       
        return(
            <div className="container">
                {this.state.modalOpen && <Modal setOpenModal={this.setOpenModal} title={this.state.modalTitle} body={this.state.modalBody} actionConfirmModal={this.actionConfirmModal} actionString={this.state.modalAction} />}
                <div className="row mb-0 col-md-12">
                    <h3>Lista de Usuarios</h3>
                    <div className="col-md-3">
                    </div>
                </div>
                <div className="card">
                    <div className="card-header title-table-desktop">
                        <div className="card-title row mb-0">  
                            <div className="col-md-2">Email / Nickname</div>
                            <div className="col-md-3">Nombre Completo</div>
                            <div className="col-md-2">Expira</div>
                            <div className="col-md-3">Roles</div>
                            <div className="col-md-2 text-right">
                                <button id="new_user" onClick={this.createUser} type="button" className="btn btn-success btn-sm"><FontAwesomeIcon icon={faPlus}/> Nuevo</button>
                            </div>
                        </div>
                    </div>
                    <div className="card-header title-table-mobile">
                        <div className="card-title row mb-0"> 
                            <div className="col-5">Resumen</div>
                            <div className="col-7 text-right btn-createform-mobile">
                                <button id="new_user" onClick={this.createUser} type="button" className="btn btn-success btn-sm"><FontAwesomeIcon icon={faPlus}/> Nuevo</button>
                            </div>  
                        </div>
                    </div>
                    <input id="input-search" className="form-control" type="search" placeholder="Busqueda (minimo 3 letras)..." />
                    <ul id="list" className="list-group">
                        {this.userslist()}
                    </ul>                     
                </div>
            </div>
        )
    }
}