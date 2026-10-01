export function getEpicAuthorizationUrl(state: string) {
  const params = new URLSearchParams({
    response_type: "code",

    client_id: process.env.EPIC_CLIENT_ID!,

    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/epic/callback`,

    scope: "openid fhirUser user/Practitioner.read",

    state,

    aud: process.env.EPIC_FHIR_BASE_URL!,
  });

  return `${process.env.EPIC_AUTHORIZATION_ENDPOINT}?` + params.toString();
}

export async function exchangeEpicCode(code: string) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",

    code,

    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/epic/callback`,

    client_id: process.env.EPIC_CLIENT_ID!,
  });

  const response = await fetch(process.env.EPIC_TOKEN_ENDPOINT!, {
    method: "POST",

    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },

    body,
  });

  if (!response.ok) {
    throw new Error("Unable to exchange Epic authorization code.");
  }

  return response.json();
}

export async function getEpicEmployee(fhirUser: string, accessToken: string) {
  const response = await fetch(fhirUser, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/fhir+json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Epic Practitioner request failed:", data);

    throw new Error("Failed to retrieve Epic Practitioner");
  }

  return data;
}
