import * as z from "zod"; 

export const Step = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    content: z.string(),
    active: z.boolean()
})

export type StepType = z.infer<typeof Step>