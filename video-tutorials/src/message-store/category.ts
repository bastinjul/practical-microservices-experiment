export function category(streamName: string): string {
    if(streamName == null) {
        return ''
    }
    return streamName.split('-')[0];
}