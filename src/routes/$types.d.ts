import type { RequestEvent } from '@sveltejs/kit';

// Define PageServerLoad type
export type PageServerLoad = () => Promise<Record<string, any>>;

// Define RequestHandler type
export type RequestHandler = (event: RequestEvent) => Promise<Response>;
