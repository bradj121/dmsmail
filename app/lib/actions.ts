'use server';

import bcrypt from 'bcrypt';
import { z } from "zod";
import fs from "node:fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const URL = process.env.API_URL ? `https://${process.env.API_URL}/api` : "http://localhost:3000/api"

const LoginFormSchema = z.object({
    email: z.string(),
    password: z.string()
})

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
