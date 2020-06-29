import React from "react";
import "./styles.css";
import * as Flex from '@twilio/flex-ui';
import { connect } from 'react-redux';

class QueueSelector extends React.Component {

    toggleQueueSelectorPanel = () => {
        
        Flex.Actions.invokeAction('SetComponentState', {
            name: 'QueueSelectorPanel',
            state: { isHidden: !this.props.isHidden }
        });

    }

    componentDidMount() {
        Flex.Actions.invokeAction('SetComponentState', {
            name: 'QueueSelectorPanel',
            state: { isHidden: (typeof this.props.isHidden === "undefined") ? true : this.props.isHidden  }
        });
    }

    render () {

        return (
            <div className="wrapper">
                <div className="tray" onClick={this.toggleQueueSelectorPanel}>
                    <Flex.Icon icon="SettingsBold"  />
                </div>
            </div>
        )
    } 
       
    
}

const mapStateToProps = state => {
    const componentViewStates = state.flex.view.componentViewStates;
    const QueueSelectorPanelState = componentViewStates && componentViewStates.QueueSelectorPanel;
    const isHidden = QueueSelectorPanelState && QueueSelectorPanelState.isHidden;

    return {
        isHidden
    }
};

export default connect(mapStateToProps)(QueueSelector);