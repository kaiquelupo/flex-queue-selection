import React from 'react';
import { FlexPlugin } from 'flex-plugin';

import QueueSelector from './components/QueueSelector';
import QueueSelectorPanel from './components/QueueSelectorPanel';

const PLUGIN_NAME = 'QueueSelectorPlugin';

export default class QueueSelectorPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {

    manager.strings.QueueSelectorPanelTitle = "QUEUES";

    flex.MainHeader.Content.add(<QueueSelector key="queue-selector"/>, {
      sortOrder: 0,
      align: "end"
    });

    flex.MainContainer.Content.add(<QueueSelectorPanel key="queue-selector-panel" />);
    
  }
}
