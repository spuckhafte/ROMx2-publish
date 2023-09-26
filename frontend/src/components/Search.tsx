import { useState, useContext } from "react";
import { AppContext, socket } from "../App";
import { createDate, incomingSockets } from "./helpers/funcs";
import { BlockAsJSON } from "../../types";

//@ts-ignore
import down from 'download-as-file';
import FullBlock from "./FullBlock";

type field = "heading" | "details";

const fields = ["heading", "details"];
export default () => {
    const [dropDown, setDropDown] = useState(false);
    const [field, setField] = useState<field>('heading');
    const { setModalJSX } = useContext(AppContext);
    const [query, setQuery] = useState('');
    const [blocks, setBlocks] = useState<BlockAsJSON[]>([]);

    const handleFieldChange = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setField((e.target as unknown as HTMLDivElement).id as field);
        setDropDown(false);
    }

    const search = () => {
        socket.emit('search', field, query);
    }

    const closeModal = () => {
        if (setModalJSX) setModalJSX(null);
    }

    const download = (file: string) => {
        socket.emit('downloadFile', file);
    }

    const openBlock = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, blockData: BlockAsJSON) => {
        if ((e.target as HTMLDivElement).className == 'filename') return;
        if (setModalJSX)
            setModalJSX(<FullBlock block={blockData} />);
    }

    incomingSockets(() => {
        socket.removeAllListeners('search-result');
        socket.removeAllListeners('downFile');

        socket.on('search-result', (newBlocks: BlockAsJSON[]) => setBlocks(newBlocks));
        socket.on('downFile', (name: string, content: string) => {
            down({
                data: content,
                filename: name,
            });
        });
    })

    return <div className="search-block">
        <div className="title">Search Record</div>
        <div className="controller">
            <div className="field-control">
                <div className="field" onClick={() => setDropDown(!dropDown)}>{field}</div>
                {
                    dropDown ?
                        <div className="field-drop">
                            {
                                fields.map((val, i) => {
                                    return <div 
                                        className={
                                            `aField ${i % 2 == 0 ? "odd-field" : ""}`
                                        }
                                        id={val}
                                        onClick={handleFieldChange}
                                        key={i}
                                        >
                                            {val}
                                    </div>
                                })
                            }
                        </div>
                    : ""
                }
            </div>
            <div className="query">
                <input 
                    type="text" 
                    autoFocus
                    onChange={e => setQuery(e.target.value)}
                />
            </div>
        </div>
        <div className="btn-group">
            <button className="search-btn" onClick={search}>Search</button>
            <button className="cancel-btn" onClick={closeModal}>Cancel</button>
        </div>
        <div className="result">
            <div className="title">Search Results</div>
            <div className="scrollit">{
                blocks.map((b, i) => <div key={i} className="resultblock" onClick={e => openBlock(e, b)}>
                    <div className="head">{b.data.heading}</div>
                    <div className="details">{b.data.details}</div>
                    <div 
                        className="filename" 
                        title={b.data.fileName} 
                        onClick={() => download(b.data.fileName)}
                    >
                        💾 Download File
                    </div>
                    <div className="time">{createDate(new Date(b.timestamp))}</div>
                    <div className="openblock">Open Record</div>
                </div>)
            }</div>
        </div>
    </div>
}