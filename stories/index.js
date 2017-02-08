import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';

storiesOf('Chrome extension UI', module)
  .add('Content UI', () => (
    <div>This is content</div>
  ))
  .add('Popup UI',()=>(
      <div>This is popup</div>
  ))
