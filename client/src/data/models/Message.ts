export interface Message {
    id?: string | number;
    board: string;
    author: string;
    text: string;
    timestamp: number;
}

export interface MessageMap {
    [boardName: string]: Message[];
}

export function assertMessage(obj: any): Message {
    if (!obj || typeof obj !== 'object') {
        throw new Error('Invalid message object');
    }
    
    if (typeof obj.board !== 'string') {
        throw new Error('Message board must be a string');
    }
    
    if (typeof obj.author !== 'string') {
        throw new Error('Message author must be a string');
    }
    
    if (typeof obj.text !== 'string') {
        throw new Error('Message text must be a string');
    }
    
    if (typeof obj.timestamp !== 'number') {
        throw new Error('Message timestamp must be a number');
    }
    
    return obj as Message;
}

export function assertMessageArray(arr: any): Message[] {
    if (!Array.isArray(arr)) {
        throw new Error('Expected message array');
    }
    
    return arr.map(assertMessage);
}
