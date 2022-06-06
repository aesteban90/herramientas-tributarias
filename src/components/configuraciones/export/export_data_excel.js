import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserLogueado } from '../../../App';
import CsvDownloader from 'react-csv-downloader';
const configData = require('../../../config.json');

async function getDataSet(){    
    let user = await axios.get(configData.serverUrl + "/users/informante/"+UserLogueado.id).then(r => r.data).catch(e => undefined);
    let dataExport = [];
    let ingresos = await axios.get(configData.serverUrl + `/formularioIngreso/owner/${UserLogueado.id}/${user.informante}/${user.periodo}`).then(r => r.data).catch(e => []);
    let egresos = await axios.get(configData.serverUrl + `/formularioEgreso/owner/${UserLogueado.id}/${user.informante}/${user.periodo}`).then(r => r.data).catch(e => []);

    dataExport = [...ingresos, ...egresos];

    //Si no encuentra nada
    if(!dataExport) return [];

    //Si no contiene datos no exporta
    if(dataExport.length === 0 ) return [];

    //Codigo Tipos de Registro
    const des_tipo = ['Venta','Compra','Ingreso','Egreso'];
    //const cod_tipo = ['1','2','3','4'];
    let cod_tipo = des_tipo.findIndex((element) => element === dataExport[0].tipo) + 1;
    
    let date = new Date(dataExport[0].fechaEmision);
    let emision =  ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()))+ '/' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + date.getFullYear();

    const headers = [
        { id: "tipo", displayName: "tipo" },
        { id: "identificacion", displayName: "identificacion" },
        { id: "ruc", displayName: "ruc" },
        { id: "razonsocial", displayName: "razonsocial" },
        { id: "comprobantetipo", displayName: "comprobantetipo" },
        { id: "emision", displayName: "emision" },
        { id: "informantetimbrado", displayName: "informantetimbrado" },
        { id: "comprobantenumero", displayName: "comprobantenumero" },
        { id: "iva10incluido", displayName: "iva10incluido" },
        { id: "iva5incluido", displayName: "iva5incluido" },
        { id: "excentas", displayName: "excentas" },
        { id: "montoventa", displayName: "montoventa" },
        { id: "condicioncodigo", displayName: "condicioncodigo" },
        { id: "monedaextranjera", displayName: "monedaextranjera" },
        { id: "imputaiva", displayName: "imputaiva" },
        { id: "gravadoire", displayName: "gravadoire" },
        { id: "gravadoirp", displayName: "gravadoirp" },
        { id: "comprobanteasociado", displayName: "comprobanteasociado" },
        { id: "timbradoasociado", displayName: "timbradoasociado" }
      ];

    const DataSet = 
        {
            filename: 'Herramientas Tributarias - Formularios',
            extension: '.csv',
            headers,
            data: dataExport.map((data) => {
                cod_tipo = des_tipo.findIndex((element) => element === data.tipo) +1;
                date = new Date(data.fechaEmision);
                emision =  ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()))+ '/' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + date.getFullYear(); 
                let monto = (cod_tipo === 2 || cod_tipo === 4 ? data.montoCompra : data.montoVenta )

                return {
                    tipo: cod_tipo + "",
                    identificacion: data.identificacionCodigo,
                    ruc: data.ruc,
                    razonsocial: data.razonSocial,
                    comprobantetipo: data.comprobanteTipoCodigo,
                    emision: emision,
                    informantetimbrado: data.informanteTimbrado,
                    comprobantenumero: data.comprobanteNumero,
                    iva10incluido: data.iva10Incluido.replace(/\./gi,''),
                    iva5incluido: data.iva5Incluido.replace(/\./gi,''),
                    excentas: data.excentas.replace(/\./gi,''),
                    montoventa: monto.replace(/\./gi,''),
                    condicioncodigo: data.condicionCodigo,
                    monedaextranjera: (data.monedaExtranjera ? "S" : "N"),
                    imputaiva: (data.imputaIVA ? "S" : "N"),
                    gravadoire: (data.gravadoIRE ? "S" : "N"),
                    gravadoirp: (data.gravadoIRP ? "S" : "N"),
                    comprobanteasociado: '',//Comprobante Asociado
                    timbradoasociado: '' //Timbrado Asociado
                }
            })
        }
    ;    
    return DataSet;
};

function ExportData(props){
    const [csvReport, setCsvReport] = useState({data:[], headers:[], filename:'', extension: ''});
    const [reload, setReload] = useState(props.reload);

    useEffect(()=>{
        async function reloadDataSet(){
            if(reload){
                setCsvReport(await getDataSet());
                setReload(false);

                console.log('csvReport',csvReport)
            }
        }
        reloadDataSet();
    })

    if (csvReport.data !== undefined && csvReport.data.length > 0){
        console.log(csvReport.data);
        return (
            <div>
                <CsvDownloader 
                    separator='  '
                    id="exportDataExcel"
                    filename={csvReport.filename}  
                    extension={csvReport.extension} 
                    className="d-none" 
                    datas={csvReport.data} 
                    noHeader={true} />
            </div>
        )
    }else{
        return (
            <div></div>
        )
    }
}

export { ExportData }