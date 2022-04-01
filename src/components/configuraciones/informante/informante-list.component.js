import React, {Component} from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faTrash, faBookmark, faCalendarCheck } from '@fortawesome/free-solid-svg-icons'
import Informante from './informante-form.component';
import PeriodoList from '../../public/periodos/periodo-list.component';
import TimbradosList from '../../public/timbados/timbrado-list.component';
import { UserLogueado } from '../../../App';
import SwitchList from '../switchList-toggle.component';
import Modal from '../../modals/modal';
const configData = require('../../../config.json');

export default class InformanteList extends Component{
    constructor(props){
        super(props);
        this.state = {
            datos: [],
            idUpdate: '',
            isToggled: false,
            user: [],
            Periodotitle: '',
            periodo:'',
            formSelected:'FormInformante',
            modalOpen:false,
            modalAction: '',
            modalID: '',
            modalTitle: '',
            modalBody:''
        }
        this.datalist = this.datalist.bind(this);
    }

    updateList = async (value) => {
        await axios.get(configData.serverUrl + "/informante/owner/"+UserLogueado.id)
            .then(response => {this.setState({datos: response.data})})
            .catch(err => console.log(err))       
    }
    
    componentDidMount(){        
        axios.get(configData.serverUrl + "/users/informante/"+UserLogueado.id)
            .then(response => {this.setState({user: response.data});this.updateList('true');})
            .catch(err => console.log(err))        
    }
    componentDidUpdate(){ 
        if(document.querySelector('#t_'+this.state.user.informante)){
            document.querySelector('#t_'+this.state.user.informante).checked = true;
        }
        window.paginar('list-group','list-group-item');
    }

    deleteData = (jsondatos) => {
        axios.get(configData.serverUrl + "/users/informante/"+UserLogueado.id).then(user => {
            if(user.data.informante === jsondatos._id){
                this.setState({
                    modalOpen: true,
                    modalAction: 'informante-actual-delete',
                    modalTitle: 'Informante Activo',
                    modalBody: 'El Informante '+jsondatos.ruc.ruc+"-"+jsondatos.ruc.div+" | "+jsondatos.ruc.razonSocial
                                +' no puede ser eliminado porque esta seleccionado como activo.'
                                +'\nPara eliminarlo debe de seleccionar otro informante y activarlo.'
                })
            }else{
                this.setState({
                    modalOpen: true,
                    modalAction: 'delete',
                    modalID: jsondatos._id,
                    modalTitle: 'Esta seguro de eliminar al informante?',
                    modalBody: jsondatos.ruc.ruc+"-"+jsondatos.ruc.div+" | "+jsondatos.ruc.razonSocial
                })
            }
        })
    }

    updateData = (jsondatos) => {
        this.setState({
            idUpdate: jsondatos._id,
            formSelected: "FormInformante"
        })
    }

    createData = (id) => {
        this.setState({
            idUpdate: id,
            formSelected: "FormInformante"
        })
    }

    
    onChangeCheckList = (dato, index) => {
        
        axios.post(configData.serverUrl + '/users/update/informante/'+UserLogueado.id, {
            informante: dato._id
        })
            .then(res => {
                UserLogueado.informante = dato._id;
                this.setState({user:UserLogueado});                
                let informante_selected = dato.ruc.ruc +"-"+dato.ruc.div + " | " +dato.ruc.razonSocial;
                if(dato.periodo)informante_selected += " | "+dato.periodo
                document.querySelector('.nav-item-informante span').innerText = informante_selected;
            })
            .catch(err => console.log(err)); 
    } 

    actionConfirmModal = () =>{
        if(this.state.modalAction === "delete"){
            axios.delete(configData.serverUrl + "/informante/"+this.state.modalID)
                .then(res => console.log(res.data))
                .catch(err => console.log(err))

            this.setState({
                datos: this.state.datos.filter(el => el._id !== this.state.modalID),
                formSelected: "FormInformante",
                idUpdate:"New",
                modalOpen:false
            })
        }
    }
    setOpenModal = () =>{this.setState({modalOpen: !this.state.modalOpen})}

    onChangeFormPeriodo = (jsondatos) =>{
        this.setState({
            idUpdate: jsondatos._id,
            Periodotitle: jsondatos.ruc.ruc+"-"+jsondatos.ruc.div+" "+jsondatos.ruc.razonSocial,
            periodo: jsondatos.periodo,
            formSelected: "FormPeriodo"
        })
    }
    onChangeFormTimbrado = (jsondatos) =>{
        this.setState({
            idUpdate: jsondatos.ruc._id,
            timbradotitle: jsondatos.ruc.ruc+"-"+jsondatos.ruc.div+" "+jsondatos.ruc.razonSocial,
            formSelected: "FormTimbrado"
        })
    }

