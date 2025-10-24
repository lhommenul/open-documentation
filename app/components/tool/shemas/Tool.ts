import * as z from "zod"; 
 
export const Tool = z.object({ 
    name: z.string(),
});

export type Tool = z.infer<typeof Tool>