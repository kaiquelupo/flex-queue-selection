import React from "react";
import "./styles.css";
import * as Flex from '@twilio/flex-ui';
import { connect } from 'react-redux';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { debounce } from "lodash";

const styles = {
    contained: {
        borderRadius: "0px",
        textTransform: "uppercase",
        marginRight: "15px", 
        padding: "4px 20px",
        fontWeight: "bold",
        fontFamily: "inherit",
        fontSize: "11px"
    },
    inputRoot: {
        height: "20px"
    }
  };

class QueueSelectorPanel extends React.Component {

    state = {
        queues: {},
        selectedQueues: null,
        showMessage: null,
        search: ""
    }

    componentDidMount() {
       this.getQueues();
    }

    getQueues = () => {
        Flex.Manager.getInstance().insightsClient.instantQuery('tr-queue').then((q) => {
            
            q.on('searchResult', (queues) => {

                this.setState({ 
                    queues
                });

                if(!this.state.selectedQueues) {
                    this.setState({ 
                        selectedQueues: Object.keys(queues).reduce((pr, cur) => {
                  
                            if(this.props.workerAttributes.routing.skills.includes(queues[cur].queue_name)){
                                return [...pr, queues[cur].queue_name]
                            }
    
                            return pr;
                            
                        }, []),
                    });
                }
            });

            q.search(this.state.search !== "" ? `data.queue_name CONTAINS "${this.state.search}"` : "");
        });
    }
    
    handleCloseClick = () => {
        Flex.Actions.invokeAction('SetComponentState', {
            name: 'QueueSelectorPanel',
            state: { isHidden: !this.props.isHidden }
        });
    }

    handleChange = (event) => {
        const { selectedQueues } = this.state

        this.setState({
            selectedQueues: event.target.checked ? 
                [ ...selectedQueues, event.target.name] : 
                selectedQueues.filter(elem => elem !== event.target.name),
            showMessage: null
        })
    };

    updateWorkerAttributes = () => {

        const { selectedQueues } = this.state;

        this.setState({ showMessage: "Loading" });

        Flex.Manager.getInstance().workerClient.setAttributes({
            ...this.props.workerAttributes,
            routing: {
                ...this.props.workerAttributes.routing,
                skills: [
                    ...selectedQueues
                ]
            },
            disabled_skills: {
                ...this.props.workerAttributes.disabled_skills,
                skills: [
                    ...(this.props.workerAttributes.disabled_skills.skills).filter(elem => !selectedQueues.includes(elem)),
                    ...(this.props.workerAttributes.routing.skills).filter(elem => !selectedQueues.includes(elem))
                ]
            }
        }).then(() => {

            this.setState({ showMessage: "Saved" });

        }).catch(() => {
            
            alert("Update failed. Please try again or contact support");
            this.setState({ showMessage: "Failed" });

        });
       
    }

    checkBulk = (all) => {
        this.setState({
            selectedQueues:  all ? 
                Object.keys(this.state.queues).reduce((pr, cur) => {
                    return [...pr, this.state.queues[cur].queue_name]
                }, []):
                [],
            showMessage: null
        })
    }


    updateQueueList = debounce((search) => {
        this.setState({ 
            search
        });
        this.getQueues();
    }, 300);

    handleInputChange = (event) => {
        this.updateQueueList(event.target.value);
    };

    render () {
        const { isHidden, classes } = this.props;

        const numberOfChecked = this.state.selectedQueues ? this.state.selectedQueues.length : 0;

        return (
            <Flex.SidePanel
                displayName="QueueSelectorPanel"
                className="queueSelectorPanel"
                isHidden={isHidden}
                title={<div>{Flex.Manager.getInstance().strings.QueueSelectorPanelTitle}</div>}
                handleCloseClick={this.handleCloseClick}
            >
                <div className="header">
                    <div className="header-description">
                        <div className="link" onClick={() => this.checkBulk(true)}>All</div> | 
                        <div className="link" onClick={() => this.checkBulk(false)}>None</div>
                    </div>
                    <div className="header-button-wrapper">
                        <div className="header-button-description">
                            {  
                                this.state.showMessage ? 
                                    <span className="bold">{this.state.showMessage}</span> : 
                                    (<div><span className="bold">{numberOfChecked}</span> selected</div>)
                            }
                        </div>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            classes={{
                                contained: classes.contained
                            }}
                            onClick={this.updateWorkerAttributes}
                            disabled={this.state.showMessage !== "Failed" && this.state.showMessage}
                        >
                            Apply
                        </Button>
                    </div>
                </div>
                <div className="inputWrapper">
                   <input 
                        type="text" 
                        className="input" 
                        onChange={this.handleInputChange}
                        placeholder="Search by name"
                   />
                </div>
                <div className="queueViewer">
                    {Object.keys(this.state.queues).map(queueSid => {
                        const queue = this.state.queues[queueSid];
                        return (
                            <FormControlLabel
                                key={queueSid}
                                control={
                                    <Checkbox 
                                        checked={this.state.selectedQueues ? 
                                            this.state.selectedQueues.includes(queue.queue_name) : 
                                            false
                                        } 
                                        onChange={this.handleChange} 
                                        name={queue.queue_name} 
                                        className="label"
                                        color="primary"
                                    />
                                }
                                label={queue.queue_name}
                            />
                        )
                    })} 
                </div>
            </Flex.SidePanel>
        )
    } 
       
    
}

const mapStateToProps = state => {

    const workerAttributes = state.flex.worker.attributes;
    const componentViewStates = state.flex.view.componentViewStates;
    const QueueSelectorPanelState = componentViewStates && componentViewStates.QueueSelectorPanel;
    const isHidden = QueueSelectorPanelState && QueueSelectorPanelState.isHidden;

    return {
        isHidden,
        workerAttributes
    }
};


export default connect(mapStateToProps)(withStyles(styles)(QueueSelectorPanel));