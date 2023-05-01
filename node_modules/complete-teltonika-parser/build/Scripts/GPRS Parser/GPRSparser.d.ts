import { PacketReader } from "../../Scripts/PacketReader";
export declare class GPRS {
    type: 5 | 6;
    isResponse: boolean;
    responseStr: string;
    constructor(pr: PacketReader<number>);
}
export declare function gerateCodec12(command: string): string;
export declare function parseCodec12(hexStr: string): {
    isResponse: boolean;
    command: string;
};
