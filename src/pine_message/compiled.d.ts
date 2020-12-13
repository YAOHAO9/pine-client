import * as $protobuf from "protobufjs";
/** Namespace message. */
export namespace message {

    /** Properties of a PineMessage. */
    interface IPineMessage {

        /** PineMessage Route */
        Route?: (string|null);

        /** PineMessage RequestID */
        RequestID?: (number|null);

        /** PineMessage Data */
        Data?: (Uint8Array|null);
    }

    /** Represents a PineMessage. */
    class PineMessage implements IPineMessage {

        /**
         * Constructs a new PineMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: message.IPineMessage);

        /** PineMessage Route. */
        public Route: string;

        /** PineMessage RequestID. */
        public RequestID: number;

        /** PineMessage Data. */
        public Data: Uint8Array;

        /**
         * Creates a new PineMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PineMessage instance
         */
        public static create(properties?: message.IPineMessage): message.PineMessage;

        /**
         * Encodes the specified PineMessage message. Does not implicitly {@link message.PineMessage.verify|verify} messages.
         * @param message PineMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: message.IPineMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PineMessage message, length delimited. Does not implicitly {@link message.PineMessage.verify|verify} messages.
         * @param message PineMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: message.IPineMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PineMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PineMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): message.PineMessage;

        /**
         * Decodes a PineMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PineMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): message.PineMessage;

        /**
         * Verifies a PineMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PineMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PineMessage
         */
        public static fromObject(object: { [k: string]: any }): message.PineMessage;

        /**
         * Creates a plain object from a PineMessage message. Also converts values to other types if specified.
         * @param message PineMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: message.PineMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PineMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
