import React, {Component} from 'react';
import axios from 'axios';
import Bancos from './bancos-form.component';
import Modal from '../../modals/modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
const configData = require('../../../config.json');

export default class BancosList extends Component{
    constructor(props){
        super(props);
        this.state = {
            datos: [],
            idUpdate: '',
            didUpdate: true,
            modalOpen:false,
            modalAction: '',
            modalID: '',
            modalTitle: '',
            modalBody:''
        }
        this.datalist = this.datalist.bind(this);
    }

    updateList = async (value) => {
        await axios.get(configData.serverUrl + "/bancos/")
            .then(response => {
                if(response.data.length > 0){                    
                    this.setState({
                        datos: response.data
                    }) 
                }
            })
            .catch(err => console.log(err))
        window.paginar('list-group','list-group-item',true);
    }

    componentDidMount(){      
        this.updateList('');
    }
    componentDidUpdate(){}
/*
    deleteData = async (jsondatos) => {
        await axios.delete(configData.serverUrl + "/bancos/"+jsondatos._id)
            .then(res => console.log(res.data))
            .catch(err => console.log(err))

        this.setState({
            datos: this.state.datos.filter(el => el._id !== jsondatos._id)
        });

        window.paginar('list-group','list-group-item',true);
    }*/
    deleteData = async (jsondatos) => {
        this.setState({
            modalOpen: true,
            modalAction: 'delete',
            modalID: jsondatos._id,
            modalTitle: 'Esta seguro de eliminar el Banco?',
            modalBody: 'Descripción: '+jsondatos.descripcion 
        })
    }    
    actionConfirmModal = () =>{
        if(this.state.modalAction === "delete"){
            axios.delete(configData.serverUrl + "/bancos/" + this.state.modalID)
                .then(res => console.log(res.data))
                .catch(err => console.log(err))

            this.setState({
                datos: this.state.datos.filter(el => el._id !== this.state.modalID),
                modalOpen: false,
            });
        }
    }
    setOpenModal = () =>{this.setState({modalOpen: !this.state.modalOpen})}

    updateData = (jsondatos) => {
        this.setState({
            idUpdate: jsondatos._id
        })
    }

    createData = (id) => {
        this.setState({
            idUpdate: id
        })
    }

    datalist(){
        return this.state.datos.map(dato => {
            return (<li className="list-group-item" key={dato._id}>
                    <div className="datos-table-desktop">
                        <div className="col-md-10">{dato.descripcion}</div>
                        <div className="col-md-2 text-right">
                            <button onClick={() => this.updateData(dato)} type="button" className="btn btn-light btn-sm mr-1"><FontAwesomeIcon icon={faEdit}/> Editar</button>
                            <button onClick={() => this.deleteData(dato)} type="button" className="btn btn-danger btn-sm"><FontAwesomeIcon icon={faTrash}/> Eliminar</button>
                        </div>
                    </div>
                    <div className="datos-table-mobile">
                        <div className="col-md-12"><b>Descripcion: </b>{dato.descripcion}</div>
                        <div className="row ">
                            <div className="text-left col-12">
                                <button onClick={() => this.updateData(dato)} type="button" className="btn btn-light btn-sm mr-1"><FontAwesomeIcon icon={faEdit}/> Editar</button>
                                <button onClick={() => this.deleteData(dato)} type="button" className="btn btn-danger btn-sm"><FontAwesomeIcon icon={faTrash}/> Eliminar</button>
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
                    <h3>Lista de Bancos</h3>
                </div>
                <div className="row">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header title-table-desktop">
                                <div className="card-title row mb-0">  
                                    <div className="col-md-10">Descripcion</div>   
                                    <div className="col-md-2 text-right">
                                        <button onClick={() => this.createData("NEW")} type="button" className="btn btn-success btn-sm"><FontAwesomeIcon icon={faPlus}/> Nuevo</button>
                                    </div>                                 
                                </div>
                            </div>
                            <div className="card-header title-table-mobile">
                                <div className="card-title row mb-0"> 
                                    <div className="col-5">Resumen</div>
                                    <div className="col-7 text-right btn-createform-mobile">
                                        <button onClick={() => this.createData("NEW")} type="button" className="btn btn-success btn-sm"><FontAwesomeIcon icon={faPlus}/> Nuevo</button>
                                    </div>  
                                </div>
                            </div>
                            <input id="input-search" className="form-control" type="search" placeholder="Busqueda (minimo 3 letras)..." />
                            <ul id="list" className="list-group">
                                {this.datalist()}
                            </ul>                     
                        </div>
                    </div>
                    
                    <div className="col-md-4">
                        <Bancos idUpdate={this.state.idUpdate} onUpdateParentList={this.updateList}/>
                    </div>
                </div>
            </div>
        )
    }
}