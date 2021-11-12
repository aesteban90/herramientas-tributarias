import React, {Component} from 'react';
import axios from 'axios';
import Timbrado from './timbrado-form.component';
import {UserLogueado} from '../../../App';
const configData = require('../../../config.json');

export default class TimbradoList extends Component{
    constructor(props){
        super(props);
        this.state = {
            datos: [],
            ruc: this.props.ruc,
            title: this.props.title
        }
        this.datalist = this.datalist.bind(this);
    }

    updateList = () => {
        axios.get(configData.serverUrl + "/timbrados/ruc/"+this.props.ruc+"/"+UserLogueado.id)
            .then(response => {      
                this.setState({
                    datos: response.data
                })
            })
            .catch(err => console.log(err))
    }    
    componentDidMount(){
        this.updateList();
        window.paginar('list-timbrado','list-timbrado-item');
    }

    componentDidUpdate(){
        if(this.state.ruc !== this.props.ruc){
            this.setState({ 
                ruc: this.props.ruc,
                title: this.props.title
            })
            this.updateList();
            window.paginar('list-timbrado','list-timbrado-item');
        }
    }

    deleteData = (jsondatos) => {
        axios.delete(configData.serverUrl + "/timbrados/"+jsondatos._id)
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

    getOwnerTimbrado = (dato) =>{
        if(dato._id)
            return (<button onClick={() => this.deleteData(dato)} type="button" className="btn btn-danger btn-sm">Eliminar</button>)
    }
    
    datalist(){        
        return this.state.datos.map((dato,index) => {
            let dateExpira = new Date(dato.vencimiento);
            let expiraString =  ((dateExpira.getDate() > 9) ? dateExpira.getDate() : ('0' + dateExpira.getDate()))+ '/' + ((dateExpira.getMonth() > 8) ? (dateExpira.getMonth() + 1) : ('0' + (dateExpira.getMonth() + 1))) + '/' + dateExpira.getFullYear();
            return (<li className="list-group-item list-timbrado-item" key={index}>                   
                    <div className="col-md-5">{dato.numero}</div>
                    <div className="col-md-5">{expiraString}</div>
                    <div className="col-md-2 text-right">
                        {this.getOwnerTimbrado(dato)}
                    </div>
                </li>)
        })
    }
    render(){       
        return(
            
                <div className="row">
                    <div className="col-md-12">
                        <h3>Timbrados</h3>
                        <h5>{this.state.title}</h5>
                        <Timbrado ruc={this.state.ruc} onUpdateParentList={this.updateList} />
                    </div>
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title row mb-0">  
                                    <div className="col-md-5">Numero</div>
                                    <div className="col-md-5">Vencimiento</div>   
                                </div>
                            </div>
                            <ul id="list" className="list-group list-timbrado">
                                {this.datalist()}
                            </ul>                     
                        </div>
                    </div>
                </div>
            
        )
    }
}