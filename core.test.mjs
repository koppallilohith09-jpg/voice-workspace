import {test} from 'node:test';import assert from 'node:assert/strict';import {parseCommand} from './public/core.js';
test('accepts supported apps and rejects shell injection',()=>{assert.deepEqual(parseCommand('open calculator'),{type:'launch',app:'calculator'});assert.equal(parseCommand('open calculator & del files').type,'unknown')});
test('timer units and bounds',()=>{assert.equal(parseCommand('set a timer for 2 minutes').seconds,120);assert.equal(parseCommand('timer 25 hours').type,'unknown');assert.equal(parseCommand('timer 0 seconds').type,'unknown')});
test('filename query preserves case',()=>assert.equal(parseCommand('find Report.pdf').query,'Report.pdf'));
