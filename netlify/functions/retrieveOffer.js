const offers = {}; // This should be the same store as in storeOffer.js

exports.handler = async function(event, context) {
  const data = JSON.parse(event.body);
  const offer = offers[data.peerId];
  if (offer) {
    return {
      statusCode: 200,
      body: JSON.stringify({ offer })
    };
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Offer not found" })
    };
  }
};
