export function getAuthContext(request: Request) {
    const role = request.headers.get('X-Mock-Role') || 'CMD';
    const identity = request.headers.get('X-Mock-Identity') || 'CMD_ADMIN';

    return { role, identity };
}
