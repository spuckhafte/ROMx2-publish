import { ASocket } from "plugboard.io";
import Chain from "../Schema/Chain.js";
import { BlockType } from "../../types.js";
import Block from "../helpers/Block.js";

export default class extends ASocket<[]> {
    async run() {
        const blocks = await Chain.find({}).sort('-1');
        const sendBlocks = blocks.map((bl) => {
            return new Block(bl.data as BlockType, bl.prevBlockHash as string).initOtherData({
                id: bl.id as string,
                timestamp: bl.timestamp as number,
                nonce: bl.nonce as number
            }).asJSON;
        });
        sendBlocks.shift();
        this.socket?.emit('allBlocks', sendBlocks.reverse());
    }
}