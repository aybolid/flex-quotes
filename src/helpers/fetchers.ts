const fetcher = async (...args: any[]) => {
  const res = await fetch(...args);
  return res.json();
};

const fetcherWithId = async (args: string[]) => {
  const [url, id] = args;
  const res = await fetch(url, {
    method: "GET",
    headers: new Headers({ "Content-Type": "application/json", id }),
    credentials: "same-origin",
  });

  return res.json();
};

export { fetcher, fetcherWithId };
