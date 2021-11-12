import React, {Component} from 'react';
import axios from 'axios';
import Rucs from './rucs-form.component';
import TimbradosList from '../timbados/timbrado-list.component';
import { UserLogueado } from '../../../App';
import Modal from '../../modals/modal';
const configData = require('../../../config.json');

export default class RucsList extends Component{
    constructor(props){
        super(props);
        this.state = {
            datos: [],
            idUpdate: '',
            timbradotitle: '',
            isToggled: false,
            user: [],
            formSelected: 'FormRucs',
            modalOpen:false,
            modalAction: '',
            modalID: '',
            modalTitle: '',
            modalBody:''
        }
        this.datalist = this.datalist.bind(this);
        this.getFormulario = this.getFormulario.bind(this);
    }

    updateList = async (value) => {
        await axios.get(configData.serverUrl + "/rucs/owner/"+UserLogueado.id)
            .then(response => {
                this.setState({
                    datos: response.data
                })
            })
            .catch(err => console.log(err))

            window.paginar('list-group','list-group-item');

    }    
    componentDidMount(){
        this.updateList('true');
    }
    componentDidUpdate(){ 
        window.paginar('list-group','list-group-item');
    }

    deleteData = async (jsondatos) => {
        let informante = await axios.get(configData.serverUrl + "/informante/owner/"+UserLogueado.id+"/"+jsondatos._id)
            .then(res => res.data[0])
            .catch(err => undefined)

        if(informante){
            this.setState({
                modalOpen: true,
                modalAction: 'ruc-vinculado-informante',
                modalTitle: 'Ruc Vinculado a Informante',
                modalBody: 'Datos: ' + jsondatos.ruc+"-"+jsondatos.div+" | "+jsondatos.razonSocial
                    +'\nNo se puede eliminar este registro porque esta vinculado a un informante.'
                    +'\nRevise de antemano si desea eliminar el informante primeramente.'
            })
        }else{
            this.setState({
                modalOpen: true,
                modalAction: 'delete',
                modalID: jsondatos._id,
                modalTitle: 'Esta seguro de eliminar el Ruc?',
                modalBody: jsondatos.ruc+"-"+jsondatos.div+" | "+jsondatos.razonSocial
            })
        }
    }

    updateData = (jsondatos) => {
        this.setState({
            idUpdate: jsondatos._id,
            formSelected: "FormRucs"
        })
    }

    createData = (id) => {
        this.setState({
            idUpdate: id,
            formSelected: "FormRucs"
        })
    }
    onChangeFormTimbrado = (jsondatos) =>{
        this.setState({
            idUpdate: jsondatos._id,
            timbradotitle: jsondatos.ruc+"-"+jsondatos.div+" "+jsondatos.razonSocial,
            formSelected: "FormTimbrado"
        })
    }
    actionConfirmModal = () =>{
        if(this.state.modalAction === "ruc-vinculado-informante"){
            window.location = "/informante";
        }
        if(this.state.modalAction === "delete"){
            axios.delete(configData.serverUrl + "/rucs/"+this.state.modalID)
                .then(res => console.log(res.data))
                .catch(err => console.log(err))

            this.setState({
                datos: this.state.datos.filter(el => el._id !== this.state.modalID),
                modalOpen: false,
            });
        }
    }
    setOpenModal = () =>{this.setState({modalOpen: !this.state.modalOpen})}

    getFormulario(){
        if(this.state.formSelected === "FormRucs"){
            return (<Rucs idUpdate={this.state.idUpdate} onUpdateParentList={this.updateList}/>);
        }else{
            return (<TimbradosList ruc={this.state.idUpdate} title={this.state.timbradotitle}/>)
        }
    }

    datalist(){
        return this.state.datos.map((dato,index) => {
            return (<li className="list-group-item" key={index}>                   
                    <div className="col-md-4">{dato.ruc +"-"+dato.div+" "+dato.razonSocial}</div>
                    <div className="col-md-5">{dato.tipoEgreso.descripcion}</div>
                    <div className="col-md-3 text-right">
                        <button onClick={() => this.updateData(dato)} type="button" className="btn btn-light btn-sm mr-1">Editar</button>
                        <button onClick={() => this.deleteData(dato)} type="button" className="btn btn-danger btn-sm">Eliminar</button>
                        <br/><br/><button onClick={() => this.onChangeFormTimbrado(dato)} type="button" className="btn btn-light btn-sm mr-1">Timbrados</button>
                    </div>
                </li>)
        })
    }
    render(){       
        return(
            <div className="container">
                {this.state.modalOpen && <Modal setOpenModal={this.setOpenModal} title={this.state.modalTitle} body={this.state.modalBody} actionConfirmModal={this.actionConfirmModal} actionString={this.state.modalAction} />}
                <div className="row mb-0 col-md-12">
                    <h3>Mis Rucs</h3>
                </div>
                <div className="row">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title row mb-0">  
                                    <div className="col-md-4">Ruc - Razon Social</div>
                                    <div className="col-md-4">Tipo Egreso Predeterminado</div>   
                                    <div className="col-md-4 text-right">
                                        <button onClick={() => this.createData("NEW")} type="button" className="btn btn-success btn-sm">Nuevo</button>
                                    </div>                                 
                                </div>
                            </div>
                            <input id="input-search" className="form-control input-search" type="search" placeholder="Busqueda (minimo 3 letras)..." />
                            <ul id="list" className="list-group">
                                {this.datalist()}
                            </ul>                     
                        </div>
                    </div>
                    <div className="col-md-4">
                        {this.getFormulario()}                        
                    </div>
                </div>
            </div>
        )
    }
}