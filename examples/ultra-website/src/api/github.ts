export async function getStarCount() {
  const response = await fetch(
    `https://api.github.com/repos/exhibitionist-digital/ultra`,
  );
  const data = await response.json();
  return {
    stargazers_count: data?.stargazers_count,
  };
}

getStarCount.keys = () => ["stars"];
