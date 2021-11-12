import React, {Component} from 'react';
import {Tabs, Tab} from 'react-bootstrap';  
import FormularioIngresoList from './formulario-ingreso/formulario-ingreso-list.component';
import FormularioEgresoList from './formulario-egreso/formulario-egreso-list.component';

export default class Dashboard extends Component{
    constructor(props){
        super(props);
        this.state = {}
    }
    render(){       
        return(
            <div className="container">
                <Tabs transition={false} defaultActiveKey="form-ingresos" className="mb-3 col">
                    <Tab eventKey="form-ingresos" title="Ingresos">
                        <FormularioIngresoList />
                    </Tab>
                    <Tab eventKey="form-egresos" title="Egresos">
                        <FormularioEgresoList />
                    </Tab>
                </Tabs>
            </div>
        )
    }
}