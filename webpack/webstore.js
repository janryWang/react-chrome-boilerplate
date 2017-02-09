'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var got = require('got');

var rootURI = 'https://www.googleapis.com';
var refreshTokenURI = 'https://accounts.google.com/o/oauth2/token';
var uploadExistingURI = function uploadExistingURI(id) {
    return rootURI + '/upload/chromewebstore/v1.1/items/' + id;
};
var publishURI = function publishURI(id, target) {
    return rootURI + '/chromewebstore/v1.1/items/' + id + '/publish?publishTarget=' + target;
};

var requiredFields = ['extensionId', 'clientId', 'clientSecret', 'refreshToken'];

var APIClient = function () {
    function APIClient(opts) {
        var _this = this;

        _classCallCheck(this, APIClient);

        requiredFields.forEach(function (field) {
            if (!opts[field]) {
                throw new Error('Option "' + field + '" is required');
            }

            _this[field] = opts[field];
        });
    }

    _createClass(APIClient, [{
        key: 'uploadExisting',
        value: function uploadExisting(readStream, token) {
            var _this2 = this;

            if (!readStream) {
                return Promise.reject(new Error('Read stream missing'));
            }

            var extensionId = this.extensionId;

            var eventualToken = token ? Promise.resolve(token) : this.fetchToken();

            return eventualToken.then(function (token) {
                return got.put(uploadExistingURI(extensionId), {
                    headers: _this2._headers(token),
                    body: readStream,
                    json: true
                }).then(_this2._extractBody);
            });
        }
    }, {
        key: 'publish',
        value: function publish() {
            var _this3 = this;

            var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';
            var token = arguments[1];
            var extensionId = this.extensionId;

            var eventualToken = token ? Promise.resolve(token) : this.fetchToken();

            return eventualToken.then(function (token) {
                return got.post(publishURI(extensionId, target), {
                    headers: _this3._headers(token),
                    json: true
                }).then(_this3._extractBody);
            });
        }
    }, {
        key: 'fetchToken',
        value: function fetchToken() {
            var clientId = this.clientId,
                clientSecret = this.clientSecret,
                refreshToken = this.refreshToken;


            return got.post(refreshTokenURI, {
                body: {
                    client_id: clientId,
                    client_secret: clientSecret,
                    refresh_token: refreshToken,
                    grant_type: 'refresh_token',
                    redirect_uri: 'urn:ietf:wg:oauth:2.0:oob'
                },
                json: true
            }).then(this._extractBody).then(function (_ref) {
                var access_token = _ref.access_token;
                return access_token;
            });
        }
    }, {
        key: '_headers',
        value: function _headers(token) {
            return {
                Authorization: 'Bearer ' + token,
                'x-goog-api-version': '2'
            };
        }
    }, {
        key: '_extractBody',
        value: function _extractBody(_ref2) {
            var body = _ref2.body;

            return body;
        }
    }]);

    return APIClient;
}();

module.exports = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    return new (Function.prototype.bind.apply(APIClient, [null].concat(args)))();
};