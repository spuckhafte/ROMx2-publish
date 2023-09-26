
/**Record data */
export type BlockType = {
    heading: string,
    details: string,
    fileName: string,
    parent: string,
    version: number,
}

export type ChainErrors =
    "[error: chain impure (breach suspected)]" |
    "[rejected: invalid previous block]" |
    "[rejected: invalid hash]"

export type BlockAsJSON = {
    id: string,
    nonce: number,
    timestamp: number,
    prevBlockHash: string,
    data: BlockType,
}