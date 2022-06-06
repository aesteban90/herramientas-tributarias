import React, {Component} from 'react';
import Select from 'react-select';
import NumberFormat from 'react-number-format'; 
import axios from 'axios';
import DatePicker from 'react-datepicker';
import MaskedInput from 'react-maskedinput';
import Switch from '../../configuraciones/switch-toggle.component';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../utiles/registerLocaleEsp.js';
import Modal from '../../modals/modal';
import { UserLogueado } from '../../../App';
const configData = require('../../../config.json'); 

export default class FormularioIngreso extends Component{
    constructor(props){
        super(props);
        this.state = {
            user_created:'',
            user_updated:'',
            user: '',
            informante: '',        
            informanteName: '',
            informantePeriodo: '',
            informanteRuc: '',
            tipoIdentificacionOptions: [],
            tipoIdentificacionSelected:{},
            tipoComprobanteOptions: [],
            tipoComprobanteSelected: {},
            tipoIngresoOptions: [],
            tipoIngresoSelected: {},
            RucsOptions: [],
            RucsSelected:{},
            condicionOptions: [],
            condicionSelected:{},
            timbradoOptions: [],
            timbradoSelected:{},
            isGravadoIRP: false,
            isGravadoIRE: false,
            isMonedaExtranjera: false,
            comprobanteNumero: '',
            excenta: '',
            IVA5: '',
            IVA10: '',
            montoVenta: '',
            costoDeducido: '',
            totalIVA: '',
            totalComprobante: '',
            rentaNetaReal: '',
            rentaNetaPresunta: '',
            rentaNetaImponible: '',
            fechaCobro: '',
            fechaEmision: '',
            clasificacion: '',
            modalOpen:false,
            modalAction: '',
            modalID: '',
            modalTitle: '',
            modalBody:'',
            message:''
        };
    }
    
    componentDidMount(){  

        /*Verificando Periodo del Informante*/
        console.log('componentDidMount');
        try {
            axios.get(configData.serverUrl + "/users/informante/"+UserLogueado.id)
            .then(response => {
                if(!response.data.periodo){
                    this.setState({                        
                        modalOpen:true,
                        modalAction: 'informante',
                        modalTitle: 'Datos del Informante necesario',
                        modalBody:'Por favor agregue los datos del informante y periodo para completar el formulario'
                    })
                }else{
                    this.setState({
                        user: UserLogueado.id,
                        informante: response.data.informante,
                        informanteName: response.data.razonSocial,
                        informantePeriodo: response.data.periodo,
                        informanteRuc: response.data.ruc+"-"+response.data.div,
                        user_created: UserLogueado.nick,
                        user_updated: UserLogueado.nick
                    });
                }
            })
            .catch(err => console.log(err))
        } catch (error) {
            console.log(error); 
        }
        

        let options = [];
        /*Tipo Identificacion Opciones*/
        axios.get(configData.serverUrl + "/tipo-identificacion/ingreso/")
        .then(response => {
            options = [];
            response.data.forEach(element => {
                options.push({value:element.codigo,label:element.descripcion});
            });
            this.setState({
                tipoIdentificacionSelected: options[0],
                tipoIdentificacionOptions: options
            });
        })
        .catch(err => console.log(err)) 

        /*Tipo COmprobante Opciones */
        axios.get(configData.serverUrl + "/tipo-comprobante/ingresos-ventas/")
        .then(response => {
            options = [];
            response.data.forEach(element => {
                options.push({value:element.codigo,label:element.descripcion});
            });
            this.setState({
                tipoComprobanteSelected: options[0],
                tipoComprobanteOptions: options
            });
        })
        .catch(err => console.log(err))    

        /* Condicion Opciones */
        options = [];
        options.push({value:"1",label:"Contado"});
        options.push({value:"2",label:"Credito"});
        options.push({value:"3",label:"No Aplica"});
        this.setState({
            condicionSelected: options[0],
            condicionOptions: options
        });
        /*Tipo Ingreso Opciones*/
        axios.get(configData.serverUrl + "/tipo-ingreso/")
        .then(response => {
            options = [];
            response.data.forEach(element => {
                options.push({value:element._id,label:element.codigo +"-"+element.descripcion});
            });
            this.setState({
                tipoIngresoSelected: options[0],
                tipoIngresoOptions: options
            });
        })
    }
    componentDidUpdate(){
        if(this.state.timbradoOptions.length === 0){
            let options = [];
            /*Timbrado Opciones */
            if(UserLogueado.ruc){
                axios.get(configData.serverUrl + `/timbrados/ruc/${UserLogueado.ruc}/${UserLogueado.id}`)
                .then(response => {
                    options = [];
                    if(response.data.length > 0){
                        response.data.forEach(element => {
                            let dateExpira = new Date(element.vencimiento);
                            let expiraString =  ((dateExpira.getDate() > 9) ? dateExpira.getDate() : ('0' + dateExpira.getDate()))+ '/' + ((dateExpira.getMonth() > 8) ? (dateExpira.getMonth() + 1) : ('0' + (dateExpira.getMonth() + 1))) + '/' + dateExpira.getFullYear();
                            options.push({value:element.numero,label:element.numero+" - "+expiraString});
                        });
                        this.setState({
                            timbradoSelected: options[0],
                            timbradoOptions: options
                        });            
                    } 
                })
                .catch(err => console.log(err))  
            }
        }
    }
    
