import { z } from 'zod'

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6, 'Password needs to be more than 6 characters')
})

export const signUpSchema = z.object({
    email: z.email(),
    password: z.string().min(6, 'Your password must be a minimum of 6 characters'),
    username: z.string().min(3, 'Username needs to be a minimum of 6 characters')
})

export const levelSchema = z.object({
    status: z.boolean()
})

export const kanbanPostSchema = z.object({
    content: z.string().min(6, 'Need more than 6 characters'),
    assigned: z.string().min(3, 'Post needs a default assigned person'),
    tester: z.string().optional(),
    testerFeedback: z.string().optional(),
    status: z.string(),
    project: z.number()
})

export const kanbanPostStatus = z.object({
    status: z.string(),
    id: z.number()
})

export const blogPostSchema = z.object({
    title: z.string().min(3, 'Title must have more than 3 characters'),
    content: z.string().min(6, 'There must be content'),
    images: z.instanceof(FormData).optional().or(z.null()),
    project: z.string(),
    author: z.string()
})

export const blogPostWithImageSchema = blogPostSchema.omit({ images: true })
    .extend({
        images: z.unknown()
            .transform(value => {
                return value as FileList
            }).transform((value) => Array.from(value)).refine(files => {    
                return files !== null ? files.every(file => [
                    "image/png",    
                    "image/jpeg",
                    "image/jpg",
                ].includes(file.type)) : true
            }, { error: 'Wrong file type, needs to be: png, jpg, jpeg' })
            .refine(files => { return files.every(item => item.size >= 2000000 ? false : true) },
                { error: 'An image needs to be lesser than 2MB' }).optional().nullable()
    })    

