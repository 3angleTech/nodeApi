// @ts-nocheck

export async function handler(req: Request): Promise<Response> {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
    body: `Hello, World! Your request was received: ${JSON.stringify(req)}.`,
  };
}