    onKeyUpRucsOptions = (e) => {
        if(e.target.value.length > 5){
            axios.get(configData.serverUrl + "/rucs/content/"+e.target.value)
            .then(response => {
                let options = [];
                response.data.forEach(element => {
                    options.push({
                        value: element._id,
                        label: element.ruc+"-"+element.div+" | "+element.razonSocial + " | "+element.ruc.replace(/\./g,'') 
                    });
                });
                this.setState({
                    RucsSelected: options[0],
                    RucsOptions: options
                });
            })
            .catch(err => console.log(err))  
        }
    }

    handleCloseAlert = () =>{document.querySelector('#alert').classList.replace('show','hide');}
    
    onChangeTipoingresoOptions = (selectedOption) => {
        this.setState({tipoIngresoSelected: selectedOption}, () => this.calcularRentaNeta());
        if(selectedOption.label.indexOf("0")>-1){
            document.querySelector("#check_irp").checked = false;
            document.querySelector("#check_ire").checked = false;
            document.querySelector("#gravado_irp").setAttribute('class', 'd-none');
            document.querySelector("#gravado_ire").setAttribute('class', 'd-none');
        }
        if(selectedOption.label.indexOf("501")>-1){
            document.querySelector('#monto_venta').setAttribute('class', 'form-group col-md-2');
            document.querySelector('#total_comprobante').setAttribute('class', 'form-group col-md-2');
            document.querySelector('#total_iva').setAttribute('class', 'form-group col-md-2');
            document.querySelector('#gravado_ire').setAttribute('class', 'form-group col-md-1');
            document.querySelector('#gravado_irp').setAttribute('class', 'd-none');
            document.querySelector('#clasificacion').setAttribute('class', 'd-none');   
            document.querySelector('#form-516-calc').setAttribute('class', 'd-none');
        }else if(selectedOption.label.indexOf("515")>-1){
            document.querySelector('#monto_venta').setAttribute('class', 'form-group col-md-2');
            document.querySelector('#total_comprobante').setAttribute('class', 'form-group col-md-2');
            document.querySelector('#total_iva').setAttribute('class', 'form-group col-md-2');
            document.querySelector('#gravado_irp').setAttribute('class', 'form-group col-md-1');
            document.querySelector('#gravado_ire').setAttribute('class', 'd-none');
            document.querySelector('#clasificacion').setAttribute('class', 'd-none');   
            document.querySelector('#form-516-calc').setAttribute('class', 'd-none');
        }else if(selectedOption.label.indexOf("516")>-1){
            document.querySelector('#gravado_irp').setAttribute('class', 'd-none');
            document.querySelector('#gravado_ire').setAttribute('class', 'd-none');
            document.querySelector('#monto_venta').setAttribute('class', 'd-none');   
            document.querySelector('#total_comprobante').setAttribute('class', 'd-none');
            document.querySelector('#total_iva').setAttribute('class', 'd-none');
            document.querySelector('#clasificacion').setAttribute('class', 'form-group col-md-6');   
            document.querySelector('#form-516-calc').setAttribute('class', 'row col-md-12');            
        }
    };
    onChangeTipoIdentificacionOptions = (selectedOption) => {this.setState({tipoIdentificacionSelected: selectedOption})};
    onChangeExcenta = (e) => {this.setState({excenta: e.target.value}, () => this.calcularMontoVenta())};
    onChangeIVA5 = (e) => {this.setState({IVA5: e.target.value}, () => this.calcularMontoVenta())};
    onChangeIVA10 = (e) => {this.setState({IVA10: e.target.value}, () => this.calcularMontoVenta())};
    calcularMontoVenta = () =>{        
        let excenta = (this.state.excenta === '' ? 0 : this.state.excenta.replace(/\./g,''))
        let IVA5 = (this.state.IVA5 === '' ? 0 : this.state.IVA5.replace(/\./g,''))
        let IVA10 = (this.state.IVA10 === '' ? 0 : this.state.IVA10.replace(/\./g,''))
        let o = parseInt(excenta);
        let r = parseInt(IVA5) / 1.05;
        let p = parseInt(IVA10) / 1.1;
        
        let q = p * 0.1;
        let s = r * 0.05;
        let montoVenta = Math.round(o + r + p);
        let totalIVA = Math.round(q + s);
        let totalComprobante = montoVenta + totalIVA

        this.setState({montoVenta,totalIVA,totalComprobante},() => this.calcularRentaNeta());
    };
    onChangeComprobanteNumero = (e) => {this.setState({comprobanteNumero: e.target.value})};
    onChangeCostoDeducido = (e) => {this.setState({costoDeducido: e.target.value}, () => this.calcularRentaNeta())};
    onChangeFechaCobro = (date) => {this.setState({fechaCobro: date})}    
    onChangeFechaEmision = (date) => {this.setState({fechaEmision: date})}
    calcularRentaNeta = () =>{
        if(this.state.tipoIngresoSelected.label.indexOf('516')>-1){
            let rentaNetaReal = 0;
            let rentaNetaPresunta = 0;
            let rentaNetaImponible = 0;
            let clasificacion= '';
            let montoVenta = parseInt(this.state.montoVenta === '' ? 0 : (this.state.montoVenta+"").replace(/\./g,''));
            let costoDeducido = parseInt(this.state.costoDeducido === '' ? 0 : (this.state.costoDeducido+"").replace(/\./g,''));
            if(this.state.tipoIngresoSelected.value !== "610876410b0ea2125c84d245"){
                //Si es <> Autoveihiculos       
                rentaNetaReal = montoVenta - costoDeducido;
                rentaNetaReal = (rentaNetaReal < 0 ? 0 : rentaNetaReal);

                if(this.state.tipoIngresoSelected.value !== "610876780b0ea2125c84d25b" && this.state.tipoIngresoSelected.value !== "6108767c0b0ea2125c84d25e"){
                    //Si es <> Rescate total o parcial de acciones && si <> Rescate total o parcial de Cuotas partes
                    if(this.state.tipoIngresoSelected.value === "610876740b0ea2125c84d258" || this.state.tipoIngresoSelected.value === "610876660b0ea2125c84d255"){
                        //Si === Subarrendamiento de Inmueble || si === Arrendamiento de Inmueble
                        rentaNetaPresunta = Math.round(montoVenta * 0.5);
                    }else{
                        rentaNetaPresunta = Math.round(montoVenta * 0.3);
                    }
                    rentaNetaImponible = (rentaNetaReal >= rentaNetaPresunta ? rentaNetaPresunta: rentaNetaReal )                
                }else{
                    rentaNetaImponible = rentaNetaReal;
                }
                
                //Clasificacion
                if(montoVenta > costoDeducido){
                    clasificacion = 'Por Renta Neta Real. Precio de Venta/Arrendamiento es mayor que el Precio de Compra, Gasto o Aporte de Capital';
                }else{
                    clasificacion = 'Por Renta Neta Real. Precio de Venta/Arrendamiento es menor o igual que el Precio de Compra, Gasto o Aporte de Capital';
                }
            }else{
                rentaNetaImponible = Math.round(costoDeducido + (montoVenta - costoDeducido) * 0.3);
                //Clasificacion
                if(montoVenta > costoDeducido){
                    clasificacion = 'Renta Neta imponible cuando el Precio de Venta es mayor que el Costo Deducido';
                }else{
                    clasificacion = 'Renta Neta imponible cuando el Precio de Venta es menor o igual que el Costo Deducido';
                }
            }

            
            this.setState({rentaNetaReal, rentaNetaPresunta, rentaNetaImponible, clasificacion})
        }
    }

