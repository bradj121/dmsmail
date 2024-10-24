'use server';

import bcrypt from 'bcrypt';
import { z } from "zod";
import fs from "node:fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PathLike } from "fs";

const URL = process.env.API_URL ? `https://${process.env.API_URL}/api` : "http://localhost:3000/api"


const FormSchema = z.object({
    id: z.number(),
    sender: z.number(),
    recipients: z.string(),
    subject: z.string(),
    body: z.string(),
    expirationDate: z.coerce.date(),
    attachments: z.custom<FileList>(),
    existingAttachments: z.unknown().transform(value => value as string[]),
    status: z.enum(['active', 'inactive']),
});

const LoginFormSchema = z.object({
    email: z.string(),
    password: z.string()
})

const CreatePolicy = FormSchema.omit({ id: true, sender: true, status: true, existingAttachments: true })

const UpdatePolicy = FormSchema.omit({ id: true, sender: true })

export async function createUser(formData: FormData) {
    const { email, password } = LoginFormSchema.parse({
        email: formData.get('email'),
        password: formData.get('password'),
    })
    const hashedPassword = await bcrypt.hash(password, 10);

    const response = await fetch(`${URL}/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            password: hashedPassword,
        })
    })
    if (!response.ok) {
        console.error(`Failed to create user ${response}`)
    } else {
        revalidatePath("/login");
        redirect("/login");
    }
}

export async function createPolicy(formData: FormData) {
    const { recipients, subject, body, expirationDate, attachments } = CreatePolicy.parse({
        recipients: formData.get('recipients'),
        subject: formData.get('subject'),
        body: formData.get('body'),
        expirationDate: formData.get('expirationDate'),
        attachments: formData.getAll('attachments'),
    });

    const status = "active";

    // Only push attachment filenames to DB
    const fileNameArr = [];
    if (attachments) {
        
        for (let i = 0; i < attachments.length; i++) {
            const attachment = attachments[i];
            if (attachment.size > 0) {
                fileNameArr.push(attachment.name);
            }
        }
    }
    const fileNames = fileNameArr.join(', ');


    const response = await fetch(`${URL}/users/1/policies`, {  // TODO: remove hard coded user
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            recipients: recipients,
            subject: subject,
            body: body,
            expiration_date: expirationDate,
            attachments: fileNames,
            status: status,
        }),
    });

    if (response.status != 200) {
        console.error(`Failed to store policy: ${response}`);
    } else {
        if (attachments) {
        // Save file to dir
            const responseData = await response.json();
            const policyId: string = responseData.id;
            try {
                const folderName = `./files/1/${policyId}`
                await fs.mkdir(folderName);
                for (let i = 0; i < attachments.length; i++) {
                    const attachment = attachments[i];
                    if (attachment && attachment.size > 0) {
                        console.log(`Uploading Attachment: ${attachment.name}`);
                        const arrayBuffer = await attachment.arrayBuffer();
                        const buffer = new Uint8Array(arrayBuffer);
                        // TODO: make directory for uploaded attachments user/policy specific
                        await fs.writeFile(`./files/1/${policyId}/${attachment.name}`, buffer);
                    }
                }
                
            } catch (err) {
                console.log(err);
                const response = await fetch(`${URL}/users/1/policies/${policyId}`, {
                    method: "DELETE",
                    headers: {"Content-Type": "application/json"}
                })
            }
        }
    }

    revalidatePath("/dashboard/policies");
    redirect("/dashboard/policies");
}

export async function updatePolicy(id: number, formData: FormData) {
    const { recipients, subject, body, expirationDate, attachments, existingAttachments, status } = UpdatePolicy.parse({
        recipients: formData.get('recipients'),
        subject: formData.get('subject'),
        body: formData.get('body'),
        expirationDate: formData.get('expirationDate'),
        attachments: formData.getAll('attachments'),
        existingAttachments: formData.getAll('existingAttachments'),
        status: formData.get('status'),
    });

    const policyId = id;

    var existingAttachmentNames: string[]

    existingAttachmentNames = existingAttachments[0].trim().split(', ');

    if (existingAttachmentNames[0] === '') {
        existingAttachmentNames = []
    }

    console.log(existingAttachmentNames)

    // Only push attachment filenames to DB
    const fileNameArr = [];
    if (attachments) {
        for (let i = 0; i < attachments.length; i++) {
            const attachment = attachments[i];
            if (attachment.size > 0) {
                fileNameArr.push(attachment.name);
            }
        }
    }

    // Create array of file names past and present
    const combinedNames = fileNameArr.concat(existingAttachmentNames);

    // Format as string for saving to DB
    const fileNames = combinedNames.join(', ');

    const response = await fetch(`${URL}/users/1/policies/${id}`, {  // TODO: remove hard coded user
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: policyId,
            recipients: recipients,
            subject: subject,
            body: body,
            expiration_date: expirationDate,
            attachments: fileNames,
            status: status,
        }),
    });

    if (response.status != 200) {
        console.error(`Failed to update policy ${id}: ${response}`);
    } else {
        if (attachments) {
        // Save files to dir
            try {
                console.log("Saving attachments")
                const folderName = `./files/1/${id}`
                if (!await exists(folderName)) {
                    await fs.mkdir(folderName, { recursive: true });
                }
                for (let i = 0; i < attachments.length; i++) {
                    const attachment = attachments[i];
                    if (attachment && attachment.size > 0) {
                        console.log(`Uploading Attachment: ${attachment.name}`);
                        const arrayBuffer = await attachment.arrayBuffer();
                        const buffer = new Uint8Array(arrayBuffer);
                        // TODO: make directory for uploaded attachments user/policy specific
                        await fs.writeFile(`./files/1/${id}/${attachment.name}`, buffer);
                    }
                }
                
            } catch (err) {
                console.log(err);
            }
        }
        if (combinedNames) {
            // reconcile with dir contents
            console.log(combinedNames)
            const savedFiles = await fs.readdir(`./files/1/${id}`)
            console.log(savedFiles)
            for (const savedFile of savedFiles) {
                if (combinedNames.indexOf(savedFile) === -1) {
                    console.log(`Removing attachment ${savedFile}`)
                    fs.rm(`./files/1/${id}/${savedFile}`)

                } else {
                    console.log(`Keeping attachment ${savedFile}`)
                }
            }
        }
    }
    

    revalidatePath("/dashboard/policies");
    redirect("/dashboard/policies");
}

export async function deletePolicy(id: number) {
    const response = await fetch(`${URL}/users/1/policies/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        }
    });
    if (response.status !== 200) {
        console.error(`Failed to delete policy ${id}: ${response}`)
    } else {
        await fs.rm(`./files/1/${id}`, { recursive: true })
    }

    revalidatePath("/dashboard/policies");
}

async function exists(f: PathLike) {
    try {
        await fs.stat(f);
        return true;
    } catch {
        return false;
    }
}