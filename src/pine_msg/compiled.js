/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.message = (function() {

    /**
     * Namespace message.
     * @exports message
     * @namespace
     */
    var message = {};

    message.PineMsg = (function() {

        /**
         * Properties of a PineMsg.
         * @memberof message
         * @interface IPineMsg
         * @property {string|null} [Route] PineMsg Route
         * @property {number|null} [RequestID] PineMsg RequestID
         * @property {Uint8Array|null} [Data] PineMsg Data
         */

        /**
         * Constructs a new PineMsg.
         * @memberof message
         * @classdesc Represents a PineMsg.
         * @implements IPineMsg
         * @constructor
         * @param {message.IPineMsg=} [properties] Properties to set
         */
        function PineMsg(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PineMsg Route.
         * @member {string} Route
         * @memberof message.PineMsg
         * @instance
         */
        PineMsg.prototype.Route = "";

        /**
         * PineMsg RequestID.
         * @member {number} RequestID
         * @memberof message.PineMsg
         * @instance
         */
        PineMsg.prototype.RequestID = 0;

        /**
         * PineMsg Data.
         * @member {Uint8Array} Data
         * @memberof message.PineMsg
         * @instance
         */
        PineMsg.prototype.Data = $util.newBuffer([]);

        /**
         * Creates a new PineMsg instance using the specified properties.
         * @function create
         * @memberof message.PineMsg
         * @static
         * @param {message.IPineMsg=} [properties] Properties to set
         * @returns {message.PineMsg} PineMsg instance
         */
        PineMsg.create = function create(properties) {
            return new PineMsg(properties);
        };

        /**
         * Encodes the specified PineMsg message. Does not implicitly {@link message.PineMsg.verify|verify} messages.
         * @function encode
         * @memberof message.PineMsg
         * @static
         * @param {message.IPineMsg} message PineMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PineMsg.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.Route != null && Object.hasOwnProperty.call(message, "Route"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.Route);
            if (message.RequestID != null && Object.hasOwnProperty.call(message, "RequestID"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.RequestID);
            if (message.Data != null && Object.hasOwnProperty.call(message, "Data"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.Data);
            return writer;
        };

        /**
         * Encodes the specified PineMsg message, length delimited. Does not implicitly {@link message.PineMsg.verify|verify} messages.
         * @function encodeDelimited
         * @memberof message.PineMsg
         * @static
         * @param {message.IPineMsg} message PineMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PineMsg.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PineMsg message from the specified reader or buffer.
         * @function decode
         * @memberof message.PineMsg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {message.PineMsg} PineMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PineMsg.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.message.PineMsg();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.Route = reader.string();
                    break;
                case 2:
                    message.RequestID = reader.int32();
                    break;
                case 3:
                    message.Data = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PineMsg message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof message.PineMsg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {message.PineMsg} PineMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PineMsg.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PineMsg message.
         * @function verify
         * @memberof message.PineMsg
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PineMsg.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.Route != null && message.hasOwnProperty("Route"))
                if (!$util.isString(message.Route))
                    return "Route: string expected";
            if (message.RequestID != null && message.hasOwnProperty("RequestID"))
                if (!$util.isInteger(message.RequestID))
                    return "RequestID: integer expected";
            if (message.Data != null && message.hasOwnProperty("Data"))
                if (!(message.Data && typeof message.Data.length === "number" || $util.isString(message.Data)))
                    return "Data: buffer expected";
            return null;
        };

        /**
         * Creates a PineMsg message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof message.PineMsg
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {message.PineMsg} PineMsg
         */
        PineMsg.fromObject = function fromObject(object) {
            if (object instanceof $root.message.PineMsg)
                return object;
            var message = new $root.message.PineMsg();
            if (object.Route != null)
                message.Route = String(object.Route);
            if (object.RequestID != null)
                message.RequestID = object.RequestID | 0;
            if (object.Data != null)
                if (typeof object.Data === "string")
                    $util.base64.decode(object.Data, message.Data = $util.newBuffer($util.base64.length(object.Data)), 0);
                else if (object.Data.length)
                    message.Data = object.Data;
            return message;
        };

        /**
         * Creates a plain object from a PineMsg message. Also converts values to other types if specified.
         * @function toObject
         * @memberof message.PineMsg
         * @static
         * @param {message.PineMsg} message PineMsg
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PineMsg.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.Route = "";
                object.RequestID = 0;
                if (options.bytes === String)
                    object.Data = "";
                else {
                    object.Data = [];
                    if (options.bytes !== Array)
                        object.Data = $util.newBuffer(object.Data);
                }
            }
            if (message.Route != null && message.hasOwnProperty("Route"))
                object.Route = message.Route;
            if (message.RequestID != null && message.hasOwnProperty("RequestID"))
                object.RequestID = message.RequestID;
            if (message.Data != null && message.hasOwnProperty("Data"))
                object.Data = options.bytes === String ? $util.base64.encode(message.Data, 0, message.Data.length) : options.bytes === Array ? Array.prototype.slice.call(message.Data) : message.Data;
            return object;
        };

        /**
         * Converts this PineMsg to JSON.
         * @function toJSON
         * @memberof message.PineMsg
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PineMsg.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PineMsg;
    })();

    message.PineErrResp = (function() {

        /**
         * Properties of a PineErrResp.
         * @memberof message
         * @interface IPineErrResp
         * @property {number|null} [Code] PineErrResp Code
         * @property {string|null} [Message] PineErrResp Message
         */

        /**
         * Constructs a new PineErrResp.
         * @memberof message
         * @classdesc Represents a PineErrResp.
         * @implements IPineErrResp
         * @constructor
         * @param {message.IPineErrResp=} [properties] Properties to set
         */
        function PineErrResp(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PineErrResp Code.
         * @member {number} Code
         * @memberof message.PineErrResp
         * @instance
         */
        PineErrResp.prototype.Code = 0;

        /**
         * PineErrResp Message.
         * @member {string} Message
         * @memberof message.PineErrResp
         * @instance
         */
        PineErrResp.prototype.Message = "";

        /**
         * Creates a new PineErrResp instance using the specified properties.
         * @function create
         * @memberof message.PineErrResp
         * @static
         * @param {message.IPineErrResp=} [properties] Properties to set
         * @returns {message.PineErrResp} PineErrResp instance
         */
        PineErrResp.create = function create(properties) {
            return new PineErrResp(properties);
        };

        /**
         * Encodes the specified PineErrResp message. Does not implicitly {@link message.PineErrResp.verify|verify} messages.
         * @function encode
         * @memberof message.PineErrResp
         * @static
         * @param {message.IPineErrResp} message PineErrResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PineErrResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.Code != null && Object.hasOwnProperty.call(message, "Code"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.Code);
            if (message.Message != null && Object.hasOwnProperty.call(message, "Message"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.Message);
            return writer;
        };

        /**
         * Encodes the specified PineErrResp message, length delimited. Does not implicitly {@link message.PineErrResp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof message.PineErrResp
         * @static
         * @param {message.IPineErrResp} message PineErrResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PineErrResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PineErrResp message from the specified reader or buffer.
         * @function decode
         * @memberof message.PineErrResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {message.PineErrResp} PineErrResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PineErrResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.message.PineErrResp();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.Code = reader.int32();
                    break;
                case 2:
                    message.Message = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PineErrResp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof message.PineErrResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {message.PineErrResp} PineErrResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PineErrResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PineErrResp message.
         * @function verify
         * @memberof message.PineErrResp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PineErrResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.Code != null && message.hasOwnProperty("Code"))
                if (!$util.isInteger(message.Code))
                    return "Code: integer expected";
            if (message.Message != null && message.hasOwnProperty("Message"))
                if (!$util.isString(message.Message))
                    return "Message: string expected";
            return null;
        };

        /**
         * Creates a PineErrResp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof message.PineErrResp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {message.PineErrResp} PineErrResp
         */
        PineErrResp.fromObject = function fromObject(object) {
            if (object instanceof $root.message.PineErrResp)
                return object;
            var message = new $root.message.PineErrResp();
            if (object.Code != null)
                message.Code = object.Code | 0;
            if (object.Message != null)
                message.Message = String(object.Message);
            return message;
        };

        /**
         * Creates a plain object from a PineErrResp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof message.PineErrResp
         * @static
         * @param {message.PineErrResp} message PineErrResp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PineErrResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.Code = 0;
                object.Message = "";
            }
            if (message.Code != null && message.hasOwnProperty("Code"))
                object.Code = message.Code;
            if (message.Message != null && message.hasOwnProperty("Message"))
                object.Message = message.Message;
            return object;
        };

        /**
         * Converts this PineErrResp to JSON.
         * @function toJSON
         * @memberof message.PineErrResp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PineErrResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PineErrResp;
    })();

    return message;
})();

module.exports = $root;
