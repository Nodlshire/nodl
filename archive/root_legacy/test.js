// Mocking Next.js request/response for testing
class NextResponse {
  static json(data, init) { return { data, status: init?.status || 200 }; }
}
const req = (body) => ({ json: async () => body });

// Import the patched route (we'll just evaluate it as JS by compiling it or simulating it)
