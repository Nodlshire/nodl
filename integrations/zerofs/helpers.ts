export function validateMountPath(path: string): boolean {
    return path.startsWith('/mnt/zerofs');
}