    getFormulario(){
        if(this.state.formSelected === "FormInformante"){
            return <Informante idUpdate={this.state.idUpdate} onUpdateParentList={this.updateList}/>           
        }else if(this.state.formSelected === "FormTimbrado"){
            return (<TimbradosList ruc={this.state.idUpdate} title={this.state.timbradotitle}/>)
        }else if(this.state.formSelected === "FormPeriodo"){
            return (<PeriodoList informante={this.state.idUpdate} title={this.state.Periodotitle} periodo={this.state.periodo}/>)
        }
    }

    datalist(){
        return this.state.datos.map((dato,index) => {
            dato.ruc = (!dato.ruc ? {ruc:'',div:'',razonSocial:''} : dato.ruc);
            let periodo = (dato.periodo === undefined ? "" : " | " + dato.periodo);
            return (<li className="list-group-item d-flex" key={dato._id}>
                    <div className="col-md-2 informante-check">
                        <SwitchList nameToggle="informanteToggle" idToggle={"t_"+dato._id} onToggle={() => this.onChangeCheckList(dato,index)} />                        
                    </div>
                    <div className="datos-table-desktop">
                        <div className="col-md-3">{dato.ruc.ruc +"-"+dato.ruc.div + periodo}</div>
                        <div className="col-md-4">{dato.ruc.razonSocial}</div>
                        <div className="col-md-3 text-right">
                            <button onClick={() => this.updateData(dato)} type="button" className="btn btn-light btn-sm mr-1"><FontAwesomeIcon icon={faEdit} /> Editar</button>
                            <button onClick={() => this.deleteData(dato)} type="button" className="btn btn-danger btn-sm"><FontAwesomeIcon icon={faTrash} /> Eliminar</button>
                            <br/><br/>
                            <button onClick={() => this.onChangeFormPeriodo(dato)} type="button" className="btn btn-light btn-sm mr-1"><FontAwesomeIcon icon={faCalendarCheck} /> Periodos</button>
                            <button onClick={() => this.onChangeFormTimbrado(dato)} type="button" className="btn btn-light btn-sm"><FontAwesomeIcon icon={faBookmark} /> Timbrados</button>
                        </div>
                    </div>
                    <div className="datos-table-mobile">
                        <div className="col-md-12"><b>Ruc: </b>{dato.ruc.ruc +"-"+dato.ruc.div + periodo}</div>
                        <div className="col-md-12"><b>Razon: </b>{dato.ruc.razonSocial}</div>
                        <div className="row col-sm-12">
                            <div className="text-left col-12 pl-1">
                                <button onClick={() => this.updateData(dato)} type="button" className="btn btn-light btn-sm mr-1 mb-1"><FontAwesomeIcon icon={faEdit} /> Editar</button>
                                <button onClick={() => this.onChangeFormPeriodo(dato)} type="button" className="btn btn-light btn-sm mr-1 mb-1"><FontAwesomeIcon icon={faCalendarCheck} /> Periodos</button>
                                <button onClick={() => this.onChangeFormTimbrado(dato)} type="button" className="btn btn-light btn-sm"><FontAwesomeIcon icon={faBookmark} /> Timbrados</button>
                                <button onClick={() => this.deleteData(dato)} type="button" className="btn btn-danger btn-sm mb-1"><FontAwesomeIcon icon={faTrash} /> Eliminar</button>
                            </div>
                        </div>
                    </div>
                </li>)
        })
    }
    render(){       
        
        return(
            <div className="container">
                {this.state.modalOpen && <Modal setOpenModal={this.setOpenModal} title={this.state.modalTitle} body={this.state.modalBody} actionConfirmModal={this.actionConfirmModal} actionString={this.state.modalAction}/>}
                <div className="row mb-0 col-md-12">
                    <h3>Lista de Informantes</h3>
                </div>
                <div className="row">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header title-table-desktop">
                                <div className="card-title row mb-0">  
                                    <div className="col-md-2">Activar</div>
                                    <div className="col-md-3">Ruc | Periodo</div>
                                    <div className="col-md-5">Razon Social</div>   
                                    <div className="col-md-2 text-right">
                                        <button onClick={() => this.createData("NEW")} type="button" className="btn btn-success btn-sm"><FontAwesomeIcon icon={faPlus} /> Agregar Informante</button>
                                    </div>                                 
                                </div>
                            </div>
                            <div className="card-header title-table-mobile">
                                <div className="card-title row mb-0"> 
                                    <div className="col-5">Resumen</div>
                                    <div className="col-7 text-right btn-createform-mobile">
                                    <button onClick={() => this.createData("NEW")} type="button" className="btn btn-success btn-sm"><FontAwesomeIcon icon={faPlus} /> Agregar Informante</button>
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
                     {this.getFormulario()}                           
                    </div>
                </div>
            </div>
        )
    }
}