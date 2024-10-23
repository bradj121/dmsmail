
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
