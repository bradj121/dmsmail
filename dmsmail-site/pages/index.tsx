import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect } from "react";
import Policy from "../components/policy";
import PolicyItem from "../components/policyItem";

const Home: NextPage = () => {
  // TODO: Update this URL to your own API endpoint!
  const dmsmailApiEndpoint: string =
    "http://localhost:8000";

  const userId: string = "anotherendeavor";
  const [isLoading, setIsLoading] = React.useState(true);
  const [policies, setPolicies] = React.useState<Policy[]>([]);
  const [newPolicyRecipients, setNewPolicyRecipients] = React.useState("");
  const [newPolicySubject, setNewPolicySubject] = React.useState("");
  const [newPolicyBody, setNewPolicyBody] = React.useState("");
  const [newPolicyExpirationDate, setNewPolicyExpirationDate] = React.useState<number>();

  const getPolicies = async () => {
    setIsLoading(true);
    const response = await fetch(`${dmsmailApiEndpoint}/policies/`);
    const responseData = await response.json();

    // Convert raw JSON to policies.
    const policies: Policy[] = responseData.policies;
    console.log(policies);
    setPolicies(policies);
    setIsLoading(false);
  };

  // Get the existing tpolicies.
  useEffect(() => {
    getPolicies();
  }, []);

  const putPolicy = async (policy: Policy) => {
    // Put a local copy of this policy into the state first for immediate feedback.
    setPolicies([policy, ...policies]);

    const response = await fetch(`${dmsmailApiEndpoint}/users/${userId}/policies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(policy),
    });
    console.log(response);
    const responseData = await response.json();
    const id: string = responseData.policy.id;
    console.log(`Successfully put policy: ${id}`);
    getPolicies();
  };

  const deletePolicy = async (id?: number) => {
    // Remove it from the local policy list.
    const newPolicies = policies.filter((policy) => policy.id !== id);
    setPolicies(newPolicies);

    // Delete policy from table.
    const response = await fetch(`${dmsmailApiEndpoint}/delete-policy/${id}`, {
      method: "DELETE",
    });
    console.log(response);
  };

  const updatePolicy = async (updatedPolicy: Policy) => {
    const response = await fetch(`${dmsmailApiEndpoint}/users/${userId}/policies`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPolicy),
    });
    console.log(response);
  };

  const addNewPolicy = async () => {
    const policy: Policy = {
      sender_id: userId,
      recipients: newPolicyRecipients,
      subject: newPolicySubject,
      body: newPolicyBody,
      expiration_date: newPolicyExpirationDate,
      is_active: true,
    };
    setNewPolicyRecipients("");
    setNewPolicySubject("");
    setNewPolicyBody("");
    setNewPolicyExpirationDate(0);
    await putPolicy(policy);
  };

  // Create the policy input field.
  const policyInputField = (
    <div className="flex mt-6">
      <input
        className="border border-gray-300 p-2 rounded-md grow mr-4"
        type="text"
        placeholder="Enter recipients here"
        value={newPolicyRecipients}
        onChange={(e) => setNewPolicyRecipients(e.target.value)}
      />
      <input
        className="border border-gray-300 p-2 rounded-md grow mr-4"
        type="text"
        placeholder="Enter subject here"
        value={newPolicySubject}
        onChange={(e) => setNewPolicySubject(e.target.value)}
      />
      <input
        className="border border-gray-300 p-2 rounded-md grow mr-4"
        type="paragraph"
        placeholder="Enter body here"
        value={newPolicyBody}
        onChange={(e) => setNewPolicyBody(e.target.value)}
      />
      <input
        className="border border-gray-300 p-2 rounded-md grow mr-4"
        type="number"
        placeholder="Enter expiration here"
        value={newPolicyExpirationDate}
        onChange={(e) => setNewPolicyExpirationDate(parseInt(e.target.value))}
      />
      <button
        className="bg-blue-600 text-white w-24 p-2 rounded-md"
        onClick={addNewPolicy}
      >
        Add
      </button>
    </div>
  );

  // Create a list of the policies.
  const policyList = (
    // Create policy using index as key
    <div>
      {policies.map((policy) => (
        <PolicyItem
          key={policy.id}
          {...policy}
          onDelete={deletePolicy}
          onUpdate={updatePolicy}
        />
      ))}
    </div>
  );

  const loadingText: string = isLoading ? "Loading" : "Ready";
  const loadingTextColor: string = isLoading
    ? "text-orange-500"
    : "text-green-500";
  const loadingStatus = (
    <div className={loadingTextColor + " text-center mb-4 text-sm"}>
      {loadingText}
    </div>
  );

  const userIdElement = (
    <div className="text-center text-gray-700">User ID: {userId}</div>
  );

  return (
    <div>
      <Head>
        <title>Dead Man's Switch Mail</title>
        <meta name="description" content="Dead man's switch mail" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-2xl font-bold text-center">My Policies</h1>
        {userIdElement}
        {loadingStatus}
        {policyList}
        {policyInputField}
      </main>
    </div>
  );
};

export default Home;