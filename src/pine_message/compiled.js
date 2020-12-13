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

    message.PineMessage = (function() {

        /**
         * Properties of a PineMessage.
         * @memberof message
         * @interface IPineMessage
         * @property {string|null} [Route] PineMessage Route
         * @property {number|null} [RequestID] PineMessage RequestID
         * @property {Uint8Array|null} [Data] PineMessage Data
         */

        /**
         * Constructs a new PineMessage.
         * @memberof message
         * @classdesc Represents a PineMessage.
         * @implements IPineMessage
         * @constructor
         * @param {message.IPineMessage=} [properties] Properties to set
         */
        function PineMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PineMessage Route.
         * @member {string} Route
         * @memberof message.PineMessage
         * @instance
         */
        PineMessage.prototype.Route = "";

        /**
         * PineMessage RequestID.
         * @member {number} RequestID
         * @memberof message.PineMessage
         * @instance
         */
        PineMessage.prototype.RequestID = 0;

        /**
         * PineMessage Data.
         * @member {Uint8Array} Data
         * @memberof message.PineMessage
         * @instance
         */
        PineMessage.prototype.Data = $util.newBuffer([]);

        /**
         * Creates a new PineMessage instance using the specified properties.
         * @function create
         * @memberof message.PineMessage
         * @static
         * @param {message.IPineMessage=} [properties] Properties to set
         * @returns {message.PineMessage} PineMessage instance
         */
        PineMessage.create = function create(properties) {
            return new PineMessage(properties);
        };

        /**
         * Encodes the specified PineMessage message. Does not implicitly {@link message.PineMessage.verify|verify} messages.
         * @function encode
         * @memberof message.PineMessage
         * @static
         * @param {message.IPineMessage} message PineMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PineMessage.encode = function encode(message, writer) {
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
         * Encodes the specified PineMessage message, length delimited. Does not implicitly {@link message.PineMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof message.PineMessage
         * @static
         * @param {message.IPineMessage} message PineMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PineMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PineMessage message from the specified reader or buffer.
         * @function decode
         * @memberof message.PineMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {message.PineMessage} PineMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PineMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.message.PineMessage();
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
         * Decodes a PineMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof message.PineMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {message.PineMessage} PineMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PineMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PineMessage message.
         * @function verify
         * @memberof message.PineMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PineMessage.verify = function verify(message) {
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
         * Creates a PineMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof message.PineMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {message.PineMessage} PineMessage
         */
        PineMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.message.PineMessage)
                return object;
            var message = new $root.message.PineMessage();
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
         * Creates a plain object from a PineMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof message.PineMessage
         * @static
         * @param {message.PineMessage} message PineMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PineMessage.toObject = function toObject(message, options) {
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
         * Converts this PineMessage to JSON.
         * @function toJSON
         * @memberof message.PineMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PineMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PineMessage;
    })();

    return message;
})();

module.exports = $root;
