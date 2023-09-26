import { BlockAsJSON } from "../../types"
import sha256 from 'sha256';
import { createDate, incomingSockets } from "./helpers/funcs";
import downloadAsFile from "download-as-file";
import { socket } from "../App";

export default (props: { block: BlockAsJSON }) => {
    const { block } = props;
    const download = () => {
        socket.emit('downloadFile', block.data.fileName);
    }

    incomingSockets(() => {
        socket.removeAllListeners('downFile');
        socket.on('downFile', (name: string, data: string) => {
            downloadAsFile({
                data, filename: name
            });
        });
    });

    return <div className="full-block">
        <div className="id">{block.id}</div>
        <div className="head" title={block.data.heading}>{block.data.heading}</div>
        <div className="version">v{block.data.version}🔗{<span>{block.data.parent ? block.data.parent : "rootless"}</span>}</div>
        <div className="details">{block.data.details}</div>
        <div className="filename" onClick={download}>💾 DOWNLOAD FILE</div>
        <div className="timestamp">{createDate(new Date(block.timestamp))}</div>

        <div className="hash">Hash <span>{sha256(JSON.stringify(block))}</span></div>
        <div className="prev-hash">P.Hash <span>{block.prevBlockHash}</span></div>
        <div className="nonce">Nonce <span>{block.nonce}</span></div>
    </div>
}