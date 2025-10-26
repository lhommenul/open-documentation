export type CID = string

export interface AbstractIpfsService {
    upload: (file: File) => Promise<CID>
}

export class IpfsService implements AbstractIpfsService {
    upload(file: File): Promise<CID> {
        return new Promise((resolve, reject) => {
            resolve('https://ipfs.io/ipfs/' + file.name)
        })
    }
}