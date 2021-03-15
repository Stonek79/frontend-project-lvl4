"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var getNextId = function getNextId() {
  return Number(_lodash["default"].uniqueId());
};

var buildState = function buildState(defaultState) {
  var generalChannelId = getNextId();
  var randomChannelId = getNextId();
  var state = {
    channels: [{
      id: generalChannelId,
      name: 'general',
      removable: false
    }, {
      id: randomChannelId,
      name: 'random',
      removable: false
    }],
    messages: [],
    currentChannelId: generalChannelId
  };

  if (defaultState.messages) {
    var _state$messages;

    (_state$messages = state.messages).push.apply(_state$messages, _toConsumableArray(defaultState.messages));
  }

  if (defaultState.channels) {
    var _state$channels;

    (_state$channels = state.channels).push.apply(_state$channels, _toConsumableArray(defaultState.channels));
  }

  if (defaultState.currentChannelId) {
    state.currentChannelId = defaultState.currentChannelId;
  }

  return state;
};

var _default = function _default(app, io) {
  var defaultState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var state = buildState(defaultState);
  app.get('/', function (_req, reply) {
    reply.view('index.pug', {
      gon: state
    });
  }).get('/api/v1/channels', function (_req, reply) {
    var resources = state.channels.map(function (c) {
      return {
        type: 'channels',
        id: c.id,
        attributes: c
      };
    });
    var response = {
      data: resources
    };
    reply.send(response);
  }).post('/api/v1/channels', function (req, reply) {
    var name = req.body.data.attributes.name;
    var channel = {
      name: name,
      removable: true,
      id: getNextId()
    };
    state.channels.push(channel);
    reply.code(201);
    var data = {
      data: {
        type: 'channels',
        id: channel.id,
        attributes: channel
      }
    };
    reply.send(data);
    io.emit('newChannel', data);
  })["delete"]('/api/v1/channels/:id', function (req, reply) {
    var channelId = Number(req.params.id);
    state.channels = state.channels.filter(function (c) {
      return c.id !== channelId;
    });
    state.messages = state.messages.filter(function (m) {
      return m.channelId !== channelId;
    });
    reply.code(204);
    var data = {
      data: {
        type: 'channels',
        id: channelId
      }
    };
    reply.send(data);
    io.emit('removeChannel', data);
  }).patch('/api/v1/channels/:id', function (req, reply) {
    var channelId = Number(req.params.id);
    var channel = state.channels.find(function (c) {
      return c.id === channelId;
    });
    var attributes = req.body.data.attributes;
    channel.name = attributes.name;
    var data = {
      data: {
        type: 'channels',
        id: channelId,
        attributes: channel
      }
    };
    reply.send(data);
    io.emit('renameChannel', data);
  }).get('/api/v1/channels/:channelId/messages', function (req, reply) {
    var messages = state.messages.filter(function (m) {
      return m.channelId === Number(req.params.channelId);
    });
    var resources = messages.map(function (m) {
      return {
        type: 'messages',
        id: m.id,
        attributes: m
      };
    });
    var response = {
      data: resources
    };
    reply.send(response);
  }).post('/api/v1/channels/:channelId/messages', function (req, reply) {
    var attributes = req.body.data.attributes;

    var message = _objectSpread(_objectSpread({}, attributes), {}, {
      channelId: Number(req.params.channelId),
      id: getNextId()
    });

    state.messages.push(message);
    reply.code(201);
    var data = {
      data: {
        type: 'messages',
        id: message.id,
        attributes: message
      }
    };
    reply.send(data);
    io.emit('newMessage', data);
  });
};

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NlcnZlci9yb3V0ZXMuanMiXSwibmFtZXMiOlsiZ2V0TmV4dElkIiwiTnVtYmVyIiwiXyIsInVuaXF1ZUlkIiwiYnVpbGRTdGF0ZSIsImRlZmF1bHRTdGF0ZSIsImdlbmVyYWxDaGFubmVsSWQiLCJyYW5kb21DaGFubmVsSWQiLCJzdGF0ZSIsImNoYW5uZWxzIiwiaWQiLCJuYW1lIiwicmVtb3ZhYmxlIiwibWVzc2FnZXMiLCJjdXJyZW50Q2hhbm5lbElkIiwicHVzaCIsImFwcCIsImlvIiwiZ2V0IiwiX3JlcSIsInJlcGx5IiwidmlldyIsImdvbiIsInJlc291cmNlcyIsIm1hcCIsImMiLCJ0eXBlIiwiYXR0cmlidXRlcyIsInJlc3BvbnNlIiwiZGF0YSIsInNlbmQiLCJwb3N0IiwicmVxIiwiYm9keSIsImNoYW5uZWwiLCJjb2RlIiwiZW1pdCIsImNoYW5uZWxJZCIsInBhcmFtcyIsImZpbHRlciIsIm0iLCJwYXRjaCIsImZpbmQiLCJtZXNzYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxTQUFTLEdBQUcsU0FBWkEsU0FBWTtBQUFBLFNBQU1DLE1BQU0sQ0FBQ0MsbUJBQUVDLFFBQUYsRUFBRCxDQUFaO0FBQUEsQ0FBbEI7O0FBRUEsSUFBTUMsVUFBVSxHQUFHLFNBQWJBLFVBQWEsQ0FBQ0MsWUFBRCxFQUFrQjtBQUNuQyxNQUFNQyxnQkFBZ0IsR0FBR04sU0FBUyxFQUFsQztBQUNBLE1BQU1PLGVBQWUsR0FBR1AsU0FBUyxFQUFqQztBQUNBLE1BQU1RLEtBQUssR0FBRztBQUNaQyxJQUFBQSxRQUFRLEVBQUUsQ0FDUjtBQUFFQyxNQUFBQSxFQUFFLEVBQUVKLGdCQUFOO0FBQXdCSyxNQUFBQSxJQUFJLEVBQUUsU0FBOUI7QUFBeUNDLE1BQUFBLFNBQVMsRUFBRTtBQUFwRCxLQURRLEVBRVI7QUFBRUYsTUFBQUEsRUFBRSxFQUFFSCxlQUFOO0FBQXVCSSxNQUFBQSxJQUFJLEVBQUUs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RTVELFFBQU1nQixPQUFPLG1DQUNSaEIsVUFEUTtBQUVYVSxNQUFBQSxTQUFTLEVBQUVwQyxNQUFNLENBQUMrQixHQUFHLENBQUNNLE1BQUosQ0FBV0QsU0FBWixDQUZOO0FBR1gzQixNQUFBQSxFQUFFLEVBQUVWLFNBQVM7QUFIRixNQUFiOztBQUtBUSxJQUFBQSxLQUFLLENBQUNLLFFBQU4sQ0FBZUUsSUFBZixDQUFvQjRCLE9BQXBCO0FBQ0F2QixJQUFBQSxLQUFLLENBQUNlLElBQU4sQ0FBVyxHQUFYO0FBQ0EsUUFBTU4sSUFBSSxHQUFHO0FBQ1hBLE1BQUFBLElBQUksRUFBRTtBQUNKSCxRQUFBQSxJQUFJLEVBQUUsVUFERjtBQUVKaEIsUUFBQUEsRUFBRSxFQUFFaUMsT0FBTyxDQUFDakMsRUFGUjtBQUdKaUIsUUFBQUEsVUFBVSxFQUFFZ0I7QUFIUjtBQURLLEtBQWI7QUFPQXZCLElBQUFBLEtBQUssQ0FBQ1UsSUFBTixDQUFXRCxJQUFYO0FBQ0FaLElBQUFBLEVBQUUsQ0FBQ21CLElBQUgsQ0FBUSxZQUFSLEVBQXNCUCxJQUF0QjtBQUNELEdBakdIO0FBa0dELEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAdHMtY2hlY2tcblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuY29uc3QgZ2V0TmV4dElkID0gKCkgPT4gTnVtYmVyKF8udW5pcXVlSWQoKSk7XG5cbmNvbnN0IGJ1aWxkU3RhdGUgPSAoZGVmYXVsdFN0YXRlKSA9PiB7XG4gIGNvbnN0IGdlbmVyYWxDaGFubmVsSWQgPSBnZXROZXh0SWQoKTtcbiAgY29uc3QgcmFuZG9tQ2hhbm5lbElkID0gZ2V0TmV4dElkKCk7XG4gIGNvbnN0IHN0YXRlID0ge1xuICAgIGNoYW5uZWxzOiBbXG4gICAgICB7IGlkOiBnZW5lcmFsQ2hhbm5lbElkLCBuYW1lOiAnZ2VuZXJhbCcsIHJlbW92YWJsZTogZmFsc2UgfSxcbiAgICAgIHsgaWQ6IHJhbmRvbUNoYW5uZWxJZCwgbmFtZTogJ3JhbmRvbScsIHJlbW92YWJsZTogZmFsc2UgfSxcbiAgICBdLFxuICAgIG1lc3NhZ2VzOiBbXSxcbiAgICBjdXJyZW50Q2hhbm5lbElkOiBnZW5lcmFsQ2hhbm5lbElkLFxuICB9O1xuXG4gIGlmIChkZWZhdWx0U3RhdGUubWVzc2FnZXMpIHtcbiAgICBzdGF0ZS5tZXNzYWdlcy5wdXNoKC4uLmRlZmF1bHRTdGF0ZS5tZXNzYWdlcyk7XG4gIH1cbiAgaWYgKGRlZmF1bHRTdGF0ZS5jaGFubmVscykge1xuICAgIHN0YXRlLmNoYW5uZWxzLnB1c2goLi4uZGVmYXVsdFN0YXRlLmNoYW5uZWxzKTtcbiAgfVxuICBpZiAoZGVmYXVsdFN0YXRlLmN1cnJlbnRDaGFubmVsSWQpIHtcbiAgICBzdGF0ZS5jdXJyZW50Q2hhbm5lbElkID0gZGVmYXVsdFN0YXRlLmN1cnJlbnRDaGFubmVsSWQ7XG4gIH1cblxuICByZXR1cm4gc3RhdGU7XG59O1xuXG5leHBvcnQgZGVmYXVsdCAoYXBwLCBpbywgZGVmYXVsdFN0YXRlID0ge30pID0+IHtcbiAgY29uc3Qgc3RhdGUgPSBidWlsZFN0YXRlKGRlZmF1bHRTdGF0ZSk7XG5cbiAgYXBwXG4gICAgLmdldCgnLycsIChfcmVxLCByZXBseSkgPT4ge1xuICAgICAgcmVwbHkudmlldygnaW5kZXgucHVnJywgeyBnb246IHN0YXRlIH0pO1xuICAgIH0pXG4gICAgLmdldCgnL2FwaS92MS9jaGFubmVscycsIChfcmVxLCByZXBseSkgPT4ge1xuICAgICAgY29uc3QgcmVzb3VyY2VzID0gc3RhdGUuY2hhbm5lbHMubWFwKChjKSA9PiAoe1xuICAgICAgICB0eXBlOiAnY2hhbm5lbHMnLFxuICAgICAgICBpZDogYy5pZCxcbiAgICAgICAgYXR0cmlidXRlczogYyxcbiAgICAgIH0pKTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0ge1xuICAgICAgICBkYXRhOiByZXNvdXJjZXMsXG4gICAgICB9O1xuICAgICAgcmVwbHkuc2VuZChyZXNwb25zZSk7XG4gICAgfSlcbiAgICAucG9zdCgnL2FwaS92MS9jaGFubmVscycsIChyZXEsIHJlcGx5KSA9PiB7XG4gICAgICBjb25zdCB7IGRhdGE6IHsgYXR0cmlidXRlczogeyBuYW1lIH0gfSB9ID0gcmVxLmJvZHk7XG4gICAgICBjb25zdCBjaGFubmVsID0ge1xuICAgICAgICBuYW1lLFxuICAgICAgICByZW1vdmFibGU6IHRydWUsXG4gICAgICAgIGlkOiBnZXROZXh0SWQoKSxcbiAgICAgIH07XG4gICAgICBzdGF0ZS5jaGFubmVscy5wdXNoKGNoYW5uZWwpO1xuICAgICAgcmVwbHkuY29kZSgyMDEpO1xuICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHR5cGU6ICdjaGFubmVscycsXG4gICAgICAgICAgaWQ6IGNoYW5uZWwuaWQsXG4gICAgICAgICAgYXR0cmlidXRlczogY2hhbm5lbCxcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICAgIHJlcGx5LnNlbmQoZGF0YSk7XG4gICAgICBpby5lbWl0KCduZXdDaGFubmVsJywgZGF0YSk7XG4gICAgfSlcbiAgICAuZGVsZXRlKCcvYXBpL3YxL2NoYW5uZWxzLzppZCcsIChyZXEsIHJlcGx5KSA9PiB7XG4gICAgICBjb25zdCBjaGFubmVsSWQgPSBOdW1iZXIocmVxLnBhcmFtcy5pZCk7XG4gICAgICBzdGF0ZS5jaGFubmVscyA9IHN0YXRlLmNoYW5uZWxzLmZpbHRlcigoYykgPT4gYy5pZCAhPT0gY2hhbm5lbElkKTtcbiAgICAgIHN0YXRlLm1lc3NhZ2VzID0gc3RhdGUubWVzc2FnZXMuZmlsdGVyKChtKSA9PiBtLmNoYW5uZWxJZCAhPT0gY2hhbm5lbElkKTtcbiAgICAgIHJlcGx5LmNvZGUoMjA0KTtcbiAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB0eXBlOiAnY2hhbm5lbHMnLFxuICAgICAgICAgIGlkOiBjaGFubmVsSWQsXG4gICAgICAgIH0sXG4gICAgICB9O1xuXG4gICAgICByZXBseS5zZW5kKGRhdGEpO1xuICAgICAgaW8uZW1pdCgncmVtb3ZlQ2hhbm5lbCcsIGRhdGEpO1xuICAgIH0pXG4gICAgLnBhdGNoKCcvYXBpL3YxL2NoYW5uZWxzLzppZCcsIChyZXEsIHJlcGx5KSA9PiB7XG4gICAgICBjb25zdCBjaGFubmVsSWQgPSBOdW1iZXIocmVxLnBhcmFtcy5pZCk7XG4gICAgICBjb25zdCBjaGFubmVsID0gc3RhdGUuY2hhbm5lbHMuZmluZCgoYykgPT4gYy5pZCA9PT0gY2hhbm5lbElkKTtcblxuICAgICAgY29uc3QgeyBkYXRhOiB7IGF0dHJpYnV0ZXMgfSB9ID0gcmVxLmJvZHk7XG4gICAgICBjaGFubmVsLm5hbWUgPSBhdHRyaWJ1dGVzLm5hbWU7XG5cbiAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB0eXBlOiAnY2hhbm5lbHMnLFxuICAgICAgICAgIGlkOiBjaGFubmVsSWQsXG4gICAgICAgICAgYXR0cmlidXRlczogY2hhbm5lbCxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgICByZXBseS5zZW5kKGRhdGEpO1xuICAgICAgaW8uZW1pdCgncmVuYW1lQ2hhbm5lbCcsIGRhdGEpO1xuICAgIH0pXG4gICAgLmdldCgnL2FwaS92MS9jaGFubmVscy86Y2hhbm5lbElkL21lc3NhZ2VzJywgKHJlcSwgcmVwbHkpID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2VzID0gc3RhdGUubWVzc2FnZXMuZmlsdGVyKChtKSA9PiBtLmNoYW5uZWxJZCA9PT0gTnVtYmVyKHJlcS5wYXJhbXMuY2hhbm5lbElkKSk7XG4gICAgICBjb25zdCByZXNvdXJjZXMgPSBtZXNzYWdlcy5tYXAoKG0pID0+ICh7XG4gICAgICAgIHR5cGU6ICdtZXNzYWdlcycsXG4gICAgICAgIGlkOiBtLmlkLFxuICAgICAgICBhdHRyaWJ1dGVzOiBtLFxuICAgICAgfSkpO1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSB7XG4gICAgICAgIGRhdGE6IHJlc291cmNlcyxcbiAgICAgIH07XG4gICAgICByZXBseS5zZW5kKHJlc3BvbnNlKTtcbiAgICB9KVxuICAgIC5wb3N0KCcvYXBpL3YxL2NoYW5uZWxzLzpjaGFubmVsSWQvbWVzc2FnZXMnLCAocmVxLCByZXBseSkgPT4ge1xuICAgICAgY29uc3QgeyBkYXRhOiB7IGF0dHJpYnV0ZXMgfSB9ID0gcmVxLmJvZHk7XG4gICAgICBjb25zdCBtZXNzYWdlID0ge1xuICAgICAgICAuLi5hdHRyaWJ1dGVzLFxuICAgICAgICBjaGFubmVsSWQ6IE51bWJlcihyZXEucGFyYW1zLmNoYW5uZWxJZCksXG4gICAgICAgIGlkOiBnZXROZXh0SWQoKSxcbiAgICAgIH07XG4gICAgICBzdGF0ZS5tZXNzYWdlcy5wdXNoKG1lc3NhZ2UpO1xuICAgICAgcmVwbHkuY29kZSgyMDEpO1xuICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHR5cGU6ICdtZXNzYWdlcycsXG4gICAgICAgICAgaWQ6IG1lc3NhZ2UuaWQsXG4gICAgICAgICAgYXR0cmlidXRlczogbWVzc2FnZSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgICByZXBseS5zZW5kKGRhdGEpO1xuICAgICAgaW8uZW1pdCgnbmV3TWVzc2FnZScsIGRhdGEpO1xuICAgIH0pO1xufTtcbiJdfQ==