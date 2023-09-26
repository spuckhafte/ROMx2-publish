var _a;
import EVaultChain from "./helpers/EVaultChain.js";
import { Plugboard } from "plugboard.io";
export const EVault = new EVaultChain();
const plugboard = new Plugboard('dist/sockets', {
    cors: { origin: "*" },
    maxHttpBufferSize: 1e7,
});
plugboard.onConnection = (socket) => {
    socket.emit('connected');
};
plugboard.start(+((_a = process.env) === null || _a === void 0 ? void 0 : _a.PORT) || 3000, () => console.log('[server started]'));
