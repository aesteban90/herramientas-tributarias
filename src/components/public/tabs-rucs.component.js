import React, {Component} from 'react';
import {Tabs, Tab} from 'react-bootstrap';  
import MisRucs from './rucs-mios/rucs-list.component';
import OtrosRucs from './rucs-otros/rucs-otros-list.component';

export default class RucsList extends Component{
    constructor(props){
        super(props);
        this.state = {
            nickname:'',
            nombre_completo:'',
            password:''
        }
    }

    componentDidMount(){
        console.log('ComponendDidMount',this.props.match)
        if(this.props.match.params.id){
            console.log('ID', this.props.match.params.id)
        }
    }

    buttonActivated = () => {
        window.location.href = "/";
    }

    onChangeNickname = (e) => {
        this.setState({
            nickname: e.target.value
        })
    }
    onChangeNombreCompleto = (e) => {
        this.setState({
            nombre_completo: e.target.value
        })
    }
    onChangePassword = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    createData = (form) =>{
        if(form === "Ingreso"){
            window.location.href = "/formularioegreso"
        }
    }
    
    onSubtmit = (e) => {
        e.preventDefault();
        
    }
    render(){       
        return(
            <div className="container">
                <Tabs transition={false} defaultActiveKey="rucs-mios" className="mb-3 col">
                    <Tab eventKey="rucs-mios" title="Mis Rucs">
                        <MisRucs />
                    </Tab>
                    <Tab eventKey="otro-rucs" title="Rucs de Otros">
                        <OtrosRucs />
                    </Tab>
                </Tabs>
            </div>
        )
    }
}