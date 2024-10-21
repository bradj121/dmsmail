import { getCsrfToken } from "next-auth/react";

const URL = process.env.API_URL ? `https://${process.env.API_URL}/api` : "http://localhost:3000/api"

export async function fetchPolicyById(id: number) {
  try {
    const response = await fetch(`${URL}/policies/${id}`);
    const policy = await response.json();
    return policy;
  } catch (error) {
    console.error('Failed to get policy', error);
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredPolicies(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE

  try {
    const csrfToken = await getCsrfToken();
    if (!csrfToken) {
      throw new Error("No csrf token")
    }
    const response = await fetch(`${URL}/policies`, {
      headers: {
        "X-XSRF-Token": csrfToken
      }
    }) 
    const policies = await response.json();
    console.log(policies)
    return policies;
  } catch (error) {
    console.error('Failed to get policies. ', error)
  }
}
