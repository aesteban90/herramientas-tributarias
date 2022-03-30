import React, {Component} from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faClone, faEdit, faTrash} from '@fortawesome/free-solid-svg-icons'
import { UserLogueado } from '../../../App';
import Spinner from 'react-bootstrap/Spinner';
import Modal from '../../modals/modal';
const configData = require('../../../config.json');

export default class FormularioEgresoList extends Component{
    constructor(props){
        super(props);
        this.state = {
            datos: [],
            loading: true,
            clonado: '',
            periodo:'',
            modalOpen:false,
            modalAction: '',
            modalID: '',
            modalTitle: '',
            modalBody:''
        }
        this.datalist = this.datalist.bind(this);
    }

    updateList = async () => {
        if(UserLogueado.id){
            let user = await axios.get(configData.serverUrl + "/users/informante/"+UserLogueado.id).then(r => r.data).catch(e => undefined);
            let egresos = await axios.get(configData.serverUrl + `/formularioEgreso/owner/${UserLogueado.id}/${user.informante}/${user.periodo}`).then(r => r.data).catch(e => undefined);
            
            if(user){
                this.setState({
                    user: UserLogueado.id,
                    informante: user.informante,
                    periodo: user.periodo,
                    datos: egresos,
                    loading: false,
                    clonado: ''
                });  

                window.paginar('list-group','list-group-item');
            }  
        }
    }
    
    componentDidMount(){
        this.updateList();
    }
    componentDidUpdate(){
        if(this.state.clonado === 'true' ){
           this.updateList()
        }
        window.paginar('list-group','list-group-item');
    }

