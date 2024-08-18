import { CONFIG_APP } from "@/config";

// replace the route for uploading attachments for uploadthing technololy
export const replaceUploadThingUrl = `/a/${CONFIG_APP.env.UPLOADTHING_APP_ID}/`;
