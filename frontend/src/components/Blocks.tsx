import { useState, useContext } from "react"
import { BlockAsJSON } from '../../types';
import { createDate, incomingSockets, runOnce } from "./helpers/funcs";
import { AppContext, socket } from "../App";
import down from 'download-as-file';
import FullBlock from "./FullBlock";

export default () => {
    const [blocks, setBlocks] = useState<BlockAsJSON[]>([]);
    const { setModalJSX } = useContext(AppContext);

    const download = (file: string) => {
        socket.emit('downloadFile', file);
    }

    const showBlock = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, blockData: BlockAsJSON) => {
        if ((e.target as HTMLDivElement).className == 'filename') return;
        if (setModalJSX)
            setModalJSX(<FullBlock block={blockData} />);
    }

    runOnce(() => {
        socket.emit('getAllBlocks');
    });

    incomingSockets(() => {
        socket.removeAllListeners( 'allBlocks');
        socket.removeAllListeners('update-recents');
        socket.removeAllListeners('downFile');

        socket.on('allBlocks', (newBlocks: BlockAsJSON[]) => {
            setBlocks(newBlocks);
        });
        socket.on('update-recents', () => {
            socket.emit('getAllBlocks');
        });
        socket.on('downFile', (name: string, content: string) => {
            down({
                data: content,
                filename: name,
            });
        });
    });

    return <div className="blocks">
        
        { blocks.length ? 
            blocks.map((blo, i) => {
                return <div className="recent-block" key={i} onClick={e => showBlock(e, blo)}>
                    <div className="head" title={blo.data.heading}>{blo.data.heading}</div>
                    <div className="version">v{blo.data.version}</div>
                    <div 
                        className="filename" 
                        title={blo.data.fileName} 
                        onClick={() => download(blo.data.fileName)}
                    >
                        Download File
                    </div>
                    <div className="time">{createDate(new Date(blo.timestamp))}</div>
                </div>
            })
            : <div className="noblocks">there are no records yet...</div> }
    </div>
}