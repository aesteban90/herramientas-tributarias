import React, {Component} from 'react';
import axios from 'axios';
import TipoDocumentoIngreso from './tpdoc-ingreso-form.component';
const configData = require('../../../config.json');

export default class TipoDocumentoIngresoList extends Component{
    constructor(props){
        super(props);
        this.state = {
            datos: [],
            idUpdate: '',
            didUpdate: true
        }
        this.datalist = this.datalist.bind(this);
    }

    updateList = async (value) => {
        await axios.get(configData.serverUrl + "/tipo-documento-ingreso/")
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

    deleteData = async (jsondatos) => {
        await axios.delete(configData.serverUrl + "/tipo-documento-ingreso/"+jsondatos._id)
            .then(res => console.log(res.data))
            .catch(err => console.log(err))

        this.setState({
            datos: this.state.datos.filter(el => el._id !== jsondatos._id)
        });

        window.paginar('list-group','list-group-item',true);
    }

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
                    <div className="col-md-2">{dato.tipo}</div>
                    <div className="col-md-2">{dato.codigo}</div>
                    <div className="col-md-6">{dato.descripcion}</div>
                    <div className="col-md-2 text-right">
                        <button onClick={() => this.updateData(dato)} type="button" className="btn btn-light btn-sm mr-1">Editar</button>
                        <button onClick={() => this.deleteData(dato)} type="button" className="btn btn-danger btn-sm">Eliminar</button>
                    </div>
                </li>)
        })
    }
    render(){       
        return(
            <div className="container">
                <div className="row mb-0 col-md-12">
                    <h3>Lista de Tipos de Documentos de Ingresos</h3>
                </div>
                <div className="row">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title row mb-0">  
                                    <div className="col-md-2">Tipo</div>
                                    <div className="col-md-2">Codigo</div>
                                    <div className="col-md-6">Descripcion</div>   
                                    <div className="col-md-2 text-right">
                                        <button onClick={() => this.createData("NEW")} type="button" className="btn btn-success btn-sm">Nuevo</button>
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
                        <TipoDocumentoIngreso idUpdate={this.state.idUpdate} onUpdateParentList={this.updateList}/>
                    </div>
                </div>
            </div>
        )
    }
}