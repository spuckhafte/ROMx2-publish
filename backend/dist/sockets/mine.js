var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ASocket } from "plugboard.io";
import Block from "../helpers/Block.js";
import Pending from "../Schema/Pending.js";
import { EVault } from "../index.js";
export default class extends ASocket {
    run() {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const pendingBlock = (yield Pending.find({}).sort('timestamp'))[0];
            if (!pendingBlock || !pendingBlock.id) {
                (_a = this.socket) === null || _a === void 0 ? void 0 : _a.emit('block-added', 'No block to mine');
                return;
            }
            const block = new Block(pendingBlock.data, EVault.chain[EVault.chain.length - 1].hash).initOtherData({
                id: pendingBlock.id,
                timestamp: pendingBlock.timestamp,
                nonce: pendingBlock.nonce,
            });
            for (let i = 0;; i++) {
                block.nonce = i;
                if (!EVault.hashDesignIsValid(block.hash))
                    continue;
                const status = EVault.addBlock(block);
                if (typeof status === 'string') {
                    (_b = this.socket) === null || _b === void 0 ? void 0 : _b.emit('error-adding-block', status);
                }
                else {
                    (_c = this.socket) === null || _c === void 0 ? void 0 : _c.emit('block-added', 'New record added to the vault.');
                    (_d = this.io) === null || _d === void 0 ? void 0 : _d.emit('update-recents');
                    yield Pending.deleteOne({ id: block.id });
                }
                break;
            }
        });
    }
}