    actionConfirmModal = () =>{
        if(this.state.modalAction === "delete"){
            axios.delete(configData.serverUrl + "/formularioEgreso/"+this.state.modalID)
                .then(res => console.log(res.data))
                .catch(err => console.log(err))

            this.setState({
                datos: this.state.datos.filter(el => el._id !== this.state.modalID),
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

    createData = () => {window.location.href = "/formularioEgreso";}  
    updateData = (jsondatos) => {window.location.href = "/formularioEgreso/update/"+jsondatos._id;}
    clonarData = (jsondatos) => {
        axios.get(configData.serverUrl + "/formularioEgreso/clonar/"+jsondatos._id)
                .then(res => {
                    this.setState({clonado:'true'});
                    console.log('Clonado',res.data)
                })
                .catch(err => console.log(err))
    }
    deleteData = (jsondatos) => {
        this.setState({
            modalOpen: true,
            modalAction: 'delete',
            modalID: jsondatos._id,
            modalTitle: 'Esta seguro de eliminar el egreso?',
            modalBody:  'Tipo Egreso: '+jsondatos.tipoEgreso+'\n'+
                        'Ruc | Razon Social: '+jsondatos.ruc +" | "+jsondatos.razonSocial
        })
    }

    datalist(){    
        return this.state.datos.map((dato,index) => {
            const date = new Date(dato.fechaEmision);
            const emision =  ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()))+ '/' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + date.getFullYear();
            
            return (<li className="list-group-item list-egresos-item" key={index}>       
                <div className="row col-12 datos-table-desktop">
                    <div className="col-md-1">{emision}</div>
                    <div className="col-md-2">{dato.ruc+" "+dato.razonSocial}</div>
                    <div className="col-md-2">{dato.comprobanteTipo}</div>
                    <div className="col-md-1">{dato.comprobanteNumero}</div>
                    <div className="col-md-1 text-right">{dato.iva5Incluido}</div>
                    <div className="col-md-1 text-right">{dato.iva10Incluido}</div>
                    <div className="col-md-1 text-right">{dato.excentas}</div>
                    <div className="col-md-1 text-right">{dato.totalComprobante}</div>
                 
                    <div className="row col-md-2">
                        <div className="col-md-4">{(dato.monedaExtranjera === "true" ? "SI" : "NO") }</div>
                        <div className="col-md-8 text-right">
                            <button onClick={() => this.clonarData(dato)} type="button" title="Clonar" className="btn btn-light btn-sm mr-1"><FontAwesomeIcon icon={faClone}/></button>
                            <button onClick={() => this.updateData(dato)} type="button" title="Editar" className="btn btn-light btn-sm mr-1"><FontAwesomeIcon icon={faEdit} /></button>
                            <button onClick={() => this.deleteData(dato)} type="button" title="Eliminar" className="btn btn-danger btn-sm"><FontAwesomeIcon icon={faTrash} /></button>
                        </div>
                    </div>
                </div>
                <div className="row col-12 datos-table-mobile">
                        <div className="col-12"><b>Emisión: </b>{emision}</div>
                        <div className="col-12"><b>Razon: </b>{dato.ruc+" "+dato.razonSocial}</div>
                        <div className="col-12"><b>Tipo: </b>{dato.comprobanteTipo}</div>
                        <div className="col-12"><b>Numero: </b>{dato.comprobanteNumero}</div>
                        <div className="col-12"><b>Moneda Extranjera: </b>{(dato.monedaExtranjera === "true" ? "SI" : "NO") }</div>
                        <div className="col-12 text-right"><b>Iva 5%: </b>{dato.iva5Incluido}</div>
                        <div className="col-12 text-right"><b>Iva 10%: </b>{dato.iva10Incluido}</div>
                        <div className="col-12 text-right"><b>Excentas: </b>{dato.excentas}</div>
                        <div className="col-12 text-right"><b>Total: </b>{dato.totalComprobante}</div>
                        <div className="row col-12">
                            <div className="text-left">
                                <button onClick={() => this.clonarData(dato)} type="button" title="Clonar" className="btn btn-light btn-sm mr-1"><FontAwesomeIcon icon={faClone}/></button>
                                <button onClick={() => this.updateData(dato)} type="button" title="Editar" className="btn btn-light btn-sm mr-1"><FontAwesomeIcon icon={faEdit} /></button>
                                <button onClick={() => this.deleteData(dato)} type="button" title="Eliminar" className="btn btn-danger btn-sm"><FontAwesomeIcon icon={faTrash} /></button>
                            </div>
                        </div>
                    </div>
                </li>)
        })
    }
    render(){     
        return(
            <div className="ml-1">
                {this.state.modalOpen && <Modal setOpenModal={this.setOpenModal} title={this.state.modalTitle} body={this.state.modalBody} actionConfirmModal={this.actionConfirmModal} actionString={this.state.modalAction}/>}
                <div className="row mb-0 col-md-12">
                    <div className="col-8 title-form">
                        <h3>Formulario Egresos del Periodo {this.state.periodo}</h3>
                    </div>
                    <div className="col-4 text-right btn-createform-desktop">
                        <button onClick={() => this.createData()} type="button" className="btn btn-success btn-sm"><FontAwesomeIcon icon={faPlus} /> Agregar Egreso</button>
                    </div>                       
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">                            
                            <div className="card-header title-table-desktop">
                                <div className="card-title row mb-0">  
                                    <div className="col-md-1">Emisión</div>
                                    <div className="col-md-2">Ruc | Razon Social</div>
                                    <div className="col-md-2">Tipo Comprobante</div>
                                    <div className="col-md-1">Comprobante</div>
                                    <div className="col-md-1">IVA 5% Incluido</div>
                                    <div className="col-md-1">IVA 10% Incluido</div>
                                    <div className="col-md-1">Excentas</div>
                                    <div className="col-md-1">Total</div>
                                    <div className="col-md-1">Moneda Extrangera</div>                             
                                </div>
                            </div>
                            <div className="card-header title-table-mobile">
                                <div className="card-title row mb-0"> 
                                    <div className="col-5">Resumen</div>
                                    <div className="col-7 text-right btn-createform-mobile">
                                        <button onClick={() => this.createData()} type="button" className="btn btn-success btn-sm"><FontAwesomeIcon icon={faPlus} /> Agregar Egreso</button>
                                    </div>  
                                </div>
                            </div>

                            <input id="input-search" className="form-control" type="search" placeholder="Busqueda (minimo 3 letras)..." />
                            <ul id="list" className="list-group">
                                {this.state.loading ? 
                                    <Spinner animation="border" variant="primary" style={{margin:"25px",alignSelf:"center"}}/> 
                                :
                                    this.state.datos && this.datalist()
                                }
                            </ul>                     
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}