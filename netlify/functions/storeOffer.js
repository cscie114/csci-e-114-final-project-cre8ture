// Using an in-memory store for demonstration; for production, consider using a more persistent storage solution.
const offers = {};

exports.handler = async function(event, context) {
  const data = JSON.parse(event.body);
  offers[data.peerId] = data.offer;
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Offer stored successfully" })
  };
};