    onChangeTimbradoOptions = (selectedOption) => this.setState({timbradoSelected: selectedOption})
    onChangeTipoComprobanteOptions = (selectedOption) => {
        this.setState({
            tipoComprobanteSelected: selectedOption
        })
        if(selectedOption.value === "109"){
            document.querySelector('#timbrados').setAttribute('class', 'form-group col-md-3');
        }else if(selectedOption.value === "208"){//Liquidacion Salario
            document.querySelector('#div-numero-comprobante input').setAttribute('required','')
        }else{
            document.querySelector('#timbrados').setAttribute('class', 'd-none');
            document.querySelector('#div-numero-comprobante input').removeAttribute('required')
        }
    };
    onChangeRucsOptions = (selectedOption) => {document.querySelector('#selectRuc input').removeAttribute('required');this.setState({RucsSelected: selectedOption})};
    onChangeCondicionOptions = (selectedOption) => {this.setState({condicionSelected: selectedOption})};
    onChangeGravadoIRP(isChecked){this.setState({isGravadoIRP: isChecked})};
    onChangeGravadoIRE(isChecked){this.setState({isGravadoIRE: isChecked})};
    onChangeMonedaExtranjera(isChecked){this.setState({isMonedaExtranjera: isChecked})};
    
    actionConfirmModal = () =>{
        if(this.state.modalAction === "informante"){
            window.location = "/informante";
        }
    }
    setOpenModal = () =>{this.setState({modalOpen: !this.state.modalOpen})}
    buttonGuardar = () =>{
        //if(!document.querySelectorAll('.css-g1d714-ValueContainer')[1].querySelector('.css-1uccc91-singleValue')){
        if(!document.querySelector('#div-ruc .css-g1d714-ValueContainer .css-1uccc91-singleValue')){
            document.querySelector('#selectRuc input').setAttribute('required','');
        }        
        if(document.querySelector('#timbrados .css-g1d714-ValueContainer .css-1uccc91-singleValue').innerHTML === ''){
            document.querySelector('#select-timbrados input').setAttribute('required','');
        }else{
            document.querySelector('#select-timbrados input').removeAttribute('required');
        }
        document.querySelector('#btnsubmit').click();
    }
    buttonSalir = () =>{
        window.location = "/";        
    }
    cleanForm = () =>{
        document.querySelector('#div-ruc .css-1uccc91-singleValue').innerText = 'Digite el Ruc o Razon Social'
        this.setState({
            tipoIdentificacionSelected: this.state.tipoIdentificacionOptions[0],
            RucsOptions: [],
            fechaCobro:'',
            fechaEmision:'',
            tipoComprobanteSelected: this.state.tipoComprobanteOptions[0],
            timbradoSelected:{},
            comprobanteNumero:'',
            condicionSelected: this.state.condicionOptions[0],
            tipoIngresoSelected: this.state.tipoIngresoOptions[0],
            excenta: '',
            IVA5: '',
            IVA10: '',
            isMonedaExtranjera: false,
            isGravadoIRE:false,
            isGravadoIRP:false,
            montoVenta: '',
            costoDeducido: '',
            totalIVA: '',
            totalComprobante: '',
            rentaNetaReal: '',
            rentaNetaPresunta: '',
            rentaNetaImponible: ''
        })
        this.onChangeTipoingresoOptions(this.state.tipoIngresoSelected);
        this.onChangeTipoComprobanteOptions( this.state.tipoComprobanteSelected);
    } 
    showNotification(isSuccess, message){        
        if(isSuccess){
            this.cleanForm();
            document.querySelector('.msgactivacion').setAttribute('class','msgactivacion alert alert-success d-block p-2 m-0');
        }else{
            document.querySelector('.msgactivacion').setAttribute('class','msgactivacion alert alert-warning d-block p-2 m-0');
        }
        this.setState({message})
        setTimeout(function(){  document.querySelector('.msgactivacion').classList.replace('d-block','d-none'); }, 3000);
    }
    onSubtmit = (e) => {
        e.preventDefault();
        console.log(configData.serverUrl + '/formularioIngreso/add')
        axios.post(configData.serverUrl + '/formularioIngreso/add',this.state)
                .then(res => this.showNotification(true,'!Guardado con exito.'))
                .catch(err => this.showNotification(false,'!Se encontro un error al guardar. Intentelo mas tarde.'));
    }

