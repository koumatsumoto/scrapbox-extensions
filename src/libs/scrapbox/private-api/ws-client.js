'use strict';
const exports = {};
exports.__esModule = true;
var endpoint = 'wss://scrapbox.io/socket.io/?EIO=3&transport=websocket';
var getJoinRoomCommand = function(param) {
  var payload = [
    'socket.io-request',
    {
      method: 'room:join',
      data: {
        pageId: null,
        projectId: param.projectId,
        projectUpdatesStream: false,
      },
    },
  ];
  return '420' + JSON.stringify(payload);
};
// 430[...] => [...]
var extractMessage = function(message) {
  while (message.length) {
    var head = message[0];
    // remove head if it is numeric char (part of protocol)
    if (Number.isInteger(Number.parseInt(head))) {
      message = message.substr(1);
    } else {
      return JSON.parse(message);
    }
  }
  return null;
};
var checkConnectionSuccess = function(data) {
  if (
    Array.isArray(data) &&
    data[0] &&
    data[0].data &&
    typeof data[0].data.success === 'boolean'
  ) {
    return data[0].data.success;
  } else {
    return false;
  }
};
var WebsocketClient = /** @class */ (function() {
  function WebsocketClient(option) {
    this.option = option;
    this.socket = null;
    // whether connected and authorized
    this.connected = false;
    this.initialize();
  }
  /**
   * Connect to websocket and register events.
   */
  WebsocketClient.prototype.initialize = function() {
    var _this = this;
    var socket = new WebSocket(endpoint);
    socket.addEventListener('open', function(event) {
      socket.send(getJoinRoomCommand({ projectId: _this.option.projectId }));
      console.log('open', event);
    });
    socket.addEventListener('message', function(event) {
      if (typeof event.data !== 'string') {
        throw new Error('unexpected data received');
      }
      console.log('[debug] ws message', event.data);
      var message = event.data;
      var data = extractMessage(message);
      console.log('[debug] extracted', data);
      // check first connection result
      if (!_this.connected && checkConnectionSuccess(data)) {
        _this.connected = true;
      }
    });
    socket.addEventListener('close', function(event) {
      _this.connected = false;
      // maybe closed by server
      console.error('[websocket-client] connection closed ', event);
    });
    socket.addEventListener('error', function(event) {
      _this.connected = false;
      console.error('[websocket-client] connection errored ', event);
    });
    this.socket = socket;
    // debug
    window.socket = socket;
  };
  return WebsocketClient;
})();
exports.WebsocketClient = WebsocketClient;
// debug
var client = new WebsocketClient({ projectId: '5dc685a50fc39d0017e27559' });
window.client = client;
