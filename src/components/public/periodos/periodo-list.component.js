import React, {Component} from 'react';
import axios from 'axios';
import Periodo from './periodo-form.component';
import SwitchList from '../../configuraciones/switchList-toggle.component';
const configData = require('../../../config.json');

export default class PeriodoList extends Component{
    constructor(props){
        super(props);
        this.state = {
            datos: [],
            informante: this.props.informante,
            periodo: this.props.periodo,
            title: this.props.title
        }
        this.datalist = this.datalist.bind(this);
    }

    updateList = () => {
        axios.get(configData.serverUrl + "/periodos/informante/"+this.props.informante)
            .then(response => {      
                this.setState({
                    datos: response.data
                })
            })
            .catch(err => console.log(err))
    }    
    componentDidMount(){
        this.updateList();
        window.paginar('list-periodos','list-periodos-item');
    }
    
    componentDidUpdate(){

        if(this.state.informante !== this.props.informante){
            this.setState({ 
                informante: this.props.informante,
                title: this.props.title
            })
            this.updateList();
            window.paginar('list-periodos','list-periodos-item');
        }

        if(document.querySelector('#periodo_'+this.props.periodo)){
            document.querySelector('#periodo_'+this.props.periodo).checked = true;
        }
    }

    onChangeCheckList = (dato, index) => {
        axios.post(configData.serverUrl + '/informante/update/'+this.props.informante, {
            periodo: dato.periodo
        })
            .then(res => {
                let informante_selected = document.querySelector('.nav-item-informante span').innerText;
                if(informante_selected.indexOf(res.data.ruc)>-1){
                    informante_selected = res.data.ruc +"-"+res.data.div + " | " +res.data.razonSocial +" | "+res.data.periodo;
                    document.querySelector('.nav-item-informante span').innerText = informante_selected;
                }
            })
            .catch(err => console.log(err)); 
            
    } 

    deleteData = (jsondatos) => {
        axios.delete(configData.serverUrl + "/periodos/"+jsondatos._id)
            .then(res => console.log(res.data))
            .catch(err => console.log(err))
        this.setState({
            datos: this.state.datos.filter(el => el._id !== jsondatos._id)
        })
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
        return this.state.datos.map((dato,index) => {
            return (<li className="list-group-item list-periodos-item" key={"pIn-"+index}>   
                    <div className="col-md-2 periodo-check">
                        <SwitchList nameToggle={"toggle_"+this.state.informante} idToggle={"periodo_"+dato.periodo} onToggle={() => this.onChangeCheckList(dato,index)} />                        
                    </div>                
                    <div className="col-md-8">{dato.periodo}</div>
                    <div className="col-md-2 text-right">
                        <button onClick={() => this.deleteData(dato)} type="button" className="btn btn-danger btn-sm">Eliminar</button>
                    </div>
                </li>)
        })
    }
    render(){       
        return(
            
                <div className="row">
                    <div className="col-md-12">
                        <h3>Periodos</h3>
                        <h5>{this.state.title}</h5>
                        <Periodo informante={this.state.informante} onUpdateParentList={this.updateList} />
                    </div>
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title row mb-0">  
                                    <div className="col-md-2"></div>
                                    <div className="col-md-8">Lista de Periodos</div>
                                </div>
                            </div>
                            <ul id="list" className="list-group list-periodos">
                                {this.datalist()}
                            </ul>                     
                        </div>
                    </div>
                </div>
            
        )
    }
}