    render(){             
        return(
            <div className="container">
                {this.state.modalOpen && <Modal setOpenModal={this.setOpenModal} title={this.state.modalTitle} body={this.state.modalBody} actionConfirmModal={this.actionConfirmModal} actionString={this.state.modalAction} />}
                <form id="formIngreso" onSubmit={this.onSubtmit}>
                    <div className="row ml-1 col-sm-12">
                        <div className="col-sm-4 title-form">
                            <h3>Formulario Ingreso</h3>
                        </div>
                        <div className="row col-sm-8 text-right">
                            <div className="form-group text-center col-sm-9">
                                <div className="msgactivacion alert alert-warning d-none" role="alert">
                                    {this.state.message}
                                </div>
                            </div>
                            <div className="col-sm-3">
                                <button type="button" onClick={this.buttonGuardar}  className="btn btn-primary ml-1" >Guardar</button>
                                <button type="submit" id="btnsubmit" className="submit d-none" ></button>
                                <button type="button" onClick={this.buttonSalir}  className="btn btn-light ml-1" >Salir</button>
                            </div>
                        </div>
                    </div>                   
                    <div className="row ml-1">
                        <div className="row col-md-12">
                            <div className="form-group col-md-3" >
                                <label>Tipo Identificacion: </label><br/>
                                <Select 
                                    noOptionsMessage={() => 'Sin resultados'}
                                    value={this.state.tipoIdentificacionSelected} 
                                    options={this.state.tipoIdentificacionOptions} 
                                    onChange={this.onChangeTipoIdentificacionOptions}                                    
                                    />
                            </div>
                            <div id="div-ruc" className="form-group col-md-5" >
                                <label>Ruc | Razon Social: </label><br/>
                                <div onKeyUp={this.onKeyUpRucsOptions}>
                                    <Select 
                                        id="selectRuc"
                                        placeholder="Digite el Ruc o Razon Social"
                                        noOptionsMessage={() => 'Sin resultados'}
                                        options={this.state.RucsOptions}
                                        onChange={this.onChangeRucsOptions}
                                        required/>
                                </div>
                            </div>                            
                            <div className="form-group col-md-2">
                                <label>Fecha Cobro: </label><br/>
                                <DatePicker 
                                    className="form-control" 
                                    locale="esp"
                                    required
                                    dateFormat="dd/MM/yyyy"
                                    selected={this.state.fechaCobro}
                                    onChange={this.onChangeFechaCobro}
                                    showYearDropdown
                                    isClearable
                                    customInput={
                                        <MaskedInput mask="11/11/1111" placeholder="mm/dd/yyyy" />
                                    }
                                />                             
                            </div>
                            <div className="form-group col-md-2">
                                <label>Fecha Emision: </label><br/>
                                <DatePicker 
                                    className="form-control" 
                                    locale="esp"
                                    required
                                    dateFormat="dd/MM/yyyy"
                                    selected={this.state.fechaEmision}
                                    onChange={this.onChangeFechaEmision}
                                    showYearDropdown
                                    isClearable
                                    customInput={
                                        <MaskedInput mask="11/11/1111" placeholder="mm/dd/yyyy" />
                                    }
                                />
                            </div> 
                        </div>
                        <div className="row col-md-12" >
                            <div className="form-group col-md-4" >
                                <label>Tipo Comprobante: </label><br/>
                                <Select 
                                    noOptionsMessage={() => 'Sin resultados'}
                                    value={this.state.tipoComprobanteSelected} 
                                    options={this.state.tipoComprobanteOptions} 
                                    onChange={this.onChangeTipoComprobanteOptions}                                    
                                    required/>
                            </div>
                            <div id="timbrados" className="form-group col-md-3 d-none" >
                                <label>Timbrado - Vencimiento: </label><br/>
                                <Select 
                                    id="select-timbrados"
                                    placeholder="Seleccione el Timbrado"
                                    noOptionsMessage={() => <a href="/informante">Ir a Configurar Timbrado</a>}
                                    value={this.state.timbradoSelected} 
                                    options={this.state.timbradoOptions} 
                                    onChange={this.onChangeTimbradoOptions}                                    
                                    required/>
                            </div>
                            <div id="div-numero-comprobante" className="form-group col-md-2" >
                                <label>Numero Comprobante: </label><br/>
                                <NumberFormat 
                                    format="###-###-#######"
                                    mask="_"
                                    className="form-control"
                                    value={this.state.comprobanteNumero}
                                    onChange={this.onChangeComprobanteNumero}                                    
                                />
                            </div>
                            <div className="form-group col-md-2" >
                                <label>Condicion: </label><br/>
                                <Select 
                                    noOptionsMessage={() => 'Sin resultados'}
                                    value={this.state.condicionSelected} 
                                    options={this.state.condicionOptions} 
                                    onChange={this.onChangeCondicionOptions}
                                    required/>
                            </div>
                        </div> 
                        <div className="row col-md-12">
                            <div className="form-group col-md-2" >
                                <label>Excentas: </label><br/>
                                <NumberFormat 
                                    thousandSeparator = "."
                                    decimalSeparator = ","
                                    className="form-control"
                                    value={this.state.excenta}
                                    onChange={this.onChangeExcenta}
                                />
                            </div>
                            <div className="form-group col-md-2" >
                                <label>Importe IVA Incluido 5%: </label><br/>
                                <NumberFormat 
                                    thousandSeparator = "."
                                    decimalSeparator = ","
                                    className="form-control"
                                    value={this.state.IVA5}
                                    onChange={this.onChangeIVA5}
                                />
                            </div>
                            <div className="form-group col-md-2" >
                                <label>Importe IVA Incluido 10%: </label><br/>
                                <NumberFormat 
                                    thousandSeparator = "."
                                    decimalSeparator = ","
                                    className="form-control"
                                    value={this.state.IVA10}
                                    onChange={this.onChangeIVA10}
                                />
                            </div> 
                            <div className="form-group col-md-2 d-block" >
                                <label>Moneda Extranjera: </label><br/>
                                    <Switch idToggle="check_moneda" isToggled={this.state.isMonedaExtranjera} onToggle={() => this.onChangeMonedaExtranjera(!this.state.isMonedaExtranjera)} />                       
                            </div>                           
                        </div> 
                        <div className="row col-md-12">
                            <div className="form-group col-md-4" >
                                <label>Tipo Ingreso: </label><br/>
                                <Select 
                                    noOptionsMessage={() => 'Sin resultados'}
                                    value={this.state.tipoIngresoSelected} 
                                    options={this.state.tipoIngresoOptions} 
                                    onChange={this.onChangeTipoingresoOptions}
                                    required/>
                            </div>                           
                            <div id="gravado_irp" className="form-group col-md-1 d-block" >
                                <label>Gravado IRP: </label><br/>
                                    <Switch idToggle="check_irp" isToggled={this.state.isGravadoIRP} onToggle={() => this.onChangeGravadoIRP(!this.state.isGravadoIRP)} />                       
                            </div>
                            <div id="gravado_ire" className="form-group col-md-1 d-none" >
                                <label>Gravado IRE: </label><br/>
                                    <Switch idToggle="check_ire" isToggled={this.state.isGravadoIRE} onToggle={() => this.onChangeGravadoIRE(!this.state.isGravadoIRE)} />
                            </div>
                            <div id="monto_venta" className="form-group col-md-2" >
                                <label>Monto de Venta: </label><br/>
                                <NumberFormat 
                                    disabled
                                    thousandSeparator = "."
                                    decimalSeparator = ","
                                    className="form-control"
                                    value={this.state.montoVenta}
                                />
                            </div>
                            <div id="total_iva" className="form-group col-md-2" >
                                <label>Total IVA: </label><br/>
                                <NumberFormat 
                                    disabled
                                    thousandSeparator = "."
                                    decimalSeparator = ","
                                    className="form-control"
                                    value={this.state.totalIVA}
                                />
                            </div>
                            <div id="total_comprobante" className="form-group col-md-2" >
                                <label>Total Comprobante: </label><br/>
                                <NumberFormat 
                                    disabled
                                    thousandSeparator = "."
                                    decimalSeparator = ","
                                    className="form-control"
                                    value={this.state.totalComprobante}
                                />
                            </div>
                            <div id="clasificacion" className="form-group col-md-6 d-none" >
                                <label>Clasificacion: </label><br/>
                                <textarea type="text"   
                                    disabled
                                    className="form-control"                            
                                    value={this.state.clasificacion}
                                />
                            </div>
                        </div>
                        <div id="form-516-calc" className="row col-md-12 d-none">
                            <div className="form-group col-md-2" >
                                <label>Costo Deducido: </label><br/>
                                 <NumberFormat 
                                    thousandSeparator = "."
                                    decimalSeparator = ","
                                    className="form-control"
                                    value={this.state.costoDeducido}
                                    onChange={this.onChangeCostoDeducido}
                                />
                            </div>
                            <div className="form-group col-md-2" >
                                <label>Renta Neta Real: </label><br/>
                                <NumberFormat 
                                    disabled
                                    thousandSeparator = "."
                                    decimalSeparator = ","
                                    className="form-control"
                                    value={this.state.rentaNetaReal}
                                />
                            </div>  
                            <div className="form-group col-md-2" >
                                <label>Renta Neta Presunta: </label><br/>
                                <NumberFormat 
                                    disabled
                                    thousandSeparator = "."
                                    decimalSeparator = ","
                                    className="form-control"
                                    value={this.state.rentaNetaPresunta}
                                />
                            </div>
                            <div className="form-group col-md-2" >
                                <label>Renta Neta Imponible: </label><br/>
                                <NumberFormat 
                                    disabled
                                    thousandSeparator = "."
                                    decimalSeparator = ","
                                    className="form-control"
                                    value={this.state.rentaNetaImponible}
                                />
                            </div>
                        </div>                         
                    </div>                                  
                </form>
            </div>
        )
    }
}
