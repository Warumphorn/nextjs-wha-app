const VERSION_API = "https://api.codingthailand.com/api/version";

export type VersionDTO = {
  version: string;
};

export async function getApiVersion(): Promise<VersionDTO> {
  const response = await fetch(VERSION_API);
  const apiInfo = await response.json();
  return apiInfo.data as VersionDTO;
}
